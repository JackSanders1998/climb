import { SignIn } from "@/lib/components/signin";
import { useStoreUserEffect } from "@/lib/hooks/useStoreUserEffect";
import { Button } from "@/lib/ui/Button";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { sand, sandA } from "@radix-ui/colors";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { Stack } from "expo-router";
import { ReactNode } from "react";
import { SheetProvider } from "react-native-actions-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import "./sheets.tsx";

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

export const settingsPath = "/settings" as const;

const WrapWithAuth = ({ children }: { children: ReactNode }) => {
  const { isLoading, isAuthenticated } = useStoreUserEffect();

  if (isAuthenticated) {
    return children;
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        padding: 32,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {isLoading ? undefined : <SignIn />}
    </SafeAreaView>
  );
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <SheetProvider>
        <ClerkProvider
          tokenCache={tokenCache}
          publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}
        >
          <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
            <WrapWithAuth>
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
                    <Button
                      symbol="gear"
                      href={settingsPath}
                      as="link"
                      title="Settings"
                    />
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
                  name="settings"
                  options={{
                    title: "Settings",
                  }}
                />
              </Stack>
            </WrapWithAuth>
          </ConvexProviderWithClerk>
        </ClerkProvider>
      </SheetProvider>
    </GestureHandlerRootView>
  );
}
