import {
  Card,
  colors,
  LabelValue,
  ProgressBar,
  Screen,
  SectionHeader,
  StatusBadge,
} from "@/components/mvp-ui";
import { selectedGoal } from "@/data/mock-goals";
import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function GoalDetailScreen() {
  return (
    <Screen title={selectedGoal.title} subtitle="目標詳情與完成條件">
      <Card>
        <View style={styles.summaryTopRow}>
          <LabelValue label="LifeArchetype" value={selectedGoal.lifeArchetype} />
          <StatusBadge label="進行中" tone="active" />
        </View>
        <View style={styles.progressCopy}>
          <Text style={styles.progressLabel}>criterion 完成數量</Text>
          <Text style={styles.progressCount}>
            {selectedGoal.completedCriteriaCount} / {selectedGoal.totalCriteriaCount}
          </Text>
        </View>
        <ProgressBar
          completed={selectedGoal.completedCriteriaCount}
          total={selectedGoal.totalCriteriaCount}
        />
        <LabelValue label="GoalStatus" value={selectedGoal.status} />
      </Card>

      <View style={styles.criteriaSection}>
        <SectionHeader
          title="CompletionCriterion"
          detail={`${selectedGoal.criteria.length} 個條件`}
        />
        <View style={styles.criteriaList}>
          {selectedGoal.criteria.map((criterion, index) => (
            <Link href="/criterion-detail" asChild key={criterion.id}>
              <Pressable
                accessibilityHint="開啟條件詳情"
                accessibilityRole="button"
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
                    {criterion.completed ? "Completed" : "In progress"}
                  </Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </Pressable>
            </Link>
          ))}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  summaryTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 16,
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
