import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";

const banner = `"use client";
/**
 * @license MIT
 * Copyright (c) 2025 matraic
 * See LICENSE file in the project root for full license text.
 */
`;

const createDefaultEntryPoint = () => [
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/index.js",
        format: "esm",
        sourcemap: true,
        banner: banner,
      },
    ],
    plugins: [resolve(), typescript()],
  },
];

const createAllEntryPoint = [
  {
    input: "src/all.ts",
    output: [
      {
        file: "dist/all.js",
        format: "esm",
        sourcemap: true,
        banner: banner,
      },
      {
        file: "dist/all.min.js",
        format: "esm",
        sourcemap: true,
        banner: banner,
        plugins: [terser({ mangle: true, compress: { directives: false } })],
      },
    ],
    external: [/^@m3e\//, "lit", "@lit/react", "react"],
    plugins: [resolve(), typescript()],
  },
];

const createEntryPoint = (path) => [
  {
    input: `src/${path}/index.ts`,
    output: [
      {
        file: `dist/${path}.js`,
        format: "esm",
        sourcemap: true,
        banner: banner,
      },
      {
        file: `dist/${path}.min.js`,
        format: "esm",
        sourcemap: true,
        banner: banner,
        plugins: [terser({ mangle: true, compress: { directives: false } })],
      },
    ],
    external: [/^@m3e\//, "lit", "@lit/react", "react"],
    plugins: [resolve(), typescript()],
  },
];

const entryPoints = createDefaultEntryPoint();

[
  "app-bar",
  "autocomplete",
  "avatar",
  "badge",
  "bottom-sheet",
  "button",
  "button-group",
  "card",
  "checkbox",
  "chips",
  "core",
  "dialog",
  "divider",
  "drawer-container",
  "expansion-panel",
  "fab",
  "fab-menu",
  "form-field",
  "heading",
  "icon",
  "icon-button",
  "list",
  "loading-indicator",
  "menu",
  "nav-bar",
  "nav-menu",
  "nav-rail",
  "option",
  "paginator",
  "progress-indicator",
  "radio-group",
  "segmented-button",
  "select",
  "shape",
  "slide-group",
  "slider",
  "snackbar",
  "split-button",
  "stepper",
  "switch",
  "tabs",
  "textarea-autosize",
  "theme",
  "toc",
  "toolbar",
  "tooltip",
].forEach((x) => {
  entryPoints.push(...createEntryPoint(x));
});

entryPoints.push(...createAllEntryPoint);

export default entryPoints;
