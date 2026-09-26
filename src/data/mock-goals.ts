export type GoalStatus = "IN_PROGRESS" | "COMPLETED" | "READY_TO_COMPLETE";

export type CompletionCriterion = {
  id: string;
  description: string;
  completed: boolean;
};

export type Goal = {
  id: string;
  title: string;
  lifeArchetype: string;
  status: GoalStatus;
  completedCriteriaCount: number;
  totalCriteriaCount: number;
  criteria: CompletionCriterion[];
};

export const goals: Goal[] = [
  {
    id: "goal-lumbridge",
    title: "完成 Lumbridge 新手生活路線",
    lifeArchetype: "EXPLORER",
    status: "IN_PROGRESS",
    completedCriteriaCount: 1,
    totalCriteriaCount: 3,
    criteria: [
      {
        id: "criterion-arrive",
        description: "抵達 Lumbridge 城堡廣場",
        completed: true,
      },
      {
        id: "criterion-shrimp",
        description: "捕捉並成功烹煮一隻蝦",
        completed: false,
      },
      {
        id: "criterion-guide",
        description: "與 Lumbridge Guide 完成一次對話",
        completed: false,
      },
    ],
  },
  {
    id: "goal-routine",
    title: "建立每週三次的冒險習慣",
    lifeArchetype: "ADVENTURER",
    status: "READY_TO_COMPLETE",
    completedCriteriaCount: 3,
    totalCriteriaCount: 3,
    criteria: [],
  },
  {
    id: "goal-cooking",
    title: "完成基礎料理練習",
    lifeArchetype: "CRAFTSPERSON",
    status: "COMPLETED",
    completedCriteriaCount: 2,
    totalCriteriaCount: 2,
    criteria: [],
  },
];

export const selectedGoal = goals[0];
export const selectedCriterion = selectedGoal.criteria[1];
