import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export function Placeholder({ onPress, text = "Placeholder" }: { onPress?: () => void; text?: string }) {
  return (
    <View className="flex-row items-center p-4 bg-white border border-gray-200 rounded-xl mb-2 mx-4">
      <MaterialCommunityIcons name="hiking" size={24} color="#64748b" className="mr-4" />
      <Text className="text-base text-zinc-800 mr-4 flex-1">{text}</Text>
      <TouchableOpacity className="bg-black rounded px-4 py-1.5" onPress={onPress}>
        <Text className="text-white font-bold text-sm">Button</Text>
      </TouchableOpacity>
    </View>
  );
}
