import * as Location from "expo-location";
import { AppleMaps } from "expo-maps";
import { useRef, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

interface SearchResult {
  latitude: number;
  longitude: number;
  address: string;
  name?: string;   // Name of the place, if available
  placeType?: string; // Type of place (restaurant, park, etc.)
}

export default function AppleMapsView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<SearchResult | null>(null);
  
  const mapRef = useRef<AppleMaps.MapView>(null);


  // Handle search for addresses and place names
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    
    try {
      // Using geocodeAsync works for both addresses and place names
      const result = await Location.geocodeAsync(searchQuery);
      
      if (result.length > 0) {
        // Process results
        const locations = await Promise.all(result.map(async (loc) => {
          const { latitude, longitude } = loc;
          
          // Get address details for the coordinates
          const addressResponse = await Location.reverseGeocodeAsync(
            { latitude, longitude }
          );
          
          const addressDetails = addressResponse[0] || {};
          
          // Try to determine if this is a named place vs. just an address
          const placeName = addressDetails.name;
          const isLikelyPlace = 
            placeName && 
            placeName !== addressDetails.street &&
            !placeName.match(/^\d+/) && // Not starting with a number (likely not a street address)
            placeName.length > 3; // Avoid abbreviations
          
          // Create a formatted address, prioritizing the place name if it exists
          let formattedComponents = [];
          
          if (isLikelyPlace) {
            formattedComponents.push(placeName);
          }
          
          // Add address components
          [
            isLikelyPlace ? null : addressDetails.name, // Skip name if already used as place
            addressDetails.street,
            addressDetails.district,
            addressDetails.city,
            addressDetails.region,
            addressDetails.postalCode,
            addressDetails.country
          ]
            .filter(Boolean)
            .forEach(component => {
              if (component && !formattedComponents.includes(component)) {
                formattedComponents.push(component);
              }
            });
          
          const formattedAddress = formattedComponents.join(", ");
          
          // Return search result
          return {
            latitude,
            longitude,
            name: isLikelyPlace ? placeName : undefined,
            placeType: isLikelyPlace ? "Place" : "Address",
            address: formattedAddress || "Unknown location"
          };
        }));
        
        setSearchResults(locations);
        
        if (locations.length > 0) {
          setSelectedLocation(locations[0]);
          // Move map to the first result
          mapRef.current?.setCameraPosition({
            coordinates: {
            latitude: locations[0].latitude,
            longitude: locations[0].longitude,
            },
            zoom: 15, // Closer zoom to see details
          });
        }
      } else {
        Alert.alert("No Results", "No locations found for this search");
        setSearchResults([]);
        setSelectedLocation(null);
      }
    } catch (error) {
      console.error("Error searching for location:", error);
      Alert.alert("Error", "Could not search for this location");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Create annotations for found locations
  const annotations = selectedLocation ? 
    [
      {
        coordinate: {
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
        },
        title: selectedLocation.name || selectedLocation.address,
        subtitle: selectedLocation.name ? selectedLocation.address : "",
      }
    ] : [];
  
  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for places, restaurants, addresses..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity 
          style={styles.searchButton} 
          onPress={handleSearch}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.searchButtonText}>Search</Text>
          )}
        </TouchableOpacity>
      </View>
      
      {/* Map */}
      <AppleMaps.View 
        ref={mapRef}
        style={styles.map}
        annotations={annotations}
      />
      
      {/* Search Results */}
      {searchResults.length > 0 && (
        <View style={styles.resultsContainer}>
          {searchResults.map((result, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.resultItem, 
                selectedLocation?.address === result.address && styles.selectedResult
              ]}
              onPress={() => {
                setSelectedLocation(result);
                mapRef.current?.setCameraPosition({
                  coordinates: {
                    latitude: result.latitude,
                    longitude: result.longitude,
                  },
                  zoom: 15,
                });
              }}
            >
              {result.name ? (
                <>
                  <Text numberOfLines={1} style={styles.resultPlaceName}>
                    {result.name}
                  </Text>
                  <Text numberOfLines={1} style={styles.resultAddress}>
                    {result.address}
                  </Text>
                </>
              ) : (
                <Text numberOfLines={2} style={styles.resultText}>
                  {result.address}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  searchContainer: {
    position: "absolute",
    top: 50,
    left: 10,
    right: 10,
    flexDirection: "row",
    zIndex: 1,
  },
  searchInput: {
    flex: 1,
    height: 50,
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  searchButton: {
    width: 80,
    height: 50,
    backgroundColor: "#007AFF",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  searchButtonText: {
    color: "white",
    fontWeight: "600",
  },
  resultsContainer: {
    position: "absolute",
    top: 110,
    left: 10,
    right: 10,
    backgroundColor: "white",
    borderRadius: 10,
    maxHeight: 200,
    zIndex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  resultItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  selectedResult: {
    backgroundColor: "#f0f0f0",
  },
  resultText: {
    fontSize: 16,
  },
  resultPlaceName: {
    fontSize: 16,
    fontWeight: "600",
  },
  resultAddress: {
    fontSize: 14,
    color: "#666",
  }
});
