import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import babel from "@rollup/plugin-babel";

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
    external: ["lit"],
    plugins: [
      resolve(),
      typescript(),
      babel({
        babelHelpers: "bundled",
        extensions: [".ts", ".js"],
        exclude: "node_modules/**",
        rootMode: "upward",
      }),
    ],
  },
  {
    input: "src/a11y/index.ts",
    output: [
      {
        file: "dist/a11y.js",
        format: "esm",
        sourcemap: true,
        banner: banner,
      },
      {
        file: "dist/a11y.min.js",
        format: "esm",
        sourcemap: true,
        banner: banner,
        plugins: [terser({ mangle: true })],
      },
    ],
    external: ["lit"],
    plugins: [
      resolve(),
      typescript(),
      babel({
        babelHelpers: "bundled",
        extensions: [".ts", ".js"],
        exclude: "node_modules/**",
        rootMode: "upward",
      }),
    ],
  },
  {
    input: "src/anchoring/index.ts",
    output: [
      {
        file: "dist/anchoring.js",
        format: "esm",
        sourcemap: true,
        banner: banner,
      },
      {
        file: "dist/anchoring.min.js",
        format: "esm",
        sourcemap: true,
        banner: banner,
        plugins: [terser({ mangle: true })],
      },
    ],
    external: ["lit"],
    plugins: [resolve(), typescript()],
  },
  {
    input: "src/bidi/index.ts",
    output: [
      {
        file: "dist/bidi.js",
        format: "esm",
        sourcemap: true,
        banner: banner,
      },
      {
        file: "dist/bidi.min.js",
        format: "esm",
        sourcemap: true,
        banner: banner,
        plugins: [terser({ mangle: true })],
      },
    ],
    external: ["lit"],
    plugins: [resolve(), typescript()],
  },
  {
    input: "src/layout/index.ts",
    output: [
      {
        file: "dist/layout.js",
        format: "esm",
        sourcemap: true,
        banner: banner,
      },
      {
        file: "dist/layout.min.js",
        format: "esm",
        sourcemap: true,
        banner: banner,
        plugins: [terser({ mangle: true })],
      },
    ],
    external: ["lit"],
    plugins: [resolve(), typescript()],
  },
  {
    input: "src/platform/index.ts",
    output: [
      {
        file: "dist/platform.js",
        format: "esm",
        sourcemap: true,
        banner: banner,
      },
      {
        file: "dist/platform.min.js",
        format: "esm",
        sourcemap: true,
        banner: banner,
        plugins: [terser({ mangle: true })],
      },
    ],
    external: ["lit"],
    plugins: [resolve(), typescript()],
  },
];
