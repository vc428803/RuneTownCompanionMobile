import { InfoCard, PrimaryLink, Screen } from "@/components/mvp-ui";

export default function SubmitResultScreen() {
  return (
    <Screen
      title="Submit Result"
      subtitle="Your evidence has been recorded locally for this demo."
    >
      <InfoCard
        eyebrow="SUBMISSION COMPLETE"
        title="Evidence accepted"
        description="Cook a shrimp"
        detail="Goal progress: 2 of 3 criteria complete"
      />
      <PrimaryLink href="/" label="Back to goals" />
    </Screen>
  );
}
