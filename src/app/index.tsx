import { getGoals } from "@/api/client";
import {
  colors,
  LoadingState,
  MessageState,
  ProgressBar,
  Screen,
  StatusBadge,
} from "@/components/mvp-ui";
import { useApiResource } from "@/hooks/use-api-resource";
import { statusPresentation } from "@/utils/goal-status";
import { Link } from "expo-router";
import { useCallback } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function GoalsListScreen() {
  const loadGoals = useCallback(() => getGoals(), []);
  const { data: goals, error, isLoading, reload } = useApiResource(loadGoals);

  return (
    <Screen title="我的目標" subtitle="查看目前進度，持續完成下一個條件。">
      {isLoading && !goals ? <LoadingState label="正在載入 Goals…" /> : null}

      {error && !goals ? (
        <MessageState
          actionLabel="重試"
          message={error.message}
          onAction={reload}
          title="無法載入 Goals"
        />
      ) : null}

      {goals?.length === 0 ? (
        <MessageState
          message="後端目前沒有已註冊的 Goal。"
          title="尚無 Goal"
        />
      ) : null}

      {goals && goals.length > 0 ? (
        <View style={styles.list}>
          {error ? (
            <Text style={styles.refreshError}>
              更新失敗，正在顯示上次載入的資料。
            </Text>
          ) : null}
          {goals.map((goal) => {
            const status = statusPresentation(goal.goalStatus);
            const percentage =
              goal.totalCriteriaCount > 0
                ? Math.round(
                    (goal.completedCriteriaCount / goal.totalCriteriaCount) * 100,
                  )
                : 0;

            return (
              <Link
                href={{
                  pathname: "/goal-detail",
                  params: { goalId: goal.goalId },
                }}
                asChild
                key={goal.goalId}
              >
                <Pressable
                  accessibilityHint="開啟目標詳情"
                  accessibilityRole="button"
                  style={({ pressed }) => [
                    styles.goalCard,
                    pressed && styles.goalCardPressed,
                  ]}
                >
                  <View style={styles.cardTopRow}>
                    <View style={styles.goalIcon}>
                      <Text style={styles.goalIconText}>
                        {goal.title.trim().charAt(0).toUpperCase() || "G"}
                      </Text>
                    </View>
                    <View style={styles.goalCopy}>
                      <Text style={styles.goalTitle}>{goal.title}</Text>
                      <StatusBadge label={status.label} tone={status.tone} />
                    </View>
                    <Text style={styles.chevron}>›</Text>
                  </View>
                  <View style={styles.progressCopy}>
                    <Text style={styles.progressLabel}>
                      {goal.completedCriteriaCount} / {goal.totalCriteriaCount} Criteria
                    </Text>
                    <Text style={styles.progressCount}>
                      {percentage}%
                    </Text>
                  </View>
                  <ProgressBar
                    completed={goal.completedCriteriaCount}
                    total={goal.totalCriteriaCount}
                  />
                </Pressable>
              </Link>
            );
          })}
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 16,
  },
  refreshError: {
    color: colors.warning,
    fontSize: 13,
    lineHeight: 20,
  },
  goalCard: {
    minHeight: 148,
    gap: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    backgroundColor: colors.surface,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  goalCardPressed: {
    borderColor: "#BFDBFE",
    backgroundColor: "#EFF6FF",
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  goalIcon: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 13,
    backgroundColor: "#DBEAFE",
  },
  goalIconText: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: "800",
  },
  goalCopy: {
    flex: 1,
    alignItems: "flex-start",
    gap: 8,
  },
  chevron: {
    color: colors.textMuted,
    fontSize: 28,
    lineHeight: 28,
  },
  goalTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "700",
    lineHeight: 23,
  },
  progressCopy: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  progressLabel: {
    color: colors.textMuted,
    fontSize: 13,
  },
  progressCount: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
  },
});
