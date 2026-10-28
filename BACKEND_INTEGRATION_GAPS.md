# Backend integration gaps before declaring the portal complete

> **Status as of Block C (Medical Consultation audit).**
> Gaps #1 and #4 were closed by `telemed-ia-medical-consultation-api` (Block B).
> Gap #2 depends on the API Gateway repository.
> Gap #3 (HU-14) and #5 (structured clinical fields) are still open.
> Gap #6 is resolved: the shell `SessionService` returns the JWT `sub` (UUID),
> which matches the `patientId` / `professionalId` used by the backend.

1. ~~**HTTP API implementation** — the current `feat/api-ports-and-dtos` status
   shared for this repository had only `GET /health` registered in
   `cmd/consultation-api/main.go`. Implement handlers/use cases for the
   published preconsultation, attention and post-summary paths.~~
   **Resolved in Block B.** The API now exposes `GET /health`,
   `GET /metrics`, `POST /api/consultations/{id}/attention`,
   `GET /api/consultations/{id}/attention`,
   `POST /api/consultations/{id}/post-summary`, and
   `GET /api/post-summaries/{id}`.

2. **API Gateway route** — add `/api/v1/consultations/*` → `/api/consultations/*`
   targeting the Medical Consultation API. The gateway archive provided for
   review has no consultation route file. **Still open** (gateway repo).

3. **Finalization HU-14** — add the agreed API operation for finalizing a
   consultation. The supplied OpenAPI has create/get attention and
   create/get post-summary operations, but no explicit finalization endpoint.
   The portal intentionally doesn't fake this behavior or call Appointment's
   status endpoint to mark a consultation completed. **Still open.**

4. ~~**Post-summary lifecycle** — generate/store `PostConsultationSummary` only
   after consultation finalization, then propagate `ConsultationCompleted` to
   Appointment Scheduling according to governance.~~
   **Resolved in Block B.** The `post_summary_repo.SaveWithOutbox` writes the
   summary and the `outbox_event` in the same transaction, and the
   `OutboxPoller` publishes it to `consultation.events` with `mandatory=true`.
   The `ConsultationCompleted` propagation depends on HU-14 (still open).

5. **Structured clinical fields** — align the OpenAPI `medications` and
   `referral` fields with the documented `MedicationInstruction` structure and
   `specialtyId` validation. Current schema accepts plain strings. **Still open**
   (contract + backend DTOs).

6. ~~**Identity mapping** — validate whether the shared shell
   `SessionService.getUserId()` (derived from JWT `sub`) is the
   patient/professional profile ID expected by Appointment endpoints. The
   portal uses that numeric value for the MVP.~~
   **Resolved.** The JWT `sub` is a UUID (per `identity-and-access`), and both
   `patientId` and `professionalId` in the Medical Consultation API are now
   `uuid`. The `String(session.getUserId())` coercion is safe.

7. **Patient summary/history access** — the UI lists appointments through
   Appointment Scheduling and follows `postSummaryId` to the summary endpoint.
   Confirm that the Appointment API returns this field once the post-summary
   event is processed and that the backend enforces ownership. **Still open**
   (depends on Appointment Scheduling).

PDF creation/download is deliberately excluded: document-service owns the PDF
and `DocumentStatus`.
