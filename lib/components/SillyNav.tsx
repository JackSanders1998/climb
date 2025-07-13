import { useAuth } from "@clerk/clerk-expo";
import { Fragment } from "react";
import { ScrollView, View } from "react-native";
import { useStoreUserEffect } from "../hooks/useStoreUserEffect";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Text } from "../ui/Text";
import { SignIn } from "./signin";

interface SillyNavProps {
  pageName: string;
}

export default function SillyNav({ pageName }: SillyNavProps) {
  const { isLoading, isAuthenticated, user } = useStoreUserEffect();
  const { signOut } = useAuth();
  console.log(user);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{
        flex: 1,
      }}
    >
      <View
        style={{
          flex: 1,
          padding: 12,
          gap: 8,
        }}
      >
        <Button
          selected={pageName === "Summary"}
          title="Summary"
          as="link"
          href="/"
          variant="surface"
        />
        <Button
          selected={pageName === "Insights"}
          title="Insights"
          as="link"
          href="/insights"
          variant="surface"
        />
        <Button
          selected={pageName === "Locations"}
          title="Locations"
          as="link"
          href="/locations"
          variant="surface"
        />
        <Button
          selected={pageName === "Settings"}
          title="Settings"
          as="link"
          href="/settings"
          variant="surface"
        />

        {isLoading ? (
          <Text>Loading...</Text>
        ) : isAuthenticated ? (
          <Fragment>
            <View style={{ paddingVertical: 32 }}>
              <Button title="Sign out" onPress={() => signOut()} />
            </View>
            {user &&
              Object.entries(user).map(([key, value], index) => (
                <Card key={index}>
                  <Text level="title3">{key}</Text>
                  <Text>{JSON.stringify(value, null, 2)}</Text>
                </Card>
              ))}
          </Fragment>
        ) : (
          <View
            style={{
              paddingVertical: 32,
            }}
          >
            <SignIn />
          </View>
        )}
      </View>
    </ScrollView>
  );
}
