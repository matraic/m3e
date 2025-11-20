import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import babel from "@rollup/plugin-babel";

const banner = `/**
 * @license MIT
 * Copyright (c) 2025 matraic
 * See LICENSE file in the project root for full license text.
 */`;

export const createConfig = (external = []) => [
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
    external: external,
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
];
