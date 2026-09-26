import { GoalStatus } from "@/api/contracts";
import {
  Card,
  colors,
  LabelValue,
  MessageState,
  PrimaryButton,
  Screen,
  StatusBadge,
} from "@/components/mvp-ui";
import { statusPresentation } from "@/utils/goal-status";
import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

const goalStatuses: GoalStatus[] = [
  "ACTIVE",
  "PAUSED",
  "READY_TO_COMPLETE",
  "COMPLETED",
  "ABANDONED",
];

function isGoalStatus(value: string | undefined): value is GoalStatus {
  return value !== undefined && goalStatuses.includes(value as GoalStatus);
}

export default function SubmitResultScreen() {
  const { accepted, criterionCompleted, criterionId, goalId, goalStatus } =
    useLocalSearchParams<{
      accepted?: string;
      criterionCompleted?: string;
      criterionId?: string;
      goalId?: string;
      goalStatus?: string;
    }>();

  if (
    !goalId ||
    !criterionId ||
    (accepted !== "true" && accepted !== "false") ||
    (criterionCompleted !== "true" && criterionCompleted !== "false") ||
    !isGoalStatus(goalStatus)
  ) {
    return (
      <Screen title="提交結果">
        <MessageState
          message="缺少有效的提交結果資料，請返回 Goal 後重新操作。"
          title="無法顯示結果"
        />
      </Screen>
    );
  }

  const wasAccepted = accepted === "true";
  const status = statusPresentation(goalStatus);

  return (
    <Screen
      title={wasAccepted ? "提交成功" : "Evidence 未通過"}
      subtitle="Evidence 驗證結果已更新。"
      footer={
        <PrimaryButton
          label={wasAccepted ? "返回 Goal 詳情" : "重新提交 Evidence"}
          onPress={() =>
            router.replace(
              wasAccepted
                ? { pathname: "/goal-detail", params: { goalId } }
                : {
                    pathname: "/submit-evidence",
                    params: { goalId, criterionId },
                  },
            )
          }
        />
      }
    >
      <View style={styles.resultHero}>
        <View
          style={[
            styles.resultIcon,
            wasAccepted ? styles.successIcon : styles.rejectedIcon,
          ]}
        >
          <Text
            style={[
              styles.resultIconText,
              wasAccepted ? styles.successIconText : styles.rejectedIconText,
            ]}
          >
            {wasAccepted ? "✓" : "!"}
          </Text>
        </View>
        <Text style={styles.resultTitle}>
          {wasAccepted ? "Evidence 已通過驗證" : "Evidence 尚未符合條件"}
        </Text>
        <Text style={styles.resultDescription}>
          {wasAccepted
            ? "這筆 Evidence 已成功支持目前的 CompletionCriterion。"
            : "Criterion 尚未完成。請返回後調整內容，再次提交。"}
        </Text>
      </View>

      <Card>
        <LabelValue label="accepted" value={accepted} />
        <View style={styles.divider} />
        <LabelValue label="criterionCompleted" value={criterionCompleted} />
        <View style={styles.divider} />
        <LabelValue label="最新 goalStatus" value={goalStatus} />
        <StatusBadge label={status.label} tone={status.tone} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  resultHero: {
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
  },
  resultIcon: {
    width: 72,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
    borderRadius: 36,
  },
  successIcon: {
    backgroundColor: colors.successSoft,
  },
  rejectedIcon: {
    backgroundColor: colors.dangerSoft,
  },
  resultIconText: {
    fontSize: 38,
    fontWeight: "700",
  },
  successIconText: {
    color: colors.success,
  },
  rejectedIconText: {
    color: colors.danger,
  },
  resultTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },
  resultDescription: {
    maxWidth: 320,
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
});
