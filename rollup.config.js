import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import babel from "@rollup/plugin-babel";

const banner = `/**
 * @license MIT
 * Copyright (c) 2025 matraic
 * See LICENSE file in the project root for full license text.
 */`;

const defaultDisableMinification = process.env.nominify === "true";

const defaultBaseOutput = {
  format: "esm",
  banner: banner,
  sourcemap: true,
  minifyInternalExports: false,
  hoistTransitiveImports: false,
};

const defaultBabelConfig = {
  babelHelpers: "bundled",
  extensions: [".ts", ".js"],
  exclude: "node_modules/**",
  rootMode: "upward",
};

const createOutput = ({ dist, config = {} }) => {
  const {
    disableMinification = defaultDisableMinification,
    terserConfig = {},
    babelConfig = {},
    baseOutput = {},
  } = config;

  const outputs = [
    {
      file: `dist/${dist}.js`,
      ...defaultBaseOutput,
    },
  ];
  if (!disableMinification) {
    outputs.push({
      file: `dist/${dist}.min.js`,
      ...defaultBaseOutput,
      ...baseOutput,
      plugins: [
        terser({
          mangle: true,
          ...terserConfig,
        }),
      ],
    });
  }
  return outputs;
};

export const createDefaultEntryPoint = ({ config = {} }) => {
  const { typescriptConfig = {} } = config;

  return {
    input: "src/index.ts",
    output: createOutput({ dist: "index", config: config }),
    plugins: [
      resolve(),
      typescript({
        exclude: ["./**/*.ts"],
        ...typescriptConfig,
      }),
    ],
  };
};

export const createInputsEntryPoint = ({ inputs = [], externals = [], config = {} }) => {
  const {
    disableMinification = defaultDisableMinification,
    typescriptConfig = {},
    terserConfig = {},
    babelConfig = {},
    baseOutput = {},
  } = config;
  const mappedInputs = {};
  inputs.forEach((module) => {
    mappedInputs[module.replace(/\//g, "-")] = `src/${module}/index.ts`;
  });

  const outputs = [
    {
      dir: `dist`,
      chunkFileNames: `[name].js`,
      entryFileNames: `[name].js`,
      ...defaultBaseOutput,
      ...baseOutput,
    },
  ];

  if (!disableMinification) {
    outputs.push({
      dir: `dist`,
      entryFileNames: `[name].min.js`,
      chunkFileNames: `[name].min.js`,
      plugins: [terser(terserConfig)],
      ...defaultBaseOutput,
      ...baseOutput,
    });
  }

  return {
    input: mappedInputs,
    output: outputs,
    external: externals,
    plugins: [
      resolve(),
      typescript(typescriptConfig),
      babel({
        ...defaultBabelConfig,
        ...babelConfig,
      }),
    ],
  };
};

export const createAllEntryPoint = ({ externals = [], config = {} }) => {
  const { typescriptConfig = {}, terserConfig = {}, babelConfig = {} } = config;
  return {
    input: "src/all.ts",
    output: createOutput({ dist: "all", config: config }),
    external: externals,
    plugins: [
      resolve(),
      typescript(typescriptConfig),
      babel({
        ...defaultBabelConfig,
        ...babelConfig,
      }),
    ],
  };
};

const createConfig = ({ inputs = [], externals = [], config = {} }) => {
  const { disableMinification = defaultDisableMinification } = config;

  if (disableMinification) {
    console.warn("Minification: disabled");
  } else {
    console.log("Minification: enabled");
  }

  return [
    createDefaultEntryPoint({ config: config }),
    createInputsEntryPoint({ inputs: inputs, externals: externals, config: config }),
    createAllEntryPoint({ externals: externals, config: config }),
  ];
};

export default createConfig;
