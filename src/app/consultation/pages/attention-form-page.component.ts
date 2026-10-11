import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ConsultationApiService } from '../data/consultation-api.service';
import { getSessionContext } from '../data/session-context';
import { getErrorMessage } from '../data/error-message';
import { Appointment, AttentionSummary, CreateAttentionPayload } from '../model/consultation.models';
import { SessionService } from 'shell/session';

@Component({
  selector: 'app-attention-form-page', standalone: true,
  imports: [DatePipe, ReactiveFormsModule, RouterLink],
  templateUrl: './attention-form-page.component.html', styleUrl: './attention-form-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttentionFormPageComponent implements OnInit {
  private readonly api = inject(ConsultationApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly session = inject(SessionService);
  private readonly professionalId = getSessionContext(this.session).id;

  protected readonly loading = signal(true);
  protected readonly loadError = signal<string | null>(null);
  protected readonly appointment = signal<Appointment | null>(null);
  protected readonly saving = signal(false);
  protected readonly saveError = signal<string | null>(null);
  protected readonly savedAttention = signal<AttentionSummary | null>(null);
  protected readonly submitted = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    observations: [''],
    diagnosis: ['', [Validators.required, Validators.minLength(3)]],
    recommendations: ['', [Validators.required, Validators.minLength(3)]],
    medicationName: [''],
    dosage: [''],
    frequency: [''],
    duration: [''],
    medicationInstructions: [''],
    referral: [''],
  });

  ngOnInit(): void {
    const appointmentId = Number(this.route.snapshot.paramMap.get('appointmentId'));
    if (!Number.isInteger(appointmentId) || appointmentId <= 0) {
      this.loadError.set('El identificador de la cita no es válido.');
      this.loading.set(false);
      return;
    }
    if (!this.professionalId) {
      this.loadError.set('No se encontró el identificador del profesional en la sesión.');
      this.loading.set(false);
      return;
    }
    this.api.listByProfessional(this.professionalId).subscribe({
      next: (page) => {
        const item = page.data.find((candidate) => candidate.id === appointmentId);
        if (!item) {
          this.loadError.set('La cita no está asignada al profesional autenticado.');
        } else if (!['CONFIRMED', 'RESCHEDULED'].includes(item.status)) {
          this.loadError.set('Solo se puede registrar atención para una cita confirmada o reprogramada.');
        } else {
          this.appointment.set(item);
        }
        this.loading.set(false);
      },
      error: (error) => { this.loadError.set(getErrorMessage(error, 'No fue posible validar la cita asignada.')); this.loading.set(false); },
    });
  }

  protected saveAttention(): void {
    this.submitted.set(true);
    this.form.markAllAsTouched();
    if (this.form.invalid || this.saving() || !this.appointment()) return;

    const value = this.form.getRawValue();
    const medicationParts = [
      value.medicationName ? `Medicamento: ${value.medicationName}` : '',
      value.dosage ? `Dosis: ${value.dosage}` : '',
      value.frequency ? `Frecuencia: ${value.frequency}` : '',
      value.duration ? `Duración: ${value.duration}` : '',
      value.medicationInstructions ? `Indicaciones: ${value.medicationInstructions}` : '',
    ].filter(Boolean);

    const payload: CreateAttentionPayload = {
      appointmentId: this.appointment()!.id,
      diagnosis: value.diagnosis.trim(),
      recommendations: value.recommendations.trim(),
      observations: value.observations.trim() || undefined,
      medications: medicationParts.join('\n') || undefined,
      referral: value.referral.trim() || undefined,
    };

    this.saving.set(true);
    this.saveError.set(null);
    this.api.createAttention(payload).subscribe({
      next: (attention) => {
        this.savedAttention.set(attention);
        this.saving.set(false);
      },
      error: (error) => {
        this.saveError.set(getErrorMessage(error, 'No fue posible guardar la atención médica. Verifica que el endpoint del API esté implementado.'));
        this.saving.set(false);
      },
    });
  }

  protected backToAgenda(): void {
    void this.router.navigate(['/consultation/professional']);
  }
}
