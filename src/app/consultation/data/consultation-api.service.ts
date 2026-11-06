import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from 'shell/apiClient';
import {
  ApiPage,
  Appointment,
  AttentionSummary,
  CreateAttentionPayload,
  PostConsultationSummary,
  PreconsultationSummary,
} from '../model/consultation.models';

/**
 * Uses the shell's shared ApiClientService so authentication, correlation,
 * and the /api/v1 gateway prefix stay centralized in the shell.
 *
 * Consultation paths follow the published consultation-service.yaml contract.
 * The gateway mapping and Go HTTP handlers are documented in
 * BACKEND_INTEGRATION_GAPS.md and must be implemented before these requests
 * work end-to-end.
 */
@Injectable({ providedIn: 'root' })
export class ConsultationApiService {
  private readonly api = inject(ApiClientService);

  listByPatient(patientId: string, page = 1, limit = 100): Observable<ApiPage<Appointment>> {
    return this.api.getWithParams<ApiPage<Appointment>>(
      `/appointments/patient/${patientId}`,
      { page, limit },
    );
  }

  listByProfessional(professionalId: string, page = 1, limit = 100): Observable<ApiPage<Appointment>> {
    return this.api.getWithParams<ApiPage<Appointment>>(
      `/appointments/professional/${professionalId}`,
      { page, limit },
    );
  }

  getPreconsultationSummary(appointmentId: string): Observable<PreconsultationSummary> {
    return this.api.getWithParams<PreconsultationSummary>(
      '/agent/preconsultations',
      { appointmentId }
    );
  }

  getPreconsultation(id: string): Observable<PreconsultationSummary> {
    return this.api.get<PreconsultationSummary>(`/consultations/preconsultation/${id}`);
  }

  getAttention(id: string): Observable<AttentionSummary> {
    return this.api.get<AttentionSummary>(`/consultations/${id}/attention`);
  }

  getPostSummary(id: string): Observable<PostConsultationSummary> {
    return this.api.get<PostConsultationSummary>(`/post-summaries/${id}`);
  }

  // TODO(consultation-id): the Go backend expects POST /consultations/{consultationId}/attention,
  // but the portal only knows the appointmentId. Until the Citas API exposes
  // GET /appointments/{id}/consultation (or Consultas adds POST /consultations),
  // the create-attention flow cannot run end-to-end and stays in mock mode.
  // See 15-project-control/technical-backlog.md (QA 2026-10-27).
  createAttention(payload: CreateAttentionPayload): Observable<AttentionSummary> {
    return this.api.post<AttentionSummary>(
      '/consultations/attention',
      payload,
      crypto.randomUUID(),
    );
  }
}
