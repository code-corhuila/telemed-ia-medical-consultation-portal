# Backend integration gaps before declaring the portal complete

1. **HTTP API implementation** — the current `feat/api-ports-and-dtos` status shared for this repository had only `GET /health` registered in `cmd/consultation-api/main.go`. Implement handlers/use cases for the published preconsultation, attention and post-summary paths.
2. **API Gateway route** — add `/api/v1/consultations/*` → `/api/consultations/*` targeting the Medical Consultation API. The gateway archive provided for review has no consultation route file.
3. **Finalization HU-14** — add the agreed API operation for finalizing a consultation. The supplied OpenAPI has create/get attention and create/get post-summary operations, but no explicit finalization endpoint. The portal intentionally doesn't fake this behavior or call Appointment's status endpoint to mark a consultation completed.
4. **Post-summary lifecycle** — generate/store `PostConsultationSummary` only after consultation finalization, then propagate `ConsultationCompleted` to Appointment Scheduling according to governance.
5. **Structured clinical fields** — align the OpenAPI `medications` and `referral` fields with the documented `MedicationInstruction` structure and `specialtyId` validation. Current schema accepts plain strings.
6. **Identity mapping** — validate whether the shared shell `SessionService.getUserId()` (derived from JWT `sub`) is the patient/professional profile ID expected by Appointment endpoints. The portal uses that numeric value for the MVP.
7. **Patient summary/history access** — the UI lists appointments through Appointment Scheduling and follows `postSummaryId` to the summary endpoint. Confirm that the Appointment API returns this field once the post-summary event is processed and that the backend enforces ownership.

PDF creation/download is deliberately excluded: document-service owns the PDF and `DocumentStatus`.
