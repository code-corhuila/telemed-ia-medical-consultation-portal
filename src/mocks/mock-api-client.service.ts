import { Injectable } from '@angular/core';
import { Observable, delay, of, throwError } from 'rxjs';
import {
  ApiPage,
  AttentionSummary,
  Consultation,
  RecordAttentionPayload,
} from '../app/consultation/model/consultation.models';
import {
  MOCK_APPOINTMENTS,
  MOCK_ATTENTIONS,
  MOCK_POST_SUMMARIES,
  MOCK_PRECONSULTATIONS,
  makePage,
} from './fixtures/consultation.fixtures';

const FAKE_LATENCY_MS = 350;

/**
 * Reemplazo local de `shell/apiClient` SOLO en modo mock.
 * En vez de pegarle al backend devuelve fixtures en memoria.
 */
@Injectable({ providedIn: 'root' })
export class ApiClientService {
  get<T>(path: string): Observable<T> {
    return this.respond<T>(path, null, undefined);
  }

  getWithParams<T>(path: string, params: Record<string, unknown>): Observable<T> {
    return this.respond<T>(path, params, undefined);
  }

  post<T>(path: string, body: unknown, _correlationId?: string): Observable<T> {
    return this.respond<T>(path, null, body);
  }

  private respond<T>(
    path: string,
    params: Record<string, unknown> | null,
    body: unknown,
  ): Observable<T> {
    try {
      const result = this.resolve<T>(path, params, body);
      return of(result).pipe(delay(FAKE_LATENCY_MS));
    } catch (error) {
      return throwError(() => error).pipe(delay(FAKE_LATENCY_MS));
    }
  }

  private resolve<T>(
    path: string,
    params: Record<string, unknown> | null,
    body: unknown,
  ): T {
    // ── GET /appointments/patient/:id ──
    const byPatient = path.match(/^\/appointments\/patient\/(\d+)/);
    if (byPatient) {
      const patientId = Number(byPatient[1]);
      const items = MOCK_APPOINTMENTS.filter((a) => a.patientId === String(patientId));
      return makePage(
        items,
        this.asNumber(params?.['page'], 1),
        this.asNumber(params?.['limit'], 100),
      ) as unknown as T;
    }

    // ── GET /appointments/professional/:id ──
    const byProfessional = path.match(/^\/appointments\/professional\/(\d+)/);
    if (byProfessional) {
      const professionalId = Number(byProfessional[1]);
      const items = MOCK_APPOINTMENTS.filter((a) => a.professionalId === String(professionalId));
      return makePage(
        items,
        this.asNumber(params?.['page'], 1),
        this.asNumber(params?.['limit'], 100),
      ) as unknown as T;
    }

    // ── GET /consultations/preconsultation/:id ──
    const preconsult = path.match(/^\/consultations\/preconsultation\/(\d+)/);
    if (preconsult) {
      const id = Number(preconsult[1]);
      const found = MOCK_PRECONSULTATIONS[id];
      if (!found) throw this.notFound(`Preconsultation ${id} not found in fixtures`);
      return found as unknown as T;
    }

    // ── GET /consultations/attention/:id ──
    const attention = path.match(/^\/consultations\/attention\/(\d+)/);
    if (attention) {
      const id = Number(attention[1]);
      const found = MOCK_ATTENTIONS[id];
      if (!found) throw this.notFound(`Attention ${id} not found in fixtures`);
      return found as unknown as T;
    }

    // ── GET /consultations/post/:id ──
    const post = path.match(/^\/consultations\/post\/(\d+)/);
    if (post) {
      const id = Number(post[1]);
      const found = MOCK_POST_SUMMARIES[id];
      if (!found) throw this.notFound(`Post summary ${id} not found in fixtures`);
      return found as unknown as T;
    }

    // ── POST /consultations (DEC-006) ──
    if (path === '/consultations' && body) {
      return { data: this.startConsultation((body as { appointmentId: string }).appointmentId) } as unknown as T;
    }

    // ── POST /consultations/:id/attention ──
    const record = path.match(/^\/consultations\/([0-9a-f-]{36})\/attention$/);
    if (record && body) {
      return { data: this.recordAttention(record[1], body as RecordAttentionPayload) } as unknown as T;
    }

    throw this.notFound(`Mock route not implemented: ${path}`);
  }

  private readonly consultations = new Map<string, Consultation>();

  private startConsultation(appointmentId: string): Consultation {
    const existing = [...this.consultations.values()].find((c) => c.appointmentId === appointmentId);
    if (existing) return existing;
    const appointment = MOCK_APPOINTMENTS.find((a) => a.id === appointmentId);
    if (!appointment) throw this.notFound(`Appointment ${appointmentId} not found in fixtures`);
    const now = new Date().toISOString();
    const created: Consultation = {
      id: crypto.randomUUID(),
      appointmentId,
      patientId: appointment.patientId,
      professionalId: appointment.professionalId,
      status: 'IN_PROGRESS',
      completedAt: null,
      createdAt: now,
      updatedAt: now,
    };
    this.consultations.set(created.id, created);
    return created;
  }

  private recordAttention(consultationId: string, payload: RecordAttentionPayload): AttentionSummary {
    const consultation = this.consultations.get(consultationId);
    if (!consultation) throw this.notFound(`Consultation ${consultationId} not found`);
    const now = new Date().toISOString();
    this.consultations.set(consultationId, { ...consultation, status: 'COMPLETED', completedAt: now, updatedAt: now });
    return this.createAttention(payload);
  }

  private createAttention(payload: RecordAttentionPayload): AttentionSummary {
    const nextId = 'f0000000-0000-4000-8000-' + Date.now().toString(16).padStart(12, '0'); // Generación rápida de UUID falso 'f0000000-0000-4000-8000-' + Date.now().toString(16).padStart(12, '0'); // Generación rápida de UUID falso Math.max(0, ...Object.keys(MOCK_ATTENTIONS).map(Number)) + 1;
    const created: AttentionSummary = {
      id: nextId,
      diagnosis: payload.diagnosis,
      recommendations: payload.recommendations,
      medications: payload.medications,
      observations: payload.observations,
      referral: payload.referral,
    };
    MOCK_ATTENTIONS[nextId as any] = created;
    return created;
  }

  private asNumber(value: unknown, fallback: number): number {
    const n = Number(value);
    return Number.isFinite(n) && n > 0 ? n : fallback;
  }

  private notFound(message: string): Error {
    const error = new Error(message) as Error & { status: number; code: string };
    error.status = 404;
    error.code = 'MOCK_NOT_FOUND';
    return error;
  }
}