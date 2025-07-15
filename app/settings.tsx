import { useStoreUserEffect } from "@/lib/hooks/useStoreUserEffect";
import { Button } from "@/lib/ui/Button";
import { Card } from "@/lib/ui/Card";
import { Text } from "@/lib/ui/Text";
import { useAuth } from "@clerk/clerk-expo";
import { Stack } from "expo-router";
import React, { Fragment } from "react";
import { Alert } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export default function Settings() {
  const { user } = useStoreUserEffect();
  const { signOut } = useAuth();

  return (
    <Fragment>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Button
              symbol="rectangle.portrait.and.arrow.right"
              onPress={() =>
                Alert.alert("Are you sure?", undefined, [
                  {
                    text: "Cancel",
                    style: "cancel",
                  },
                  {
                    text: "Sign out",
                    onPress: () => signOut(),
                    style: "destructive",
                  },
                ])
              }
              title="Sign out"
            />
          ),
        }}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{
          padding: 12,
          gap: 8,
          flexDirection: "column",
        }}
      >
        <Card>
          <Text level="title3">{user?.fullName}</Text>
          <Text>{user?.id}</Text>
          <Text>{user?.primaryEmailAddress?.emailAddress}</Text>
        </Card>
      </ScrollView>
    </Fragment>
  );
}
