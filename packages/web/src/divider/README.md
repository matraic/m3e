# @m3e/web/divider

The `m3e-divider` component visually separates content within layouts, lists, or containers using a thin, unobtrusive line. It supports horizontal and vertical orientation, with optional inset variants to align with layout padding and visual hierarchy. The divider thickness, color, and inset behavior are customizable via CSS properties to maintain consistency across surfaces. It is designed to reinforce spatial relationships without drawing attention, preserving focus on primary content.

```ts
import "@m3e/web/divider";
```

## 🗂️ Elements

- `m3e-divider` — A thin line that separates content in lists or other containers.

## 🧪 Examples

Separate list items with dividers. Import `@m3e/web/list` for the list elements.

```html
<m3e-list>
  <m3e-list-item>Item 1</m3e-list-item>
  <m3e-divider></m3e-divider>
  <m3e-list-item>Item 2</m3e-list-item>
  <m3e-divider></m3e-divider>
  <m3e-list-item>Item 3</m3e-list-item>
</m3e-list>
```

Use `inset`, `inset-start`, or `inset-end` to indent a horizontal divider.

```html
<m3e-divider></m3e-divider>
<m3e-divider inset></m3e-divider>
<m3e-divider inset-start></m3e-divider>
<m3e-divider inset-end></m3e-divider>
```

Use `vertical` for vertical dividers. Give their container a definite height.

```html
<m3e-divider vertical></m3e-divider>
<m3e-divider vertical inset></m3e-divider>
<m3e-divider vertical inset-start></m3e-divider>
<m3e-divider vertical inset-end></m3e-divider>
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
