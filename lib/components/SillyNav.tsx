import { ScrollView, View } from "react-native";
import { SheetManager } from "react-native-actions-sheet";
import { useStoreUserEffect } from "../hooks/useStoreUserEffect";
import { Button } from "../ui/Button";

interface SillyNavProps {
  pageName: string;
}

export default function SillyNav({ pageName }: SillyNavProps) {
  const { roles } = useStoreUserEffect();

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{
        flex: 1,
      }}
    >
      <View
        style={{
          flex: 1,
          padding: 12,
          gap: 8,
        }}
      >
        <Button
          title="Open sheet"
          onPress={() => SheetManager.show("session-sheet")}
          symbol="rectangle.portrait.bottomthird.inset.filled"
          variant="primary"
        />
        <Button
          selected={pageName === "Summary"}
          title="Summary"
          as="link"
          href="/"
          variant="surface"
          symbol="square.grid.2x2"
        />
        <Button
          selected={pageName === "Insights"}
          title="Insights"
          as="link"
          href="/insights"
          variant="surface"
          symbol="chart.bar"
        />
        {roles.includes("ADMIN") && (
          <Button
            selected={pageName === "Locations"}
            title="Locations"
            as="link"
            href="/locations"
            variant="surface"
            symbol="map"
          />
        )}
      </View>
    </ScrollView>
  );
}
