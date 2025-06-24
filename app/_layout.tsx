import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { Stack } from "expo-router";
import { Button } from "react-native";

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

const SignOutButton = ({ tintColor }: { tintColor?: string }) => {
  const { signOut, isSignedIn } = useAuth();
  return isSignedIn ? (
    <Button title="Sign out" onPress={() => signOut()} color={tintColor} />
  ) : null;
};

export default function RootLayout() {
  return (
    <ClerkProvider
      tokenCache={tokenCache}
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              title: "Convex Chat",
              headerTransparent: true,
              headerLargeTitle: true,
              // headerBlurEffect: "prominent",
              headerShadowVisible: true,
              headerLargeTitleShadowVisible: false,
              headerStyle: {
                backgroundColor: "rgba (255, 255, 255, 0.01)",
              },
              headerLargeStyle: {
                backgroundColor: "transparent",
              },

              headerLeft: ({ tintColor }) => (
                <SignOutButton tintColor={tintColor} />
              ),
            }}
          />
        </Stack>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
