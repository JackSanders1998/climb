import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { Link, Stack, usePathname } from "expo-router";
import { Text } from "react-native";

// Component for the header right content - needs to be outside the main component
// to properly use the usePathname hook
function HeaderRightContent() {
  const pathname = usePathname();

  // Don't show Settings link if we're already on settings or locations
  if (
    !(
      pathname.toLowerCase().includes("index") ||
      pathname.toLowerCase().includes("summary") ||
      pathname.toLowerCase().includes("insights")
    )
  ) {
    return null;
  }

  return (
    <Link href="/settings">
      <Text>Settings</Text>
    </Link>
  );
}

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
            headerRight: () => {
              // We need to create a component that uses the usePathname hook
              return <HeaderRightContent />;
            },
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
            name="locations/index"
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
          <Stack.Screen
            name="(locations)/[name]"
            options={({ route }) => ({
              title: route.params?.name || "Location Detail",
            })}
          />
        </Stack>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
