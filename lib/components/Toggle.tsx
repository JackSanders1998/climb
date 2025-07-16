import { Switch } from "@expo/ui/swift-ui";
import { sandA } from "@radix-ui/colors";
import { View } from "react-native";
import { Text } from "../ui/Text";

export const Toggle = ({
  checked,
  setChecked,
  label,
}: {
  checked: boolean;
  setChecked: (checked: boolean) => void;
  label: string;
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Text>{label}</Text>
      <Switch
        value={checked}
        onValueChange={(checked) => {
          setChecked(checked);
        }}
        color={sandA.sandA12}
        label={label}
        variant="switch"
      />
    </View>
  );
};
