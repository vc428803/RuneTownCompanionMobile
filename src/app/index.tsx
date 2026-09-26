import { colors, ProgressBar, Screen, StatusBadge } from "@/components/mvp-ui";
import { GoalStatus, goals } from "@/data/mock-goals";
import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

function statusPresentation(status: GoalStatus) {
  switch (status) {
    case "COMPLETED":
      return { label: "已完成", tone: "complete" as const };
    case "READY_TO_COMPLETE":
      return { label: "待完成", tone: "ready" as const };
    default:
      return { label: "進行中", tone: "active" as const };
  }
}

export default function GoalsListScreen() {
  return (
    <Screen title="我的目標" subtitle="查看目前進度，持續完成下一個條件。">
      <View style={styles.list}>
        {goals.map((goal) => {
          const status = statusPresentation(goal.status);

          return (
            <Link href="/goal-detail" asChild key={goal.id}>
              <Pressable
                accessibilityHint="開啟目標詳情"
                accessibilityRole="button"
                style={({ pressed }) => [
                  styles.goalCard,
                  pressed && styles.goalCardPressed,
                ]}
              >
                <View style={styles.cardTopRow}>
                  <StatusBadge label={status.label} tone={status.tone} />
                  <Text style={styles.chevron}>›</Text>
                </View>
                <Text style={styles.goalTitle}>{goal.title}</Text>
                <View style={styles.progressCopy}>
                  <Text style={styles.progressLabel}>完成條件</Text>
                  <Text style={styles.progressCount}>
                    {goal.completedCriteriaCount} / {goal.totalCriteriaCount}
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
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 16,
  },
  goalCard: {
    minHeight: 180,
    gap: 16,
    padding: 18,
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
    justifyContent: "space-between",
    gap: 12,
  },
  chevron: {
    color: colors.textMuted,
    fontSize: 28,
    lineHeight: 28,
  },
  goalTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 28,
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
