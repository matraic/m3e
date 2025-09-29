# @m3e/divider

The `m3e-divider` component visually separates content within layouts, lists, or containers using a thin, unobtrusive line. It supports horizontal and vertical orientation, with optional inset variants to align with layout padding and visual hierarchy. The divider thickness, color, and inset behavior are customizable via CSS properties to maintain consistency across surfaces. It is designed to reinforce spatial relationships without drawing attention, preserving focus on primary content.

> **Part of the [Material 3 Expressive (M3E)](../../README.md) monorepo**  
> This package is maintained within the unified M3E repository, which provides a suite of Material 3 web components.

## 📦 Installation

```bash
npm install @m3e/divider
```

## 🚀 Browser Usage

This package uses [JavaScript Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#module_specifiers). To use it directly in a browser without a bundler, use a module script similar to the following.

```html
<script type="module" src="/node_modules/@m3e/divider/dist/index.js"></script>
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

- `m3e-divider` — A thin line that separates content in lists or other containers.

## 🧪 Examples

The following example illustrates a basic horizontal divider.

```html
<m3e-divider></m3e-divider>
```

## 📖 API Reference

This section details the attributes and CSS custom properties available for the `m3e-divider` component.

### ⚙️ Attributes

| Attribute     | Type      | Default | Description                                                        |
| ------------- | --------- | ------- | ------------------------------------------------------------------ |
| `inset`       | `boolean` | `false` | Whether the divider is indented with equal padding on both sides.  |
| `inset-start` | `boolean` | `false` | Whether the divider is indented with padding on the leading side.  |
| `inset-end`   | `boolean` | `false` | Whether the divider is indented with padding on the trailing side. |
| `vertical`    | `boolean` | `false` | Whether the divider is vertically aligned with adjacent content.   |

### 🎛️ CSS Custom Properties

| Property                         | Description                                                          |
| -------------------------------- | -------------------------------------------------------------------- |
| `--m3e-divider-thickness`        | Thickness of the divider line.                                       |
| `--m3e-divider-color`            | Color of the divider line.                                           |
| `--m3e-divider-inset-size`       | Fallback inset size when no specific start or end inset is provided. |
| `--m3e-divider-inset-start-size` | Leading inset size.                                                  |
| `--m3e-divider-inset-end-size`   | Trailing inset size.                                                 |

## 🤝 Contributing

See the root monorepo `CONTRIBUTING.md` for guidelines on contributing to this package.

## 📄 License

This package is licensed under the MIT License.
