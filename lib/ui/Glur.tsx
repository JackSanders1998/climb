import { sand } from "@radix-ui/colors";
import Masked from "@react-native-masked-view/masked-view";
import { BlurView } from "expo-blur";
import { StyleSheet, View, ViewStyle } from "react-native";

export const Glur = ({
  direction,
  style,
}: {
  direction: "l2r" | "r2l" | "t2b" | "b2t";
  style?: ViewStyle;
}) => {
  const gradientDirection = {
    l2r: "left",
    r2l: "right",
    t2b: "top",
    b2t: "bottom",
  };

  return (
    <Masked
      maskElement={
        <View
          style={[
            {
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "transparent",
              experimental_backgroundImage: `linear-gradient(to ${gradientDirection[direction]}, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 75%)`,
            },
            style,
          ]}
        />
      }
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 96,
      }}
    >
      <View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: sand.sand3, opacity: 0.5 },
        ]}
      />
      <BlurView intensity={24} style={StyleSheet.absoluteFill} />
    </Masked>
  );
};
