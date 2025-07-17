import { View } from "react-native";
import * as DropdownMenu from "zeego/dropdown-menu";
import { Button } from "../ui/Button";

export const Select = <const T extends readonly string[]>({
  value,
  values,
  onValueChange,
  align = "left",
}: {
  values: T;
  value: T[number];
  onValueChange?: (value: T[number]) => void;
  align?: "left" | "right";
}) => {
  const longestValue = values.reduce((longest, current) =>
    current.length > longest.length ? current : longest,
  );

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <View>
          <Button
            variant="ghost"
            title={value}
            symbol="chevron.up.chevron.down"
            // symbolSide={align}
            style={[
              {
                position: "absolute",
                top: 0,
              },
              align === "left" ? { left: 0 } : { right: 0 },
            ]}
          />
          <View
            style={{
              opacity: 0,
            }}
          >
            <Button
              disabled
              variant="ghost"
              title={longestValue}
              // symbolSide={align}
              symbol="chevron.up.chevron.down"
            />
          </View>
        </View>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {values.map((v) => (
          <DropdownMenu.CheckboxItem
            key={v}
            value={value === v}
            onSelect={() => onValueChange?.(v)}
          >
            <DropdownMenu.ItemTitle>{v}</DropdownMenu.ItemTitle>
            <DropdownMenu.ItemIndicator />
          </DropdownMenu.CheckboxItem>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};
