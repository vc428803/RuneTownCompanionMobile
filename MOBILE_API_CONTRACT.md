# RuneTownCompanion Mobile API Contract

This document is the frontend contract for the currently implemented RuneTownCompanion backend. It describes only APIs and data that exist in production code today.

## 1. Backend Base Information

| Item | Local URL |
|---|---|
| Base URL | `http://localhost:8080` |
| Swagger UI | `http://localhost:8080/swagger-ui.html` |
| OpenAPI JSON | `http://localhost:8080/v3/api-docs` |

The port can be overridden when starting Spring Boot. Mobile development on a physical device must replace `localhost` with an address reachable from that device.

All request and response bodies below use JSON.

## 2. Available Endpoints

### GET `/api/goals`

Returns all goals currently registered in the backend, ordered by `goalId`.

- Path parameters: none
- Request body: none
- Success status: `200 OK`
- Response body: array of `GoalSummary`

Example request:

```http
GET http://localhost:8080/api/goals
```

Example response:

```json
[
  {
    "goalId": "goal-demo",
    "title": "Publish the first article",
    "goalStatus": "ACTIVE",
    "completedCriteriaCount": 0,
    "totalCriteriaCount": 1
  }
]
```

The API does not return a percentage. The frontend may calculate progress as `completedCriteriaCount / totalCriteriaCount`.

### GET `/api/goals/{goalId}`

Returns one goal and its completion criteria.

- Path parameter `goalId`: required string
- Request body: none
- Success status: `200 OK`
- Error status: `404 Not Found` when the goal does not exist
- Response body: `GoalDetail`

Example request:

```http
GET http://localhost:8080/api/goals/goal-demo
```

Example response:

```json
{
  "goalId": "goal-demo",
  "title": "Publish the first article",
  "lifeArchetype": "CREATOR",
  "goalStatus": "ACTIVE",
  "criteria": [
    {
      "criterionId": "criterion-demo",
      "description": "Publish the article",
      "completed": false
    }
  ]
}
```

### GET `/api/goals/{goalId}/criteria/{criterionId}`

Returns one completion criterion and its single supporting Evidence, if present.

- Path parameter `goalId`: required string
- Path parameter `criterionId`: required string
- Request body: none
- Success status: `200 OK`
- Error status: `404 Not Found` when either the goal or criterion does not exist
- Response body: `CriterionDetail`

Example request:

```http
GET http://localhost:8080/api/goals/goal-demo/criteria/criterion-demo
```

Example response before Evidence is accepted:

```json
{
  "criterionId": "criterion-demo",
  "description": "Publish the article",
  "completed": false,
  "supportingEvidence": null
}
```

Example `supportingEvidence` after Evidence is accepted:

```json
{
  "criterionId": "criterion-demo",
  "description": "Publish the article",
  "completed": true,
  "supportingEvidence": {
    "description": "The article is now publicly available",
    "source": "https://example.com/articles/first"
  }
}
```

### POST `/api/goals/{goalId}/criteria/{criterionId}/evidence`

Submits an Evidence candidate for one criterion. When accepted, the criterion is completed and the Goal status is re-evaluated.

- Path parameter `goalId`: required string
- Path parameter `criterionId`: required string
- Request body: `EvidenceSubmissionRequest`, required
- `200 OK`: Evidence accepted
- `404 Not Found`: goal or criterion does not exist
- `409 Conflict`: criterion is already completed
- `422 Unprocessable Content`: Evidence did not qualify
- Response body for `200` and `422`: `EvidenceSubmissionResponse`

Example request:

```http
POST http://localhost:8080/api/goals/goal-demo/criteria/criterion-demo/evidence
Content-Type: application/json
```

```json
{
  "title": "Published the first article",
  "description": "The article is now publicly available",
  "source": "https://example.com/articles/first"
}
```

Example successful response:

```json
{
  "accepted": true,
  "goalId": "goal-demo",
  "criterionId": "criterion-demo",
  "criterionCompleted": true,
  "goalStatus": "READY_TO_COMPLETE"
}
```

