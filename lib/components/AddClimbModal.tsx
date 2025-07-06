import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

interface AddClimbModalProps {
  visible: boolean;
  onClose: () => void;
}

export const AddClimbModal: React.FC<AddClimbModalProps> = ({ visible, onClose }) => {
  return (
    <Modal
      visible={visible}
      transparent
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/40">
        <View className="bg-white rounded-2xl p-6 min-w-[80%] shadow-lg items-center relative">
          <TouchableOpacity
            onPress={onClose}
            className="absolute top-3 right-3 z-10 p-1"
            style={{ position: "absolute", top: 12, right: 12 }}
            accessibilityLabel="Close"
          >
            <MaterialCommunityIcons name="close" size={24} color="#212529" />
          </TouchableOpacity>
          <Text className="text-lg font-bold mb-4 mt-2">Add Climb</Text>
          <Text className="mb-6 text-zinc-700">This is your add climb modal.</Text>
          <TouchableOpacity
            onPress={onClose}
            className="bg-black py-4 w-full items-center justify-center rounded-b-2xl mt-2"
          >
            <Text className="text-white font-bold text-lg">Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
