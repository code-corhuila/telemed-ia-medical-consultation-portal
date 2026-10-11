/**
 * Stub de `shell/apiError` para modo mock.
 * No está importado hoy, pero queda para que el alias de tsconfig resuelva.
 */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly traceId?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}