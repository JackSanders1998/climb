import { Select } from "@/lib/components/Select";
import { Toggle } from "@/lib/components/Toggle";
import { useSettings } from "@/lib/hooks/useSettings";
import { useStoreUserEffect } from "@/lib/hooks/useStoreUserEffect";
import { Button } from "@/lib/ui/Button";
import { Card } from "@/lib/ui/Card";
import { Glur } from "@/lib/ui/Glur";
import { Text } from "@/lib/ui/Text";
import { useAuth } from "@clerk/clerk-expo";
import { useQueryClient } from "@tanstack/react-query";
import React, { Fragment } from "react";
import { Alert, Image, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Divider } from "../lib/components/Divider";

export default function Settings() {
  const { user } = useStoreUserEffect();
  const { signOut } = useAuth();

  const {
    query: { data: settings },
    mutation: { mutate: patchSettings },
  } = useSettings();

  const client = useQueryClient();

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
        <Card style={{ gap: 12 }}>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Image
              source={{ uri: user?.imageUrl }}
              style={{ width: 28, height: 28, borderRadius: 8 }}
            />

            <Text level="title2">{user?.fullName}</Text>
          </View>
          <Divider />
          <Text dim>{user?.id}</Text>
          <Divider />
          <Text dim>{user?.primaryEmailAddress?.emailAddress}</Text>
          <Divider />
          <Text dim>{user?.createdAt?.toString()}</Text>
        </Card>
        {settings && (
          <Card
            style={{
              gap: 4,
              paddingVertical: 4,
            }}
          >
            <Text style={{ paddingVertical: 8 }} level="title3">
              General settings
            </Text>
            <Divider />
            <Toggle
              checked={settings?.adminFeaturesEnabled ?? false}
              setChecked={(checked) => {
                if (checked !== settings?.adminFeaturesEnabled) {
                  patchSettings({
                    adminFeaturesEnabled: checked,
                  });
                }
              }}
              label="Enable admin features"
            />
            <Divider />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text>Interval summary</Text>
              <Select
                align="right"
                values={["Week", "Month"] as const}
                value={settings?.summaryInterval ?? "Week"}
                onValueChange={(val) => {
                  patchSettings({ summaryInterval: val });
                }}
              />
            </View>
          </Card>
        )}

        <Button
          variant="destructive"
          symbol="trash"
          onPress={() =>
            Alert.alert(
              "Are you sure you want to clear the local cache?",
              undefined,
              [
                {
                  text: "Cancel",
                  style: "cancel",
                },
                {
                  text: "Clear cache",
                  onPress: () => client.clear(),
                  style: "destructive",
                },
              ],
            )
          }
          title="Clear cache"
        />

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
