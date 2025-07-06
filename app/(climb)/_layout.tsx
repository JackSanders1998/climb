import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="climbs" options={{ title: "Climbs" }} />
    </Stack>
  );
}
