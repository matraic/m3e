import { customElementVsCodePlugin } from "custom-element-vs-code-integration";

export default {
  globs: ["src/**/*.ts", "../nav-bar/src/NavBarElement.ts", "../core/src/shared/mixins/*.ts"],
  exclude: ["src/**/*.spec.ts"],
  packagejson: true,
  outdir: "dist",
  litelement: true,
  plugins: [
    customElementVsCodePlugin({
      outdir: "dist",
      htmlFileName: "html-custom-data.json",
      cssFileName: "css-custom-data.json",
    }),
  ],
};
