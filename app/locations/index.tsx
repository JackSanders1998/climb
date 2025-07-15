import { api } from "@/convex/_generated/api";
import NewLocationModal from "@/lib/components/NewLocationModal";
import { useQuery } from "convex/react";
import { AppleMaps } from "expo-maps";
import { Link, Stack } from "expo-router";
import React, { Fragment, useState } from "react";
import {
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const addressFormatter = (addressLines: string[]) => {
  try {
    const line = addressLines[1].trim() || "";
    const city = line.split(",")[0] || "";
    const state = line.split(",")[1].trim().split(" ")[0] || "";
    return { locale: `${city}, ${state}`, country: addressLines[2] || "" };
  } catch {
    return { locale: addressLines[1] || "", country: addressLines[2] || "" };
  }
};

export default function Locations() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewLocationModal, setShowNewLocationModal] = useState(false);
  const [showPending, setShowPending] = useState(false);
  const [showRejected, setShowRejected] = useState(false);
  const data = useQuery(api.locations.locations.search, {
    searchTerm,
    showPending,
    showRejected,
  });

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{
        flex: 1,
      }}
    >
      <Stack.Screen
        options={{
          title: "Locations",
          headerSearchBarOptions: {
            placeholder: "Search locations...",
            onChangeText: (event: NativeSyntheticEvent<{ text: string }>) =>
              setSearchTerm(event.nativeEvent.text),
          },
          headerRight: () => (
            <TouchableOpacity
              onPress={() => setShowNewLocationModal(true)}
              style={styles.newButton}
            >
              <Text style={styles.newButtonText}>New +</Text>
            </TouchableOpacity>
          ),
        }}
      />

      {/* Filter Toggles */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterToggle,
            showPending && styles.filterToggleActive,
          ]}
          onPress={() => setShowPending(!showPending)}
        >
          <Text
            style={[
              styles.filterToggleText,
              showPending && styles.filterToggleTextActive,
            ]}
          >
            Show Pending
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterToggle,
            showRejected && styles.filterToggleActive,
          ]}
          onPress={() => setShowRejected(!showRejected)}
        >
          <Text
            style={[
              styles.filterToggleText,
              showRejected && styles.filterToggleTextActive,
            ]}
          >
            Show Rejected
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        <Fragment>
          {data && data.length > 0 ? (
            data.map((location, index) => (
              <Link
                key={index}
                href={{
                  pathname: "/locations/[name]",
                  params: {
                    id: location._id,
                    name: location.name,
                    latitude: location.latitude.toString(),
                    longitude: location.longitude.toString(),
                    address: JSON.stringify(location.formattedAddressLines),
                    category: location.poiCategory || "",
                    country: location.country || "",
                    reviewStatus: location.reviewStatus || "pending",
                  },
                }}
                asChild
              >
                <TouchableOpacity
                  style={styles.locationCard}
                  activeOpacity={0.7}
                >
                  {/* Small Map View */}
                  <View style={styles.mapContainer} pointerEvents="none">
                    <AppleMaps.View
                      style={styles.miniMap}
                      cameraPosition={{
                        coordinates: {
                          latitude: location.latitude,
                          longitude: location.longitude,
                        },
                        zoom: 15,
                      }}
                      uiSettings={{
                        myLocationButtonEnabled: false,
                        togglePitchEnabled: false,
                      }}
                    />
                  </View>

                  {/* Metadata */}
                  <View style={styles.metadataContainer}>
                    <View style={styles.headerRow}>
                      <Text style={styles.locationName}>
                        {location.name || "Unknown Location"}
                      </Text>
                      <View style={styles.environmentBadge}>
                        <Text style={styles.badgeText}>
                          {location.poiCategory === "RockClimbing"
                            ? "Gym"
                            : "Outside"}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.locationAddress}>
                      {addressFormatter(location.formattedAddressLines).locale}
                    </Text>
                    <Text style={styles.locationAddress}>
                      {addressFormatter(location.formattedAddressLines).country}
                    </Text>
                  </View>
                </TouchableOpacity>
              </Link>
            ))
          ) : (
            <Text style={styles.emptyText}>
              This would default to locations near you or your recent ones or
              popular ones or something. For now, search for chicago or sf or
              portland or movement. This is totally powered by convex db, not
              apple maps.
            </Text>
          )}
        </Fragment>
      </ScrollView>

      {/* New Location Modal */}
      <NewLocationModal
        visible={showNewLocationModal}
        onClose={() => setShowNewLocationModal(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  emptyText: {
    color: "#666",
    fontSize: 16,
    marginTop: 50,
    textAlign: "center",
  },
  environmentBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#007AFF",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  filterContainer: {
    backgroundColor: "#f8f9fa",
    borderBottomColor: "#e1e8ed",
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterToggle: {
    backgroundColor: "white",
    borderColor: "#ddd",
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterToggleActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  filterToggleText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "500",
  },
  filterToggleTextActive: {
    color: "white",
  },
  headerRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  locationAddress: {
    color: "#666",
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 8,
  },
  locationCard: {
    backgroundColor: "white",
    borderRadius: 12,
    elevation: 3,
    flexDirection: "row",
    margin: 10,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  locationName: {
    color: "#333",
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    marginRight: 8,
  },
  mapContainer: {
    borderRadius: 8,
    height: 80,
    marginRight: 8,
    overflow: "hidden",
    width: 80,
  },
  metadataContainer: {
    flex: 1,
    justifyContent: "flex-start",
  },
  miniMap: {
    flex: 1,
  },
  newButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  newButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
});
