import { api } from "@/convex/_generated/api";
import NewLocationModal from "@/lib/components/NewLocationModal";
import { Select } from "@/lib/components/Select";
import { Button } from "@/lib/ui/Button";
import { Card } from "@/lib/ui/Card";
import { Text } from "@/lib/ui/Text";
import { convexQuery } from "@convex-dev/react-query";
import { sandA } from "@radix-ui/colors";
import { useQuery } from "@tanstack/react-query";

import { AppleMaps } from "expo-maps";
import { Link, Stack } from "expo-router";
import React, { useState } from "react";
import {
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SheetManager } from "react-native-actions-sheet";

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

  const [showLocationsFilter, setShowLocationsFilter] = useState<
    "All" | "Pending" | "Rejected"
  >("All");
  const { data } = useQuery(
    convexQuery(api.locations.locations.search, {
      searchTerm,
      showPending: showLocationsFilter === "Pending",
      showRejected: showLocationsFilter === "Rejected",
    }),
  );

  const locations = data ?? [];
  //
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        padding: 12,
        paddingTop: 0,
        gap: 12,
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
            <View
              style={{
                flexDirection: "row",
                gap: 16,
              }}
            >
              <Select
                align="right"
                values={["All", "Pending", "Rejected"] as const}
                value={showLocationsFilter}
                onValueChange={(val) => setShowLocationsFilter(val)}
              />

              <Button
                title="New"
                onPress={() => SheetManager.show("location-sheet")}
                symbol="plus"
                variant="ghost"
              />
            </View>
          ),
        }}
      />

      <Button
        title="Old create modal"
        onPress={() => setShowNewLocationModal(true)}
        variant="surface"
      />
      {locations.length > 0 ? (
        locations.map((location, index) => (
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
                reviewStatus: location.reviewStatus || "Pending",
              },
            }}
            asChild
          >
            <TouchableOpacity>
              <Card
                style={{
                  flexDirection: "row",
                }}
              >
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
                    <Text level="title3">
                      {location.name || "Unknown Location"}
                    </Text>
                    <View
                      style={{
                        backgroundColor: sandA.sandA4,
                        paddingHorizontal: 4,
                        paddingVertical: 2,
                        borderRadius: 4,
                      }}
                    >
                      <Text level="caption1" dim>
                        {location.poiCategory === "RockClimbing"
                          ? "Gym"
                          : "Outside"}
                      </Text>
                    </View>
                  </View>
                  <Text dim>
                    {addressFormatter(location.formattedAddressLines).locale}
                  </Text>
                  <Text dim>
                    {addressFormatter(location.formattedAddressLines).country}
                  </Text>
                </View>
              </Card>
            </TouchableOpacity>
          </Link>
        ))
      ) : (
        <Text>No Locations</Text>
      )}

      {/* New Location Modal */}
      <NewLocationModal
        visible={showNewLocationModal}
        onClose={() => setShowNewLocationModal(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  emptyText: {
    color: "#666",
    fontSize: 16,
    marginTop: 50,
    textAlign: "center",
  },
  filterContainer: {
    borderBottomColor: sandA.sandA6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 4,
    paddingTop: 0,
    paddingVertical: 12,
  },
  headerRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  mapContainer: {
    borderRadius: 4,
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
});
