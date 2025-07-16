import { Switch } from "@expo/ui/swift-ui";
import { sandA } from "@radix-ui/colors";

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
    <Switch
      value={checked}
      onValueChange={(checked) => {
        setChecked(checked);
      }}
      color={sandA.sandA12}
      label={label}
      variant="switch"
    />
  );
};
