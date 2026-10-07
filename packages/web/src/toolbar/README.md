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

#### Toolbar and shape properties

| Property                              | Description                                |
| ------------------------------------- | ------------------------------------------ |
| `--m3e-toolbar-size`                  | The size (height or width) of the toolbar. |
| `--m3e-toolbar-spacing`               | The gap between toolbar items.             |
| `--m3e-toolbar-rounded-shape`         | Border radius for rounded shape.           |
| `--m3e-toolbar-rounded-leading-space` | Leading space for rounded shape.           |
| `--m3e-toolbar-rounded-trailing-space`| Trailing space for rounded shape.          |
| `--m3e-toolbar-rounded-top-space`     | Top space for rounded shape.               |
| `--m3e-toolbar-rounded-bottom-space`  | Bottom space for rounded shape.            |
| `--m3e-toolbar-square-shape`          | Border radius for square shape.            |
| `--m3e-toolbar-square-leading-space`  | Leading space for square shape.            |
| `--m3e-toolbar-square-trailing-space` | Trailing space for square shape.           |
| `--m3e-toolbar-square-top-space`      | Top space for square shape.                |
| `--m3e-toolbar-square-bottom-space`   | Bottom space for square shape.             |

#### Shared variant fallback properties

These properties provide values shared by both variants. A variant-specific property overrides its corresponding shared property.

| Property                                         | Description                                     |
| ------------------------------------------------ | ----------------------------------------------- |
| `--m3e-toolbar-container-color`                 | Toolbar container background color.             |
| `--m3e-toolbar-button-container-color`           | Button container background color.              |
| `--m3e-toolbar-selected-button-container-color`  | Selected button container background color.     |
| `--m3e-toolbar-icon-color`                      | Icon color.                                     |
| `--m3e-toolbar-selected-icon-color`             | Selected icon color.                            |
| `--m3e-toolbar-label-color`                     | Label color.                                    |
| `--m3e-toolbar-selected-label-color`            | Selected label color.                           |
| `--m3e-toolbar-disabled-icon-color`             | Icon color when disabled.                       |
| `--m3e-toolbar-disabled-icon-opacity`           | Icon opacity when disabled.                     |
| `--m3e-toolbar-disabled-label-color`            | Label color when disabled.                      |
| `--m3e-toolbar-label-icon-opacity`              | Label opacity when disabled.                    |
| `--m3e-toolbar-[state]-state-layer-color`       | State layer color for `hover`, `focus`, `pressed`. |
| `--m3e-toolbar-[state]-selected-state-layer-color` | Selected state layer color for `hover`, `focus`, `pressed`. |
| `--m3e-toolbar-[state]-state-layer-opacity`     | State layer opacity for `hover`, `focus`, `pressed`. |
| `--m3e-toolbar-[state]-icon-color`              | Icon color for `hover`, `focus`, `pressed`.      |
| `--m3e-toolbar-[state]-selected-icon-color`     | Selected icon color for `hover`, `focus`, `pressed`. |
| `--m3e-toolbar-[state]-label-color`             | Label color for `hover`, `focus`, `pressed`.     |
| `--m3e-toolbar-[state]-selected-label-color`    | Selected label color for `hover`, `focus`, `pressed`. |

#### Variant properties

Replace `[variant]` with `standard` or `vibrant`, and `[state]` with `hover`, `focus`, or `pressed`. Variant-specific values take precedence over the corresponding shared properties above.

| Property                                                     | Description                                        |
| ------------------------------------------------------------ | -------------------------------------------------- |
| `--m3e-toolbar-[variant]-container-color`                    | Toolbar container background color.                |
| `--m3e-toolbar-[variant]-button-container-color`            | Button container background color.                 |
| `--m3e-toolbar-[variant]-selected-button-container-color`   | Selected button container background color.        |
| `--m3e-toolbar-[variant]-icon-color`                         | Icon color.                                        |
| `--m3e-toolbar-[variant]-selected-icon-color`                | Selected icon color.                               |
| `--m3e-toolbar-[variant]-label-color`                        | Label color.                                       |
| `--m3e-toolbar-[variant]-selected-label-color`               | Selected label color.                              |
| `--m3e-toolbar-[variant]-disabled-icon-color`                | Icon color when disabled.                          |
| `--m3e-toolbar-[variant]-disabled-icon-opacity`              | Icon opacity when disabled.                        |
| `--m3e-toolbar-[variant]-disabled-label-color`               | Label color when disabled.                         |
| `--m3e-toolbar-[variant]-disabled-label-opacity`             | Label opacity when disabled.                       |
| `--m3e-toolbar-[variant]-[state]-state-layer-color`          | State layer color.                                 |
| `--m3e-toolbar-[variant]-[state]-selected-state-layer-color` | Selected state layer color.                        |
| `--m3e-toolbar-[variant]-[state]-state-layer-opacity`        | State layer opacity.                               |
| `--m3e-toolbar-[variant]-[state]-icon-color`                 | Icon color.                                        |
| `--m3e-toolbar-[variant]-[state]-selected-icon-color`        | Selected icon color.                               |
| `--m3e-toolbar-[variant]-[state]-label-color`                | Label color.                                       |
| `--m3e-toolbar-[variant]-[state]-selected-label-color`       | Selected label color.                              |
