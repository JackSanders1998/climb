import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { Link, Stack } from "expo-router";
import { Text } from "react-native";

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

export default function RootLayout() {
  return (
    <ClerkProvider
      tokenCache={tokenCache}
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <Stack
          screenOptions={{
            headerShown: true,
            headerLargeTitle: true,
            headerTransparent: false,
            headerLargeTitleShadowVisible: false,
            headerShadowVisible: true,
            headerStyle: { backgroundColor: "rgba(255, 255, 255, 0.01)" },
            headerLargeStyle: { backgroundColor: "transparent" },
            headerRight: () => (
              <Link href="/settings">
                <Text>Settings</Text>
              </Link>
            ),
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              title: "Summary",
            }}
          />
          <Stack.Screen
            name="insights"
            options={{
              title: "Insights",
            }}
          />
          <Stack.Screen
            name="locations"
            options={{
              title: "Locations",
            }}
          />
          <Stack.Screen
            name="settings"
            options={{
              title: "Settings",
            }}
          />
        </Stack>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
