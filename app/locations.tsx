import { api } from "@/convex/_generated/api";
import AppleMapsView from "@/lib/components/AppleMapsView";
import { useAction } from "convex/react";
import React, { Fragment, useEffect, useState } from "react";
import { Text } from "react-native";

export default function Locations() {
  const [mapResults, setMapResults] = useState<any>();
  const searchMap = useAction(api.maps.search);

  useEffect(() => {
    // Define and call handleSearch only once when component mounts
    const handleSearch = async () => {
      try {
        const results = await searchMap({
          params: {
            q: "climbing",
          },
        });
        setMapResults(results);
      } catch (error) {
        console.error("Error fetching map results:", error);
      }
    };
    
    handleSearch();
    // Including searchMap in the dependency array to satisfy ESLint
    // Since searchMap is a Convex action reference, it should be stable across renders
  }, [searchMap]);

  return (
    <Fragment>
      <Text>Search Results: {JSON.stringify(mapResults)}</Text>
      <AppleMapsView />
    </Fragment>
  );
}
