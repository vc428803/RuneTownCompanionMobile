import {
  Card,
  colors,
  PrimaryLink,
  Screen,
  SectionHeader,
  StatusBadge,
} from "@/components/mvp-ui";
import { selectedCriterion } from "@/data/mock-goals";
import { StyleSheet, Text, View } from "react-native";

export default function CriterionDetailScreen() {
  return (
    <Screen
      title={selectedCriterion.description}
      subtitle="CompletionCriterion 詳情"
      footer={<PrimaryLink href="/submit-evidence" label="提交 Evidence" />}
    >
      <Card>
        <StatusBadge label="In progress" tone="active" />
        <View style={styles.infoBlock}>
          <Text style={styles.infoLabel}>completed</Text>
          <Text style={styles.infoValue}>false</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoBlock}>
          <Text style={styles.infoLabel}>要求說明</Text>
          <Text style={styles.requirement}>
            在 Lumbridge 周邊捕捉一隻生蝦，使用營火成功烹煮後，提交能清楚說明完成過程的 Evidence。
          </Text>
        </View>
      </Card>

      <View style={styles.evidenceSection}>
        <SectionHeader title="Supporting Evidence" detail="0 筆" />
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Text style={styles.emptyIconText}>＋</Text>
          </View>
          <Text style={styles.emptyTitle}>尚無 Evidence</Text>
          <Text style={styles.emptyDescription}>
            提交文字資料後，相關 Evidence 會顯示在這裡。
          </Text>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  infoBlock: {
    gap: 6,
  },
  infoLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "600",
  },
  infoValue: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "700",
  },
  requirement: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 24,
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
