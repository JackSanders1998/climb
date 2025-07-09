import { Link } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";

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
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>
          {pageName} Page
        </Text>
        <View style={styles.linksContainer}>
          <Link href="/">
            <Text
              style={isCurrentPage("Summary") ? styles.activeLink : styles.link}
            >
              Go to Summary
            </Text>
          </Link>
          <Link href="/insights">
            <Text
              style={
                isCurrentPage("Insights") ? styles.activeLink : styles.link
              }
            >
              Go to Insights
            </Text>
          </Link>
          <Link href="/locations">
            <Text
              style={
                isCurrentPage("Locations") ? styles.activeLink : styles.link
              }
            >
              Go to Locations
            </Text>
          </Link>
          <Link href="/settings">
            <Text
              style={
                isCurrentPage("Settings") ? styles.activeLink : styles.link
              }
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
    marginTop: 20,
    alignItems: "center",
  },
  link: {
    fontSize: 16,
    marginVertical: 8,
  },
  activeLink: {
    fontSize: 16,
    marginVertical: 8,
    color: "blue",
    fontWeight: "bold",
  },
});
