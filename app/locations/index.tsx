import { api } from "@/convex/_generated/api";
import NewLocationModal from "@/lib/components/NewLocationModal";
import { Button } from "@/lib/ui/Button";
import { Card } from "@/lib/ui/Card";
import { Text } from "@/lib/ui/Text";
import { sandA } from "@radix-ui/colors";
import { useQuery } from "convex/react";
import { AppleMaps } from "expo-maps";
import { Link, Stack } from "expo-router";
import React, { Fragment, useState } from "react";
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
  const data = useQuery(api.locations.locations.search, { searchTerm });

  const all = useQuery(api.locations.locations.list, { limit: undefined });

  const locations =
    data && data.length > 0 ? data : all && all.length > 0 ? all : [];

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
            <View
              style={{
                flexDirection: "row",
                gap: 16,
              }}
            >
              <Button
                title="Old"
                onPress={() => setShowNewLocationModal(true)}
                variant="ghost"
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
      <ScrollView
        contentContainerStyle={{
          padding: 12,
          gap: 12,
        }}
      >
        <Fragment>
          {locations.length > 0 ? (
            locations.map((location, index) => (
              <Link
                key={index}
                href={{
                  pathname: "/locations/[name]",
                  params: {
                    id: location._id,
                    name: location.name,
                    latitude: location.coordinate.latitude.toString(),
                    longitude: location.coordinate.longitude.toString(),
                    address: JSON.stringify(location.formattedAddressLines),
                    category: location.poiCategory || "",
                    country: location.country || "",
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
                            latitude: location.coordinate.latitude,
                            longitude: location.coordinate.longitude,
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
                        {
                          addressFormatter(location.formattedAddressLines)
                            .locale
                        }
                      </Text>
                      <Text dim>
                        {
                          addressFormatter(location.formattedAddressLines)
                            .country
                        }
                      </Text>
                    </View>
                  </Card>
                </TouchableOpacity>
              </Link>
            ))
          ) : (
            <Text>No Locations</Text>
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
  locationCard: {
    flexDirection: "row",
    backgroundColor: "white",
    margin: 10,
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mapContainer: {
    width: 80,
    height: 80,
    borderRadius: 4,
    overflow: "hidden",
    marginRight: 8,
  },
  miniMap: {
    flex: 1,
  },
  metadataContainer: {
    flex: 1,
    justifyContent: "flex-start",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  locationName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    flex: 1,
    marginRight: 8,
  },
  environmentBadge: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  locationAddress: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    lineHeight: 18,
  },
  coordinatesRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  coordinateLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#888",
    marginRight: 4,
  },
  coordinateValue: {
    fontSize: 12,
    color: "#333",
    marginRight: 12,
  },
  categoryText: {
    fontSize: 13,
    color: "#007AFF",
    marginBottom: 4,
  },
  countryText: {
    fontSize: 12,
    color: "#999",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginTop: 50,
  },
  // Header button styles
  newButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  newButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
});
