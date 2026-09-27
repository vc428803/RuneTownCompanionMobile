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

### Runtime verification completed

- Verified the Android Emulator through ADB reverse using API base URL `http://127.0.0.1:8080`.
- Verified Goal list, Goal detail, nullable Supporting Evidence, accepted Evidence (`200`), rejected Evidence (`422`), missing resources (`404`), duplicate Evidence (`409`), and network failure handling.
- Verified Metro on port `8081` and the Spring Boot API on port `8080`.
- Aligned the five Mobile MVP screens with UI Flow v0.3 without adding unsupported Goal creation, Collection, Profile, Milestone, or AI features.

## 2026-09-27 — Goal Completion UI Entry

### Completed

- Added a bottom primary `完成目標` CTA that appears only when Goal Detail receives `READY_TO_COMPLETE`.
- Added a confirmation modal containing the Goal title, completion-condition summary, cancel action, and confirm-action loading/disabled structure.
- Kept the confirm action disabled and clearly labeled as waiting for the backend contract; the frontend does not locally change `READY_TO_COMPLETE` into `COMPLETED`.
- Added a dedicated completed-state message when Goal Detail receives `COMPLETED`; the completion CTA is hidden in that state.

### Blocker / dependency

- `MOBILE_API_CONTRACT.md` does not currently define a Goal completion endpoint. A backend endpoint and its request, success, and error contracts are required before the confirmation action can be enabled and wired.

### Next step

- Implement and document the smallest backend Goal completion API slice, then return to Mobile to connect the existing confirmation action and refresh Goal Detail from the server response.
