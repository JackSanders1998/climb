import { sandA } from "@radix-ui/colors";
import React from "react";
import {
  Text as RNText,
  TextProps as RNTextProps,
  TextStyle,
} from "react-native";

const textLevels = {
  largeTitle: {
    fontSize: 34,
    fontWeight: "bold",
    lineHeight: 41,
  },
  title1: {
    fontSize: 28,
    fontWeight: "bold",
    lineHeight: 34,
  },
  title2: {
    fontSize: 22,
    fontWeight: "bold",
    lineHeight: 28,
  },
  title3: {
    fontSize: 20,
    fontWeight: "bold",
    lineHeight: 25,
  },
  headline: {
    fontSize: 17,
    fontWeight: "600", // Semibold
    lineHeight: 22,
  },
  body: {
    fontSize: 17,
    fontWeight: "normal",
    lineHeight: 22,
  },
  callout: {
    fontSize: 16,
    fontWeight: "normal",
    lineHeight: 21,
  },
  subhead: {
    fontSize: 15,
    fontWeight: "normal",
    lineHeight: 20,
  },
  footnote: {
    fontSize: 13,
    fontWeight: "normal",
    lineHeight: 18,
  },
  caption1: {
    fontSize: 12,
    fontWeight: "normal",
    lineHeight: 16,
  },
  caption2: {
    fontSize: 11,
    fontWeight: "normal",
    lineHeight: 13,
  },
} as const satisfies Record<
  string,
  Pick<TextStyle, "fontSize" | "fontWeight" | "lineHeight">
>;

type TextProps = Omit<RNTextProps, "style"> & {
  level?: keyof typeof textLevels;
  emphasized?: boolean;
  dim?: boolean;
  style?: Omit<TextStyle, "fontSize" | "fontWeight" | "lineHeight">;
};

export const Text = ({
  level = "body",
  emphasized = false,
  style,
  children,
  ...props
}: TextProps) => {
  const levelStyle = textLevels[level] || textLevels.body;

  return (
    <RNText
      style={[
        levelStyle,
        {
          fontWeight: emphasized ? "bold" : levelStyle.fontWeight,
          color: (style?.color ?? props.dim) ? sandA.sandA11 : sandA.sandA12,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
};
