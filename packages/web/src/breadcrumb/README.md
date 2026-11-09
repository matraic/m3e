# @m3e/web/breadcrumb

The `m3e-breadcrumb` and `m3e-breadcrumb-item` components work together to display a hierarchical navigation trail. Use `m3e-breadcrumb` as a wrapper and place one or more `m3e-breadcrumb-item` elements inside to represent the navigation path.

```ts
import "@m3e/web/breadcrumb";
```

## 🗂️ Elements

- `m3e-breadcrumb` — Displays a hierarchical navigation path and identifies the user's current location within an application.
- `m3e-breadcrumb-item` — An item in a breadcrumb.

## 🧪 Examples

Place breadcrumb items in order from the broadest level to the current location. The last item is automatically treated as the current page.

```html
<m3e-breadcrumb>
  <m3e-breadcrumb-item>Dashboard</m3e-breadcrumb-item>
  <m3e-breadcrumb-item>Reports</m3e-breadcrumb-item>
  <m3e-breadcrumb-item>Annual</m3e-breadcrumb-item>
</m3e-breadcrumb>
```

Use `href` for links on earlier items. The last item is the current location and is not interactive; supply additional items as in the basic example.

```html
<m3e-breadcrumb>
  <m3e-breadcrumb-item href="https://developer.mozilla.org/en-US/docs/Web" target="_blank">Web</m3e-breadcrumb-item>
  <!-- Additional items omitted for brevity -->
</m3e-breadcrumb>
```

Use the `icon` slot for an icon before a label, or place an icon in the default slot and use `item-label` for an icon-only item. Import `@m3e/web/icon` when using `m3e-icon`.

```html
<m3e-breadcrumb>
  <m3e-breadcrumb-item item-label="Dashboard">
    <m3e-icon name="dashboard"></m3e-icon>
  </m3e-breadcrumb-item>
  <m3e-breadcrumb-item>
    <m3e-icon slot="icon" name="analytics"></m3e-icon>Reports
  </m3e-breadcrumb-item>
  <m3e-breadcrumb-item>
    <m3e-icon slot="icon" name="calendar_month"></m3e-icon>Annual
  </m3e-breadcrumb-item>
</m3e-breadcrumb>
```

Use the `separator` slot for a custom separator. Supply the additional items shown in the basic example.

```html
<m3e-breadcrumb>
  <span slot="separator">/</span>
  <m3e-breadcrumb-item>Dashboard</m3e-breadcrumb-item>
  <!-- Additional items omitted for brevity -->
</m3e-breadcrumb>
```

Use `wrap` to allow breadcrumb items to wrap. Supply the items shown in the basic example.

```html
<m3e-breadcrumb wrap>
  <!-- Items omitted for brevity -->
</m3e-breadcrumb>
```

Use `--md-sys-density-scale` to adjust the breadcrumb density. Supply the items shown in the basic example. The showcase omits additional breadcrumbs and density classes.

```html
<m3e-breadcrumb class="density-3">
  <!-- Items omitted for brevity -->
</m3e-breadcrumb>
<!-- Additional breadcrumbs omitted for brevity -->
```

```css
.density-3 {
  --md-sys-density-scale: -3;
}
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

| Attribute    | Type                                                           | Default     | Description                                                                             |
| ------------ | -------------------------------------------------------------- | ----------- | --------------------------------------------------------------------------------------- |
| `item-label` | `string`                                                       | `""`        | The accessible label used by the internal breadcrumb button.                            |
| `disabled`   | `boolean`                                                      | `false`     | Whether the breadcrumb item is disabled.                                                |
| `current`    | `"page" \| "step" \| "location" \| "date" \| "time" \| "true"` | `undefined` | Marks the breadcrumb item as the current location in the trail.                         |
| `href`       | `string`                                                       | `""`        | The URL to which the internal breadcrumb link button points.                            |
| `target`     | `string`                                                       | `""`        | The target of the internal breadcrumb link button.                                      |
| `download`   | `string`                                                       | `null`      | Whether the internal link target will be downloaded, optionally specifying a file name. |
| `rel`        | `string`                                                       | `""`        | The relationship between the internal link target and the document.                     |

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
