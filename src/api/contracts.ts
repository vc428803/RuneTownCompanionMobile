export type GoalStatus =
  | "ACTIVE"
  | "PAUSED"
  | "READY_TO_COMPLETE"
  | "COMPLETED"
  | "ABANDONED";

export type LifeArchetype =
  | "GUARDIAN"
  | "SCHOLAR"
  | "ARTISAN"
  | "CREATOR"
  | "TECHNOMANCER"
  | "HEALER"
  | "MERCHANT"
  | "RANGER"
  | "CULTIVATOR"
  | "COMMANDER"
  | "CHALLENGER";

export type GoalSummary = {
  goalId: string;
  title: string;
  goalStatus: GoalStatus;
  completedCriteriaCount: number;
  totalCriteriaCount: number;
};

export type CriterionSummary = {
  criterionId: string;
  description: string;
  completed: boolean;
};

export type GoalDetail = {
  goalId: string;
  title: string;
  lifeArchetype: LifeArchetype;
  goalStatus: GoalStatus;
  criteria: CriterionSummary[];
};

export type SupportingEvidence = {
  description: string;
  source: string | null;
};

export type CriterionDetail = CriterionSummary & {
  supportingEvidence: SupportingEvidence | null;
};

export type EvidenceSubmissionRequest = {
  title: string;
  description: string;
  source: string;
};

export type EvidenceSubmissionResponse = {
  accepted: boolean;
  goalId: string;
  criterionId: string;
  criterionCompleted: boolean;
  goalStatus: GoalStatus;
};

export type GoalCompletionResponse = {
  goalId: string;
  goalStatus: GoalStatus;
};
