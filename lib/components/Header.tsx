import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Link, useSegments } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export const Header: React.FC = () => {
  // Get the first segment of the URL to use as the title
  const title = useSegments()[0] || "Climbs";

  return (
    <View className="flex-row items-center justify-between px-4 pt-16 pb-3">
      <View>
        <Text className="text-xl font-bold text-[#212529]">{title}</Text>
      </View>
      <Link href="/preferences" asChild>
        <TouchableOpacity>
          <MaterialCommunityIcons name="cog" size={24} color="#212529" />
        </TouchableOpacity>
      </Link>
    </View>
  );
};
