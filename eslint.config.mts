import js from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: { js },
    extends: [
      "js/recommended",
      "eslint:recommended",
      "plugin:react/recommended",
      "plugin:react/jsx-runtime"
    ],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        projectService: true
      }
    }
  },
  js.configs.recommended,
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    plugins: {
      "react-hooks": reactHooks
    },
    rules: {
      // Enable rules of hooks and exhaustive-deps
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn", // or "error"
      // forget to `await` an async call
      "@typescript-eslint/no-floating-promises": "warn" // or 'error'
    }
  }
]);
