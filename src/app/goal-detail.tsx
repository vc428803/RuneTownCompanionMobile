import { getGoal } from "@/api/client";
import {
  Card,
  colors,
  LabelValue,
  LoadingState,
  MessageState,
  ProgressBar,
  Screen,
  SectionHeader,
  StatusBadge,
} from "@/components/mvp-ui";
import { useApiResource } from "@/hooks/use-api-resource";
import { statusPresentation } from "@/utils/goal-status";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function GoalDetailScreen() {
  const { goalId } = useLocalSearchParams<{ goalId?: string }>();
  const loadGoal = useCallback(() => {
    if (!goalId) {
      return Promise.reject(new Error("缺少 goalId，無法載入 Goal。"));
    }
    return getGoal(goalId);
  }, [goalId]);
  const { data: goal, error, isLoading, reload } = useApiResource(loadGoal);

  if (isLoading && !goal) {
    return (
      <Screen title="Goal 詳情">
        <LoadingState label="正在載入 Goal…" />
      </Screen>
    );
  }

  if (error && !goal) {
    return (
      <Screen title="Goal 詳情">
        <MessageState
          actionLabel="重試"
          message={error.message}
          onAction={reload}
          title="無法載入 Goal"
        />
      </Screen>
    );
  }

  if (!goal) {
    return null;
  }

  const completedCount = goal.criteria.filter(
    (criterion) => criterion.completed,
  ).length;
  const percentage =
    goal.criteria.length > 0
      ? Math.round((completedCount / goal.criteria.length) * 100)
      : 0;
  const status = statusPresentation(goal.goalStatus);

  return (
    <Screen>
      {error ? (
        <Text style={styles.refreshError}>更新失敗，正在顯示上次載入的資料。</Text>
      ) : null}
      <Card>
        <View style={styles.heroRow}>
          <View style={styles.goalIcon}>
            <Text style={styles.goalIconText}>
              {goal.title.trim().charAt(0).toUpperCase() || "G"}
            </Text>
          </View>
          <View style={styles.heroCopy}>
            <Text style={styles.goalTitle}>{goal.title}</Text>
            <Text style={styles.archetype}>{goal.lifeArchetype}</Text>
          </View>
        </View>
        <View style={styles.progressCopy}>
          <Text style={styles.progressLabel}>
            {completedCount} / {goal.criteria.length} Criteria
          </Text>
          <Text style={styles.progressCount}>
            {percentage}%
          </Text>
        </View>
        <ProgressBar completed={completedCount} total={goal.criteria.length} />
        <View style={styles.statusPanel}>
          <LabelValue label="狀態" value={goal.goalStatus} />
          <StatusBadge label={status.label} tone={status.tone} />
        </View>
      </Card>

      <View style={styles.criteriaSection}>
        <SectionHeader
          title={`Criteria (${goal.criteria.length})`}
        />
        {goal.criteria.length === 0 ? (
          <MessageState message="此 Goal 尚未設定條件。" title="尚無 Criterion" />
        ) : (
          <View style={styles.criteriaList}>
            {goal.criteria.map((criterion, index) => (
              <Pressable
                accessibilityHint="開啟條件詳情"
                accessibilityRole="button"
                key={criterion.criterionId}
                onPress={() =>
                  router.push({
                    pathname: "/criterion-detail",
                    params: {
                      goalId: goal.goalId,
                      criterionId: criterion.criterionId,
                    },
                  })
                }
                style={({ pressed }) => [
                  styles.criterionRow,
                  pressed && styles.criterionRowPressed,
                ]}
              >
                <View
                  style={[
                    styles.criterionIcon,
                    criterion.completed && styles.criterionIconComplete,
                  ]}
                >
                  <Text
                    style={[
                      styles.criterionIconText,
                      criterion.completed && styles.criterionIconTextComplete,
                    ]}
                  >
                    {criterion.completed ? "✓" : index + 1}
                  </Text>
                </View>
                <View style={styles.criterionCopy}>
                  <Text style={styles.criterionDescription}>
                    {criterion.description}
                  </Text>
                  <Text
                    style={
                      criterion.completed
                        ? styles.completeText
                        : styles.inProgressText
                    }
                  >
                    {criterion.completed ? "已完成" : "尚未完成"}
                  </Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  refreshError: {
    color: colors.warning,
    fontSize: 13,
    lineHeight: 20,
  },
  heroRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  goalIcon: {
    width: 52,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    backgroundColor: "#DBEAFE",
  },
  goalIconText: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: "800",
  },
  heroCopy: {
    flex: 1,
    gap: 5,
  },
  goalTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 27,
  },
  archetype: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "600",
  },
  progressCopy: {
    flexDirection: "row",
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
  statusPanel: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
  },
  criteriaSection: {
    gap: 14,
  },
  criteriaList: {
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    backgroundColor: colors.surface,
  },
  criterionRow: {
    minHeight: 84,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  criterionRowPressed: {
    backgroundColor: "#EFF6FF",
  },
  criterionIcon: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: colors.surfaceStrong,
  },
  criterionIconComplete: {
    backgroundColor: colors.successSoft,
  },
  criterionIconText: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "700",
  },
  criterionIconTextComplete: {
    color: colors.success,
  },
  criterionCopy: {
    flex: 1,
    gap: 5,
  },
  criterionDescription: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 22,
  },
  completeText: {
    color: colors.success,
    fontSize: 12,
    fontWeight: "700",
  },
  inProgressText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "700",
  },
  chevron: {
    color: colors.textMuted,
    fontSize: 26,
  },
});
