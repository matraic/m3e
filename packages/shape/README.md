# @m3e/shape

The `m3e-shape` component allows you to use abstract shapes thoughtfully to add emphasis and decorative flair, including built-in shape morphing.

All shapes are sourced from the Material Shape library: `4-leaf-clover`, `4-sided-cookie`, `6-sided-cookie`, `7-sided-cookie`, `8-leaf-clover`, `9-sided-cookie`, `12-sided-cookie`, `arch`, `arrow`, `boom`, `bun`, `burst`, `circle`, `diamond`, `fan`, `flower`, `gem`, `ghost-ish`, `heart`, `hexagon`, `oval`, `pentagon`, `pill`, `pixel-circle`, `pixel-triangle`, `puffy`, `puffy-diamond`, `semicircle`, `slanted`, `soft-boom`, `soft-burst`, `square`, `sunny`, `triangle`, and `very-sunny`.

Refer to the Material Shape library for visual references and details.

> **This package is part of [M3E](https://github.com/matraic/m3e) monorepo**, a unified suite of Material 3 web components. [Explore the docs](https://matraic.github.io/m3e) to see them in action.

## 📦 Installation

```bash
npm install @m3e/shape
```

## 💻 Editor Integration

This package includes a [Custom Elements Manifest](https://github.com/webcomponents/custom-elements-manifest) to support enhanced editor tooling and developer experience.

### Visual Studio Code

To enable autocomplete and hover documentation for `@m3e/shape`, install the [Custom Elements Manifest Language Server](https://marketplace.visualstudio.com/items?itemName=pwrs.cem-language-server-vscode) extension. It will automatically detect the manifest bundled with this package and surface tag names, attributes, slots, and events in supported files.

Alternately, you can explicitly reference the `html-custom-data.json` and `css-custom-data.json` in your workspace settings:

```json
{
  "html.customData": ["./node_modules/@m3e/shape/dist/html-custom-data.json"],
  "css.customData": ["./node_modules/@m3e/shape/dist/css-custom-data.json"]
}
```

## 🚀 Native Module Support

This package uses [JavaScript Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#module_specifiers). To use it directly in a browser without a bundler, use a module script similar to the following.

```html
<script type="module" src="/node_modules/@m3e/shape/dist/index.js"></script>
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

- `m3e-shape` — A shape used to add emphasis and decorative flair.

## 🧪 Examples

The following example illustrates using the `m3e-shape` component to present the `sunny` shape.

```html
<m3e-shape name="sunny"></m3e-shape>
```

## 📖 API Reference

This section details the attributes, slots and CSS custom properties available for the `m3e-shape` component.

### ⚙️ Attributes

| Attribute | Type                | Default | Description            |
| --------- | ------------------- | ------- | ---------------------- |
| `name`    | `ShapeName \| null` | `null`  | The name of the shape. |

### 🧩 Slots

| Slot        | Description                               |
| ----------- | ----------------------------------------- |
| _(default)_ | Renders the clipped content of the shape. |

### 🎛️ CSS Custom Properties

| Property                      | Description                                |
| ----------------------------- | ------------------------------------------ |
| `--m3e-shape-size`            | Default size of the shape.                 |
| `--m3e-shape-container-color` | Container (background) color of the shape. |
| `--m3e-shape-transition`      | Transition used to morph between shapes.   |

## 🤝 Contributing

See the root monorepo `CONTRIBUTING.md` for guidelines on contributing to this package.

## 📄 License

This package is licensed under the MIT License.
