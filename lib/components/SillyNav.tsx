import { SignedIn, SignedOut, useAuth, useUser } from "@clerk/clerk-expo";
import { ScrollView, View } from "react-native";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Text } from "../ui/Text";
import { SignIn } from "./signin";

interface SillyNavProps {
  pageName: string;
}

export default function SillyNav({ pageName }: SillyNavProps) {
  // Helper function to determine if a link is for the current page
  const isCurrentPage = (linkText: string) => {
    return pageName === linkText;
  };

  const { user } = useUser();

  const { signOut } = useAuth();

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

        <SignedOut>
          <View
            style={{
              paddingVertical: 32,
            }}
          >
            <SignIn />
          </View>
        </SignedOut>
        <SignedIn>
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
        </SignedIn>
      </View>
    </ScrollView>
  );
}
