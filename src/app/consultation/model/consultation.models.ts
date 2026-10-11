export type AppointmentStatus = 'CONFIRMED' | 'RESCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';

export interface Appointment {
  id: number;
  patientId: number;
  professionalId: number;
  start: string;
  end: string;
  status: AppointmentStatus;
  preconsultationSummaryId: number | null;
  postSummaryId: number | null;
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
  id: number;
  consultationReason: string;
  evolutionTime?: string;
  detailedSymptoms: string;
  relevantHistory?: string;
}

export interface AttentionSummary {
  id: number;
  diagnosis: string;
  recommendations: string;
  medications?: string;
  observations?: string;
  referral?: string;
}

export interface PostConsultationSummary {
  id: number;
  preconsultationSummary?: PreconsultationSummary;
  attentionSummary?: AttentionSummary;
  generatedAt: string;
}

/** This shape follows consultation-service.yaml as published in governance. */
export interface CreateAttentionPayload {
  appointmentId: number;
  diagnosis: string;
  recommendations: string;
  medications?: string;
  observations?: string;
  referral?: string;
}

export interface GeneratePostSummaryPayload {
  appointmentId: number;
  preconsultationSummaryId: number;
  attentionSummaryId: number;
}

export interface ApiError {
  status: number;
  code: string;
  message: string;
  traceId?: string;
  details?: ReadonlyArray<{ field: string; message: string }>;
}
