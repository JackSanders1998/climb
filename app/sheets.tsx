import { Button } from "@/lib/ui/Button";
import { Text } from "@/lib/ui/Text";
import { purple, sandA } from "@radix-ui/colors";
import { ReactNode, useState } from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import ActionSheet, {
  registerSheet,
  ScrollView,
  SheetDefinition,
  useSheetIDContext,
  useSheetRef,
} from "react-native-actions-sheet";
import * as DropdownMenu from "zeego/dropdown-menu";

import SweetSFSymbol from "sweet-sfsymbols";
import { SystemName } from "sweet-sfsymbols/build/SweetSFSymbols.types";

const Sheet = ({ children, title }: { children: ReactNode; title: string }) => {
  const sheetId = useSheetIDContext();

  const ref = useSheetRef(sheetId);

  return (
    <ActionSheet
      containerStyle={{ backgroundColor: "transparent" }}
      headerAlwaysVisible={false}
      overlayColor={sandA.sandA12}
      defaultOverlayOpacity={0.2}
      gestureEnabled
      CustomHeaderComponent={<></>}
    >
      <ScrollView
        style={{
          marginHorizontal: 8,
          backgroundColor: "white",
          borderRadius: 32,
          borderCurve: "continuous",
          borderColor: sandA.sandA8,
          borderWidth: StyleSheet.hairlineWidth,
        }}
        stickyHeaderIndices={[1]}
      >
        <View
          style={{
            padding: 12,
            paddingLeft: 24,
            paddingBottom: 0,
            justifyContent: "space-between",
            flexDirection: "row",
            alignItems: "center",
            // backgroundColor: "pink",
          }}
        >
          <Text level="title3">{title}</Text>
          <Button onPress={() => ref.current.hide()} symbol="xmark" />
        </View>

        <View style={{ padding: 24, paddingTop: 16 }}>{children}</View>
      </ScrollView>
    </ActionSheet>
  );
};

const Choice = ({
  title,
  onPress,
  symbol,
  checked = false,
}: {
  title: string;
  onPress: () => void;
  symbol: SystemName;
  checked?: boolean;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <SweetSFSymbol
        name={symbol}
        size={34}
        weight="bold"
        colors={[purple.purple10]}
      />

      <Text level="subhead">{title}</Text>
      <SweetSFSymbol
        colors={[checked ? sandA.sandA12 : sandA.sandA8]}
        name={checked ? "checkmark.circle.fill" : "circle"}
        size={15}
        weight="regular"
      />
    </TouchableOpacity>
  );
};

const SessionSheet = () => {
  const [selectedStyle, setSelectedStyle] = useState<
    "lead" | "toprope" | "boulder"
  >("lead");

  return (
    <Sheet title="Log a climb">
      <View
        style={{
          gap: 24,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <Choice
            title="Lead"
            onPress={() => setSelectedStyle("lead")}
            symbol="figure.dance"
            checked={selectedStyle === "lead"}
          />
          <Choice
            title="Top rope"
            onPress={() => setSelectedStyle("toprope")}
            symbol="figure.climbing"
            checked={selectedStyle === "toprope"}
          />
          <Choice
            title="Boulder"
            onPress={() => setSelectedStyle("boulder")}
            symbol="figure.fall"
            checked={selectedStyle === "boulder"}
          />
        </View>

        <View
          style={{
            alignItems: "flex-start",
          }}
        >
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <Button
                variant="ghost"
                title="YDS"
                symbol="chevron.up.chevron.down"
              />
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <DropdownMenu.Label />
              <DropdownMenu.Item
                key="item-1"
                onSelect={() => Alert.alert("You selected Item 1")}
              >
                <DropdownMenu.ItemTitle>Item 1</DropdownMenu.ItemTitle>
              </DropdownMenu.Item>
              <DropdownMenu.Item
                key="item-2"
                onSelect={() => Alert.alert("You selected Item 2")}
              >
                <DropdownMenu.ItemTitle>Item 2</DropdownMenu.ItemTitle>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </View>

        <Button title="Add photo" symbol="photo.badge.plus" variant="surface" />
        <Button
          title="Add note"
          symbol="note.text.badge.plus"
          variant="surface"
        />
        <Button title="Submit" symbol="checkmark" variant="primary" />
      </View>
    </Sheet>
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
