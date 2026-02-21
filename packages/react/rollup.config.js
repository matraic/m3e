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
    ],
    plugins: [resolve(), typescript()],
  },
  {
    input: "src/app-bar/index.ts",
    output: [
      {
        file: "dist/app-bar.js",
        format: "esm",
        sourcemap: true,
        banner: banner,
      },
      {
        file: "dist/app-bar.min.js",
        format: "esm",
        sourcemap: true,
        banner: banner,
        plugins: [terser({ mangle: true, compress: { directives: false } })],
      },
    ],
    external: [/^@m3e\//, "lit", "@lit/react", "react"],
    plugins: [resolve(), typescript()],
  },
  {
    input: "src/autocomplete/index.ts",
    output: [
      { file: "dist/autocomplete.js", format: "esm", sourcemap: true, banner: banner },
      {
        file: "dist/autocomplete.min.js",
        format: "esm",
        sourcemap: true,
        banner: banner,
        plugins: [terser({ mangle: true, compress: { directives: false } })],
      },
    ],
    external: [/^@m3e\//, "lit", "@lit/react", "react"],
    plugins: [resolve(), typescript()],
  },
  {
    input: "src/avatar/index.ts",
    output: [
      { file: "dist/avatar.js", format: "esm", sourcemap: true, banner: banner },
      {
        file: "dist/avatar.min.js",
        format: "esm",
        sourcemap: true,
        banner: banner,
        plugins: [terser({ mangle: true, compress: { directives: false } })],
      },
    ],
    external: [/^@m3e\//, "lit", "@lit/react", "react"],
    plugins: [resolve(), typescript()],
  },
  {
    input: "src/badge/index.ts",
    output: [
      { file: "dist/badge.js", format: "esm", sourcemap: true, banner: banner },
      {
        file: "dist/badge.min.js",
        format: "esm",
        sourcemap: true,
        banner: banner,
        plugins: [terser({ mangle: true, compress: { directives: false } })],
      },
    ],
    external: [/^@m3e\//, "lit", "@lit/react", "react"],
    plugins: [resolve(), typescript()],
  },
  {
    input: "src/bottom-sheet/index.ts",
    output: [
      { file: "dist/bottom-sheet.js", format: "esm", sourcemap: true, banner: banner },
      {
        file: "dist/bottom-sheet.min.js",
        format: "esm",
        sourcemap: true,
        banner: banner,
        plugins: [terser({ mangle: true, compress: { directives: false } })],
      },
    ],
    external: [/^@m3e\//, "lit", "@lit/react", "react"],
    plugins: [resolve(), typescript()],
  },
  {
    input: "src/button/index.ts",
    output: [
      { file: "dist/button.js", format: "esm", sourcemap: true, banner: banner },
      {
        file: "dist/button.min.js",
        format: "esm",
        sourcemap: true,
        banner: banner,
        plugins: [terser({ mangle: true, compress: { directives: false } })],
      },
    ],
    external: [/^@m3e\//, "lit", "@lit/react", "react"],
    plugins: [resolve(), typescript()],
  },
  {
    input: "src/button-group/index.ts",
    output: [
      { file: "dist/button-group.js", format: "esm", sourcemap: true, banner: banner },
      {
        file: "dist/button-group.min.js",
        format: "esm",
        sourcemap: true,
        banner: banner,
        plugins: [terser({ mangle: true, compress: { directives: false } })],
      },
    ],
    external: [/^@m3e\//, "lit", "@lit/react", "react"],
    plugins: [resolve(), typescript()],
  },
  {
    input: "src/card/index.ts",
    output: [
      { file: "dist/card.js", format: "esm", sourcemap: true, banner: banner },
      {
        file: "dist/card.min.js",
        format: "esm",
        sourcemap: true,
        banner: banner,
        plugins: [terser({ mangle: true, compress: { directives: false } })],
      },
    ],
    external: [/^@m3e\//, "lit", "@lit/react", "react"],
    plugins: [resolve(), typescript()],
  },
  {
    input: "src/checkbox/index.ts",
    output: [
      { file: "dist/checkbox.js", format: "esm", sourcemap: true, banner: banner },
      {
        file: "dist/checkbox.min.js",
        format: "esm",
        sourcemap: true,
        banner: banner,
        plugins: [terser({ mangle: true, compress: { directives: false } })],
      },
    ],
    external: [/^@m3e\//, "lit", "@lit/react", "react"],
    plugins: [resolve(), typescript()],
  },
  {
    input: "src/chips/index.ts",
    output: [
      { file: "dist/chips.js", format: "esm", sourcemap: true, banner: banner },
      {
        file: "dist/chips.min.js",
        format: "esm",
        sourcemap: true,
        banner: banner,
        plugins: [terser({ mangle: true, compress: { directives: false } })],
      },
    ],
    external: [/^@m3e\//, "lit", "@lit/react", "react"],
    plugins: [resolve(), typescript()],
  },
  {
    input: "src/dialog/index.ts",
    output: [
      { file: "dist/dialog.js", format: "esm", sourcemap: true, banner: banner },
      {
        file: "dist/dialog.min.js",
        format: "esm",
        sourcemap: true,
        banner: banner,
        plugins: [terser({ mangle: true, compress: { directives: false } })],
      },
    ],
    external: [/^@m3e\//, "lit", "@lit/react", "react"],
    plugins: [resolve(), typescript()],
  },
  {
    input: "src/divider/index.ts",
    output: [
      { file: "dist/divider.js", format: "esm", sourcemap: true, banner: banner },
      {
        file: "dist/divider.min.js",
        format: "esm",
        sourcemap: true,
        banner: banner,
        plugins: [terser({ mangle: true, compress: { directives: false } })],
      },
    ],
    external: [/^@m3e\//, "lit", "@lit/react", "react"],
    plugins: [resolve(), typescript()],
  },
  {
    input: "src/drawer-container/index.ts",
    output: [
      { file: "dist/drawer-container.js", format: "esm", sourcemap: true, banner: banner },
      {
        file: "dist/drawer-container.min.js",
        format: "esm",
        sourcemap: true,
        banner: banner,
        plugins: [terser({ mangle: true, compress: { directives: false } })],
      },
    ],
    external: [/^@m3e\//, "lit", "@lit/react", "react"],
    plugins: [resolve(), typescript()],
  },
  {
    input: "src/expansion-panel/index.ts",
    output: [
      { file: "dist/expansion-panel.js", format: "esm", sourcemap: true, banner: banner },
      {
        file: "dist/expansion-panel.min.js",
        format: "esm",
        sourcemap: true,
        banner: banner,
        plugins: [terser({ mangle: true, compress: { directives: false } })],
      },
    ],
    external: [/^@m3e\//, "lit", "@lit/react", "react"],
    plugins: [resolve(), typescript()],
  },
  {
    input: "src/fab/index.ts",
    output: [
      { file: "dist/fab.js", format: "esm", sourcemap: true, banner: banner },
      {
        file: "dist/fab.min.js",
        format: "esm",
        sourcemap: true,
        banner: banner,
        plugins: [terser({ mangle: true, compress: { directives: false } })],
      },
    ],
    external: [/^@m3e\//, "lit", "@lit/react", "react"],
    plugins: [resolve(), typescript()],
  },
  {
    input: "src/fab-menu/index.ts",
    output: [
      { file: "dist/fab-menu.js", format: "esm", sourcemap: true, banner: banner },
      {
        file: "dist/fab-menu.min.js",
        format: "esm",
        sourcemap: true,
        banner: banner,
        plugins: [terser({ mangle: true, compress: { directives: false } })],
      },
    ],
    external: [/^@m3e\//, "lit", "@lit/react", "react"],
    plugins: [resolve(), typescript()],
  },
  {
    input: "src/form-field/index.ts",
    output: [
      { file: "dist/form-field.js", format: "esm", sourcemap: true, banner: banner },
      {
        file: "dist/form-field.min.js",
        format: "esm",
        sourcemap: true,
        banner: banner,
        plugins: [terser({ mangle: true, compress: { directives: false } })],
      },
    ],
    external: [/^@m3e\//, "lit", "@lit/react", "react"],
    plugins: [resolve(), typescript()],
  },
  {
    input: "src/heading/index.ts",
    output: [
      { file: "dist/heading.js", format: "esm", sourcemap: true, banner: banner },
      {
        file: "dist/heading.min.js",
        format: "esm",
        sourcemap: true,
        banner: banner,
        plugins: [terser({ mangle: true, compress: { directives: false } })],
      },
    ],
    external: [/^@m3e\//, "lit", "@lit/react", "react"],
    plugins: [resolve(), typescript()],
  },
  {
    input: "src/icon/index.ts",
    output: [
      { file: "dist/icon.js", format: "esm", sourcemap: true, banner: banner },
      {
        file: "dist/icon.min.js",
        format: "esm",
        sourcemap: true,
        banner: banner,
        plugins: [terser({ mangle: true, compress: { directives: false } })],
      },
    ],
    external: [/^@m3e\//, "lit", "@lit/react", "react"],
    plugins: [resolve(), typescript()],
  },
  {
    input: "src/icon-button/index.ts",
    output: [
      { file: "dist/icon-button.js", format: "esm", sourcemap: true, banner: banner },
      {
        file: "dist/icon-button.min.js",
        format: "esm",
        sourcemap: true,
        banner: banner,
        plugins: [terser({ mangle: true, compress: { directives: false } })],
      },
    ],
    external: [/^@m3e\//, "lit", "@lit/react", "react"],
    plugins: [resolve(), typescript()],
  },
  {
    input: "src/list/index.ts",
    output: [
      { file: "dist/list.js", format: "esm", sourcemap: true, banner: banner },
      {
        file: "dist/list.min.js",
        format: "esm",
        sourcemap: true,
        banner: banner,
        plugins: [terser({ mangle: true, compress: { directives: false } })],
      },
    ],
    external: [/^@m3e\//, "lit", "@lit/react", "react"],
    plugins: [resolve(), typescript()],
  },
  {
    input: "src/loading-indicator/index.ts",
    output: [
      { file: "dist/loading-indicator.js", format: "esm", sourcemap: true, banner: banner },
      {
        file: "dist/loading-indicator.min.js",
        format: "esm",
        sourcemap: true,
        banner: banner,
        plugins: [terser({ mangle: true, compress: { directives: false } })],
      },
    ],
    external: [/^@m3e\//, "lit", "@lit/react", "react"],
    plugins: [resolve(), typescript()],
  },
  {
    input: "src/menu/index.ts",
    output: [
      { file: "dist/menu.js", format: "esm", sourcemap: true, banner: banner },
      {
        file: "dist/menu.min.js",
        format: "esm",
        sourcemap: true,
        banner: banner,
        plugins: [terser({ mangle: true, compress: { directives: false } })],
      },
    ],
    external: [/^@m3e\//, "lit", "@lit/react", "react"],
    plugins: [resolve(), typescript()],
  },
  {
    input: "src/nav-bar/index.ts",
    output: [
      { file: "dist/nav-bar.js", format: "esm", sourcemap: true, banner: banner },
      {
        file: "dist/nav-bar.min.js",
        format: "esm",
        sourcemap: true,
        banner: banner,
        plugins: [terser({ mangle: true, compress: { directives: false } })],
      },
    ],
    external: [/^@m3e\//, "lit", "@lit/react", "react"],
    plugins: [resolve(), typescript()],
  },
  {
    input: "src/nav-menu/index.ts",
    output: [
      { file: "dist/nav-menu.js", format: "esm", sourcemap: true, banner: banner },
      {
        file: "dist/nav-menu.min.js",
        format: "esm",
        sourcemap: true,
        banner: banner,
        plugins: [terser({ mangle: true, compress: { directives: false } })],
      },
    ],
    external: [/^@m3e\//, "lit", "@lit/react", "react"],
    plugins: [resolve(), typescript()],
  },
  {
    input: "src/nav-rail/index.ts",
    output: [
      { file: "dist/nav-rail.js", format: "esm", sourcemap: true, banner: banner },
      {
        file: "dist/nav-rail.min.js",
        format: "esm",
        sourcemap: true,
        banner: banner,
        plugins: [terser({ mangle: true, compress: { directives: false } })],
      },
    ],
    external: [/^@m3e\//, "lit", "@lit/react", "react"],
    plugins: [resolve(), typescript()],
  },
  {
    input: "src/option/index.ts",
    output: [
      { file: "dist/option.js", format: "esm", sourcemap: true, banner: banner },
      {
        file: "dist/option.min.js",
        format: "esm",
        sourcemap: true,
        banner: banner,
        plugins: [terser({ mangle: true, compress: { directives: false } })],
      },
    ],
    external: [/^@m3e\//, "lit", "@lit/react", "react"],
    plugins: [resolve(), typescript()],
  },
  {
    input: "src/paginator/index.ts",
    output: [
      { file: "dist/paginator.js", format: "esm", sourcemap: true, banner: banner },
      {
        file: "dist/paginator.min.js",
        format: "esm",
        sourcemap: true,
        banner: banner,
        plugins: [terser({ mangle: true, compress: { directives: false } })],
      },
    ],
    external: [/^@m3e\//, "lit", "@lit/react", "react"],
    plugins: [resolve(), typescript()],
  },
  {
    input: "src/progress-indicator/index.ts",
    output: [
      { file: "dist/progress-indicator.js", format: "esm", sourcemap: true, banner: banner },
      {
        file: "dist/progress-indicator.min.js",
        format: "esm",
        sourcemap: true,
        banner: banner,
        plugins: [terser({ mangle: true, compress: { directives: false } })],
      },
    ],
    external: [/^@m3e\//, "lit", "@lit/react", "react"],
    plugins: [resolve(), typescript()],
  },
  {
    input: "src/radio-group/index.ts",
    output: [
      { file: "dist/radio-group.js", format: "esm", sourcemap: true, banner: banner },
      {
        file: "dist/radio-group.min.js",
        format: "esm",
        sourcemap: true,
        banner: banner,
        plugins: [terser({ mangle: true, compress: { directives: false } })],
      },
    ],
    external: [/^@m3e\//, "lit", "@lit/react", "react"],
    plugins: [resolve(), typescript()],
  },
  {
    input: "src/segmented-button/index.ts",
    output: [
      { file: "dist/segmented-button.js", format: "esm", sourcemap: true, banner: banner },
      {
        file: "dist/segmented-button.min.js",
        format: "esm",
        sourcemap: true,
        banner: banner,
        plugins: [terser({ mangle: true, compress: { directives: false } })],
      },
    ],
    external: [/^@m3e\//, "lit", "@lit/react", "react"],
    plugins: [resolve(), typescript()],
  },
  {
    input: "src/select/index.ts",
    output: [
      { file: "dist/select.js", format: "esm", sourcemap: true, banner: banner },
      {
        file: "dist/select.min.js",
        format: "esm",
        sourcemap: true,
        banner: banner,
        plugins: [terser({ mangle: true, compress: { directives: false } })],
      },
    ],
    external: [/^@m3e\//, "lit", "@lit/react", "react"],
    plugins: [resolve(), typescript()],
  },
  {
    input: "src/shape/index.ts",
    output: [
      { file: "dist/shape.js", format: "esm", sourcemap: true, banner: banner },
      {
        file: "dist/shape.min.js",
        format: "esm",
        sourcemap: true,
        banner: banner,
        plugins: [terser({ mangle: true, compress: { directives: false } })],
      },
    ],
    external: [/^@m3e\//, "lit", "@lit/react", "react"],
    plugins: [resolve(), typescript()],
  },
  {
    input: "src/slide-group/index.ts",
    output: [
      { file: "dist/slide-group.js", format: "esm", sourcemap: true, banner: banner },
      {
        file: "dist/slide-group.min.js",
        format: "esm",
        sourcemap: true,
        banner: banner,
        plugins: [terser({ mangle: true, compress: { directives: false } })],
      },
    ],
    external: [/^@m3e\//, "lit", "@lit/react", "react"],
    plugins: [resolve(), typescript()],
  },
  {
    input: "src/slider/index.ts",
    output: [
      { file: "dist/slider.js", format: "esm", sourcemap: true, banner: banner },
      {
        file: "dist/slider.min.js",
        format: "esm",
        sourcemap: true,
        banner: banner,
        plugins: [terser({ mangle: true, compress: { directives: false } })],
      },
    ],
    external: [/^@m3e\//, "lit", "@lit/react", "react"],
    plugins: [resolve(), typescript()],
  },
  {
    input: "src/snackbar/index.ts",
    output: [
      { file: "dist/snackbar.js", format: "esm", sourcemap: true, banner: banner },
      {
        file: "dist/snackbar.min.js",
        format: "esm",
        sourcemap: true,
        banner: banner,
        plugins: [terser({ mangle: true, compress: { directives: false } })],
      },
    ],
    external: [/^@m3e\//, "lit", "@lit/react", "react"],
    plugins: [resolve(), typescript()],
  },
  {
    input: "src/split-button/index.ts",
    output: [
      { file: "dist/split-button.js", format: "esm", sourcemap: true, banner: banner },
      {
        file: "dist/split-button.min.js",
        format: "esm",
        sourcemap: true,
        banner: banner,
        plugins: [terser({ mangle: true, compress: { directives: false } })],
      },
    ],
    external: [/^@m3e\//, "lit", "@lit/react", "react"],
    plugins: [resolve(), typescript()],
  },
  {
    input: "src/stepper/index.ts",
    output: [
      { file: "dist/stepper.js", format: "esm", sourcemap: true, banner: banner },
      {
        file: "dist/stepper.min.js",
        format: "esm",
        sourcemap: true,
        banner: banner,
        plugins: [terser({ mangle: true, compress: { directives: false } })],
      },
    ],
    external: [/^@m3e\//, "lit", "@lit/react", "react"],
    plugins: [resolve(), typescript()],
  },
  {
    input: "src/switch/index.ts",
    output: [
      { file: "dist/switch.js", format: "esm", sourcemap: true, banner: banner },
      {
        file: "dist/switch.min.js",
        format: "esm",
        sourcemap: true,
        banner: banner,
        plugins: [terser({ mangle: true, compress: { directives: false } })],
      },
    ],
    external: [/^@m3e\//, "lit", "@lit/react", "react"],
    plugins: [resolve(), typescript()],
  },
  {
    input: "src/tabs/index.ts",
    output: [
      { file: "dist/tabs.js", format: "esm", sourcemap: true, banner: banner },
      {
        file: "dist/tabs.min.js",
        format: "esm",
        sourcemap: true,
        banner: banner,
        plugins: [terser({ mangle: true, compress: { directives: false } })],
      },
    ],
    external: [/^@m3e\//, "lit", "@lit/react", "react"],
    plugins: [resolve(), typescript()],
  },
  {
    input: "src/textarea-autosize/index.ts",
    output: [
      { file: "dist/textarea-autosize.js", format: "esm", sourcemap: true, banner: banner },
      {
        file: "dist/textarea-autosize.min.js",
        format: "esm",
        sourcemap: true,
        banner: banner,
        plugins: [terser({ mangle: true, compress: { directives: false } })],
      },
    ],
    external: [/^@m3e\//, "lit", "@lit/react", "react"],
    plugins: [resolve(), typescript()],
  },
  {
    input: "src/theme/index.ts",
    output: [
      { file: "dist/theme.js", format: "esm", sourcemap: true, banner: banner },
      {
        file: "dist/theme.min.js",
        format: "esm",
        sourcemap: true,
        banner: banner,
        plugins: [terser({ mangle: true, compress: { directives: false } })],
      },
    ],
    external: [/^@m3e\//, "lit", "@lit/react", "react"],
    plugins: [resolve(), typescript()],
  },
  {
    input: "src/toc/index.ts",
    output: [
      { file: "dist/toc.js", format: "esm", sourcemap: true, banner: banner },
      {
        file: "dist/toc.min.js",
        format: "esm",
        sourcemap: true,
        banner: banner,
        plugins: [terser({ mangle: true, compress: { directives: false } })],
      },
    ],
    external: [/^@m3e\//, "lit", "@lit/react", "react"],
    plugins: [resolve(), typescript()],
  },
  {
    input: "src/toolbar/index.ts",
    output: [
      { file: "dist/toolbar.js", format: "esm", sourcemap: true, banner: banner },
      {
        file: "dist/toolbar.min.js",
        format: "esm",
        sourcemap: true,
        banner: banner,
        plugins: [terser({ mangle: true, compress: { directives: false } })],
      },
    ],
    external: [/^@m3e\//, "lit", "@lit/react", "react"],
    plugins: [resolve(), typescript()],
  },
  {
    input: "src/tooltip/index.ts",
    output: [
      { file: "dist/tooltip.js", format: "esm", sourcemap: true, banner: banner },
      {
        file: "dist/tooltip.min.js",
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
