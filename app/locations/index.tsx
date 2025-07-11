import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { AppleMaps } from "expo-maps";
import { Link } from "expo-router";
import React, { Fragment, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const addressFormatter = (addressLines: string[]) => {
  const line = addressLines[1].trim() || "";
  const city = line.split(",")[0] || "";
  const state = line.split(",")[1].trim().split(" ")[0] || "";
  return {locale: `${city}, ${state}`, country: addressLines[2] || ""};
}

export default function Locations() {
  // Using movement as a plceholder for testing
  const [searchTerm, setSearchTerm] = useState("movement");
  const data = useQuery(api.locations.locations.search, { searchTerm });

  return (
    <Fragment>
      <TextInput
        placeholder="Search..."
        value={searchTerm}
        onChangeText={setSearchTerm}
      />
      <ScrollView>
        <Fragment>
          {data && data.length > 0 ? (
            data.map((location, index) => (
              <Link
                key={index}
                href={{
                  pathname: '/locations/[name]',
                  params: {
                    id: location._id,
                    name: location.name,
                    latitude: location.coordinate.latitude.toString(),
                    longitude: location.coordinate.longitude.toString(),
                    address: JSON.stringify(location.formattedAddressLines),
                    category: location.poiCategory || '',
                    country: location.country || '',
                  }
                }}
                asChild
              >
                <TouchableOpacity style={styles.locationCard} activeOpacity={0.7}>
                  {/* Small Map View */}
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
                          {location.poiCategory === "RockClimbing" ? "Gym" : "Outside"}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.locationAddress}>{addressFormatter(location.formattedAddressLines).locale}</Text>
                    <Text style={styles.locationAddress}>{addressFormatter(location.formattedAddressLines).country}</Text>
                  </View>
                </TouchableOpacity>
              </Link>
            ))
          ) : (
            <Text style={styles.emptyText}>Add some locations!</Text>
          )}
        </Fragment>
      </ScrollView>
    </Fragment>
  );
}

const styles = StyleSheet.create({
  locationCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mapContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 8,
  },
  miniMap: {
    flex: 1,
  },
  metadataContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  locationName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  environmentBadge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  locationAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 18,
  },
  coordinatesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  coordinateLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#888',
    marginRight: 4,
  },
  coordinateValue: {
    fontSize: 12,
    color: '#333',
    marginRight: 12,
  },
  categoryText: {
    fontSize: 13,
    color: '#007AFF',
    marginBottom: 4,
  },
  countryText: {
    fontSize: 12,
    color: '#999',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 50,
  },
});
