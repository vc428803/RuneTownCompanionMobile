import {
  Card,
  colors,
  LabelValue,
  PrimaryLink,
  Screen,
  StatusBadge,
} from "@/components/mvp-ui";
import { StyleSheet, Text, View } from "react-native";

export default function SubmitResultScreen() {
  return (
    <Screen
      title="提交成功"
      subtitle="Evidence 驗證結果已更新。"
      footer={<PrimaryLink href="/goal-detail" label="返回 Goal 詳情" />}
    >
      <View style={styles.successHero}>
        <View style={styles.successIcon}>
          <Text style={styles.successIconText}>✓</Text>
        </View>
        <Text style={styles.successTitle}>Evidence 已通過驗證</Text>
        <Text style={styles.successDescription}>
          這筆 Evidence 已成功支持目前的 CompletionCriterion。
        </Text>
      </View>

      <Card>
        <LabelValue label="criterionCompleted" value="true" />
        <View style={styles.divider} />
        <LabelValue label="最新 goalStatus" value="READY_TO_COMPLETE" />
        <StatusBadge label="READY_TO_COMPLETE" tone="ready" />
        <Text style={styles.readyMessage}>
          所有 criterion 已完成，此 Goal 現在可以進行完成確認。
        </Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  successHero: {
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
  },
  successIcon: {
    width: 72,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
    borderRadius: 36,
    backgroundColor: colors.successSoft,
  },
  successIconText: {
    color: colors.success,
    fontSize: 38,
    fontWeight: "700",
  },
  successTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },
  successDescription: {
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
  readyMessage: {
    color: colors.warning,
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 20,
  },
});
