import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiClientService } from 'shell/apiClient';
import {
  AccountName,
  ApiPage,
  Appointment,
  AttentionSummary,
  Consultation,
  DataEnvelope,
  PostConsultationSummary,
  PreconsultationSummary,
  ProfessionalListItem,
  RecordAttentionPayload,
} from '../model/consultation.models';

/**
 * Uses the shell's shared ApiClientService so authentication, correlation,
 * and the /api/v1 gateway prefix stay centralized in the shell.
 *
 * Consultation paths follow the published consultation-service.yaml contract.
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

  /** Professionals with their names (professional-management, any authenticated role). */
  listProfessionals(): Observable<ApiPage<ProfessionalListItem>> {
    return this.api.getWithParams<ApiPage<ProfessionalListItem>>('/professionals', { page: 1, limit: 100 });
  }

  /** Names of up to 50 accounts (identity DEC-013; a professional gets patients only). */
  lookupAccountNames(ids: readonly string[]): Observable<{ data: AccountName[] }> {
    return this.api.getWithParams<{ data: AccountName[] }>('/auth/accounts/names', { ids: ids.join(',') });
  }

  getPreconsultationSummary(appointmentId: string): Observable<PreconsultationSummary> {
    return this.api.getWithParams<PreconsultationSummary>(
      '/agent/preconsultations',
      { appointmentId }
    );
  }

  /** The attention of a consultation; the API allows only its patient, its professional and document-generation. */
  getAttention(consultationId: string): Observable<AttentionSummary> {
    return this.api
      .get<DataEnvelope<AttentionSummary>>(`/consultations/${consultationId}/attention`)
      .pipe(map((answer) => answer.data));
  }

  getPostSummary(id: string): Observable<PostConsultationSummary> {
    return this.api
      .get<DataEnvelope<PostConsultationSummary>>(`/consultations/post-summaries/${id}`)
      .pipe(map((answer) => answer.data));
  }

  /**
   * Creates the consultation of an appointment, or returns the existing one (DEC-006).
   * Calling it again for the same appointment is safe.
   */
  startConsultation(appointmentId: string): Observable<Consultation> {
    return this.api
      .post<DataEnvelope<Consultation>>('/consultations', { appointmentId }, crypto.randomUUID())
      .pipe(map((answer) => answer.data));
  }

  /** Records the attention; the consultation becomes COMPLETED. */
  recordAttention(consultationId: string, payload: RecordAttentionPayload): Observable<AttentionSummary> {
    return this.api
      .post<DataEnvelope<AttentionSummary>>(`/consultations/${consultationId}/attention`, payload, crypto.randomUUID())
      .pipe(map((answer) => answer.data));
  }
}
