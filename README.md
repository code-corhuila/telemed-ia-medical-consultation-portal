# telemed-ia-medical-consultation-portal

Angular 21 + Native Federation remote for the **Medical Consultation** bounded context of TeleMed IA.

## Pages included

- `/consultation` — patient consultation history (derived from the patient's appointments and completed/post-summary references).
- `/consultation/detail/:appointmentId` — consultation details, pre-consultation information, and post-consultation summary.
- `/consultation/professional` — professional's assigned appointments and pre-consultation availability indicators.
- `/consultation/professional/:appointmentId/attention` — clinical attention form for observations, diagnosis, recommendations, medication instructions, and referral notes.

The remote name is `consultation`, exposed as `./routes`, and is intended to be mounted by the shell under `/consultation`. Local development uses port `4205`.

## Local development

```bash
npm ci
npm start
```

## Build

```bash
npm run build
```

## Integration contract and blockers

This portal follows the published `07-api/contracts/openapi/consultation-service.yaml` paths:

- `GET /api/v1/consultations/preconsultation/{id}`
- `POST /api/v1/consultations/attention`
- `GET /api/v1/consultations/attention/{id}` (available in contract; not currently needed by the screens)
- `POST /api/v1/consultations/post`
- `GET /api/v1/consultations/post/{id}`

The patient/professional lists use the existing Appointment API endpoints:

- `GET /api/v1/appointments/patient/{id}`
- `GET /api/v1/appointments/professional/{id}`

### Important: UI scaffold is not yet end-to-end functional

The uploaded API repository status showed only `GET /health` registered in `cmd/consultation-api/main.go`; the domain models, ports, and DTOs exist on the branch, but the HTTP handlers/use cases are not exposed yet. The current API Gateway repository also has no consultation route. Before clinical requests can work, add the Go HTTP handlers and a gateway rule that forwards `/api/v1/consultations/*` to the service's `/api/consultations/*` path.

The published OpenAPI contract also has no consultation-finalization operation for HU-14. Therefore this UI deliberately does **not** mark appointments as `COMPLETED`, nor does it generate a post-consultation summary immediately after saving attention. The backend must finalize care, publish `ConsultationCompleted`, and let Appointment Scheduling process that event before the post-summary flow is considered complete.

The current contract represents `medications` and `referral` as plain strings. The domain model describes structured `MedicationInstruction` values and requires the destination specialty to exist in Professional Management. To meet that full business rule, the OpenAPI/backend should be extended to accept structured medication instructions and a validated specialty identifier. This portal serializes medication fields to the text format currently documented and clearly labels the referral limitation.

PDF generation and download are intentionally out of scope here; they belong to `document-service` (Document Generation bounded context), not Medical Consultation.

## Shared shell services

The portal imports `shell/session` and `shell/apiClient`, exposed by `telemed-ia-front`. It does not read `sessionStorage` or create a second HTTP client. The shell's session is the source of the current user's numeric ID and role, and the shared API client owns the `/api/v1` prefix and authentication behavior.

The local `public/federation.manifest.json` points `shell` to `http://localhost:4200/remoteEntry.json` for development. Run the shell first, then start this portal on port 4205. The final test should be made at `http://localhost:4200/consultation` because that is the mounted remote route.

The MVP assumes that the numeric JWT `sub` corresponds to the numeric patient/professional ID used by Appointment Scheduling. Validate that identity mapping with Identity/Access before production; backend authorization remains authoritative.


## Local mock mode

For UI development and demos without running the shell or the backend, the portal
supports an in-memory mock mode:

```bash
npm run start:mock
```

This serves the portal **standalone** on `http://localhost:4205`, replacing
`shell/apiClient` and `shell/session` with local implementations through
`tsconfig.mock.json`. No shell, no gateway, no API, no database required.

### Available users (query params)

- **Patient view:** `http://localhost:4205/?mockRole=PATIENT&mockId=1`
- **Professional view:** `http://localhost:4205/consultation/professional?mockRole=PROFESSIONAL&mockId=2`

`mockName` is also supported to override the display name.

### What the mock covers

The mock client resolves the following endpoints in memory:

- `GET /appointments/patient/:id`
- `GET /appointments/professional/:id`
- `GET /consultations/preconsultation/:id`
- `GET /consultations/attention/:id`
- `GET /consultations/post/:id`
- `POST /consultations/attention` (autoincremental)

Fixtures live in `src/mocks/fixtures/`. They are coherent across lists and
details: appointments reference preconsultation and post-summary IDs, and the
professional queue matches the patient history for the same appointment IDs.

### Important

- `npm start` (Native Federation mode) is unaffected.
- The `mock` configuration sets `browser: src/main.ts`, bypassing
  `initFederation`, so the portal boots as a normal Angular app.
- `tsconfig.mock.json` is only referenced by the `mock` build configuration.