Example qualification failure response (`422`):

```json
{
  "accepted": false,
  "goalId": "goal-demo",
  "criterionId": "criterion-demo",
  "criterionCompleted": false,
  "goalStatus": "ACTIVE"
}
```

`title` and `description` must be non-null and non-blank to qualify. The published OpenAPI schema marks `title`, `description`, and `source` as required; frontend clients should always send all three. `source` is a plain string and is not guaranteed to be a validated URL.

Malformed JSON or a missing request body may produce `400 Bad Request` from Spring. The documented `404` and `409` responses currently use Spring's default error shape, for example:

```json
{
  "timestamp": "2026-09-26T03:50:36.569Z",
  "status": 409,
  "error": "Conflict",
  "path": "/api/goals/goal-demo/criteria/criterion-demo/evidence"
}
```

The error body does not currently guarantee a human-readable domain message.

## 3. Mobile MVP API Availability

| Mobile need | Status |
|---|---|
| `GET /api/goals` | IMPLEMENTED |
| `GET /api/goals/{goalId}` | IMPLEMENTED |
| `GET /api/goals/{goalId}/criteria/{criterionId}` | IMPLEMENTED |
| `POST /api/goals/{goalId}/criteria/{criterionId}/evidence` | IMPLEMENTED |

These four endpoints are the complete currently available Mobile MVP API surface.

## 4. Data Contract

“Required” means the frontend should expect the field to be present in a successful response or must send it in a request. Except where explicitly marked nullable, successful-response fields are non-null in the current API flow.

### Goal Summary

Returned by `GET /api/goals`.

| Field | JSON type | Required | Nullable | Meaning |
|---|---|---:|---:|---|
| `goalId` | string | yes | no | Goal identifier used in API paths. |
| `title` | string | yes | no | Display title. |
| `goalStatus` | `GoalStatus` string | yes | no | Current Goal lifecycle status. |
| `completedCriteriaCount` | integer (`int64`) | yes | no | Number of completed criteria. |
| `totalCriteriaCount` | integer (`int32`) | yes | no | Total number of criteria. |

### Goal Detail

Returned by `GET /api/goals/{goalId}`.

| Field | JSON type | Required | Nullable | Meaning |
|---|---|---:|---:|---|
| `goalId` | string | yes | no | Goal identifier. |
| `title` | string | yes | no | Display title. |
| `lifeArchetype` | `LifeArchetype` string | yes | no | Goal classification. |
| `goalStatus` | `GoalStatus` string | yes | no | Current Goal lifecycle status. |
| `criteria` | array of `CriterionSummary` | yes | no | Criteria belonging to this Goal. |

### CompletionCriterion Summary

Elements of `GoalDetail.criteria`.

| Field | JSON type | Required | Nullable | Meaning |
|---|---|---:|---:|---|
| `criterionId` | string | yes | no | Registry-provided identifier used in criterion API paths. |
| `description` | string | yes | no | Criterion display text. |
| `completed` | boolean | yes | no | Whether the criterion is satisfied. |

### CompletionCriterion Detail

Returned by `GET /api/goals/{goalId}/criteria/{criterionId}`.

| Field | JSON type | Required | Nullable | Meaning |
|---|---|---:|---:|---|
| `criterionId` | string | yes | no | Registry-provided criterion identifier. |
| `description` | string | yes | no | Criterion display text. |
| `completed` | boolean | yes | no | Whether the criterion is satisfied. |
| `supportingEvidence` | `SupportingEvidence` object | yes | yes | Evidence satisfying this criterion, or `null`. |

### Supporting Evidence

| Field | JSON type | Required when object exists | Nullable | Meaning |
|---|---|---:|---:|---|
| `description` | string | yes | no for Evidence accepted through the API | Submitted Evidence description. |
| `source` | string | yes | possible at runtime | Submitted source text; not necessarily a URL. |

