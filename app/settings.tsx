import { api } from "@/convex/_generated/api";
import { Toggle } from "@/lib/components/Toggle";
import { useStoreUserEffect } from "@/lib/hooks/useStoreUserEffect";
import { Button } from "@/lib/ui/Button";
import { Card } from "@/lib/ui/Card";
import { Glur } from "@/lib/ui/Glur";
import { Text } from "@/lib/ui/Text";
import { useAuth } from "@clerk/clerk-expo";
import { convexQuery, useConvexMutation } from "@convex-dev/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { Fragment } from "react";
import { Alert, Image, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export default function Settings() {
  const { user } = useStoreUserEffect();
  const { signOut } = useAuth();

  const { data: settings } = useQuery(
    convexQuery(api.settings.settings.get, {}),
  );

  const { mutate: patchSettings } = useMutation({
    mutationFn: useConvexMutation(api.settings.settings.patch),
  });

  return (
    <Fragment>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{
          padding: 12,
          gap: 12,
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
          <View style={{ height: 4 }}></View>
          <Text dim>{user?.id}</Text>
          <Text dim>{user?.primaryEmailAddress?.emailAddress}</Text>
          <Text dim>{user?.createdAt?.toString()}</Text>
          <View style={{ height: 8 }}></View>
        </Card>
        {settings && (
          <Card>
            <Toggle
              checked={settings?.adminFeaturesEnabled}
              setChecked={async (checked) => {
                if (checked !== settings?.adminFeaturesEnabled) {
                  await patchSettings({
                    adminFeaturesEnabled: checked,
                  });
                }
              }}
              label="Enable admin features"
            />
          </Card>
        )}
        <Button
          variant="destructive"
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
