import { Routes } from '@angular/router';

/** Standalone routes mirror the paths exposed by the consultation remote. */
export const routes: Routes = [
  {
    path: 'consultation',
    loadChildren: () => import('./consultation/consultation.routes').then((module) => module.routes),
  },
  { path: '', pathMatch: 'full', redirectTo: 'consultation' },
  { path: '**', redirectTo: 'consultation' },
];
