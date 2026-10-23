import {
  ApiPage,
  Appointment,
  AttentionSummary,
  PostConsultationSummary,
  PreconsultationSummary,
} from '../../app/consultation/model/consultation.models';

// ─────────────────────────────────────────────────────────────
// Citas: paciente 1 = Juan Pérez · profesional 2 = Dra. Gómez
// ─────────────────────────────────────────────────────────────
export const MOCK_APPOINTMENTS: Appointment[] = [
  // ── Paciente 1 ──
  {
    id: 'a0000000-0000-4000-8000-000000000001',
    patientId: 'b0000000-0000-4000-8000-1',
    professionalId: 'c0000000-0000-4000-8000-2',
    start: '2026-10-15T09:00:00',
    end: '2026-10-15T09:30:00',
    status: 'CONFIRMED',
    preconsultationSummaryId: 'd0000000-0000-4000-8000-11',
    postSummaryId: null,
    createdAt: '2026-10-01T12:00:00',
    updatedAt: '2026-10-01T12:00:00',
  },
  {
    id: 'a0000000-0000-4000-8000-000000000002',
    patientId: 'b0000000-0000-4000-8000-1',
    professionalId: 'c0000000-0000-4000-8000-2',
    start: '2026-09-20T10:00:00',
    end: '2026-09-20T10:30:00',
    status: 'COMPLETED',
    preconsultationSummaryId: 'd0000000-0000-4000-8000-12',
    postSummaryId: 'e0000000-0000-4000-8000-102',
    createdAt: '2026-09-01T12:00:00',
    updatedAt: '2026-09-20T11:00:00',
  },
  {
    id: 'a0000000-0000-4000-8000-000000000003',
    patientId: 'b0000000-0000-4000-8000-1',
    professionalId: 'c0000000-0000-4000-8000-2',
    start: '2026-08-15T14:00:00',
    end: '2026-08-15T14:30:00',
    status: 'COMPLETED',
    preconsultationSummaryId: 'd0000000-0000-4000-8000-13',
    postSummaryId: null,
    createdAt: '2026-08-01T12:00:00',
    updatedAt: '2026-08-15T15:00:00',
  },
  {
    id: 'a0000000-0000-4000-8000-000000000004',
    patientId: 'b0000000-0000-4000-8000-1',
    professionalId: 'c0000000-0000-4000-8000-5',
    start: '2026-07-10T08:30:00',
    end: '2026-07-10T09:00:00',
    status: 'COMPLETED',
    preconsultationSummaryId: 'd0000000-0000-4000-8000-14',
    postSummaryId: 'e0000000-0000-4000-8000-104',
  },
  // ── Cola de la profesional 2 ──
  {
    id: 'a0000000-0000-4000-8000-000000000005',
    patientId: 'b0000000-0000-4000-8000-3',
    professionalId: 'c0000000-0000-4000-8000-2',
    start: '2026-10-15T11:00:00',
    end: '2026-10-15T11:30:00',
    status: 'RESCHEDULED',
    preconsultationSummaryId: null,
    postSummaryId: null,
  },
  {
    id: 'a0000000-0000-4000-8000-000000000006',
    patientId: 'b0000000-0000-4000-8000-4',
    professionalId: 'c0000000-0000-4000-8000-2',
    start: '2026-10-05T15:00:00',
    end: '2026-10-05T15:30:00',
    status: 'COMPLETED',
    preconsultationSummaryId: 'd0000000-0000-4000-8000-16',
    postSummaryId: 'e0000000-0000-4000-8000-106',
  },
  {
    id: 'a0000000-0000-4000-8000-000000000007',
    patientId: 'b0000000-0000-4000-8000-6',
    professionalId: 'c0000000-0000-4000-8000-2',
    start: '2026-10-20T16:00:00',
    end: '2026-10-20T16:30:00',
    status: 'CONFIRMED',
    preconsultationSummaryId: 'd0000000-0000-4000-8000-17',
    postSummaryId: null,
  },
];

// ─────────────────────────────────────────────────────────────
// Preconsultas
// ─────────────────────────────────────────────────────────────

