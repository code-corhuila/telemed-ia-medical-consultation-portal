import type { ApiError } from 'shell/apiError';

/**
 * The shell's interceptor turns every HTTP failure into an ApiError, so the
 * service's error code is `error.code` (not the raw `error.error.error`).
 */
export function errorCode(error: unknown): string | null {
  return isApiError(error) ? error.code : null;
}

function isApiError(error: unknown): error is ApiError {
  return typeof error === 'object' && error !== null && 'status' in error && 'code' in error;
}

export function getErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === 'object' && error !== null) {
    const response = error as { error?: { message?: string }; message?: string };
    return response.error?.message ?? response.message ?? fallback;
  }
  return fallback;
}
