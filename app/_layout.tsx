import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import React from "react";
import { Button, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

const Placeholder = () => (
  <View style={{ padding: 24, alignItems: "center" }}>
    <Button title="Placeholder Button" onPress={() => {}} />
    <Text style={{ marginTop: 16, textAlign: "center" }}>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod, urna eu tincidunt consectetur, nisi nisl aliquam nunc, eget aliquam massa nisl quis neque. Proin ac neque nec nisi dictum tincidunt. Sed euismod, nisl vel tincidunt lacinia, nunc nisl aliquam nunc, eget aliquam massa nisl quis neque.
    </Text>
  </View>
);

export default function RootLayout() {
  const [modalVisible, setModalVisible] = React.useState(false);
  return (
    <ClerkProvider
      tokenCache={tokenCache}
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <Placeholder />
          <Placeholder />
          <Placeholder />
          <Placeholder />
          <Placeholder />
        </ScrollView>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Modal
            visible={modalVisible}
            transparent
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
                <View style={styles.modalBottomContent}>
                  <Text style={{ fontSize: 18, marginBottom: 16 }}>This is a modal!</Text>
                  <Button title="Close" onPress={() => setModalVisible(false)} />
                </View>
            </View>
          </Modal>
          <View style={styles.bottomButtonContainer}>
            <TouchableOpacity style={styles.smallBlackButton} onPress={() => setModalVisible(true)}>
              <Text style={styles.smallBlackButtonText}>Open Modal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}

const styles = StyleSheet.create({
  bottomButtonContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 32,
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalBottomContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 24,
    alignItems: "center",
    minWidth: 240,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  smallBlackButton: {
    backgroundColor: "#000",
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 0,
    minHeight: 0,
  },
  smallBlackButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
    letterSpacing: 0.2,
  },
});
