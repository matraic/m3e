import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const PATH_DATA_PATTERN = /^[MmLlHhVvCcSsQqTtAaZz0-9.,\s-]+$/;
const VIEW_BOX_PATTERN = /^-?\d+(\.\d+)?\s+-?\d+(\.\d+)?\s+-?\d+(\.\d+)?\s+-?\d+(\.\d+)?$/;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const distDir = path.join(__dirname, "dist");
fs.mkdirSync(distDir, { recursive: true });

const variants = ["outlined", "rounded", "sharp"];

for (const variant of variants) {
  const variantDir = path.join(__dirname, "..", "..", "node_modules", "@material-symbols", "svg-400", variant);
  const files = fs.readdirSync(variantDir);
  const iconNames = files
    .filter((f) => f.endsWith(".svg") && !f.endsWith("-fill.svg"))
    .map((f) => f.replace(".svg", ""));

  console.log(`Building dist/${variant}`);

  const variantDistDir = path.join(distDir, variant);
  fs.mkdirSync(variantDistDir, { recursive: true });

  for (const iconName of iconNames) {
    const svg = fs.readFileSync(path.join(variantDir, `${iconName}.svg`), "utf8");
    const svgFill = fs.readFileSync(path.join(variantDir, `${iconName}-fill.svg`), "utf8");

    const svgViewBox = svg.match(/<svg[^>]*viewBox="([^"]+)"/)?.[1];
    const svgPath = svg.match(/<path[^>]*d="([^"]+)"/)?.[1];

    if (!PATH_DATA_PATTERN.test(svgPath)) {
      console.error(`Unable to register icon '${iconName}' for variant '${variant}'. Invalid outlined path data.`);
    }
    if (!VIEW_BOX_PATTERN.test(svgViewBox)) {
      console.error(`Unable to register icon '${iconName}' for variant '${variant}'. Invalid outlined viewbox data.`);
    }

    const svgFillViewBox = svgFill.match(/<svg[^>]*viewBox="([^"]+)"/)?.[1];
    const svgFillPath = svgFill.match(/<path[^>]*d="([^"]+)"/)?.[1];

    if (!PATH_DATA_PATTERN.test(svgFillPath)) {
      console.error(`Unable to register icon '${iconName}' for variant '${variant}'. Invalid filled path data.`);
    }
    if (!VIEW_BOX_PATTERN.test(svgViewBox)) {
      console.error(`Unable to register icon '${iconName}' for variant '${variant}'. Invalid filled viewbox data.`);
    }

    fs.writeFileSync(
      path.join(variantDistDir, `${iconName}.js`),
      `import { registerIcon } from '@m3e/web/icon';
registerIcon('${iconName}','${variant}',{outlined:{viewBox:'${svgViewBox}',path:'${svgPath}'},filled:{viewBox:'${svgFillViewBox}', path: '${svgFillPath}'}});`,
    );
  }

  fs.writeFileSync(path.join(variantDistDir, `index.js`), iconNames.map((icon) => `import './${icon}';`).join("\n"));
}

fs.writeFileSync(path.join(distDir, `index.js`), variants.map((variant) => `import './${variant}';`).join("\n"));
