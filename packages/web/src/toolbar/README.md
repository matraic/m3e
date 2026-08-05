# @m3e/web/toolbar

The `m3e-toolbar` component presents contextual actions, navigation, and controls. Designed according to Material 3 principles, it supports vertical and horizontal orientation, shape and variant customization, and adaptive layout via CSS custom properties.

```ts
import "@m3e/web/toolbar";
```

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
| `--m3e-toolbar-rounded-leading-space`    | Leading space for rounded shape.           |
| `--m3e-toolbar-rounded-trailing-space`   | Trailing space for rounded shape.          |
| `--m3e-toolbar-rounded-top-space`        | Top space for rounded shape.               |
| `--m3e-toolbar-rounded-bottom-space`     | Bottom space for rounded shape.            |
| `--m3e-toolbar-square-leading-space`     | Leading space for square shape.            |
| `--m3e-toolbar-square-trailing-space`    | Trailing space for square shape.           |
| `--m3e-toolbar-square-top-space`         | Top space for square shape.                |
| `--m3e-toolbar-square-bottom-space`      | Bottom space for square shape.             |
| `--m3e-toolbar-standard-container-color` | Container color for the standard variant.  |
| `--m3e-toolbar-standard-color`           | Foreground color for the standard variant. |
| `--m3e-toolbar-vibrant-container-color`  | Container color for the vibrant variant.   |
| `--m3e-toolbar-vibrant-color`            | Foreground color for the vibrant variant.  |

Note: The `--m3e-toolbar-rounded-padding` and `--m3e-toolbar-square-padding` properties are deprecated. Use the `-leading-space`, `-trailing-space`, `-top-space`, and `-bottom-space` properties above for fine-grained control.
