import React, { useState } from "react";
import { Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

interface NewLocationModalProps {
  visible: boolean;
  onClose: () => void;
  onCreateLocation?: (locationData: {
    name: string;
    address: string;
    type: string;
  }) => void;
}

export default function NewLocationModal({ visible, onClose, onCreateLocation }: NewLocationModalProps) {
  const [newLocationName, setNewLocationName] = useState("");
  const [newLocationAddress, setNewLocationAddress] = useState("");
  const [newLocationType, setNewLocationType] = useState("Gym");

  const handleCreateLocation = () => {
    if (!newLocationName.trim() || !newLocationAddress.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    
    // Call the callback function if provided
    if (onCreateLocation) {
      onCreateLocation({
        name: newLocationName,
        address: newLocationAddress,
        type: newLocationType,
      });
    }
    
    // Show success message and close modal
    Alert.alert("Success", "Location created successfully!", [
      {
        text: "OK",
        onPress: () => {
          resetForm();
          onClose();
        }
      }
    ]);
  };

  const resetForm = () => {
    setNewLocationName("");
    setNewLocationAddress("");
    setNewLocationType("Gym");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity 
            onPress={handleClose}
            style={styles.cancelButton}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>New Location</Text>
          <TouchableOpacity 
            onPress={handleCreateLocation}
            style={styles.createButton}
          >
            <Text style={styles.createButtonText}>Create</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          <View style={styles.formSection}>
            <Text style={styles.fieldLabel}>Location Name</Text>
            <TextInput
              style={styles.textInput}
              value={newLocationName}
              onChangeText={setNewLocationName}
              placeholder="Enter location name"
              autoFocus
            />
          </View>

          <View style={styles.formSection}>
            <Text style={styles.fieldLabel}>Address</Text>
            <TextInput
              style={styles.textInput}
              value={newLocationAddress}
              onChangeText={setNewLocationAddress}
              placeholder="Enter address"
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.formSection}>
            <Text style={styles.fieldLabel}>Type</Text>
            <View style={styles.typeButtons}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  newLocationType === "Gym" && styles.typeButtonActive
                ]}
                onPress={() => setNewLocationType("Gym")}
              >
                <Text style={[
                  styles.typeButtonText,
                  newLocationType === "Gym" && styles.typeButtonTextActive
                ]}>
                  Gym
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  newLocationType === "Outside" && styles.typeButtonActive
                ]}
                onPress={() => setNewLocationType("Outside")}
              >
                <Text style={[
                  styles.typeButtonText,
                  newLocationType === "Outside" && styles.typeButtonTextActive
                ]}>
                  Outside
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  cancelButton: {
    padding: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#666",
  },
  createButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  createButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  formSection: {
    marginBottom: 24,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 48,
  },
  typeButtons: {
    flexDirection: "row",
    gap: 12,
  },
  typeButton: {
    flex: 1,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  typeButtonActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  typeButtonText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  typeButtonTextActive: {
    color: "white",
  },
});
