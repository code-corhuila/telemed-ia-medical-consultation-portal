export type AppointmentStatus = 'CONFIRMED' | 'RESCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';

export interface Appointment {
  id: string;
  patientId: string;
  professionalId: string;
  start: string;
  end: string;
  status: AppointmentStatus;
  preconsultationSummaryId: string | null;
  postSummaryId: string | null;
  cancellationReason?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface PageMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiPage<T> {
  data: T[];
  meta?: PageMeta;
}

export interface PreconsultationSummary {
  id: string;
  conversationId: string;
  appointmentId: string;
  patientId: string;
  consultationReason: string;
  evolutionTime: string | null;
  detailedSymptoms: string;
  relevantHistory: string | null;
  createdAt: string;
}

export interface MedicationDTO {
  name: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
  instructions?: string;
}

export interface AttentionSummary {
  id: string;
  consultationId: string;
  diagnosis: string;
  recommendations: string;
  medications?: MedicationDTO[];
  observations?: string;
  referral?: string;
}

/** GET /consultations/post-summaries/{id}: references only; the attention is read by consultation. */
export interface PostConsultationSummary {
  id: string;
  consultationId: string;
  appointmentId: string;
  patientId: string;
  preconsultationSummaryId?: string;
  attentionSummaryId?: string;
  professionalId?: string;
  completedAt?: string;
  generatedAt: string;
}

/** Consultation of one appointment (consultation DEC-006). */
export interface Consultation {
  id: string;
  appointmentId: string;
  patientId: string;
  professionalId: string;
  status: 'IN_PROGRESS' | 'COMPLETED';
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/** The consultation API wraps every success answer in `data`. */
export interface DataEnvelope<T> {
  data: T;
}

/** Body of POST /consultations/{id}/attention. `medications` is always an array. */
export interface RecordAttentionPayload {
  diagnosis: string;
  recommendations: string;
  medications: MedicationDTO[];
  observations?: string;
  referral?: string;
}

export interface GeneratePostSummaryPayload {
  appointmentId: string;
  preconsultationSummaryId: string;
  attentionSummaryId: string;
}

export interface ApiError {
  status: number;
  code: string;
  message: string;
  traceId?: string;
  details?: ReadonlyArray<{ field: string; message: string }>;
}

/** One row of GET /api/v1/professionals (professional-management). */
export interface ProfessionalListItem {
  id: string;
  identityUserId: string;
  fullName?: string | null;
  professionalType: string;
  status: string;
}

/** GET /api/v1/auth/accounts/names (identity DEC-013). */
export interface AccountName {
  id: string;
  fullName: string;
}
