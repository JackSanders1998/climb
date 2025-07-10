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
    emphasizedFontWeight: undefined,
  },
  title1: {
    fontSize: 28,
    fontWeight: "bold",
    lineHeight: 34,
    emphasizedFontWeight: undefined,
  },
  title2: {
    fontSize: 22,
    fontWeight: "bold",
    lineHeight: 28,
    emphasizedFontWeight: undefined,
  },
  title3: {
    fontSize: 20,
    fontWeight: "600",
    lineHeight: 25,
    emphasizedFontWeight: undefined,
  },
  headline: {
    fontSize: 17,
    fontWeight: "600",
    lineHeight: 22,
    emphasizedFontWeight: undefined,
  },
  body: {
    fontSize: 17,
    fontWeight: "normal",
    lineHeight: 22,
    emphasizedFontWeight: "bold",
  },
  callout: {
    fontSize: 16,
    fontWeight: "normal",
    lineHeight: 21,
    emphasizedFontWeight: undefined,
  },
  subhead: {
    fontSize: 15,
    fontWeight: "normal",
    lineHeight: 20,
    emphasizedFontWeight: undefined,
  },
  footnote: {
    fontSize: 13,
    fontWeight: "normal",
    lineHeight: 18,
    emphasizedFontWeight: undefined,
  },
  caption1: {
    fontSize: 12,
    fontWeight: "normal",
    lineHeight: 16,
    emphasizedFontWeight: undefined,
  },
  caption2: {
    fontSize: 11,
    fontWeight: "normal",
    lineHeight: 13,
    emphasizedFontWeight: undefined,
  },
} as const satisfies Record<
  string,
  Pick<TextStyle, "fontSize" | "fontWeight" | "lineHeight"> & {
    emphasizedFontWeight: TextStyle["fontWeight"] | undefined;
  }
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
          fontWeight: emphasized
            ? (levelStyle.emphasizedFontWeight ?? levelStyle.fontWeight)
            : levelStyle.fontWeight,
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
