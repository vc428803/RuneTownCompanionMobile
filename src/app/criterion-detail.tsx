import { getCriterion } from "@/api/client";
import {
  Card,
  colors,
  LabelValue,
  LoadingState,
  MessageState,
  PrimaryLink,
  Screen,
  SectionHeader,
  StatusBadge,
} from "@/components/mvp-ui";
import { useApiResource } from "@/hooks/use-api-resource";
import { useLocalSearchParams } from "expo-router";
import { useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function CriterionDetailScreen() {
  const { goalId, criterionId } = useLocalSearchParams<{
    goalId?: string;
    criterionId?: string;
  }>();
  const loadCriterion = useCallback(() => {
    if (!goalId || !criterionId) {
      return Promise.reject(
        new Error("缺少 goalId 或 criterionId，無法載入 Criterion。"),
      );
    }
    return getCriterion(goalId, criterionId);
  }, [criterionId, goalId]);
  const {
    data: criterion,
    error,
    isLoading,
    reload,
  } = useApiResource(loadCriterion);

  if (isLoading && !criterion) {
    return (
      <Screen title="Criterion 詳情">
        <LoadingState label="正在載入 Criterion…" />
      </Screen>
    );
  }

  if (error && !criterion) {
    return (
      <Screen title="Criterion 詳情">
        <MessageState
          actionLabel="重試"
          message={error.message}
          onAction={reload}
          title="無法載入 Criterion"
        />
      </Screen>
    );
  }

  if (!criterion || !goalId || !criterionId) {
    return null;
  }

  return (
    <Screen
      title={criterion.description}
      subtitle="CompletionCriterion 詳情"
      footer={
        !criterion.completed ? (
          <PrimaryLink
            href={{
              pathname: "/submit-evidence",
              params: { goalId, criterionId },
            }}
            label="提交 Evidence"
          />
        ) : undefined
      }
    >
      {error ? (
        <Text style={styles.refreshError}>更新失敗，正在顯示上次載入的資料。</Text>
      ) : null}
      <Card>
        <StatusBadge
          label={criterion.completed ? "Completed" : "In progress"}
          tone={criterion.completed ? "complete" : "active"}
        />
        <LabelValue label="completed" value={String(criterion.completed)} />
      </Card>

      <View style={styles.evidenceSection}>
        <SectionHeader
          title="Supporting Evidence"
          detail={criterion.supportingEvidence ? "1 筆" : "0 筆"}
        />
        {criterion.supportingEvidence ? (
          <Card>
            <LabelValue
              label="description"
              value={criterion.supportingEvidence.description}
            />
            <View style={styles.divider} />
            <LabelValue
              label="source"
              value={criterion.supportingEvidence.source ?? "未提供"}
            />
          </Card>
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Text style={styles.emptyIconText}>＋</Text>
            </View>
            <Text style={styles.emptyTitle}>尚無 Evidence</Text>
            <Text style={styles.emptyDescription}>
              提交並通過驗證後，Supporting Evidence 會顯示在這裡。
            </Text>
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
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
  evidenceSection: {
    gap: 14,
  },
  emptyState: {
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 32,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#CBD5E1",
    borderRadius: 16,
    backgroundColor: colors.surface,
  },
  emptyIcon: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
    borderRadius: 22,
    backgroundColor: "#DBEAFE",
  },
  emptyIconText: {
    color: colors.primary,
    fontSize: 26,
    lineHeight: 28,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
  emptyDescription: {
    maxWidth: 280,
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
  },
});
