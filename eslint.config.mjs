import css from "@eslint/css";
import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import markdown from "@eslint/markdown";

export default defineConfig([
  { files: ["**/*.css"], plugins: { css }, language: "css/css", extends: ["css/recommended"], "rules": { "css/no-invalid-properties": "off", "css/no-empty-blocks": "off", "css/use-baseline": "off"} },
  { files: ["**/*.{js,mjs}"], plugins: { js }, extends: ["js/recommended"] },
  { files: ["**/*.js"], languageOptions: { sourceType: "script" } },
  { files: ["**/*.{js,mjs}"], languageOptions: { globals: {...globals.browser, ...globals.node} } },
  { files: ["**/*.md"], plugins: { markdown }, language: "markdown/gfm", extends: ["markdown/recommended"] }
]);
