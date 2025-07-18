import { sand, sandA } from "@radix-ui/colors";
import {
  TextInput as RNTextInput,
  StyleSheet,
  TextInputProps,
  View,
} from "react-native";
import { Text } from "../ui/Text";

export const TextInput = (props: TextInputProps & { label?: string }) => {
  const { style, ...rest } = props;

  return (
    <View
      style={{
        gap: 8,
      }}
    >
      {props.label && (
        <Text
          style={{
            paddingHorizontal: 4,
          }}
          dim
        >
          {props.label}
        </Text>
      )}

      <RNTextInput
        placeholderTextColor={sandA.sandA10}
        {...rest}
        style={[
          {
            borderWidth: StyleSheet.hairlineWidth,
            height: 44,
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 12,
            borderCurve: "continuous",
            borderColor: sandA.sandA9,
            backgroundColor: sand.sand1,
            fontSize: 15,
            boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.04)",
          },
          style,
        ]}
      />
    </View>
  );
};
