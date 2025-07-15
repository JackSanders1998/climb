import { Text } from "@/lib/ui/Text";
import { View } from "react-native";
import ActionSheet, {
  registerSheet,
  SheetDefinition,
} from "react-native-actions-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SessionSheet = () => {
  const insets = useSafeAreaInsets();
  return (
    <ActionSheet
      safeAreaInsets={insets}
      containerStyle={{ backgroundColor: "transparent", zIndex: 1000 }}
    >
      <View
        style={{
          padding: 20,
          margin: 20,
          backgroundColor: "white",
          borderRadius: 12,
        }}
      >
        <Text>Foo, I am here.</Text>
      </View>
    </ActionSheet>
  );
};

registerSheet("session-sheet", SessionSheet);

// We extend some of the types here to give us great intellisense
// across the app for all registered sheets.
declare module "react-native-actions-sheet" {
  interface Sheets {
    "example-sheet": SheetDefinition;
  }
}

export {};
