import NewLocationModal from "@/lib/components/NewLocationModal";
import { Button } from "@/lib/ui/Button";
import { Card } from "@/lib/ui/Card";
import { AppleMaps } from "expo-maps";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function LocationDetail() {
  const params = useLocalSearchParams();
  const [showNewLocationModal, setShowNewLocationModal] = useState(false);

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
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    paddingTop: 50,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    marginRight: 15,
  },
  backButtonText: {
    fontSize: 16,
    color: "#007AFF",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  mapContainer: {
    height: 300,
    margin: 15,
    borderRadius: 12,
    overflow: "hidden",
  },
  fullMap: {
    flex: 1,
  },
  infoContainer: {
    backgroundColor: "white",
    margin: 15,
    borderRadius: 12,
    padding: 20,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  locationName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    flex: 1,
    marginRight: 10,
  },
  environmentBadge: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  detailSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  addressLine: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  coordinateText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
    fontFamily: "monospace",
  },
  categoryText: {
    fontSize: 14,
    color: "#007AFF",
  },
  countryText: {
    fontSize: 14,
    color: "#666",
  },
  reviewStatusHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
  },
  statusApproved: {
    backgroundColor: "#E8F5E8",
    borderColor: "#4CAF50",
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
  reviewDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
});
