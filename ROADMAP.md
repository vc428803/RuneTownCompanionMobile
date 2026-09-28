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
- Added a dedicated completed-state message when Goal Detail receives `COMPLETED`; the completion CTA is hidden in that state.
- Added the typed `POST /api/goals/{goalId}/completion` client integration without a request body.
- Connected confirmation to the backend with duplicate-submit protection, loading state, and inline error recovery.
- Applied the successful backend response directly to Goal Detail state without an extra GET.
- Added completion-specific `404` handling and authoritative state refresh after `409 Conflict`.
- Verified network failure recovery without crashing or locally promoting Goal state.

### Current State

- Goal Completion integration is complete and the backend completion API blocker is removed.
- The Mobile MVP now runs from Goal/Criterion browsing through Evidence submission, `READY_TO_COMPLETE`, formal Goal completion, and the final `COMPLETED` state.
- Android emulator verification covers the successful end-to-end flow, stale-state `409` resynchronization, and network failure recovery.

## 2026-09-28 — Goal Completion Regression Coverage

### Completed

- Added the Expo SDK 57 Jest setup with React Native Testing Library.
- Pinned `test-renderer@1.2.0` to match the project's React 19.2 runtime.
- Added Goal Detail component regression tests for successful completion, `404 Not Found`, `409 Conflict`, and network-failure recovery.
- Verified that success promotes the displayed Goal to `COMPLETED` without an extra GET.
- Verified that `404` and network failures keep the confirmation recoverable without changing local Goal state.
- Verified that `409` triggers a fresh Goal request and renders the authoritative backend status.

### Verification

- Jest: 1 suite, 4 tests passed.
- Expo lint passes without warnings.
- TypeScript type checking passes.

### Current State

- The Goal Completion UI, backend integration, emulator flow, and automated regression coverage are complete.
