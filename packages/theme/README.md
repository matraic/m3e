# @m3e/theme

The `m3e-theme` component is a non-visual element used to apply dynamic color, expressive motion, density, and strong focus indicators to nested, theme-aware elements.

When `m3e-theme` is nested directly beneath the `<body>` of a document, the `<body>`'s `background-color` is set to the computed value of `--md-sys-color-background` and `color` is set to the computed value of `--md-sys-color-on-background`. In addition the document's `scrollbar-color` is set to the computed values of `--m3e-scrollbar-thumb-color` and `--m3e-scrollbar-track-color` which, when supported, cascades to all viewport scrollbars.

> **This package is part of [M3E](https://github.com/matraic/m3e) monorepo**, a unified suite of Material 3 web components. [Explore the docs](https://matraic.github.io/m3e) to see them in action.

## 📦 Installation

```bash
npm install @m3e/theme
```

## 💻 Editor Integration

This package includes a [Custom Elements Manifest](https://github.com/webcomponents/custom-elements-manifest) to support enhanced editor tooling and developer experience.

### Visual Studio Code

To enable autocomplete and hover documentation for `@m3e/theme`, install the [Custom Elements Manifest Language Server](https://marketplace.visualstudio.com/items?itemName=pwrs.cem-language-server-vscode) extension. It will automatically detect the manifest bundled with this package and surface tag names, attributes, slots, and events in supported files.

Alternately, you can explicitly reference the `html-custom-data.json` and `css-custom-data.json` in your workspace settings:

```json
{
  "html.customData": ["./node_modules/@m3e/theme/dist/html-custom-data.json"],
  "css.customData": ["./node_modules/@m3e/theme/dist/css-custom-data.json"]
}
```

## 🚀 Native Module Support

This package uses [JavaScript Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#module_specifiers). To use it directly in a browser without a bundler, use a module script similar to the following.

```html
<script type="module" src="/node_modules/@m3e/theme/dist/index.js"></script>
```

In addition, you must use an [import map](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script/type/importmap) to include dependencies.

```html
<script type="importmap">
  {
    "imports": {
      "lit": "https://cdn.jsdelivr.net/npm/lit@3.3.0/+esm",
      "@m3e/core": "/node_modules/@m3e/core/dist/index.js"
    }
  }
</script>
```

> For production, use index.min.js for faster load times.

## 🗂️ Elements

- `m3e-theme` — A non-visual element responsible for application-level theming.

## 🧪 Examples

The following example adds a top-level `m3e-theme` directly beneath a document's `<body>` element to apply application-level theming. In this example, `color` and `scheme` are used to create a dynamic color palette which automatically adjusts to a user's light or dark color preference. In addition, expressive motion and strong focus indicators are enabled.

```html
<body>
  <m3e-theme color="#7D67BE" scheme="auto" motion="expressive" strong-focus>
    <!-- App content here -->
  </m3e-theme>
</body>
```

## 📖 API Reference

### ⚙️ Attributes

| Attribute      | Type                                                                                                                              | Default      | Description                                                |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------------ | ---------------------------------------------------------- |
| `color`        | `string`                                                                                                                          | `"#7D67BE"`  | The hex color from which to derive dynamic color palettes. |
| `variant`      | `"monochrome" \| "neutral" \| "tonal-spot" \| "vibrant" \| "expressive" \| "fidelity" \| "rainbow" \| "fruit-salad" \| "content"` | `"vibrant"`  | The color variant of the theme.                            |
| `scheme`       | `"auto" \| "light" \| "dark"`                                                                                                     | `"auto"`     | The color scheme of the theme.                             |
| `contrast`     | `"standard" \| "medium" \| "high"`                                                                                                | `"standard"` | The contrast level of the theme.                           |
| `strong-focus` | `boolean`                                                                                                                         | `false`      | Whether to enable strong focus indicators.                 |
| `density`      | `number`                                                                                                                          | `0`          | The density scale (0, -1, -2).                             |
| `motion`       | `"standard" \| "expressive"`                                                                                                      | `"standard"` | The motion scheme.                                         |

## 🤝 Contributing

See the root monorepo `CONTRIBUTING.md` for guidelines on contributing to this package.

## 📄 License

This package is licensed under the MIT License.
