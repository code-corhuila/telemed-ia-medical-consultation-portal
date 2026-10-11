import { Injectable } from '@angular/core';

/**
 * Reemplazo local de `shell/session` SOLO para modo mock.
 * Lee rol/id/nombre de query params para poder cambiar de usuario sin tocar código:
 *   http://localhost:4205/?mockRole=PATIENT&mockId=1
 *   http://localhost:4205/consultation/professional?mockRole=PROFESSIONAL&mockId=2
 */
@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly id: number | null;
  private readonly role: string;
  private readonly name: string;

  constructor() {
    const params = new URLSearchParams(window.location.search);
    const rawId = params.get('mockId');
    this.role = (params.get('mockRole') ?? 'PATIENT').toUpperCase();
    this.id = rawId !== null ? Number(rawId) : (this.role === 'PROFESSIONAL' ? 2 : 1);
    this.name =
      params.get('mockName') ??
      (this.role === 'PROFESSIONAL' ? 'Dra. María Gómez' : 'Juan Pérez');
  }

  getUserId(): number | null {
    return this.id !== null && Number.isFinite(this.id) ? this.id : null;
  }
  getRole(): string | null {
    return this.role;
  }
  getName(): string {
    return this.name;
  }
}