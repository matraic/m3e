# @m3e/shape

The `m3e-shape` component allows you to use abstract shapes thoughtfully to add emphasis and decorative flair, including built-in shape morphing.

All shapes are sourced from the Material Shape library: `4-leaf-clover`, `4-sided-cookie`, `6-sided-cookie`, `7-sided-cookie`, `8-leaf-clover`, `9-sided-cookie`, `12-sided-cookie`, `arch`, `arrow`, `boom`, `bun`, `burst`, `circle`, `diamond`, `fan`, `flower`, `gem`, `ghost-ish`, `heart`, `hexagon`, `oval`, `pentagon`, `pill`, `pixel-circle`, `pixel-triangle`, `puffy`, `puffy-diamond`, `semicircle`, `slanted`, `soft-boom`, `soft-burst`, `square`, `sunny`, `triangle`, and `very-sunny`.

Refer to the Material Shape library for visual references and details.

> **Part of the [Material 3 Expressive (M3E)](../../README.md) monorepo**  
> This package is maintained within the unified M3E repository, which provides a suite of Material 3 web components.

## 📦 Installation

```bash
npm install @m3e/shape
```

## 🚀 Browser Usage

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