export const MOCK_PRECONSULTATIONS: Record<string, PreconsultationSummary> = {
  'd0000000-0000-4000-8000-000000000011': {
    id: 'd0000000-0000-4000-8000-000000000011',
    conversationId: 'c0000000-0000-4000-8000-000000000001',
    appointmentId: 'a0000000-0000-4000-8000-000000000001',
    patientId: 'b0000000-0000-4000-8000-000000000001',
    consultationReason: 'Dolor de garganta y fiebre',
    evolutionTime: '3 días',
    detailedSymptoms: 'Dolor al tragar, cansancio, fiebre de 38.5',
    relevantHistory: 'Alergia a la penicilina',
    createdAt: '2026-10-20T10:00:00Z',
  },
  'd0000000-0000-4000-8000-000000000012': {
    id: 'd0000000-0000-4000-8000-000000000012',
    conversationId: 'c0000000-0000-4000-8000-000000000002',
    appointmentId: 'a0000000-0000-4000-8000-000000000002',
    patientId: 'b0000000-0000-4000-8000-000000000002',
    consultationReason: 'Dolor de cabeza persistente',
    evolutionTime: '1 semana',
    detailedSymptoms: 'Migraña, sensibilidad a la luz',
    relevantHistory: 'Sin antecedentes relevantes',
    createdAt: '2026-10-21T09:30:00Z',
  },
  'd0000000-0000-4000-8000-000000000013': {
    id: 'd0000000-0000-4000-8000-000000000013',
    conversationId: 'c0000000-0000-4000-8000-000000000003',
    appointmentId: 'a0000000-0000-4000-8000-000000000003',
    patientId: 'b0000000-0000-4000-8000-000000000003',
    consultationReason: 'Dolor abdominal',
    evolutionTime: '2 días',
    detailedSymptoms: 'Dolor cólico, náuseas',
    relevantHistory: 'Gastritis previa',
    createdAt: '2026-10-22T14:15:00Z',
  },
};

export const MOCK_ATTENTIONS: Record<number, AttentionSummary> = {
  202: {
    id: 'a0000000-0000-4000-8000-000000000202',
    diagnosis: 'Cefalea tensional episódica',
    recommendations: 'Hidratación, higiene del sueño, pausas activas cada 2 horas.',
    medications:
      'Medicamento: Ibuprofeno 400mg\nDosis: 1 tableta\nFrecuencia: Cada 8 horas\nDuración: 3 días',
    observations: 'Paciente consciente, orientado, sin signos de alarma neurológica.',
  },
  204: {
    id: 'a0000000-0000-4000-8000-000000000204',
    diagnosis: 'Bronquitis aguda leve',
    recommendations:
      'Reposo relativo, abundantes líquidos, evitar cambios bruscos de temperatura.',
    medications:
      'Medicamento: Salbutamol inhalador\nDosis: 2 puff\nFrecuencia: Cada 6 horas si hay tos\nDuración: 5 días',
    observations: 'Auscultación con leves sibilancias dispersas.',
    referral: 'Neumología si persiste más de 2 semanas',
  },
  206: {
    id: 'a0000000-0000-4000-8000-000000000206',
    diagnosis: 'Nevus melanocítico benigno',
    recommendations: 'Fotoprotección diaria, control dermatológico anual.',
    observations: 'Lesión simétrica, bordes regulares, color homogéneo.',
  },
};

// ─────────────────────────────────────────────────────────────
// Resúmenes post-consulta
// ─────────────────────────────────────────────────────────────
export const MOCK_POST_SUMMARIES: Record<number, PostConsultationSummary> = {
  102: {
    id: 'a0000000-0000-4000-8000-000000000102',
    preconsultationSummary: MOCK_PRECONSULTATIONS[12],
    attentionSummary: MOCK_ATTENTIONS[202],
    generatedAt: '2026-09-20T11:00:00',
  },
  104: {
    id: 'a0000000-0000-4000-8000-000000000104',
    preconsultationSummary: MOCK_PRECONSULTATIONS[14],
    attentionSummary: MOCK_ATTENTIONS[204],
    generatedAt: '2026-07-10T09:30:00',
  },
  106: {
    id: 'a0000000-0000-4000-8000-000000000106',
    preconsultationSummary: MOCK_PRECONSULTATIONS[16],
    attentionSummary: MOCK_ATTENTIONS[206],
    generatedAt: '2026-10-05T15:30:00',
  },
};

// ─────────────────────────────────────────────────────────────
// Helper para empaquetar en ApiPage<T>
// ─────────────────────────────────────────────────────────────
export function makePage<T>(items: T[], page = 1, limit = 100): ApiPage<T> {
  const start = (page - 1) * limit;
  const slice = items.slice(start, start + limit);
  return {
    data: slice,
    meta: {
      page,
      limit,
      total: items.length,
      totalPages: Math.max(1, Math.ceil(items.length / limit)),
    },
  };
}