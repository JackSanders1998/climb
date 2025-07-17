import { sand, sandA } from "@radix-ui/colors";
import { StyleSheet, View, ViewProps } from "react-native";

export const Card = (props: ViewProps) => {
  const { children, style, ...rest } = props;

  return (
    <>
      <View
        style={[
          {
            backgroundColor: sand.sand1,
            borderRadius: 16,
            borderCurve: "continuous",
            padding: 16,
            gap: 4,
            borderColor: sandA.sandA8,
            borderWidth: StyleSheet.hairlineWidth,
            width: "100%",
            boxShadow:
              "0px 0px 6px rgba(0, 0, 0, 0.01), 0px 2px 4px rgba(0, 0, 0, 0.02)",
          },
          style,
        ]}
        {...rest}
      >
        {children}
      </View>
    </>
  );
};
