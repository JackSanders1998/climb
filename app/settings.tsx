import { useStoreUserEffect } from "@/lib/hooks/useStoreUserEffect";
import { Button } from "@/lib/ui/Button";
import { Card } from "@/lib/ui/Card";
import { Glur } from "@/lib/ui/Glur";
import { Text } from "@/lib/ui/Text";
import { useAuth } from "@clerk/clerk-expo";
import { Stack } from "expo-router";
import React, { Fragment } from "react";
import { Alert, Image, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export default function Settings() {
  const { user } = useStoreUserEffect();
  const { signOut } = useAuth();

  return (
    <Fragment>
      <Stack.Screen options={{ headerRight: undefined }} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{
          padding: 12,
          gap: 8,
          flexDirection: "column",
        }}
      >
        <Card style={{ gap: 8 }}>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Image
              source={{ uri: user?.imageUrl }}
              style={{ width: 28, height: 28, borderRadius: 8 }}
            />

            <Text level="title2">{user?.fullName}</Text>
          </View>
          <Text>{user?.id}</Text>
          <Text>{user?.primaryEmailAddress?.emailAddress}</Text>
          <Text>{user?.createdAt?.toString()}</Text>
          <View style={{ height: 16 }}></View>
          <Button
            variant="surface"
            symbol="rectangle.portrait.and.arrow.right"
            onPress={() =>
              Alert.alert("Are you sure you want to sign out?", undefined, [
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
        </Card>
        {/* {user &&
          Object.entries(user).map(([key, value], index) => (
            <Card key={index}>
              <Text level="title3">{key}</Text>
              <Text>{JSON.stringify(value, null, 2)}</Text>
            </Card>
          ))} */}
      </ScrollView>
      <Glur
        direction="b2t"
        style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}
      />
    </Fragment>
  );
}
