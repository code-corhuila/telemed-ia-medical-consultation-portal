import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ConsultationApiService } from '../data/consultation-api.service';
import { getSessionContext } from '../data/session-context';
import { getErrorMessage } from '../data/error-message';
import { Appointment } from '../model/consultation.models';
import { SessionService } from 'shell/session';

type QueueFilter = 'ALL' | 'TO_ATTEND' | 'COMPLETED';

@Component({
  selector: 'app-professional-consultations-page', standalone: true, imports: [DatePipe, RouterLink],
  templateUrl: './professional-consultations-page.component.html', styleUrl: './professional-consultations-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfessionalConsultationsPageComponent implements OnInit {
  private readonly api = inject(ConsultationApiService);
  private readonly session = inject(SessionService);
  private readonly professionalId = getSessionContext(this.session).id;
  protected readonly professionalName = this.session.getName() || 'Profesional';
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly appointments = signal<Appointment[]>([]);
  protected readonly filter = signal<QueueFilter>('TO_ATTEND');

  protected readonly todayCount = computed(() => {
    const now = new Date();
    return this.appointments().filter((item) => {
      const date = new Date(item.start);
      return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() && date.getDate() === now.getDate();
    }).length;
  });

  protected readonly counts = computed(() => ({
    ALL: this.appointments().length,
    TO_ATTEND: this.appointments().filter((item) => ['CONFIRMED', 'RESCHEDULED'].includes(item.status)).length,
    COMPLETED: this.appointments().filter((item) => item.status === 'COMPLETED').length,
  }));

  protected readonly filteredAppointments = computed(() => {
    switch (this.filter()) {
      case 'COMPLETED': return this.appointments().filter((item) => item.status === 'COMPLETED');
      case 'TO_ATTEND': return this.appointments().filter((item) => ['CONFIRMED', 'RESCHEDULED'].includes(item.status));
      default: return this.appointments();
    }
  });

  ngOnInit(): void { this.load(); }

  protected load(): void {
    if (this.professionalId === null) {
      this.error.set('No se encontró un identificador numérico de profesional en la sesión.');
      this.loading.set(false);
      return;
    }
    this.loading.set(true);
    this.error.set(null);
    this.api.listByProfessional(this.professionalId).subscribe({
      next: (response) => { this.appointments.set(response.data ?? []); this.loading.set(false); },
      error: (error) => { this.error.set(getErrorMessage(error, 'No fue posible cargar las consultas asignadas.')); this.loading.set(false); },
    });
  }

  protected setFilter(filter: QueueFilter): void { this.filter.set(filter); }
  protected statusLabel(status: string): string {
    const labels: Record<string, string> = { COMPLETED: 'COMPLETADA', CONFIRMED: 'CONFIRMADA', RESCHEDULED: 'REPROGRAMADA', CANCELLED: 'CANCELADA', NO_SHOW: 'NO ASISTIÓ' };
    return labels[status] ?? status;
  }
  protected canStart(item: Appointment): boolean { return item.status === 'CONFIRMED' || item.status === 'RESCHEDULED'; }
}
