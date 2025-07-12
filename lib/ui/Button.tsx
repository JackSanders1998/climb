import { sand, sandA, slateA } from "@radix-ui/colors";
import { Link, LinkProps } from "expo-router";
import {
  StyleSheet,
  TextProps,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import { Text } from "./Text";

type ILinkProps = { as: "link" } & LinkProps;
type IButtonProps = { as?: "button" } & TouchableOpacityProps;

type SharedProps = { title: string; selected?: boolean; variant?: Variant };

type ButtonProps = SharedProps &
  (Omit<ILinkProps, "children"> | Omit<IButtonProps, "children">);

const sharedStyles = {
  container: {
    borderRadius: 12,
    paddingHorizontal: 16,
    gap: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    textAlign: "center",
    height: 44,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "transparent",
  },
  text: {},
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
  ...props
}: ButtonProps) => {
  const state: State = selected ? "selected" : "default";

  if (props.as === "link") {
    return (
      <Link
        {...props}
        style={[
          sharedStyles.container,
          variantStyles[variant].default.container,
          variantStyles[variant][state].container,
        ]}
        asChild
      >
        <TouchableOpacity>
          <Text
            level={variant === "ghost" ? "body" : "subhead"}
            style={variantStyles[variant][state].text}
          >
            {props.title}
          </Text>
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
      ]}
    >
      <Text
        level={variant === "ghost" ? "body" : "subhead"}
        style={variantStyles[variant][state].text}
      >
        {props.title}
      </Text>
    </TouchableOpacity>
  );
};
