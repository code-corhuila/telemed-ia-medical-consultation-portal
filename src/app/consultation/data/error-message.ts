export function getErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === 'object' && error !== null) {
    const response = error as { error?: { message?: string }; message?: string };
    return response.error?.message ?? response.message ?? fallback;
  }
  return fallback;
}
