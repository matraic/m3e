# @m3e/icon

The `m3e-icon` component makes it easy to use Material Symbols in your application. It supports outlined, rounded, and sharp variants, as well as variable font features like fill, weight, grade, and optical size. For more information, see the [Material Symbol Guide](https://developers.google.com/fonts/docs/material_symbols) and [Material Symbol Library](https://fonts.google.com/icons).

The Material Symbols font is the easiest way to incorporate Material Symbols into your application. Using the [Fonts CSS API](https://developers.google.com/fonts/docs/css2#forming_api_urls), you can use variable fonts to optimize icon
usage within your application. See [Can I Use's Variable Fonts](https://caniuse.com/variable-fonts) to determine whether your user's browser support variable fonts.

> **This package is part of [M3E](https://github.com/matraic/m3e) monorepo**, a unified suite of Material 3 web components. [Explore the docs](https://matraic.github.io/m3e) to see them in action.

## 📦 Installation

```bash
npm install @m3e/icon
```

## 💻 Editor Integration

This package includes a [Custom Elements Manifest](https://github.com/webcomponents/custom-elements-manifest) to support enhanced editor tooling and developer experience.

### Visual Studio Code

To enable autocomplete and hover documentation for `@m3e/icon`, install the [Custom Elements Manifest Language Server](https://marketplace.visualstudio.com/items?itemName=pwrs.cem-language-server-vscode) extension. It will automatically detect the manifest bundled with this package and surface tag names, attributes, slots, and events in supported files.

Alternately, you can explicitly reference the `html-custom-data.json` and `css-custom-data.json` in your workspace settings:

```json
{
  "html.customData": ["./node_modules/@m3e/icon/dist/html-custom-data.json"],
  "css.customData": ["./node_modules/@m3e/icon/dist/css-custom-data.json"]
}
```

## 🚀 Browser Usage

This package uses [JavaScript Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#module_specifiers). To use it directly in a browser without a bundler, use a module script similar to the following.

```html
<script type="module" src="/node_modules/@m3e/icon/dist/index.js"></script>
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

- `m3e-icon` — A small symbol used to easily identify an action or category.

## 🧪 Examples

The following example illustrates showing the `home` icon. The `name` attribute specifies the icon to present.

```html
<m3e-icon name="home"></m3e-icon>
```

The next example illustrates a link used to download a variable font for outlined icons with fill support.

```html
<link
  href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0..1,0"
  rel="stylesheet"
/>
```

## 📖 API Reference

### ⚙️ Attributes

| Attribute      | Type                                 | Default      | Description                                                    |
| -------------- | ------------------------------------ | ------------ | -------------------------------------------------------------- |
| `name`         | `string`                             |              | The name of the icon.                                          |
| `variant`      | `"outlined" \| "rounded" \| "sharp"` | `"outlined"` | The appearance variant of the icon.                            |
| `filled`       | `boolean`                            | `false`      | Whether the icon is filled.                                    |
| `grade`        | `"low" \| "medium" \| "high"`        | `"medium"`   | The grade of the icon.                                         |
| `weight`       | `number`                             | `400`        | A value from 100 to 700 indicating the weight of the icon.     |
| `optical-size` | `number`                             | `24`         | A value from 20 to 48 indicating the optical size of the icon. |

### 🎛️ CSS Custom Properties

| Property          | Description            |
| ----------------- | ---------------------- |
| `--m3e-icon-size` | Font size of the icon. |

## 🤝 Contributing

See the root monorepo `CONTRIBUTING.md` for guidelines on contributing to this package.

## 📄 License

This package is licensed under the MIT License.
