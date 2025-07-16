import { SignIn } from "@/lib/components/signin";
import { useStoreUserEffect } from "@/lib/hooks/useStoreUserEffect";
import { Button } from "@/lib/ui/Button";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { ConvexQueryClient } from "@convex-dev/react-query";
import { sand, sandA } from "@radix-ui/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { Link, Stack, useRouter } from "expo-router";
import { ReactNode } from "react";
import { Alert, Image, StyleSheet, View } from "react-native";
import { SheetProvider } from "react-native-actions-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import * as DropdownMenu from "zeego/dropdown-menu";
import "./sheets.tsx";

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

const convexQueryClient = new ConvexQueryClient(convex);

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryKeyHashFn: convexQueryClient.hashFn(),
      queryFn: convexQueryClient.queryFn(),
    },
  },
});
convexQueryClient.connect(queryClient);

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

const SettingsButton = () => {
  const { user } = useStoreUserEffect();

  return (
    <Link href={"/settings"}>
      <Image
        source={{ uri: user?.imageUrl }}
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          borderColor: sandA.sandA7,
          borderWidth: StyleSheet.hairlineWidth,
        }}
      />
    </Link>
  );
};

const DoneButton = () => {
  const router = useRouter();
  return (
    <Button
      variant="ghost"
      title="Close"
      onPress={() =>
        router.canGoBack() ? router.back() : router.navigate("/")
      }
    />
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
            <PersistQueryClientProvider
              persistOptions={{
                persister: asyncStoragePersister,
              }}
              client={queryClient}
            >
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
                    headerStyle: {
                      backgroundColor: "rgba(255, 255, 255, 0.01)",
                    },
                    headerLargeStyle: { backgroundColor: "transparent" },
                    // headerRight: () => (
                    //   <Button
                    //     symbol="gear"
                    //     href={settingsPath}
                    //     as="link"
                    //     title="Settings"
                    //   />
                    // ),
                    headerRight: () => (
                      <View
                        style={{
                          flexDirection: "row",
                          gap: 16,
                          alignItems: "center",
                        }}
                      >
                        <DropdownMenu.Root>
                          <DropdownMenu.Trigger>
                            <Button
                              variant="ghost"
                              title="Week"
                              symbol="chevron.up.chevron.down"
                            />
                          </DropdownMenu.Trigger>
                          <DropdownMenu.Content>
                            <DropdownMenu.Label />
                            <DropdownMenu.Item
                              key="item-1"
                              onSelect={() =>
                                Alert.alert("You selected Item 1")
                              }
                            >
                              <DropdownMenu.ItemTitle>
                                Item 1
                              </DropdownMenu.ItemTitle>
                            </DropdownMenu.Item>
                            <DropdownMenu.Item
                              key="item-2"
                              onSelect={() =>
                                Alert.alert("You selected Item 2")
                              }
                            >
                              <DropdownMenu.ItemTitle>
                                Item 2
                              </DropdownMenu.ItemTitle>
                            </DropdownMenu.Item>
                          </DropdownMenu.Content>
                        </DropdownMenu.Root>
                        <SettingsButton />
                      </View>
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
                      presentation: "modal",
                      headerLargeTitle: false,
                      headerRight: DoneButton,
                    }}
                  />
                </Stack>
              </WrapWithAuth>
            </PersistQueryClientProvider>
          </ConvexProviderWithClerk>
        </ClerkProvider>
      </SheetProvider>
    </GestureHandlerRootView>
  );
}
