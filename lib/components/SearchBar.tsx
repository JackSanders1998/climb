import { api } from "@/convex/_generated/api";
import { useAction } from "convex/react";
import React, { useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

// Define the interface for search results based on the provided structure
interface LocationResult {
  id: string;
  name: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  formattedAddressLines: string[];
  poiCategory?: string;
  country?: string;
}

const debounce = (func: { (term: string): Promise<void>; apply?: any; }, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: any[]) => {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

interface SearchBarProps {
  onSelectLocation?: (location: LocationResult) => void;
}

const SearchBar = ({ onSelectLocation }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<LocationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const autocomplete = useAction(api.maps.search);

  const fetchSearchResults = async (term: string) => {
    if (!term.trim()) {
      setSearchResults([]);
      setLoading(false);
      setShowDropdown(false);
      return;
    }
    
    try {
      // Perform an API request based on the search term
      const results = await autocomplete({
        params: {
          q: term,
          userLocation: "37.7749,-122.4194", // Example user location
        },
      });

      setSearchResults(results || []);
      setShowDropdown(results && results.length > 0);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle the error, e.g., show an error message to the user
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = debounce(fetchSearchResults, 500);

  const handleSearch = (text: string) => {
    setSearchTerm(text);
    setLoading(true);
    debouncedSearch(text);
  };

  const handleSelectLocation = (location: LocationResult) => {
    // Call the onSelectLocation callback if provided
    if (onSelectLocation) {
      onSelectLocation(location);
    }
    // Close the dropdown
    setShowDropdown(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <TextInput 
          style={styles.searchInput}
          placeholder="Search for locations..."
          onChangeText={handleSearch}
          returnKeyType="search"
        />
        {loading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="small" color="#007AFF" />
          </View>
        )}
      </View>
      
      {/* Dropdown Results */}
      {showDropdown && searchResults.length > 0 && (
        <ScrollView 
          style={styles.dropdownContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {searchResults.map((location) => (
            <TouchableOpacity
              key={location.id}
              style={styles.resultItem}
              onPress={() => handleSelectLocation(location)}
            >
              <Text style={styles.locationName}>{location.name}</Text>
              <Text style={styles.locationAddress}>
                {location.formattedAddressLines[0]}
              </Text>
              <Text style={styles.locationCity}>
                {location.formattedAddressLines.length > 1 && location.formattedAddressLines[1]}
              </Text>
              {location.poiCategory && (
                <Text style={styles.categoryTag}>{location.poiCategory}</Text>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    zIndex: 100,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 50,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },
  loaderContainer: {
    marginLeft: 8,
  },
  dropdownContainer: {
    maxHeight: 300,
    backgroundColor: 'white',
    borderRadius: 8,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  resultItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  locationName: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 2,
  },
  locationAddress: {
    fontSize: 14,
    color: '#333',
  },
  locationCity: {
    fontSize: 14,
    color: '#666',
  },
  categoryTag: {
    fontSize: 12,
    color: '#007AFF',
    marginTop: 4,
  }
});

export default SearchBar;
