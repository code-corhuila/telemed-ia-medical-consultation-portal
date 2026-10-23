import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ConsultationApiService } from '../data/consultation-api.service';
import { getSessionContext } from '../data/session-context';
import { getErrorMessage } from '../data/error-message';
import { Appointment } from '../model/consultation.models';
import { SessionService } from 'shell/session';

type HistoryFilter = 'ALL' | 'AVAILABLE' | 'PENDING';

@Component({
  selector: 'app-patient-consultations-page',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './patient-consultations-page.component.html',
  styleUrl: './patient-consultations-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatientConsultationsPageComponent implements OnInit {
  private readonly api = inject(ConsultationApiService);
  private readonly session = inject(SessionService);
  private readonly patientId = getSessionContext(this.session).id;

  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly appointments = signal<Appointment[]>([]);
  protected readonly filter = signal<HistoryFilter>('ALL');

  protected readonly counts = computed(() => {
    const completed = this.appointments().filter((item) => item.status === 'COMPLETED');
    return {
      ALL: completed.length,
      AVAILABLE: completed.filter((item) => item.postSummaryId !== null).length,
      PENDING: completed.filter((item) => item.postSummaryId === null).length,
    };
  });

  protected readonly filteredAppointments = computed(() => {
    const completed = this.appointments().filter((item) => item.status === 'COMPLETED');
    switch (this.filter()) {
      case 'AVAILABLE': return completed.filter((item) => item.postSummaryId !== null);
      case 'PENDING': return completed.filter((item) => item.postSummaryId === null);
      default: return completed;
    }
  });

  ngOnInit(): void { this.load(); }

  protected load(): void {
    if (this.patientId === null) {
      this.error.set('No se encontró un identificador numérico de paciente en la sesión.');
      this.loading.set(false);
      return;
    }
    this.loading.set(true);
    this.error.set(null);
    this.api.listByPatient(this.patientId as string).subscribe({
      next: (response) => {
        this.appointments.set(response.data ?? []);
        this.loading.set(false);
      },
      error: (error) => {
        this.error.set(getErrorMessage(error, 'No fue posible cargar tu historial de consultas.'));
        this.loading.set(false);
      },
    });
  }

  protected setFilter(filter: HistoryFilter): void { this.filter.set(filter); }

  protected statusLabel(status: string): string {
    const labels: Record<string, string> = {
      COMPLETED: 'COMPLETADA', CONFIRMED: 'CONFIRMADA', RESCHEDULED: 'REPROGRAMADA',
      CANCELLED: 'CANCELADA', NO_SHOW: 'NO ASISTIÓ',
    };
    return labels[status] ?? status;
  }
}
