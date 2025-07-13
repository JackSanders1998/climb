import { api } from "@/convex/_generated/api";
import { useAction, useMutation } from "convex/react";
import * as Location from "expo-location";
import { AppleMaps } from "expo-maps";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface NewLocationModalProps {
  visible: boolean;
  onClose: () => void;
  onCreateLocation?: (locationData: {
    name: string;
    address: string;
    type: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  }) => void;
}

export default function NewLocationModal({
  visible,
  onClose,
  onCreateLocation,
}: NewLocationModalProps) {
  const [newLocationAddress, setNewLocationAddress] = useState("");
  const [newLocationType, setNewLocationType] = useState("Gym");
  const [selectedCoordinates, setSelectedCoordinates] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [selectedLocationData, setSelectedLocationData] = useState<any>(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: 64.48972,
    longitude: 10.81861,
    zoom: 12,
  });
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const appleMapsSearch = useAction(api.locations.appleMaps.search);
  const locationCreate = useMutation(api.locations.locations.insert);

  // Request location permissions and get user location
  useEffect(() => {
    if (!visible) return;

    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.log("Permission to access location was denied");
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        const userCoords = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        setUserLocation(userCoords);

        // Update map region to user's location on first load
        setMapRegion({
          latitude: userCoords.latitude,
          longitude: userCoords.longitude,
          zoom: 12,
        });
      } catch (error) {
        console.error("Error getting location:", error);
      }
    })();
  }, [visible]);

  // Debounce function
  const debounce = (func: Function, delay: number) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  };

  // Search function
  const searchLocations = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      setIsSearching(false);
      return;
    }

    try {
      setIsSearching(true);
      const results = await appleMapsSearch({
        params: {
          q: query,
          userLocation: userLocation
            ? `${userLocation.latitude},${userLocation.longitude}`
            : `${mapRegion.latitude || 0},${mapRegion.longitude || 0}`,
        },
      });

      setSearchResults(results || []);
      setShowDropdown((results || []).length > 0);

      // Update map to show the first search result
      if (results && results.length > 0) {
        const firstResult = results[0];
        setMapRegion({
          latitude: firstResult.coordinate.latitude,
          longitude: firstResult.coordinate.longitude,
          zoom: 15,
        });
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
      setShowDropdown(false);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search
  const debouncedSearch = debounce(searchLocations, 500);

  // Handle text input change
  const handleAddressChange = (text: string) => {
    setNewLocationAddress(text);
    if (text.trim()) {
      setIsSearching(true);
      debouncedSearch(text);
    } else {
      setSearchResults([]);
      setShowDropdown(false);
      setIsSearching(false);
      // Reset map to user location when search is cleared
      setMapRegion({
        latitude: userLocation?.latitude || 0,
        longitude: userLocation?.longitude || 0,
        zoom: 12,
      });
    }
  };

  // Handle selecting a search result
  const handleSelectSearchResult = (result: any) => {
    setNewLocationAddress(result.name);
    setSelectedCoordinates({
      latitude: result.coordinate.latitude,
      longitude: result.coordinate.longitude,
    });
    setSelectedLocationData(result); // Store complete location data
    setMapRegion({
      latitude: result.coordinate.latitude,
      longitude: result.coordinate.longitude,
      zoom: 15,
    });
    setShowDropdown(false);
    setSearchResults([]); // Clear search results to remove markers from map
  };

  const handleCreateLocation = async () => {
    if (!selectedCoordinates || !newLocationAddress.trim()) {
      Alert.alert("Error", "Please search for and select a location");
      return;
    }

    try {
      // Insert location into database using Convex mutation
      await locationCreate({
        appleMapsId: selectedLocationData?.id || "",
        name: newLocationAddress,
        description: `${newLocationType} climbing location`,
        coordinate: {
          latitude: selectedCoordinates.latitude,
          longitude: selectedCoordinates.longitude,
        },
        formattedAddressLines: selectedLocationData.formattedAddressLines,
        poiCategory: selectedLocationData.poiCategory,
        environment: newLocationType as "Gym" | "Outdoor",
        country: selectedLocationData.country,
        countryCode: selectedLocationData.countryCode,
        displayMapRegion: selectedLocationData.displayMapRegion || {
          eastLongitude: selectedCoordinates.longitude + 0.005,
          westLongitude: selectedCoordinates.longitude - 0.005,
          northLatitude: selectedCoordinates.latitude + 0.005,
          southLatitude: selectedCoordinates.latitude - 0.005,
        },
        structuredAddress: selectedLocationData.structuredAddress,
      });

      // Show success message and close modal
      Alert.alert("Success", "Location created successfully!", [
        {
          text: "OK",
          onPress: () => {
            resetForm();
            onClose();
          },
        },
      ]);
    } catch (error: unknown) {
      console.error("Error creating location:", error);
      Alert.alert(
        "Error",
        JSON.stringify((error as Error).message) ||
          "Failed to create location. Please try again."
      );
    }
  };

  const resetForm = () => {
    setNewLocationAddress("");
    setNewLocationType("Gym");
    setSelectedCoordinates(null);
    setSelectedLocationData(null);
    setMapRegion({
      latitude: userLocation?.latitude || 0,
      longitude: userLocation?.longitude || 0,
      zoom: 12,
    });
    setSearchResults([]);
    setShowDropdown(false);
    setIsSearching(false);
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
          <TouchableOpacity onPress={handleClose} style={styles.cancelButton}>
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
            <Text style={styles.fieldLabel}>Type</Text>
            <View style={styles.typeButtons}>
              <TouchableOpacity
                style={styles.typeIconButton}
                onPress={() => setNewLocationType("Gym")}
              >
                <Text style={styles.typeIcon}>🏃‍♂️</Text>
                <Text style={styles.typeIconButtonText}>Gym</Text>
                {newLocationType === "Gym" && (
                  <View style={styles.checkmarkCircle}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.typeIconButton}
                onPress={() => setNewLocationType("Outside")}
              >
                <Text style={styles.typeIcon}>🏔️</Text>
                <Text style={styles.typeIconButtonText}>Outside</Text>
                {newLocationType === "Outside" && (
                  <View style={styles.checkmarkCircle}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.fieldLabel}>Location</Text>
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.textInput}
                value={newLocationAddress}
                onChangeText={handleAddressChange}
                placeholder="Search for a location..."
                autoComplete="off"
                autoFocus
              />
              {isSearching && (
                <View style={styles.searchLoader}>
                  <ActivityIndicator size="small" color="#007AFF" />
                </View>
              )}
            </View>

            {showDropdown && searchResults.length > 0 && (
              <View style={styles.dropdown}>
                <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
                  {searchResults.map((result, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.dropdownItem}
                      onPress={() => handleSelectSearchResult(result)}
                    >
                      <Text style={styles.dropdownItemTitle}>
                        {result.name}
                      </Text>
                      {result.formattedAddressLines &&
                        result.formattedAddressLines.length > 0 && (
                          <Text style={styles.dropdownItemSubtitle}>
                            {result.formattedAddressLines.join(", ")}
                          </Text>
                        )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          <View style={styles.formSection}>
            <Text style={styles.fieldLabel}>Location Preview</Text>
            <View style={styles.mapContainer}>
              <AppleMaps.View
                style={styles.mapView}
                cameraPosition={{
                  coordinates: {
                    latitude: mapRegion.latitude,
                    longitude: mapRegion.longitude,
                  },
                  zoom: mapRegion.zoom,
                }}
                markers={[
                  // Show user location marker if available
                  ...(userLocation
                    ? [
                        {
                          coordinates: userLocation,
                          systemImage: "location.fill",
                          title: "Your Location",
                          tintColor: "blue",
                        },
                      ]
                    : []),
                  // Show selected coordinates marker
                  ...(selectedCoordinates
                    ? [
                        {
                          coordinates: selectedCoordinates,
                          systemImage: "figure.climbing",
                          title: "Selected Location",
                          tintColor: "purple",
                        },
                      ]
                    : []),
                  // Show search result markers
                  ...searchResults.map((result, index) => ({
                    coordinates: {
                      latitude: result.coordinate.latitude,
                      longitude: result.coordinate.longitude,
                    },
                    systemImage: "mappin",
                    title: result.name,
                    subtitle: result.formattedAddressLines?.join(", "),
                    tintColor: selectedCoordinates ? "red" : "orange",
                  })),
                ]}
                uiSettings={{
                  myLocationButtonEnabled: true,
                }}
              />
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
  helpText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    fontStyle: "italic",
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
  typeIconButton: {
    flex: 1,
    padding: 16,
    alignItems: "center",
    minHeight: 80,
  },
  typeIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  typeIconButtonText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
    marginBottom: 4,
  },
  checkmarkCircle: {
    backgroundColor: "#000",
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  checkmarkText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
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
  mapContainer: {
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    position: "relative",
  },
  mapView: {
    flex: 1,
    height: 200,
  },

  searchContainer: {
    position: "relative",
  },
  searchLoader: {
    position: "absolute",
    right: 12,
    top: 12,
  },
  dropdown: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginTop: 4,
    maxHeight: 200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dropdownScroll: {
    maxHeight: 200,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  dropdownItemTitle: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  dropdownItemSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
});
