import { ScrollView, View } from "react-native";
import { SheetManager } from "react-native-actions-sheet";
import { useStoreUserEffect } from "../hooks/useStoreUserEffect";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Text } from "../ui/Text";

interface SillyNavProps {
  pageName: string;
  paddingBottom?: number;
}

export default function SillyNav({
  pageName,
  paddingBottom = 0,
}: SillyNavProps) {
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

        {Array.from({ length: 10 }, (_, index) => index).map((i) => (
          <Card key={"foo" + i}>
            <Text level="headline">To test scrolling</Text>
            <Text>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor
              ipsam ipsum rem molestias, voluptate hic omnis minus at fugit
              adipisci!
            </Text>
          </Card>
        ))}
      </View>
      <View style={{ height: paddingBottom }} />
    </ScrollView>
  );
}
