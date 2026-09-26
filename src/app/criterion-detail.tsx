import { InfoCard, PrimaryLink, Screen } from "@/components/mvp-ui";

export default function CriterionDetailScreen() {
  return (
    <Screen title="Criterion Detail" subtitle="Cook a shrimp">
      <InfoCard
        eyebrow="REQUIREMENT"
        title="Show your cooked shrimp"
        description="Submit a screenshot of your inventory with one cooked shrimp visible."
        detail="Status: Evidence needed"
      />
      <PrimaryLink href="/submit-evidence" label="Submit evidence" />
    </Screen>
  );
}
