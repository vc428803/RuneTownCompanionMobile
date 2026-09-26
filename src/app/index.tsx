import { Screen, InfoCard, PrimaryLink } from "@/components/mvp-ui";

export default function Index() {
  return (
    <Screen
      title="Goals"
      subtitle="Choose a goal to see its progress and criteria."
    >
      <InfoCard
        eyebrow="ACTIVE GOAL"
        title="Complete the Lumbridge Starter Path"
        description="Finish the three beginner tasks around Lumbridge."
        detail="1 of 3 criteria complete"
      />
      <PrimaryLink href="/goal-detail" label="View goal" />
    </Screen>
  );
}
