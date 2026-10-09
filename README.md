# RuneTown Companion Mobile

NEXELYTH Life Progression System 的行動端 MVP。

使用 React Native 與 Spring Boot REST API 整合，提供 Goal 查詢、Evidence 提交與 Goal Completion 等核心流程。

> 成長來自真實進程，而不是反覆刷取經驗值。

---

## 專案簡介

RuneTown Companion Mobile 是 NEXELYTH 生態系統的行動端介面。

使用者可透過 App：

- 查詢人生目標 (Goal)
- 檢視完成條件 (Completion Criteria)
- 提交完成證據 (Evidence)
- 完成目標流程 (Goal Completion)

所有領域規則與狀態轉換皆由 Spring Boot Backend 負責，Mobile 專注於 UI、流程控制與狀態同步。

---

## 技術架構

```text
React Native / Expo
        │
        ▼
TypeScript API Client
        │
        ▼
Spring Boot REST API
        │
        ▼
Goal Domain Model
        │
        ▼
PostgreSQL
```

---

## 核心功能

### Goal List

- 查詢目標列表
- 顯示狀態與完成進度

### Goal Detail

- 查看目標詳細資訊
- 顯示 Completion Criteria
- 顯示 Goal 狀態

### Criterion Detail

- 查詢完成條件
- 查看已接受 Evidence

### Evidence Submission

- 提交完成證據
- 處理驗證失敗
- 防止重複提交

### Goal Completion

- 呼叫 Completion API
- 根據後端結果更新狀態
- 處理狀態衝突

---

## Domain-driven Goal Lifecycle

Goal 完成流程由 Backend 管理。

```text
ACTIVE
   │
   ▼
READY_TO_COMPLETE
   │
   ▼
COMPLETED
```

當所有 Completion Criteria 滿足時：

1. Goal 進入 `READY_TO_COMPLETE`
2. 使用者發起 Completion
3. Backend 驗證通過
4. Goal 轉為 `COMPLETED`

前端不自行推導領域狀態，Backend 為唯一權威來源（Source of Truth）。

---

## 狀態一致性設計

針對 API 回應採取不同策略：

| API 回應 | 處理方式 |
|-----------|-----------|
| 200 | 套用後端回傳資料 |
| 404 | 顯示資源不存在 |
| 409 | 重新取得最新狀態 |
| 422 | 顯示驗證失敗訊息 |
| Network Error | 保留可恢復操作狀態 |

其中 `409 Conflict` 會重新同步 Goal Detail，避免使用過期資料。

---

## 重複提交防護

Evidence Submission 與 Goal Completion 提供：

- Loading State
- Button Disable
- Retry 機制
- Conflict Recovery

避免重複請求造成資料不一致。

---

## 自動化測試

使用：

- Jest
- React Native Testing Library

測試涵蓋：

- Goal Completion
- Evidence Submission
- 404 Not Found
- 409 Conflict
- 422 Validation Failure
- Network Failure
- Retry Flow

---

## API Integration

| Method | Endpoint |
|----------|----------|
| GET | `/api/goals` |
| GET | `/api/goals/{goalId}` |
| GET | `/api/goals/{goalId}/criteria/{criterionId}` |
| POST | `/api/goals/{goalId}/criteria/{criterionId}/evidence` |
| POST | `/api/goals/{goalId}/completion` |

詳細契約請參考：

```text
MOBILE_API_CONTRACT.md
```

---

## 本機執行

```bash
npm install

cp .env.example .env.local

npx expo start
```

Android Emulator：

```bash
adb reverse tcp:8080 tcp:8080
adb reverse tcp:8081 tcp:8081
```

測試：

```bash
npm test
```

型別檢查：

```bash
npx tsc --noEmit
```

Lint：

```bash
npm run lint
```

---

## 已完成

- Goal / Criterion Query
- Evidence Submission
- Goal Completion
- Typed API Client
- Error Recovery
- State Synchronization
- Automated Testing

---

## 技術重點

- Domain-driven UI Design
- REST API Integration
- Type-safe API Client
- State Consistency
- Error Recovery
- Automated Testing
- React Native + Spring Boot 全端整合

---

## Backend Repository

https://github.com/vc428803/RuneTownCompanion
