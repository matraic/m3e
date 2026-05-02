# @m3e/web/breadcrumb

The `m3e-breadcrumb` and `m3e-breadcrumb-item` components work together to display a hierarchical navigation trail. Use `m3e-breadcrumb` as a wrapper and place one or more `m3e-breadcrumb-item` elements inside to represent the navigation path.

```ts
import "@m3e/web/breadcrumb";
```

## 🗂️ Elements

- `m3e-breadcrumb` — Displays a hierarchical navigation path and identifies the user's current location within an application.
- `m3e-breadcrumb-item` — An item in a breadcrumb.

## 🧪 Examples

The following example illustrates a simple breadcrumb with three items.

```html
<m3e-breadcrumb>
  <m3e-breadcrumb-item href="/dashboard">Dashboard</m3e-breadcrumb-item>
  <m3e-breadcrumb-item href="/dashboard/reports">Reports</m3e-breadcrumb-item>
  <m3e-breadcrumb-item href="/dashboard/reports/annual">Annual</m3e-breadcrumb-item>
</m3e-breadcrumb>
```

Use a custom separator by assigning content to the `separator` slot.

```html
<m3e-breadcrumb>
  <span slot="separator">/</span>
  <m3e-breadcrumb-item href="/dashboard">Dashboard</m3e-breadcrumb-item>
  <m3e-breadcrumb-item href="/dashboard/reports">Reports</m3e-breadcrumb-item>
  <m3e-breadcrumb-item href="/dashboard/reports/annual">Annual</m3e-breadcrumb-item>
</m3e-breadcrumb>
```

## 📖 API Reference

This section describes the attributes and slots available for the breadcrumb components.

### ⚙️ `m3e-breadcrumb` Attributes

| Attribute | Type      | Default | Description                                           |
| --------- | --------- | ------- | ----------------------------------------------------- |
| `wrap`    | `boolean` | `false` | Whether breadcrumb items should wrap onto a new line. |

### 🧩 `m3e-breadcrumb` Slots

| Slot        | Description                                          |
| ----------- | ---------------------------------------------------- |
| _(default)_ | Renders breadcrumb items.                            |
| `separator` | Renders a custom separator between breadcrumb items. |

### ⚙️ `m3e-breadcrumb-item` Attributes

| Attribute    | Type                                                           | Default     | Description                                                                                                |
| ------------ | -------------------------------------------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------- |
| `item-label` | `string`                                                       | `""`        | The accessible label used by the internal breadcrumb button.                                               |
| `disabled`   | `boolean`                                                      | `false`     | Whether the breadcrumb item is disabled.                                                                   |
| `current`    | `"page" \| "step" \| "location" \| "date" \| "time" \| "true"` | `undefined` | Marks the breadcrumb item as the current location in the trail.                                            |
| `href`       | `string`                                                       | `""`        | The URL to which the internal breadcrumb link button points.                                               |
| `target`     | `string`                                                       | `""`        | The target of the internal breadcrumb link button.                                                         |
| `download`   | `string`                                                       | `null`      | A value indicating whether the internal link target will be downloaded, optionally specifying a file name. |
| `rel`        | `string`                                                       | `""`        | The relationship between the internal link target and the document.                                        |

### 🧩 `m3e-breadcrumb-item` Slots

| Slot        | Description                          |
| ----------- | ------------------------------------ |
| _(default)_ | Renders the breadcrumb item content. |

### 🎛️ CSS Custom Properties

| Property                                                | Description                                               |
| ------------------------------------------------------- | --------------------------------------------------------- |
| `--m3e-breadcrumb-item-shape`                           | Shape of the internal breadcrumb item button.             |
| `--m3e-breadcrumb-item-container-height`                | Height of the internal breadcrumb item button container.  |
| `--m3e-breadcrumb-item-icon-color`                      | Color of breadcrumb item icon-only content.               |
| `--m3e-breadcrumb-item-icon-padding-inline`             | Horizontal padding for icon-only breadcrumb items.        |
| `--m3e-breadcrumb-item-icon-hover-state-layer-color`    | Hover state layer color for icon-only breadcrumb items.   |
| `--m3e-breadcrumb-item-icon-focus-state-layer-color`    | Focus state layer color for icon-only breadcrumb items.   |
| `--m3e-breadcrumb-item-icon-pressed-state-layer-color`  | Pressed state layer color for icon-only breadcrumb items. |
| `--m3e-breadcrumb-item-label-color`                     | Color of breadcrumb item label content.                   |
| `--m3e-breadcrumb-item-label-font-size`                 | Font size of breadcrumb item label content.               |
| `--m3e-breadcrumb-item-label-font-weight`               | Font weight of breadcrumb item label content.             |
| `--m3e-breadcrumb-item-label-line-height`               | Line height of breadcrumb item label content.             |
| `--m3e-breadcrumb-item-label-tracking`                  | Letter spacing of breadcrumb item label content.          |
| `--m3e-breadcrumb-item-label-padding-inline`            | Horizontal padding for label breadcrumb items.            |
| `--m3e-breadcrumb-item-label-hover-state-layer-color`   | Hover state layer color for label breadcrumb items.       |
| `--m3e-breadcrumb-item-label-focus-state-layer-color`   | Focus state layer color for label breadcrumb items.       |
| `--m3e-breadcrumb-item-label-pressed-state-layer-color` | Pressed state layer color for label breadcrumb items.     |
| `--m3e-breadcrumb-item-last-color`                      | Color used for the current breadcrumb item.               |
| `--m3e-breadcrumb-item-icon-label-space`                | Space between icon and label.                             |
| `--m3e-breadcrumb-item-icon-size`                       | Size of the icon.                                         |
| `--m3e-breadcrumb-item-disabled-color`                  | Disabled color used by the breadcrumb item button.        |
| `--m3e-breadcrumb-item-disabled-opacity`                | Disabled opacity used by the breadcrumb item button.      |
