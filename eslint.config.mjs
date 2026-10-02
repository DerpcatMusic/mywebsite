import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import nextVitals from "eslint-config-next/core-web-vitals";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
// Keep the established rule policy in one place while ESLint 9 uses flat config.
const legacy = require("./.eslintrc.json");

export default [
  ...nextVitals,
  prettierConfig,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: legacy.parserOptions,
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      prettier: prettierPlugin,
    },
    rules: legacy.rules,
  },
  {
    ignores: legacy.ignorePatterns.map(pattern =>
      pattern.endsWith("/") ? `${pattern}**` : `**/${pattern}`
    ),
  },
];
