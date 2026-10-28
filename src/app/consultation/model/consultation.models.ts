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
  diagnosis: string;
  recommendations: string;
  medications?: MedicationDTO[];
  observations?: string;
  referral?: string;
}

export interface PostConsultationSummary {
  id: string;
  preconsultationSummary?: PreconsultationSummary;
  attentionSummary?: AttentionSummary;
  generatedAt: string;
}

/** This shape follows consultation-service.yaml as published in governance. */
export interface CreateAttentionPayload {
  appointmentId: string;
  diagnosis: string;
  recommendations: string;
  medications?: MedicationDTO[];
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