Supporting Evidence does not expose an Evidence ID, title, timestamp, qualification details, or a list of prior submissions.

### Evidence Submission Request

| Field | JSON type | Required | Nullable | Meaning |
|---|---|---:|---:|---|
| `title` | string | yes | no | Candidate title; must not be blank. |
| `description` | string | yes | no | Candidate description; must not be blank. |
| `source` | string | yes | frontend should not send null | Source text. URL format is not enforced. |

### Evidence Submission Response

Returned for both accepted (`200`) and qualification-rejected (`422`) submissions.

| Field | JSON type | Required | Nullable | Meaning |
|---|---|---:|---:|---|
| `accepted` | boolean | yes | no | Whether the Evidence qualified. |
| `goalId` | string | yes | no | Target Goal identifier. |
| `criterionId` | string | yes | no | Target criterion identifier. |
| `criterionCompleted` | boolean | yes | no | Criterion state after processing. |
| `goalStatus` | `GoalStatus` string | yes | no | Goal state after processing. |

## 5. Enum / Allowed Values

### GoalStatus

The backend enum contains exactly:

```text
ACTIVE
PAUSED
READY_TO_COMPLETE
COMPLETED
ABANDONED
```

The Mobile app should tolerate every value even though the current API only provides an Evidence submission mutation.

### LifeArchetype

The backend enum contains exactly:

```text
GUARDIAN
SCHOLAR
ARTISAN
CREATOR
TECHNOMANCER
HEALER
MERCHANT
RANGER
CULTIVATOR
COMMANDER
CHALLENGER
```

## 6. Data the Mobile UI Can Safely Use

### Domain and API supported

- Goal ID, title, status, completed criterion count, and total criterion count.
- Goal LifeArchetype through Goal Detail.
- Criterion ID, description, and completed state.
- A criterion's single supporting Evidence as description/source, or `null`.
- Evidence submission using title, description, and source.
- Submission result using accepted, criterionCompleted, and latest goalStatus.
- Updated GET responses after a successful POST, for the lifetime of the same server process.

### Domain exists, but no API is available

- The collected Evidence list held by the backend has no read endpoint.
- A Goal can represent `COMPLETED`, but there is currently no Goal completion HTTP endpoint.

### Not implemented as a Mobile API

- Create, edit, delete, pause, abandon, or explicitly complete a Goal.
- Create, edit, delete, or reorder completion criteria.
- Evidence history or multiple supporting Evidence records per criterion.
- Collection browsing APIs.
- User/account APIs.

## 7. Known Limitations

- Data is stored only in an in-memory registry.
- Restarting the server resets all runtime changes and restores the seeded demo data.
- The default local seed is `goal-demo` with `criterion-demo`.
- `criterionId` comes from the registry mapping; it is not a field on the domain CompletionCriterion.
- Each criterion currently exposes at most one supporting Evidence object.
- Supporting Evidence exposes only `description` and `source`.
- The submitted Evidence `title` is used during submission but is not returned by Criterion Detail.
- No Evidence history endpoint exists.
- Goal progress is returned as completed and total counts, not a percentage.
- Error responses are not yet normalized into a dedicated Mobile error DTO.
- No pagination, filtering, sorting parameters, API version prefix, or concurrency token is available.

## 8. Frontend Do Not Assume

The Mobile app must not assume that any of the following currently exists:

- Milestone as a navigable or mutable layer between Goal and Evidence.
- Milestone, ImpactRule, or game-impact HTTP endpoints.
- World progression or WorldState APIs.
- AI feedback, AI qualification explanations, or generated suggestions.
- Multiple supporting Evidence items for one criterion.
- Evidence history, Evidence IDs, Evidence title retrieval, or Evidence timestamps.
- Authentication, user identity, authorization, or per-user data separation.
- Database persistence, offline synchronization, or data surviving a server restart.
- Goal creation, Goal completion, Goal editing, criterion management, or deletion APIs.
- A server-calculated progress percentage.
