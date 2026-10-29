import fs from "node:fs";
import path from "node:path";

const manifestPath = path.resolve(
  "packages/web/dist/custom-elements.json"
);

const outputPath = path.resolve(
  "experiments/wrapper-generation/Checkbox.generated.ts"
);

const manifest = JSON.parse(
  fs.readFileSync(manifestPath, "utf8")
);

const declarations = manifest.modules.flatMap(
  (module) => module.declarations ?? []
);

const checkbox = declarations.find(
  (declaration) => declaration.tagName === "m3e-checkbox"
);

if (!checkbox) {
  throw new Error(
    "m3e-checkbox not found in Custom Elements Manifest"
  );
}

const reactEventNames = {
  beforeinput: "onBeforeInput",
  input: "onInput",
  change: "onChange",
  invalid: "onInvalid",
  click: "onClick",
};

const eventLines = (checkbox.events ?? [])
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

import { M3eCheckboxElement } from "@pulse/web/checkbox";

export const M3eCheckbox = createComponent({
  tagName: "m3e-checkbox",
  elementClass: M3eCheckboxElement,
  react: React,
  events: {
${eventLines}
  },
});
`;

fs.writeFileSync(outputPath, source, "utf8");

console.log(`Generated ${outputPath}`);