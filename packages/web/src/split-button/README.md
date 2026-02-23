# @m3e/web/split-button

The `m3e-split-button` component presents a primary action alongside a menu of related actions, uniting two buttons in a single expressive surface. Designed for Material 3, it supports `elevated`, `filled`, `tonal`, and `outlined` variants, and adapts to all button sizes. The leading button triggers the main action, while the trailing icon button reveals additional options, enabling efficient workflows and clear visual hierarchy. The split button ensures accessible, adaptive, and visually harmonious interactions, reflecting Material 3’s principles of clarity, flexibility, and expressive design.

```ts
import "@m3e/web/split-button";
```

## 🗂️ Elements

- `m3e-split-button` — Combines a primary action and a menu of related actions in a single expressive surface.

## 🧪 Examples

The following example illustrates use of the `m3e-split-button` to combine the `m3e-button`, `m3e-icon-button`, and `m3e-menu` components into a split button.

```html
<m3e-split-button>
  <m3e-button slot="leading-button"> <m3e-icon slot="icon" name="edit"></m3e-icon>Edit </m3e-button>
  <m3e-icon-button slot="trailing-button">
    <m3e-icon name="keyboard_arrow_down"></m3e-icon>
    <m3e-menu-trigger for="menu1"></m3e-menu-trigger>
  </m3e-icon-button>
</m3e-split-button>
```

## 📖 API Reference

This section details the attributes, slots, and CSS custom properties available for the `m3e-split-button` component.

### ⚙️ Attributes

| Attribute | Type                                                               | Default    | Description                                 |
| --------- | ------------------------------------------------------------------ | ---------- | ------------------------------------------- |
| `variant` | `"elevated" \| "filled" \| "tonal" \| "outlined"`                  | `"filled"` | The appearance variant of the split button. |
| `size`    | `"extra-small" \| "small" \| "medium" \| "large" \| "extra-large"` | `"small"`  | The size of the split button.               |

### 🧩 Slots

| Slot              | Description                                       |
| ----------------- | ------------------------------------------------- |
| `leading-button`  | The leading button for the primary action.        |
| `trailing-button` | The trailing icon button for the menu of actions. |

### 🎛️ CSS Custom Properties

| Property                                                                   | Description                                                       |
| -------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `--m3e-split-button-extra-small-trailing-button-unselected-leading-space`  | Leading space for the trailing button (extra-small, unselected).  |
| `--m3e-split-button-extra-small-trailing-button-unselected-trailing-space` | Trailing space for the trailing button (extra-small, unselected). |
| `--m3e-split-button-small-trailing-button-unselected-leading-space`        | Leading space for the trailing button (small, unselected).        |
| `--m3e-split-button-small-trailing-button-unselected-trailing-space`       | Trailing space for the trailing button (small, unselected).       |
| `--m3e-split-button-medium-trailing-button-unselected-leading-space`       | Leading space for the trailing button (medium, unselected).       |
| `--m3e-split-button-medium-trailing-button-unselected-trailing-space`      | Trailing space for the trailing button (medium, unselected).      |
| `--m3e-split-button-large-trailing-button-unselected-leading-space`        | Leading space for the trailing button (large, unselected).        |
| `--m3e-split-button-large-trailing-button-unselected-trailing-space`       | Trailing space for the trailing button (large, unselected).       |
| `--m3e-split-button-extra-large-trailing-button-unselected-leading-space`  | Leading space for the trailing button (extra-large, unselected).  |
| `--m3e-split-button-extra-large-trailing-button-unselected-trailing-space` | Trailing space for the trailing button (extra-large, unselected). |
| `--m3e-split-button-extra-small-trailing-button-selected-leading-space`    | Leading space for the trailing button (extra-small, selected).    |
| `--m3e-split-button-extra-small-trailing-button-selected-trailing-space`   | Trailing space for the trailing button (extra-small, selected).   |
| `--m3e-split-button-small-trailing-button-selected-leading-space`          | Leading space for the trailing button (small, selected).          |
| `--m3e-split-button-small-trailing-button-selected-trailing-space`         | Trailing space for the trailing button (small, selected).         |
| `--m3e-split-button-medium-trailing-button-selected-leading-space`         | Leading space for the trailing button (medium, selected).         |
| `--m3e-split-button-medium-trailing-button-selected-trailing-space`        | Trailing space for the trailing button (medium, selected).        |
| `--m3e-split-button-large-trailing-button-selected-leading-space`          | Leading space for the trailing button (large, selected).          |
| `--m3e-split-button-large-trailing-button-selected-trailing-space`         | Trailing space for the trailing button (large, selected).         |
| `--m3e-split-button-extra-large-trailing-button-selected-leading-space`    | Leading space for the trailing button (extra-large, selected).    |
| `--m3e-split-button-extra-large-trailing-button-selected-trailing-space`   | Trailing space for the trailing button (extra-large, selected).   |
| `--m3e-split-button-extra-small-inner-corner-size`                         | Inner corner size for the leading/trailing button (extra-small).  |
| `--m3e-split-button-small-inner-corner-size`                               | Inner corner size for the leading/trailing button (small).        |
| `--m3e-split-button-medium-inner-corner-size`                              | Inner corner size for the leading/trailing button (medium).       |
| `--m3e-split-button-large-inner-corner-size`                               | Inner corner size for the leading/trailing button (large).        |
| `--m3e-split-button-extra-large-inner-corner-size`                         | Inner corner size for the leading/trailing button (extra-large).  |
| `--m3e-split-button-extra-small-inner-corner-hover-size`                   | Inner corner size on hover (extra-small).                         |
| `--m3e-split-button-small-inner-corner-hover-size`                         | Inner corner size on hover (small).                               |
| `--m3e-split-button-medium-inner-corner-hover-size`                        | Inner corner size on hover (medium).                              |
| `--m3e-split-button-large-inner-corner-hover-size`                         | Inner corner size on hover (large).                               |
| `--m3e-split-button-extra-large-inner-corner-hover-size`                   | Inner corner size on hover (extra-large).                         |
| `--m3e-split-button-extra-small-inner-corner-pressed-size`                 | Inner corner size on press (extra-small).                         |
| `--m3e-split-button-small-inner-corner-pressed-size`                       | Inner corner size on press (small).                               |
| `--m3e-split-button-medium-inner-corner-pressed-size`                      | Inner corner size on press (medium).                              |
| `--m3e-split-button-large-inner-corner-pressed-size`                       | Inner corner size on press (large).                               |
| `--m3e-split-button-extra-large-inner-corner-pressed-size`                 | Inner corner size on press (extra-large).                         |
| `--m3e-split-button-extra-small-between-spacing`                           | Spacing between leading and trailing buttons (extra-small).       |
| `--m3e-split-button-small-between-spacing`                                 | Spacing between leading and trailing buttons (small).             |
| `--m3e-split-button-medium-between-spacing`                                | Spacing between leading and trailing buttons (medium).            |
| `--m3e-split-button-large-between-spacing`                                 | Spacing between leading and trailing buttons (large).             |
| `--m3e-split-button-extra-large-between-spacing`                           | Spacing between leading and trailing buttons (extra-large).       |
