# RuneTownCompanion Mobile API Integration Summary

This document is a human-readable integration summary for the Mobile frontend. It is not a replacement for the backend HTTP specification.

> Maintenance rule: When the backend API changes, update only the frontend-relevant summary here. Keep the complete HTTP schema in OpenAPI instead of copying it into this document.

## 1. Source of Truth

The latest backend Springdoc/OpenAPI definition is the authoritative source for the complete HTTP contract, including request and response schemas.

- Swagger UI: `http://localhost:8080/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`
- This document keeps only the information needed to integrate and maintain the Mobile frontend.
- If this summary conflicts with the latest backend OpenAPI, the backend OpenAPI takes precedence and this summary should be corrected.

The local backend base URL is `http://localhost:8080`. A physical device must use a backend address reachable from that device.

## 2. Current Mobile MVP Endpoints

| Method and path | Mobile purpose | Frontend-relevant success result | UI-relevant status codes |
|---|---|---|---|
| `GET /api/goals` | Load the Goal list. | Goal summaries used for title, status, and progress. | `200` success. |
| `GET /api/goals/{goalId}` | Load Goal Detail and its criteria. | Goal detail with current lifecycle status and criteria. | `200` success; `404` Goal unavailable. |
| `GET /api/goals/{goalId}/criteria/{criterionId}` | Load Criterion Detail and accepted supporting Evidence. | Criterion detail; `supportingEvidence` may be `null`. | `200` success; `404` Goal or Criterion unavailable. |
| `POST /api/goals/{goalId}/criteria/{criterionId}/evidence` | Submit an Evidence candidate using `title`, `description`, and `source`. | Submission result containing acceptance, criterion completion, and latest Goal status. | `200` accepted; `422` did not qualify; `404` target unavailable; `409` Criterion already completed. |
| `POST /api/goals/{goalId}/completion` | Formally complete a Goal that is `READY_TO_COMPLETE`; no request body is sent. | `{ goalId, goalStatus }`, where a successful completion has `goalStatus: "COMPLETED"`. | `200` completed; `404` Goal unavailable; `409` Goal is not currently `READY_TO_COMPLETE`. |

Network and unexpected server failures use the app's shared API error handling.

## 3. Shared Frontend Data

These are summaries of fields currently consumed by the Mobile frontend. Consult OpenAPI for the complete wire schema.

### Goal summary

Used by the Goal list:

- `goalId`: navigation and API identifier.
- `title`: display title.
- `goalStatus`: current lifecycle state.
- `completedCriteriaCount`: completed criteria count.
- `totalCriteriaCount`: total criteria count.

The frontend derives progress from the completed and total counts; the backend does not provide a percentage.

### Goal detail

Used by Goal Detail:

- `goalId`
- `title`
- `lifeArchetype`
- `goalStatus`
- `criteria`: array of CompletionCriterion summaries.

### CompletionCriterion

Fields used in criterion summaries and details:

- `criterionId`
- `description`
- `completed`
- `supportingEvidence`: detail-only field; a Supporting Evidence object or `null`.

### Supporting Evidence

- `description`
- `source`: string or `null`; it is display text and is not guaranteed to be a validated URL.

The current Criterion Detail does not expose the Evidence title, ID, timestamp, or submission history.

### Evidence submission response

- `accepted`
- `goalId`
- `criterionId`
- `criterionCompleted`
- `goalStatus`

The same response shape is used for an accepted submission (`200`) and a qualification rejection (`422`).

### Goal completion response

- `goalId`
- `goalStatus`: authoritative state after the completion attempt; it must be `COMPLETED` for the frontend to treat a `200` response as successful completion.

## 4. Important Enums

### GoalStatus

- `ACTIVE`: Goal is in progress.
- `PAUSED`: Goal is paused.
- `READY_TO_COMPLETE`: every completion criterion is satisfied, but the Goal has not been formally completed.
- `COMPLETED`: Goal has been formally completed by the backend.
- `ABANDONED`: Goal is abandoned.

Important lifecycle rules:

- `100%` progress does not mean `COMPLETED`.
- `READY_TO_COMPLETE` is the state waiting for the explicit completion action.
- Only `COMPLETED` represents a formally completed Goal.
- The frontend must never promote `READY_TO_COMPLETE` to `COMPLETED` without a successful backend completion response.

### LifeArchetype

The Mobile frontend supports these backend values for display:

`GUARDIAN`, `SCHOLAR`, `ARTISAN`, `CREATOR`, `TECHNOMANCER`, `HEALER`, `MERCHANT`, `RANGER`, `CULTIVATOR`, `COMMANDER`, `CHALLENGER`.

## 5. Frontend Behavior Rules

- Treat Goal completion as successful only after `POST /api/goals/{goalId}/completion` returns `200` with `goalStatus === "COMPLETED"`.
- Apply a successful Goal completion response directly to the current Goal Detail state; no follow-up GET is required.
- On completion `409`, show that the state changed or completion is unavailable, then GET Goal Detail again because frontend state may be stale.
- On completion `404`, show that the Goal no longer exists or cannot be retrieved.
- Disable duplicate submission and show loading while a completion request is in flight; always restore request state afterward.
- Treat Evidence `422` as a handled qualification result, not as an App crash.
- Treat `supportingEvidence: null` as a valid Criterion Detail state.
- Network failures and unexpected server errors must produce recoverable UI and must not crash the App.
- Encode path identifiers before placing them in request URLs.

## 6. Known Limitations

- Backend state is held in memory; restarting the backend resets runtime changes to the seeded demo data.
- There is no authentication or per-user data separation.
- There is no persistent or offline storage contract for Mobile data.
- `criterionId` is currently supplied by backend registry mapping rather than stored on the domain CompletionCriterion itself.
- Criterion Detail exposes at most one Supporting Evidence object and no Evidence history.
- Error responses are not normalized into a dedicated Mobile error DTO.

## 7. Unsupported / Do Not Assume

The Mobile frontend must not assume support for:

- Milestone UI flow or Milestone APIs.
- World State or world-progression APIs.
- AI behavior, feedback, qualification explanations, or generated suggestions.
- Collection browsing or mutation APIs.
- Profile, account, or authentication flows.
- Game rewards or impact-rule APIs.
