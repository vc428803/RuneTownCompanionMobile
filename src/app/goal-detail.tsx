import { InfoCard, PrimaryLink, Screen } from "@/components/mvp-ui";

export default function GoalDetailScreen() {
  return (
    <Screen
      title="Goal Detail"
      subtitle="Complete the Lumbridge Starter Path"
    >
      <InfoCard
        eyebrow="NEXT CRITERION"
        title="Cook a shrimp"
        description="Catch a raw shrimp and cook it on a fire in Lumbridge."
        detail="Reward: 20 XP"
      />
      <PrimaryLink href="/criterion-detail" label="View criterion" />
    </Screen>
  );
}
