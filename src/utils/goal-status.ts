import { GoalStatus } from "@/api/contracts";

export type StatusTone = "active" | "complete" | "ready" | "neutral";

export function statusPresentation(status: GoalStatus): {
  label: string;
  tone: StatusTone;
} {
  switch (status) {
    case "ACTIVE":
      return { label: "進行中", tone: "active" };
    case "READY_TO_COMPLETE":
      return { label: "待完成", tone: "ready" };
    case "COMPLETED":
      return { label: "已完成", tone: "complete" };
    case "PAUSED":
      return { label: "已暫停", tone: "neutral" };
    case "ABANDONED":
      return { label: "已放棄", tone: "neutral" };
  }
}
