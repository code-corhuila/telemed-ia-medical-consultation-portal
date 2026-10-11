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
    id: 1,
    patientId: 1,
    professionalId: 2,
    start: '2026-10-15T09:00:00',
    end: '2026-10-15T09:30:00',
    status: 'CONFIRMED',
    preconsultationSummaryId: 11,
    postSummaryId: null,
    createdAt: '2026-10-01T12:00:00',
    updatedAt: '2026-10-01T12:00:00',
  },
  {
    id: 2,
    patientId: 1,
    professionalId: 2,
    start: '2026-09-20T10:00:00',
    end: '2026-09-20T10:30:00',
    status: 'COMPLETED',
    preconsultationSummaryId: 12,
    postSummaryId: 102,
    createdAt: '2026-09-01T12:00:00',
    updatedAt: '2026-09-20T11:00:00',
  },
  {
    id: 3,
    patientId: 1,
    professionalId: 2,
    start: '2026-08-15T14:00:00',
    end: '2026-08-15T14:30:00',
    status: 'COMPLETED',
    preconsultationSummaryId: 13,
    postSummaryId: null,
    createdAt: '2026-08-01T12:00:00',
    updatedAt: '2026-08-15T15:00:00',
  },
  {
    id: 4,
    patientId: 1,
    professionalId: 5,
    start: '2026-07-10T08:30:00',
    end: '2026-07-10T09:00:00',
    status: 'COMPLETED',
    preconsultationSummaryId: 14,
    postSummaryId: 104,
  },
  // ── Cola de la profesional 2 ──
  {
    id: 5,
    patientId: 3,
    professionalId: 2,
    start: '2026-10-15T11:00:00',
    end: '2026-10-15T11:30:00',
    status: 'RESCHEDULED',
    preconsultationSummaryId: null,
    postSummaryId: null,
  },
  {
    id: 6,
    patientId: 4,
    professionalId: 2,
    start: '2026-10-05T15:00:00',
    end: '2026-10-05T15:30:00',
    status: 'COMPLETED',
    preconsultationSummaryId: 16,
    postSummaryId: 106,
  },
  {
    id: 7,
    patientId: 6,
    professionalId: 2,
    start: '2026-10-20T16:00:00',
    end: '2026-10-20T16:30:00',
    status: 'CONFIRMED',
    preconsultationSummaryId: 17,
    postSummaryId: null,
  },
];

// ─────────────────────────────────────────────────────────────
// Preconsultas
// ─────────────────────────────────────────────────────────────
export const MOCK_PRECONSULTATIONS: Record<number, PreconsultationSummary> = {
  11: {
    id: 11,
    consultationReason: 'Dolor abdominal recurrente',
    evolutionTime: '5 días',
    detailedSymptoms: 'Dolor en epigastrio, náuseas matutinas, sin fiebre.',
    relevantHistory: 'Gastritis diagnosticada en 2023. Sin alergias conocidas.',
  },
  12: {
    id: 12,
    consultationReason: 'Cefalea tensional',
    evolutionTime: '2 semanas',
    detailedSymptoms: 'Dolor occipital constante, empeora al final del día.',
    relevantHistory: 'Estrés laboral. Sin migrañas previas.',
  },
  13: {
    id: 13,
    consultationReason: 'Control post-operatorio',
    evolutionTime: '1 mes',
    detailedSymptoms: 'Herida quirúrgica sin signos de infección, leve molestia.',
    relevantHistory: 'Apendicectomía en agosto 2026.',
  },
  14: {
    id: 14,
    consultationReason: 'Tos persistente',
    evolutionTime: '3 semanas',
    detailedSymptoms: 'Tos seca nocturna, sin fiebre, sin disnea.',
    relevantHistory: 'Asma leve intermitente.',
  },
  16: {
    id: 16,
    consultationReason: 'Revisión dermatológica',
    evolutionTime: '10 días',
    detailedSymptoms: 'Lesión pigmentada en antebrazo derecho.',
    relevantHistory: 'Sin antecedentes oncológicos.',
  },
  17: {
    id: 17,
    consultationReason: 'Dolor lumbar',
    evolutionTime: '1 semana',
    detailedSymptoms: 'Dolor lumbar bajo, irradiado a glúteo derecho.',
    relevantHistory: 'Sedentarismo. Sin traumatismos.',
  },
};

// ─────────────────────────────────────────────────────────────
// Atenciones médicas
// ─────────────────────────────────────────────────────────────
export const MOCK_ATTENTIONS: Record<number, AttentionSummary> = {
  202: {
    id: 202,
    diagnosis: 'Cefalea tensional episódica',
    recommendations: 'Hidratación, higiene del sueño, pausas activas cada 2 horas.',
    medications:
      'Medicamento: Ibuprofeno 400mg\nDosis: 1 tableta\nFrecuencia: Cada 8 horas\nDuración: 3 días',
    observations: 'Paciente consciente, orientado, sin signos de alarma neurológica.',
  },
  204: {
    id: 204,
    diagnosis: 'Bronquitis aguda leve',
    recommendations:
      'Reposo relativo, abundantes líquidos, evitar cambios bruscos de temperatura.',
    medications:
      'Medicamento: Salbutamol inhalador\nDosis: 2 puff\nFrecuencia: Cada 6 horas si hay tos\nDuración: 5 días',
    observations: 'Auscultación con leves sibilancias dispersas.',
    referral: 'Neumología si persiste más de 2 semanas',
  },
  206: {
    id: 206,
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
    id: 102,
    preconsultationSummary: MOCK_PRECONSULTATIONS[12],
    attentionSummary: MOCK_ATTENTIONS[202],
    generatedAt: '2026-09-20T11:00:00',
  },
  104: {
    id: 104,
    preconsultationSummary: MOCK_PRECONSULTATIONS[14],
    attentionSummary: MOCK_ATTENTIONS[204],
    generatedAt: '2026-07-10T09:30:00',
  },
  106: {
    id: 106,
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