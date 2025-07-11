import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { AppleMaps } from "expo-maps";
import React, { Fragment, useState } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";

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
              <View
                key={index}
                style={{ height: 200, margin: 10 }}
                pointerEvents="none"
              >
                <AppleMaps.View
                  style={{ flex: 1 }}
                  cameraPosition={{
                    coordinates: {
                      latitude: location.coordinate.latitude,
                      longitude: location.coordinate.longitude,
                    },
                    zoom: 15,
                  }}
                  markers={[
                    {
                      coordinates: {
                        latitude: location.coordinate.latitude,
                        longitude: location.coordinate.longitude,
                      },
                      systemImage: "figure.climbing",
                      title:
                        location.name ||
                        location.formattedAddressLines.join(", "),
                      tintColor: "purple",
                    },
                  ]}
                />
              </View>
            ))
          ) : (
            <Text>Add some locations!</Text>
          )}
        </Fragment>
      </ScrollView>
    </Fragment>
  );
}
