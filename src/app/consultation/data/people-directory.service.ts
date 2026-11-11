import { Injectable, inject, signal } from '@angular/core';
import { catchError, forkJoin, map, of } from 'rxjs';

import { ConsultationApiService } from './consultation-api.service';

const NAMES_PER_CALL = 50;

/**
 * Real names for the account ids that appointments carry. Names are cached in a
 * signal, so a template that asks for a name re-renders when it arrives. A failed
 * lookup is not an error for the page: it keeps the generic label.
 */
@Injectable({ providedIn: 'root' })
export class PeopleDirectoryService {
  private readonly api = inject(ConsultationApiService);

  private readonly names = signal<ReadonlyMap<string, string>>(new Map());
  private professionalsLoaded = false;

  /** Loads professionals' names (patient views); retried on the next call if it fails. */
  resolveProfessionals(): void {
    if (this.professionalsLoaded) {
      return;
    }
    this.professionalsLoaded = true;
    this.api.listProfessionals().subscribe({
      next: (page) =>
        this.remember(
          page.data
            .filter((item) => !!item.fullName)
            .map((item) => [item.identityUserId, item.fullName as string] as const),
        ),
      error: () => (this.professionalsLoaded = false),
    });
  }

  /** Loads the names of these patients (professional views). */
  resolvePatients(patientIds: readonly string[]): void {
    const known = this.names();
    const missing = [...new Set(patientIds)].filter((id) => !known.has(id));
    if (missing.length === 0) {
      return;
    }

    const calls = chunks(missing, NAMES_PER_CALL).map((ids) =>
      this.api.lookupAccountNames(ids).pipe(
        map((answer) => answer.data),
        catchError(() => of([])),
      ),
    );

    forkJoin(calls).subscribe((answers) =>
      this.remember(answers.flat().map((name) => [name.id, name.fullName] as const)),
    );
  }

  professionalName(professionalId: string): string {
    return this.names().get(professionalId) ?? 'Profesional';
  }

  patientName(patientId: string): string {
    return this.names().get(patientId) ?? 'Paciente';
  }

  private remember(entries: readonly (readonly [string, string])[]): void {
    if (entries.length === 0) {
      return;
    }
    this.names.update((current) => new Map([...current, ...entries]));
  }
}

function chunks<T>(items: readonly T[], size: number): T[][] {
  const result: T[][] = [];
  for (let start = 0; start < items.length; start += size) {
    result.push(items.slice(start, start + size));
  }
  return result;
}
