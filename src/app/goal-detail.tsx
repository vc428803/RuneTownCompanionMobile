import { ApiError, completeGoal, getGoal } from "@/api/client";
import {
  Card,
  colors,
  LabelValue,
  LoadingState,
  MessageState,
  PrimaryButton,
  ProgressBar,
  Screen,
  SectionHeader,
  StatusBadge,
} from "@/components/mvp-ui";
import { useApiResource } from "@/hooks/use-api-resource";
import { statusPresentation } from "@/utils/goal-status";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

export default function GoalDetailScreen() {
  const { goalId } = useLocalSearchParams<{ goalId?: string }>();
  const [isCompletionDialogVisible, setIsCompletionDialogVisible] =
    useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [completionError, setCompletionError] = useState<string | null>(null);
  const loadGoal = useCallback(() => {
    if (!goalId) {
      return Promise.reject(new Error("缺少 goalId，無法載入 Goal。"));
    }
    return getGoal(goalId);
  }, [goalId]);
  const {
    data: goal,
    error,
    isLoading,
    reload,
    setData: setGoal,
  } = useApiResource(loadGoal);

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
  const isReadyToComplete = goal.goalStatus === "READY_TO_COMPLETE";
  const isCompleted = goal.goalStatus === "COMPLETED";

  const handleCompleteGoal = async () => {
    if (isCompleting) {
      return;
    }

    setIsCompleting(true);
    setCompletionError(null);

    try {
      const response = await completeGoal(goal.goalId);

      if (response.goalStatus !== "COMPLETED") {
        setCompletionError("後端未回傳 COMPLETED 狀態，請稍後再試。");
        return;
      }

      setGoal((currentGoal) =>
        currentGoal?.goalId === response.goalId
          ? { ...currentGoal, goalStatus: response.goalStatus }
          : currentGoal,
      );
      setIsCompletionDialogVisible(false);
    } catch (reason: unknown) {
      const completionRequestError =
        reason instanceof Error ? reason : new Error("發生未知錯誤。");
      setCompletionError(completionRequestError.message);

      if (reason instanceof ApiError && reason.status === 409) {
        reload();
      }
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <>
      <Screen
        footer={
          isReadyToComplete ? (
            <PrimaryButton
              label="完成目標"
              onPress={() => {
                setCompletionError(null);
                setIsCompletionDialogVisible(true);
              }}
            />
          ) : undefined
        }
      >
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

        {isCompleted ? (
          <View accessibilityLiveRegion="polite" style={styles.completedPanel}>
            <Text style={styles.completedTitle}>目標已完成</Text>
            <Text style={styles.completedMessage}>
              此 Goal 已正式進入 COMPLETED，所有完成條件均已達成。
            </Text>
          </View>
        ) : null}

        <View style={styles.criteriaSection}>
          <SectionHeader title={`Criteria (${goal.criteria.length})`} />
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

      <Modal
        animationType="fade"
        onRequestClose={() => {
          if (!isCompleting) {
            setIsCompletionDialogVisible(false);
          }
        }}
        transparent
        visible={isCompletionDialogVisible}
      >
        <View style={styles.modalBackdrop}>
          <View
            accessibilityLabel="完成目標確認"
            accessibilityViewIsModal
            style={styles.dialog}
          >
            <Text accessibilityRole="header" style={styles.dialogTitle}>
              完成此目標？
            </Text>
            <Text style={styles.dialogGoalTitle}>{goal.title}</Text>
            <View style={styles.dialogDetails}>
              <Text style={styles.dialogDetail}>• 所有完成條件已達成</Text>
              <Text style={styles.dialogDetail}>
                • 確認後 Goal 將正式進入 COMPLETED
              </Text>
            </View>
            {completionError ? (
              <View accessibilityLiveRegion="polite" style={styles.errorNotice}>
                <Text style={styles.errorNoticeText}>
                  {completionError}
                </Text>
              </View>
            ) : null}
            <View style={styles.dialogActions}>
              <Pressable
                accessibilityRole="button"
                disabled={isCompleting}
                onPress={() => setIsCompletionDialogVisible(false)}
                style={({ pressed }) => [
                  styles.cancelButton,
                  pressed && styles.cancelButtonPressed,
                  isCompleting && styles.buttonDisabled,
                ]}
              >
                <Text style={styles.cancelButtonText}>取消</Text>
              </Pressable>
              <View style={styles.confirmButtonContainer}>
                <PrimaryButton
                  label={isCompleting ? "完成中…" : "確認完成"}
                  loading={isCompleting}
                  onPress={handleCompleteGoal}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </>
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
  completedPanel: {
    gap: 6,
    padding: 16,
    borderWidth: 1,
    borderColor: "#BBF7D0",
    borderRadius: 16,
    backgroundColor: colors.successSoft,
  },
  completedTitle: {
    color: colors.success,
    fontSize: 17,
    fontWeight: "700",
  },
  completedMessage: {
    color: "#166534",
    fontSize: 14,
    lineHeight: 21,
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
  modalBackdrop: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "rgba(15, 23, 42, 0.56)",
  },
  dialog: {
    width: "100%",
    maxWidth: 440,
    gap: 16,
    padding: 22,
    borderRadius: 18,
    backgroundColor: colors.background,
  },
  dialogTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "700",
  },
  dialogGoalTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 23,
  },
  dialogDetails: {
    gap: 8,
  },
  dialogDetail: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
  },
  errorNotice: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: colors.dangerSoft,
  },
  errorNoticeText: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 19,
  },
  dialogActions: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.background,
  },
  cancelButtonPressed: {
    backgroundColor: colors.surfaceStrong,
  },
  cancelButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
  confirmButtonContainer: {
    flex: 1,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
