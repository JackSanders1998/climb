import { Tabs } from "expo-router";

// export default function RootLayout() {
//   return (
    // <ClerkProvider
    //   tokenCache={tokenCache}
    //   publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}
    // >
    //   <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
    //     <Stack>
    //       <Stack.Screen name="index" />
    //     </Stack>
    //   </ConvexProviderWithClerk>
    // </ClerkProvider>
//   );
// }

import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { ConvexReactClient } from "convex/react";
import { StatusBar } from "expo-status-bar";
import React from "react";

import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { ConvexProviderWithClerk } from "convex/react-clerk";
// import { Stack } from "expo-router";

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});
// import "../../global.css";

export default function RootLayout() {
  return (
    <ClerkProvider
      tokenCache={tokenCache}
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <React.Fragment>
          <StatusBar style="auto" />
          <Tabs
            screenOptions={{ tabBarActiveTintColor: "teal" }}
            backBehavior="order"
          >
            <Tabs.Screen
              name="(home)"
              options={{
                title: "Home",
                headerShown: false,
                tabBarLabel: "Index",
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons
                    name="numeric-1-box-outline"
                    size={size}
                    color={color}
                  />
                ),
              }}
            />
            <Tabs.Screen
              name="second"
              options={{
                title: "Second",
                headerShown: false,
                popToTopOnBlur: true,
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons
                    name="numeric-2-box-outline"
                    size={size}
                    color={color}
                  />
                ),
              }}
            />
            <Tabs.Screen
              name="third"
              options={{
                title: "Third",
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons
                    name="numeric-3-box-outline"
                    size={size}
                    color={color}
                  />
                ),
              }}
            />
            <Tabs.Screen
              name="fourth"
              options={{
                tabBarBadge: 2,
                tabBarBadgeStyle: {
                  backgroundColor: "tomato",
                  color: "white",
                },
                title: "Fourth",
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons
                    name="numeric-4-box-outline"
                    size={size}
                    color={color}
                  />
                ),
              }}
            />
          </Tabs>
        </React.Fragment>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
