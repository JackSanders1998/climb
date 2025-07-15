// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");
const tsParser = require("@typescript-eslint/parser");
const tsPlugin = require("@typescript-eslint/eslint-plugin");
const reactNativePlugin = require("eslint-plugin-react-native");

module.exports = defineConfig([
  eslintPluginPrettierRecommended,
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      "react-native": reactNativePlugin,
    },
    rules: {
      ...expoConfig.rules,
      "react-native/no-unused-styles": "warn",
      "react-native/sort-styles": "warn",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
  {
    ignores: [
      ".expo/*",
      "convex/_generated/*",
      ".vscode/*",
      "ios/*",
      "*.js",
      "node_modules/*",
    ],
  },
]);
