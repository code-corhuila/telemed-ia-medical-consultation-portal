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

  listByPatient(patientId: number, page = 1, limit = 100): Observable<ApiPage<Appointment>> {
    return this.api.getWithParams<ApiPage<Appointment>>(
      `/appointments/patient/${patientId}`,
      { page, limit },
    );
  }

  listByProfessional(professionalId: number, page = 1, limit = 100): Observable<ApiPage<Appointment>> {
    return this.api.getWithParams<ApiPage<Appointment>>(
      `/appointments/professional/${professionalId}`,
      { page, limit },
    );
  }

  getPreconsultation(id: number): Observable<PreconsultationSummary> {
    return this.api.get<PreconsultationSummary>(`/consultations/preconsultation/${id}`);
  }

  getAttention(id: number): Observable<AttentionSummary> {
    return this.api.get<AttentionSummary>(`/consultations/attention/${id}`);
  }

  getPostSummary(id: number): Observable<PostConsultationSummary> {
    return this.api.get<PostConsultationSummary>(`/consultations/post/${id}`);
  }

  createAttention(payload: CreateAttentionPayload): Observable<AttentionSummary> {
    return this.api.post<AttentionSummary>(
      '/consultations/attention',
      payload,
      crypto.randomUUID(),
    );
  }
}
