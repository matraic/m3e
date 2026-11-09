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
    {
      name: "collect-class-documentation",
      analyzePhase({ ts, node, moduleDoc }) {
        if (!ts.isClassDeclaration(node) || !node.name) return;

        const declaration = moduleDoc.declarations.find((item) => item.name === node.name.text);
        if (!declaration) return;

        const tags = (node.jsDoc ?? []).flatMap((doc) => doc.tags ?? []);
        const tagText = (tag) => {
          const comment = tag.comment;
          return (typeof comment === "string" ? comment : (comment ?? []).map((part) => part.text).join("")).trim();
        };
        const descriptions = tags.filter((tag) => tag.tagName.text === "description").map(tagText).filter(Boolean);
        const examples = tags.filter((tag) => tag.tagName.text === "example").map(tagText).filter(Boolean);

        if (descriptions.length) {
          declaration.remarks = descriptions.join("\n\n");
        }
        if (examples.length) {
          declaration.examples = examples;
        }
      },
    },
    customElementVsCodePlugin({
      outdir: "dist",
      htmlFileName: "html-custom-data.json",
      cssFileName: "css-custom-data.json",
    }),
  ],
};
