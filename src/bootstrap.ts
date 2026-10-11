import { initFederation } from '@angular-architects/native-federation';

initFederation('federation.manifest.json')
  .catch((error) => {
    console.error(
      'Federation initialization failed',
      error,
    );
  })
  .then(() => import('./main'))
  .catch((error) => {
    console.error(
      'Medical Consultation bootstrap failed',
      error,
    );
  });