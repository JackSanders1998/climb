import { sand, sandA, slateA } from "@radix-ui/colors";
import { BlurView } from "expo-blur";
import { Link, LinkProps } from "expo-router";
import {
  StyleSheet,
  TextProps,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";
import SweetSFSymbol from "sweet-sfsymbols";
import { SystemName } from "sweet-sfsymbols/build/SweetSFSymbols.types";
import { Text } from "./Text";

type ILinkProps = { as: "link" } & LinkProps;
type IButtonProps = { as?: "button" } & TouchableOpacityProps;

type SharedProps = {
  title?: string;
  selected?: boolean;
  variant?: Variant;
  symbol?: SystemName;
  symbolSide?: "left" | "right";
};

type ButtonProps = SharedProps &
  (Omit<ILinkProps, "children"> | Omit<IButtonProps, "children">);

const sharedStyles = {
  container: {
    borderRadius: 12,
    paddingHorizontal: 16,
    gap: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    textAlign: "center",
    height: 44,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "transparent",
    overflow: "hidden",
    borderCurve: "continuous",
  },
  text: {
    marginHorizontal: 4,
  },
} as const satisfies {
  container: LinkProps["style"] | TouchableOpacityProps["style"];
  text: TextProps["style"];
};

const variantStyles = {
  primary: {
    default: {
      container: {
        backgroundColor: sandA.sandA12,
        boxShadow:
          "0px 0px 4px rgba(0, 0, 0, 0.12), 0px 8px 16px rgba(0, 0, 0, 0.24)",
      },
      text: {
        color: sand.sand1,
      },
    },
    selected: {
      container: {},
      text: {},
    },
  },
  ghost: {
    default: {
      container: {},
      text: {},
    },
    selected: { container: {}, text: {} },
  },
  surface: {
    default: {
      container: {
        backgroundColor: slateA.slateA3,
        borderColor: slateA.slateA8,
        borderWidth: StyleSheet.hairlineWidth,
      },
      text: {
        color: slateA.slateA12,
      },
    },
    selected: {
      container: {
        backgroundColor: slateA.slateA7,
      },
      text: {},
    },
  },
} as const satisfies Record<
  string,
  Record<
    string,
    {
      container: LinkProps["style"] | TouchableOpacityProps["style"];
      text: TextProps["style"];
    }
  >
>;

type Variant = keyof typeof variantStyles;

type State = keyof (typeof variantStyles)[Variant];

export const Button = ({
  selected,
  variant = "ghost",
  symbolSide = "right",
  ...props
}: ButtonProps) => {
  const state: State = selected ? "selected" : "default";

  const symbolColor =
    "color" in variantStyles[variant][state].text
      ? variantStyles[variant][state].text.color
      : "color" in variantStyles[variant].default.text
        ? variantStyles[variant].default.text.color
        : "black";

  // const symbolColor = "red";

  const Symbol = () => {
    if (props.symbol) {
      return (
        <SweetSFSymbol
          colors={[symbolColor]}
          name={props.symbol}
          weight="regular"
          size={variant === "ghost" ? 17 : 15}
        />
      );
    } else {
      return undefined;
    }
  };

  if (props.as === "link") {
    return (
      <Link
        {...props}
        style={[
          sharedStyles.container,
          variantStyles[variant].default.container,
          variantStyles[variant][state].container,
          { backgroundColor: "transparent" },
          { ...(!props.title ? { width: 44, height: 44 } : {}) },
        ]}
        asChild
      >
        <TouchableOpacity>
          {variant !== "ghost" && (
            <BlurView
              style={{
                position: "absolute",
                inset: 0,
              }}
            />
          )}
          <View
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor:
                "backgroundColor" in variantStyles[variant][state].container
                  ? variantStyles[variant][state].container.backgroundColor
                  : "transparent",
            }}
          />
          {symbolSide === "left" && <Symbol />}
          {props.title && (
            <Text
              level={variant === "ghost" ? "body" : "subhead"}
              style={{
                ...sharedStyles.text,
                ...variantStyles[variant][state].text,
              }}
            >
              {props.title}
            </Text>
          )}
          {symbolSide === "right" && <Symbol />}
        </TouchableOpacity>
      </Link>
    );
  }

  return (
    <TouchableOpacity
      {...props}
      style={[
        sharedStyles.container,
        variantStyles[variant].default.container,
        variantStyles[variant][state].container,
        { backgroundColor: "transparent" },
        { ...(!props.title ? { width: 44, height: 44 } : {}) },
      ]}
    >
      {variant !== "ghost" && (
        <BlurView
          style={{
            position: "absolute",
            inset: 0,
          }}
        />
      )}
      <View
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor:
            "backgroundColor" in variantStyles[variant][state].container
              ? variantStyles[variant][state].container.backgroundColor
              : "transparent",
        }}
      />
      {symbolSide === "left" && <Symbol />}

      {props.title && (
        <Text
          level={variant === "ghost" ? "body" : "subhead"}
          style={{
            ...sharedStyles.text,
            ...variantStyles[variant][state].text,
          }}
        >
          {props.title}
        </Text>
      )}
      {symbolSide === "right" && <Symbol />}
    </TouchableOpacity>
  );
};
