# @m3e/loading-indicator

The `m3e-loading-indicator` component uses animation to grab attention, mitigate perceived latency, and indicate that an activity is in progress. Use the `variant` attribute to switch between `uncontained` (default) and `contained` appearances for contrast and context.

> **This package is part of [M3E](https://github.com/matraic/m3e) monorepo**, a unified suite of Material 3 web components. [Explore the docs](https://matraic.github.io/m3e) to see them in action.

## 📦 Installation

```bash
npm install @m3e/loading-indicator
```

## 💻 Editor Integration

This package includes a [Custom Elements Manifest](https://github.com/webcomponents/custom-elements-manifest) to support enhanced editor tooling and developer experience.

### Visual Studio Code

To enable autocomplete and hover documentation for `@m3e/loading-indicator`, install the [Custom Elements Manifest Language Server](https://marketplace.visualstudio.com/items?itemName=pwrs.cem-language-server-vscode) extension. It will automatically detect the manifest bundled with this package and surface tag names, attributes, slots, and events in supported files.

Alternately, you can explicitly reference the `html-custom-data.json` and `css-custom-data.json` in your workspace settings:

```json
{
  "html.customData": ["./node_modules/@m3e/loading-indicator/dist/html-custom-data.json"],
  "css.customData": ["./node_modules/@m3e/loading-indicator/dist/css-custom-data.json"]
}
```

## 🚀 Native Module Support

This package uses [JavaScript Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#module_specifiers). To use it directly in a browser without a bundler, use a module script similar to the following.

```html
<script type="module" src="/node_modules/@m3e/loading-indicator/dist/index.js"></script>
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

- `m3e-loading-indicator` — Shows indeterminate progress for a short wait time.

## 🧪 Examples

The following example illustrates an uncontained loading indicator.

```html
<m3e-loading-indicator></m3e-loading-indicator>
```

## 📖 API Reference

This section details the attributes and CSS custom properties available for the `m3e-loading-indicator` component.

### ⚙️ Attributes

| Attribute | Type                           | Default         | Description                              |
| --------- | ------------------------------ | --------------- | ---------------------------------------- |
| `variant` | `"uncontained" \| "contained"` | `"uncontained"` | The appearance variant of the indicator. |

### 🎛️ CSS Custom Properties

| Property                                                   | Description                             |
| ---------------------------------------------------------- | --------------------------------------- |
| `--m3e-loading-indicator-active-indicator-color`           | Uncontained active indicator color.     |
| `--m3e-loading-indicator-contained-active-indicator-color` | Contained active indicator color.       |
| `--m3e-loading-indicator-contained-container-color`        | Contained container (background) color. |
| `--m3e-loading-indicator-active-indicator-size`            | Size of the active indicator.           |
| `--m3e-loading-indicator-container-shape`                  | Container shape.                        |
| `--m3e-loading-indicator-container-size`                   | Container size.                         |

## 🤝 Contributing

See the root monorepo `CONTRIBUTING.md` for guidelines on contributing to this package.

## 📄 License

This package is licensed under the MIT License.
