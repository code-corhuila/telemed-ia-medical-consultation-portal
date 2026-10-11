import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ConsultationApiService } from '../data/consultation-api.service';
import { getSessionContext } from '../data/session-context';
import { getErrorMessage } from '../data/error-message';
import { Appointment, PostConsultationSummary, PreconsultationSummary } from '../model/consultation.models';
import { SessionService } from 'shell/session';

@Component({
  selector: 'app-consultation-detail-page', standalone: true, imports: [DatePipe, RouterLink],
  templateUrl: './consultation-detail-page.component.html', styleUrl: './consultation-detail-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConsultationDetailPageComponent implements OnInit {
  private readonly api = inject(ConsultationApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly sessionService = inject(SessionService);
  private readonly session = getSessionContext(this.sessionService);

  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly appointment = signal<Appointment | null>(null);
  protected readonly postSummary = signal<PostConsultationSummary | null>(null);
  protected readonly preconsultation = signal<PreconsultationSummary | null>(null);
  protected readonly summaryLoading = signal(false);
  protected readonly summaryNotice = signal<string | null>(null);
  protected readonly sessionRole = this.session.role;

  ngOnInit(): void {
    const appointmentId = Number(this.route.snapshot.paramMap.get('appointmentId'));
    if (!Number.isInteger(appointmentId) || appointmentId <= 0) {
      this.error.set('El identificador de la cita no es válido.');
      this.loading.set(false);
      return;
    }
    if (!this.session.id) {
      this.error.set('No se encontró el usuario autenticado en la sesión.');
      this.loading.set(false);
      return;
    }

    const isProfessional = this.session.role === 'PROFESSIONAL';
    const request = isProfessional
      ? this.api.listByProfessional(this.session.id)
      : this.api.listByPatient(this.session.id);

    request.subscribe({
      next: (page) => {
        const item = page.data.find((candidate) => candidate.id === appointmentId);
        if (!item) {
          this.error.set('No se encontró la cita en tu historial autorizado.');
          this.loading.set(false);
          return;
        }
        this.appointment.set(item);
        this.loading.set(false);
        this.loadSummaries(item);
      },
      error: (error) => {
        this.error.set(getErrorMessage(error, 'No fue posible cargar la consulta.'));
        this.loading.set(false);
      },
    });
  }

  private loadSummaries(appointment: Appointment): void {
    if (appointment.postSummaryId !== null) {
      this.summaryLoading.set(true);
      this.api.getPostSummary(appointment.postSummaryId).subscribe({
        next: (summary) => {
          this.postSummary.set(summary);
          this.preconsultation.set(summary.preconsultationSummary ?? null);
          this.summaryLoading.set(false);
          if (!summary.preconsultationSummary && appointment.preconsultationSummaryId) {
            this.loadPreconsultation(appointment.preconsultationSummaryId);
          }
        },
        error: (error) => {
          this.summaryNotice.set(getErrorMessage(error, 'El resumen posterior todavía no está disponible.'));
          this.summaryLoading.set(false);
          if (appointment.preconsultationSummaryId) this.loadPreconsultation(appointment.preconsultationSummaryId);
        },
      });
    } else if (appointment.preconsultationSummaryId !== null) {
      this.loadPreconsultation(appointment.preconsultationSummaryId);
      this.summaryNotice.set('La cita aún no tiene un resumen posterior asociado.');
    } else {
      this.summaryNotice.set('Esta cita no tiene una referencia de preconsulta ni un resumen posterior asociado.');
    }
  }

  private loadPreconsultation(id: number): void {
    this.api.getPreconsultation(id).subscribe({
      next: (summary) => this.preconsultation.set(summary),
      error: (error) => this.summaryNotice.set(getErrorMessage(error, 'No fue posible cargar el resumen de preconsulta.')),
    });
  }

  protected statusLabel(status: string): string {
    const labels: Record<string, string> = { COMPLETED: 'COMPLETADA', CONFIRMED: 'CONFIRMADA', RESCHEDULED: 'REPROGRAMADA', CANCELLED: 'CANCELADA', NO_SHOW: 'NO ASISTIÓ' };
    return labels[status] ?? status;
  }

  protected get canStartAttention(): boolean {
    return this.session.role === 'PROFESSIONAL' && !!this.appointment() && ['CONFIRMED', 'RESCHEDULED'].includes(this.appointment()!.status);
  }
}
