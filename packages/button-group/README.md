# @m3e/button-group

The `m3e-button-group` component arranges multiple into a unified, expressive layout, supporting both `standard` and `connected` variants. It enables seamless, accessible grouping of actions, adapts to various sizes, and ensures consistent spacing, shape, and alignment. Designed according to Material 3 principles, it empowers users to interact with related actions in a visually harmonious and intuitive way.

> **Part of the [Material 3 Expressive (M3E)](../../README.md) monorepo**  
> This package is maintained within the unified M3E repository, which provides a suite of Material 3 web components.

## 📦 Installation

```bash
npm install @m3e/button-group
```

## 🚀 Browser Usage

This package uses [JavaScript Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#module_specifiers). To use it directly in a browser without a bundler, use a module script similar to the following.

```html
<script type="module" src="/node_modules/@m3e/button-group/dist/index.js"></script>
```

You also need a module script for `@m3e/button` and `@m3e/icon-button` due to being a dependency.

```html
<script type="module" src="/node_modules/@m3e/button/dist/index.js"></script>
<script type="module" src="/node_modules/@m3e/icon-button/dist/index.js"></script>
```

In addition, you must use an [import map](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script/type/importmap) to include additional dependencies.

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

- `m3e-button-group` — Organizes buttons and adds interactions between them.

## 🧪 Examples

The following example illustrates a standard button group.

```html
<m3e-button-group>
  <m3e-icon-button variant="tonal" toggle><m3e-icon name="format_bold"></m3e-icon></m3e-icon-button>
  <m3e-icon-button variant="tonal" toggle><m3e-icon name="format_italic"></m3e-icon></m3e-icon-button>
  <m3e-icon-button variant="tonal" toggle><m3e-icon name="format_underlined"></m3e-icon></m3e-icon-button>
</m3e-button-group>
```

The next example illustrates a connected button group.

```html
<m3e-button-group variant="connected">
  <m3e-button variant="tonal" shape="square" toggle>Start</m3e-button>
  <m3e-button variant="tonal" shape="square" toggle>Directions</m3e-button>
  <m3e-button variant="tonal" shape="square" toggle>Share</m3e-button>
</m3e-button-group>
```

## 📖 API Reference

This section details the attributes, slots, and CSS custom properties available for the `m3e-button-group` component.

### ⚙️ Attributes

| Attribute | Type                                                               | Default      | Description                                      |
| --------- | ------------------------------------------------------------------ | ------------ | ------------------------------------------------ |
| `multi`   | `boolean`                                                          | `false`      | Whether multiple toggle buttons can be selected. |
| `size`    | `"extra-small" \| "small" \| "medium" \| "large" \| "extra-large"` | `"small"`    | The size of the group.                           |
| `variant` | `"standard" \| "connected"`                                        | `"standard"` | The appearance variant of the group.             |

### 🧩 Slots

| Slot        | Description                       |
| ----------- | --------------------------------- |
| _(default)_ | Renders the buttons of the group. |

### 🎛️ CSS Custom Properties

| Property                                                       | Description                                       |
| -------------------------------------------------------------- | ------------------------------------------------- |
| `--m3e-standard-button-group-extra-small-spacing`              | Spacing between buttons in standard, extra-small. |
| `--m3e-standard-button-group-small-spacing`                    | Spacing between buttons in standard, small.       |
| `--m3e-standard-button-group-medium-spacing`                   | Spacing between buttons in standard, medium.      |
| `--m3e-standard-button-group-large-spacing`                    | Spacing between buttons in standard, large.       |
| `--m3e-standard-button-group-extra-large-spacing`              | Spacing between buttons in standard, extra-large. |
| `--m3e-connected-button-group-spacing`                         | Spacing between buttons in connected variant.     |
| `--m3e-connected-button-group-extra-small-inner-shape`         | Corner shape for connected, extra-small.          |
| `--m3e-connected-button-group-extra-small-inner-pressed-shape` | Pressed corner shape for connected, extra-small.  |
| `--m3e-connected-button-group-small-inner-shape`               | Corner shape for connected, small.                |
| `--m3e-connected-button-group-small-inner-pressed-shape`       | Pressed corner shape for connected, small.        |
| `--m3e-connected-button-group-medium-inner-shape`              | Corner shape for connected, medium.               |
| `--m3e-connected-button-group-medium-inner-pressed-shape`      | Pressed corner shape for connected, medium.       |
| `--m3e-connected-button-group-large-inner-shape`               | Corner shape for connected, large.                |
| `--m3e-connected-button-group-large-inner-pressed-shape`       | Pressed corner shape for connected, large.        |
| `--m3e-connected-button-group-extra-large-inner-shape`         | Corner shape for connected, extra-large.          |
| `--m3e-connected-button-group-extra-large-inner-pressed-shape` | Pressed corner shape for connected, extra-large.  |

## 🤝 Contributing

See the root monorepo `CONTRIBUTING.md` for guidelines on contributing to this package.

## 📄 License

This package is licensed under the MIT License.
