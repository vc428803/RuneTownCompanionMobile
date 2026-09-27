import {
  CriterionDetail,
  EvidenceSubmissionRequest,
  EvidenceSubmissionResponse,
  GoalCompletionResponse,
  GoalDetail,
  GoalSummary,
} from "@/api/contracts";

const defaultBaseUrl = "http://127.0.0.1:8080";

export const API_BASE_URL = (
  process.env.EXPO_PUBLIC_API_BASE_URL ?? defaultBaseUrl
).replace(/\/$/, "");

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number | null,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function messageForStatus(status: number) {
  switch (status) {
    case 400:
      return "送出的資料格式不正確，請檢查後再試一次。";
    case 404:
      return "找不到指定的 Goal 或 Criterion。";
    case 409:
      return "這個 Criterion 已經完成，無法重複提交。";
    default:
      return `伺服器回傳錯誤（${status}）。`;
  }
}

async function request<T>(
  path: string,
  init?: RequestInit,
  acceptedStatuses: number[] = [200],
  errorMessages: Partial<Record<number, string>> = {},
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        Accept: "application/json",
        ...init?.headers,
      },
    });
  } catch {
    throw new ApiError(
      `無法連線至後端（${API_BASE_URL}）。請確認 Spring Boot 已啟動，且裝置可連到此位址。`,
      null,
    );
  }

  if (!acceptedStatuses.includes(response.status)) {
    throw new ApiError(
      errorMessages[response.status] ?? messageForStatus(response.status),
      response.status,
    );
  }

  try {
    return (await response.json()) as T;
  } catch {
    throw new ApiError("伺服器回傳了無法解析的資料。", response.status);
  }
}

function segment(value: string) {
  return encodeURIComponent(value);
}

export function getGoals() {
  return request<GoalSummary[]>("/api/goals");
}

export function getGoal(goalId: string) {
  return request<GoalDetail>(`/api/goals/${segment(goalId)}`);
}

export function getCriterion(goalId: string, criterionId: string) {
  return request<CriterionDetail>(
    `/api/goals/${segment(goalId)}/criteria/${segment(criterionId)}`,
  );
}

export function submitEvidence(
  goalId: string,
  criterionId: string,
  payload: EvidenceSubmissionRequest,
) {
  return request<EvidenceSubmissionResponse>(
    `/api/goals/${segment(goalId)}/criteria/${segment(criterionId)}/evidence`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
    [200, 422],
  );
}

export function completeGoal(goalId: string) {
  return request<GoalCompletionResponse>(
    `/api/goals/${segment(goalId)}/completion`,
    { method: "POST" },
    [200],
    {
      404: "此 Goal 已不存在或無法取得。",
      409: "Goal 狀態已變更，目前無法完成。已重新同步最新狀態。",
    },
  );
}
