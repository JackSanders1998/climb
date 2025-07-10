import { Button } from "@/lib/ui/Button";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { sand, sandA } from "@radix-ui/colors";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { Stack } from "expo-router";

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

const settingsPath = "/settings" as const;

export default function RootLayout() {
  return (
    <ClerkProvider
      tokenCache={tokenCache}
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <Stack
          screenOptions={{
            contentStyle: {
              backgroundColor: sand.sand3,
            },
            headerShown: true,
            headerLargeTitle: true,
            headerTransparent: true,
            headerTitleStyle: {
              color: sandA.sandA12,
            },
            headerTintColor: sandA.sandA12,
            headerLargeTitleShadowVisible: false,
            headerShadowVisible: true,
            headerBlurEffect: "regular",
            headerStyle: { backgroundColor: "rgba(255, 255, 255, 0.01)" },
            headerLargeStyle: { backgroundColor: "transparent" },
            headerRight: () => (
              <Button href={settingsPath} as="link" title="Settings" />
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
