import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerBackButtonDisplayMode: "minimal",
        headerTintColor: "#1f2937",
        headerTitleStyle: { fontWeight: "600" },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Goals" }} />
      <Stack.Screen name="goal-detail" options={{ title: "Goal Detail" }} />
      <Stack.Screen
        name="criterion-detail"
        options={{ title: "Criterion Detail" }}
      />
      <Stack.Screen
        name="submit-evidence"
        options={{ title: "Submit Evidence" }}
      />
      <Stack.Screen
        name="submit-result"
        options={{ title: "Submit Result" }}
      />
    </Stack>
  );
}
