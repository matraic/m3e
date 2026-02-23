import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import { fileURLToPath } from "url";
import { dirname } from "path";

export default tseslint.config(eslint.configs.recommended, tseslint.configs.recommended, {
  languageOptions: {
    parserOptions: {
      project: true,
      tsconfigRootDir: dirname(fileURLToPath(import.meta.url)),
    },
  },
});
