import fs from "node:fs";
import path from "node:path";

const manifestPath = path.resolve(
  "packages/web/dist/custom-elements.json"
);

const outputPath = path.resolve(
  "experiments/wrapper-generation/Button.generated.ts"
);

const manifest = JSON.parse(
  fs.readFileSync(manifestPath, "utf8")
);

const declarations = manifest.modules.flatMap(
  (module) => module.declarations ?? []
);

const button = declarations.find(
  (declaration) => declaration.tagName === "m3e-button"
);

if (!button) {
  throw new Error(
    "m3e-button not found in Custom Elements Manifest"
  );
}

const reactEventNames = {
  beforeinput: "onBeforeInput",
  input: "onInput",
  change: "onChange",
  click: "onClick",
};

const eventLines = (button.events ?? [])
  .map((event) => {
    const reactName = reactEventNames[event.name];

    if (!reactName) {
      throw new Error(
        `No React event mapping defined for "${event.name}"`
      );
    }

    return `    ${reactName}: "${event.name}",`;
  })
  .join("\n");

const source = `import React from "react";
import { createComponent } from "@lit/react";

import { M3eButtonElement } from "@pulse/web/button";

export const M3eButton = createComponent({
  tagName: "m3e-button",
  elementClass: M3eButtonElement,
  react: React,
  events: {
${eventLines}
  },
});
`;

fs.writeFileSync(outputPath, source, "utf8");

console.log(`Generated ${outputPath}`);