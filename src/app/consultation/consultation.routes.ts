import { Routes } from '@angular/router';

/** Exposed as `./routes`; mounted by the shell below /consultation. */
export const routes: Routes = [
  {
    path: 'professional/:appointmentId/attention',
    loadComponent: () => import('./pages/attention-form-page.component').then((m) => m.AttentionFormPageComponent),
  },
  {
    path: 'professional',
    loadComponent: () => import('./pages/professional-consultations-page.component').then((m) => m.ProfessionalConsultationsPageComponent),
  },
  {
    path: 'detail/:appointmentId',
    loadComponent: () => import('./pages/consultation-detail-page.component').then((m) => m.ConsultationDetailPageComponent),
  },
  {
    path: '',
    loadComponent: () => import('./pages/patient-consultations-page.component').then((m) => m.PatientConsultationsPageComponent),
  },
  { path: '**', redirectTo: '' },
];
