# @m3e/toolbar

The `m3e-toolbar` component presents contextual actions, navigation, and controls. Designed according to Material 3 principles, it supports vertical and horizontal orientation, shape and variant customization, and adaptive layout via CSS custom properties.

> **This package is part of [M3E](https://github.com/matraic/m3e) monorepo**, a unified suite of Material 3 web components. [Explore the docs](https://matraic.github.io/m3e) to see them in action.

## 📦 Installation

```bash
npm install @m3e/toolbar
```

## 💻 Editor Integration

This package includes a [Custom Elements Manifest](https://github.com/webcomponents/custom-elements-manifest) to support enhanced editor tooling and developer experience.

### Visual Studio Code

To enable autocomplete and hover documentation for `@m3e/toolbar`, install the [Custom Elements Manifest Language Server](https://marketplace.visualstudio.com/items?itemName=pwrs.cem-language-server-vscode) extension. It will automatically detect the manifest bundled with this package and surface tag names, attributes, slots, and events in supported files.

Alternately, you can explicitly reference the `html-custom-data.json` and `css-custom-data.json` in your workspace settings:

```json
{
  "html.customData": ["./node_modules/@m3e/toolbar/dist/html-custom-data.json"],
  "css.customData": ["./node_modules/@m3e/toolbar/dist/css-custom-data.json"]
}
```

## 🚀 Browser Usage

This package uses [JavaScript Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#module_specifiers). To use it directly in a browser without a bundler, use a module script similar to the following.

```html
<script type="module" src="/node_modules/@m3e/toolbar/dist/index.js"></script>
```

In addition, you must use an [import map](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script/type/importmap) to include dependencies.

```html
<script type="importmap">
  {
    "imports": {
      "lit": "https://cdn.jsdelivr.net/npm/lit@3.3.0/+esm",
      "@m3e/core": "/node_modules/@m3e/core/dist/index.js",
      "@m3e/core/a11y": "/node_modules/@m3e/core/dist/a11y.js"
    }
  }
</script>
```

> For production, use index.min.js and a11y.min.js for faster load times.

## 🗂️ Elements

- `m3e-toolbar` — Presents frequently used actions relevant to the current page.

## 🧪 Examples

The following example illustrates a vibrant, rounded toolbar containing icon buttons:

```html
<m3e-toolbar variant="vibrant" shape="rounded">
  <m3e-icon-button>
    <m3e-icon name="arrow_back"></m3e-icon>
  </m3e-icon-button>
  <m3e-icon-button>
    <m3e-icon name="arrow_forward"></m3e-icon>
  </m3e-icon-button>
  <m3e-icon-button width="wide" variant="filled">
    <m3e-icon name="add"></m3e-icon>
  </m3e-icon-button>
  <m3e-icon-button>
    <m3e-icon name="picture_in_picture"></m3e-icon>
  </m3e-icon-button>
  <m3e-icon-button>
    <m3e-icon name="more_vert"></m3e-icon>
  </m3e-icon-button>
</m3e-toolbar>
```

## 📖 API Reference

This section details the attributes, slots and CSS custom properties available for the `m3e-toolbar` component.

### ⚙️ Attributes

| Attribute  | Type      | Default      | Description                                 |
| ---------- | --------- | ------------ | ------------------------------------------- |
| `elevated` | `boolean` | `false`      | Whether the toolbar is elevated.            |
| `shape`    | `string`  | `"square"`   | The shape of the toolbar.                   |
| `variant`  | `string`  | `"standard"` | The appearance variant of the toolbar.      |
| `vertical` | `boolean` | `false`      | Whether the element is oriented vertically. |

### 🧩 Slots

| Slot        | Description                         |
| ----------- | ----------------------------------- |
| _(default)_ | Renders the content of the toolbar. |

### 🎛️ CSS Custom Properties

| Property                                 | Description                                |
| ---------------------------------------- | ------------------------------------------ |
| `--m3e-toolbar-size`                     | The size (height or width) of the toolbar. |
| `--m3e-toolbar-spacing`                  | The gap between toolbar items.             |
| `--m3e-toolbar-rounded-shape`            | Border radius for rounded shape.           |
| `--m3e-toolbar-rounded-padding`          | Padding for rounded shape.                 |
| `--m3e-toolbar-square-padding`           | Padding for square shape.                  |
| `--m3e-toolbar-standard-container-color` | Container color for the standard variant.  |
| `--m3e-toolbar-standard-color`           | Foreground color for the standard variant. |
| `--m3e-toolbar-vibrant-container-color`  | Container color for the vibrant variant.   |
| `--m3e-toolbar-vibrant-color`            | Foreground color for the vibrant variant.  |

## 🤝 Contributing

See the root monorepo `CONTRIBUTING.md` for guidelines on contributing to this package.

## 📄 License

This package is licensed under the MIT License.
