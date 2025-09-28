# @m3e/toolbar

The `m3e-toolbar` component presents contextual actions, navigation, and controls. Designed according to Material 3 principles, it supports vertical and horizontal orientation, shape and variant customization, and adaptive layout via CSS custom properties.

> **Part of the [Material 3 Expressive (M3E)](../../README.md) monorepo**  
> This package is maintained within the unified M3E repository, which provides a suite of Material 3 web components.

## 📦 Installation

```bash
npm install @m3e/toolbar
```

## 🗂️ Elements

- `m3e-toolbar` — A Material 3 Expressive toolbar for contextual actions and navigation.

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

| Slot Name   | Description                         |
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
