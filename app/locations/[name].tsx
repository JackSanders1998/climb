import NewLocationModal from "@/lib/components/NewLocationModal";
import { Button } from "@/lib/ui/Button";
import { Card } from "@/lib/ui/Card";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { AppleMaps } from "expo-maps";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";

export default function LocationDetail() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [showNewLocationModal, setShowNewLocationModal] = useState(false);

  // Convex mutations
  const approveLocation = useMutation(api.locations.review.approve);
  const rejectLocation = useMutation(api.locations.review.reject);

  // Parse the parameters
  const location = {
    id: params.id as string,
    name: params.name as string,
    latitude: parseFloat(params.latitude as string),
    longitude: parseFloat(params.longitude as string),
    address: params.address ? JSON.parse(params.address as string) : [],
    category: params.category as string,
    country: params.country as string,
    reviewStatus: params.reviewStatus as string,
  };

  // Handle approval
  const handleApprove = async () => {
    try {
      await approveLocation({ id: location.id as any });
      Alert.alert("Success", "Location approved successfully", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch {
      Alert.alert("Error", "Failed to approve location");
    }
  };

  // Handle rejection
  const handleReject = async () => {
    Alert.alert(
      "Reject Location",
      "Are you sure you want to reject this location?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reject",
          style: "destructive",
          onPress: async () => {
            try {
              await rejectLocation({ id: location.id as any });
              Alert.alert("Success", "Location rejected successfully", [
                { text: "OK", onPress: () => router.back() },
              ]);
            } catch {
              Alert.alert("Error", "Failed to reject location");
            }
          },
        },
      ],
    );
  };

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{
        flex: 1,
      }}
    >
      <Stack.Screen
        options={{
          title: location.name || "Location Detail",
          headerRight: () => (
            <Button
              title="New +"
              variant="ghost"
              onPress={() => setShowNewLocationModal(true)}
            />
          ),
        }}
      />
      <View style={styles.content}>
        {/* Large Map View */}
        <View style={styles.mapContainer}>
          <AppleMaps.View
            style={styles.fullMap}
            cameraPosition={{
              coordinates: {
                latitude: location.latitude,
                longitude: location.longitude,
              },
              zoom: 16,
            }}
            markers={[
              {
                coordinates: {
                  latitude: location.latitude,
                  longitude: location.longitude,
                },
                systemImage: "figure.climbing",
                title: location.name,
                tintColor: "purple",
              },
            ]}
            uiSettings={{
              myLocationButtonEnabled: true,
              togglePitchEnabled: false,
            }}
          />
        </View>

        {/* Location Information */}
        <View style={styles.infoContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.locationName}>{location.name}</Text>
            <View style={styles.environmentBadge}>
              <Text style={styles.badgeText}>
                {location.category === "RockClimbing" ? "Gym" : "Outside"}
              </Text>
            </View>
          </View>

          <View style={styles.detailSection}>
            <Text style={styles.sectionTitle}>Address</Text>
            {location.address.map((line: string, index: number) => (
              <Text key={index} style={styles.addressLine}>
                {line}
              </Text>
            ))}
          </View>

          <View style={styles.detailSection}>
            <Text style={styles.sectionTitle}>Coordinates</Text>
            <Text style={styles.coordinateText}>
              Latitude: {location.latitude.toFixed(6)}
            </Text>
            <Text style={styles.coordinateText}>
              Longitude: {location.longitude.toFixed(6)}
            </Text>
          </View>

          {location.category && (
            <View style={styles.detailSection}>
              <Text style={styles.sectionTitle}>Category</Text>
              <Text style={styles.categoryText}>{location.category}</Text>
            </View>
          )}

          {location.country && (
            <View style={styles.detailSection}>
              <Text style={styles.sectionTitle}>Country</Text>
              <Text style={styles.countryText}>{location.country}</Text>
            </View>
          )}
        </View>

        {/* Review Status Card */}
        <Card>
          <View style={styles.reviewStatusHeader}>
            <Text style={styles.sectionTitle}>Review Status</Text>
            <View
              style={[
                styles.statusBadge,
                location.reviewStatus === "approved" && styles.statusApproved,
                location.reviewStatus === "pending" && styles.statusPending,
                location.reviewStatus === "rejected" && styles.statusRejected,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  location.reviewStatus === "approved" &&
                    styles.statusTextApproved,
                  location.reviewStatus === "pending" &&
                    styles.statusTextPending,
                  location.reviewStatus === "rejected" &&
                    styles.statusTextRejected,
                ]}
              >
                {location.reviewStatus.charAt(0).toUpperCase() +
                  location.reviewStatus.slice(1)}
              </Text>
            </View>
          </View>
          <Text style={styles.reviewDescription}>
            {location.reviewStatus === "approved" &&
              "This location has been reviewed and approved for public viewing."}
            {location.reviewStatus === "pending" &&
              "This location is awaiting review by a moderator."}
            {location.reviewStatus === "rejected" &&
              "This location has been reviewed and rejected."}
          </Text>

          {/* Review Action Buttons */}
          {location.reviewStatus === "pending" && (
            <View style={styles.reviewActions}>
              <Button
                title="Approve"
                variant="primary"
                onPress={handleApprove}
                style={styles.actionButton}
              />
              <Button
                title="Reject"
                variant="ghost"
                onPress={handleReject}
                style={[styles.actionButton, { backgroundColor: "#FF4444" }]}
              />
            </View>
          )}

          {location.reviewStatus === "rejected" && (
            <View style={styles.reviewActions}>
              <Button
                title="Approve"
                variant="primary"
                onPress={handleApprove}
                style={styles.actionButtonSingle}
              />
            </View>
          )}
        </Card>
      </View>

      {/* New Location Modal */}
      <NewLocationModal
        visible={showNewLocationModal}
        onClose={() => setShowNewLocationModal(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    flex: 1,
  },
  actionButtonSingle: {
    width: "100%",
  },
  addressLine: {
    color: "#666",
    fontSize: 14,
    marginBottom: 4,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  categoryText: {
    color: "#007AFF",
    fontSize: 14,
  },
  content: {
    flex: 1,
  },
  coordinateText: {
    color: "#666",
    fontFamily: "monospace",
    fontSize: 14,
    marginBottom: 4,
  },
  countryText: {
    color: "#666",
    fontSize: 14,
  },
  detailSection: {
    marginBottom: 20,
  },
  environmentBadge: {
    backgroundColor: "#007AFF",
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  fullMap: {
    flex: 1,
  },
  infoContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    margin: 15,
    padding: 20,
  },
  locationName: {
    color: "#333",
    flex: 1,
    fontSize: 24,
    fontWeight: "700",
    marginRight: 10,
  },
  mapContainer: {
    borderRadius: 12,
    height: 300,
    margin: 15,
    overflow: "hidden",
  },
  reviewActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  reviewDescription: {
    color: "#666",
    fontSize: 14,
    lineHeight: 20,
  },
  reviewStatusHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  statusApproved: {
    backgroundColor: "#E8F5E8",
    borderColor: "#4CAF50",
  },
  statusBadge: {
    borderRadius: 15,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statusPending: {
    backgroundColor: "#FFF3E0",
    borderColor: "#FF9800",
  },
  statusRejected: {
    backgroundColor: "#FFEBEE",
    borderColor: "#F44336",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  statusTextApproved: {
    color: "#2E7D2E",
  },
  statusTextPending: {
    color: "#E65100",
  },
  statusTextRejected: {
    color: "#C62828",
  },
  titleRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
});
