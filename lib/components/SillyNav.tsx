import { Link } from "expo-router";
import { PlatformColor, ScrollView, StyleSheet, View } from "react-native";
import { Text } from "../ui/Text";

interface SillyNavProps {
  pageName: string;
}

export default function SillyNav({ pageName }: SillyNavProps) {
  // Helper function to determine if a link is for the current page
  const isCurrentPage = (linkText: string) => {
    return pageName === linkText;
  };

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          gap: 24,
        }}
      >
        <Text level="title1">{pageName} Page</Text>
        <View style={styles.linksContainer}>
          <Link href="/">
            <Text
              style={
                isCurrentPage("Summary") ? { color: PlatformColor("link") } : {}
              }
              level="body"
              dim={false}
              emphasized={isCurrentPage("Summary")}
            >
              Go to Summary
            </Text>
          </Link>
          <Link href="/insights">
            <Text
              style={
                isCurrentPage("Insights")
                  ? { color: PlatformColor("link") }
                  : {}
              }
              level="body"
              dim={false}
              emphasized={isCurrentPage("Insights")}
            >
              Go to Insights
            </Text>
          </Link>
          <Link href="/locations">
            <Text
              style={
                isCurrentPage("Locations")
                  ? { color: PlatformColor("link") }
                  : {}
              }
              level="body"
              dim={false}
              emphasized={isCurrentPage("Locations")}
            >
              Go to Locations
            </Text>
          </Link>
          <Link href="/settings">
            <Text
              style={
                isCurrentPage("Settings")
                  ? { color: PlatformColor("link") }
                  : {}
              }
              level="body"
              dim={false}
              emphasized={isCurrentPage("Settings")}
            >
              Go to Settings
            </Text>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  linksContainer: {
    alignItems: "center",
    gap: 16,
  },
});
