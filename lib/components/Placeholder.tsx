import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export function Placeholder({ onPress, text = "Placeholder" }: { onPress?: () => void; text?: string }) {
  return (
    <View className="flex-row items-center p-4">
      <Text className="text-base text-zinc-800 mr-4">{text}</Text>
      <TouchableOpacity className="bg-black rounded px-4 py-1.5" onPress={onPress}>
        <Text className="text-white font-bold text-sm">Button</Text>
      </TouchableOpacity>
    </View>
  );
}
