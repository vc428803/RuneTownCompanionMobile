import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: "#ffffff" },
        headerBackButtonDisplayMode: "minimal",
        headerTintColor: "#1f2937",
        headerShadowVisible: false,
        headerStyle: { backgroundColor: "#ffffff" },
        headerTitleStyle: { fontWeight: "600" },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Goals" }} />
      <Stack.Screen name="goal-detail" options={{ title: "Goal 詳情" }} />
      <Stack.Screen
        name="criterion-detail"
        options={{ title: "Criterion 詳情" }}
      />
      <Stack.Screen
        name="submit-evidence"
        options={{ title: "提交 Evidence" }}
      />
      <Stack.Screen
        name="submit-result"
        options={{ title: "提交結果" }}
      />
    </Stack>
  );
}
