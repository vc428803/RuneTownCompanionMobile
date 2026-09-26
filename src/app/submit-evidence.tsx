import { InfoCard, PrimaryLink, Screen } from "@/components/mvp-ui";

export default function SubmitEvidenceScreen() {
  return (
    <Screen
      title="Submit Evidence"
      subtitle="Review the mock evidence before submitting."
    >
      <InfoCard
        eyebrow="MOCK EVIDENCE"
        title="lumbridge-shrimp.png"
        description="Inventory screenshot · 1.2 MB"
        detail="Ready to submit"
      />
      <PrimaryLink href="/submit-result" label="Submit evidence" />
    </Screen>
  );
}
