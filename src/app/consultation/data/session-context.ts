import { SessionService } from 'shell/session';

export interface SessionContext {
  readonly id: string | null;
  readonly role: string | null;
  readonly name: string;
}

/**
 * Use the shell's shared session contract. Domain portals must not decode JWTs
 * or read sessionStorage independently.
 */
export function getSessionContext(session: SessionService): SessionContext {
  return {
    id: String(session.getUserId() ?? ''),
    role: session.getRole(),
    name: session.getName(),
  };
}
