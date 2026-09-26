# RuneTownCompanion Mobile Roadmap

## 2026-09-27 — Mobile MVP API integration

### Completed

- Added `MOBILE_API_CONTRACT.md` to the Mobile repository as the frontend source of truth.
- Replaced the seeded Goal and Criterion mock data with the four implemented backend endpoints.
- Added typed API contracts for Goal summaries, Goal details, Criterion details, Supporting Evidence, and Evidence submission results.
- Passed `goalId` and `criterionId` through Expo Router search parameters.
- Added loading, empty, retry, network-error, and submission-in-progress UI states.
- Added accepted (`200`) and qualification-rejected (`422`) Evidence result flows.
- Added handling for `400`, `404`, and `409` responses.
- Added presentation support for every documented `GoalStatus` value.
- Added `EXPO_PUBLIC_API_BASE_URL` configuration and platform-specific local defaults.
- Removed the obsolete frontend mock data module.

### Verification

- Expo lint passes without warnings.
- TypeScript type checking passes.
- Android production bundle export succeeds.
- The checked-in frontend contract matches the supplied API contract.

### Runtime follow-up

- Restart the Spring Boot backend before end-to-end verification. The process that was listening on port 8080 was started before the three GET endpoints were added and returned `404` for `GET /api/goals`.
- After restart, verify Goal list, Goal detail, Criterion detail, accepted Evidence, and rejected Evidence flows against the seeded `goal-demo` / `criterion-demo` data.
