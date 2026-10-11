declare module 'shell/apiClient' {
  export class ApiClientService {
    get<T>(path: string): import('rxjs').Observable<T>;
    getWithParams<T>(
      path: string,
      params: Record<string, string | number>,
    ): import('rxjs').Observable<T>;
    post<T>(
      path: string,
      body: unknown,
      idempotencyKey: string,
    ): import('rxjs').Observable<T>;
    put<T>(path: string, body: unknown): import('rxjs').Observable<T>;
    delete<T>(path: string): import('rxjs').Observable<T>;
  }
}

declare module 'shell/session' {
  export class SessionService {
    getUserId(): number | null;
    getRole(): string | null;
    getName(): string;
    isAuthenticated(): boolean;
  }
}

declare module 'shell/apiError' {
  export interface ApiError {
    status: number;
    code: string;
    message: string;
    details?: ReadonlyArray<{ field: string; message: string }>;
    traceId?: string;
  }
}
