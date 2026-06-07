import { customElementVsCodePlugin } from "custom-element-vs-code-integration";
import { getTsProgram, typeParserPlugin } from "@wc-toolkit/type-parser";

export default {
  globs: ["src/**/*.ts"],
  exclude: ["src/**/*.spec.ts"],
  packagejson: true,
  outdir: "dist",
  litelement: true,
  overrideModuleCreation({ ts, globs }) {
    return getTsProgram(ts, globs, "tsconfig.json")
      .getSourceFiles()
      .filter((x) => globs.find((glob) => x.fileName.includes(glob)));
  },
  plugins: [
    typeParserPlugin(),
    customElementVsCodePlugin({
      outdir: "dist",
      htmlFileName: "html-custom-data.json",
      cssFileName: "css-custom-data.json",
    }),
  ],
};
