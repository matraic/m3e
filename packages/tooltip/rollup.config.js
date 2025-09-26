import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";

const banner = `/**
 * @license MIT
 * Copyright (c) 2025 matraic
 * See LICENSE file in the project root for full license text.
 */`;

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/index.js",
        format: "esm",
        sourcemap: true,
        banner: banner,
      },
      {
        file: "dist/index.min.js",
        format: "esm",
        sourcemap: true,
        banner: banner,
        plugins: [terser({ mangle: true })],
      },
    ],
    external: ["@m3e/core", "@m3e/core/a11y", "@m3e/core/anchoring", "@m3e/core/platform", "lit"],
    plugins: [resolve(), typescript()],
  },
];
