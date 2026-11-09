# @m3e/web/slide-group

The `m3e-slide-group` component presents directional pagination controls for navigating overflowing content. It orchestrates scrollable layouts with expressive slot-based icons and adaptive orientation, revealing navigation affordances only when content exceeds a defined threshold. It supports both horizontal and vertical flows, and encodes accessibility through customizable labels and interaction states.

```ts
import "@m3e/web/slide-group";
```

## 🗂️ Elements

- `m3e-slide-group` — Presents pagination controls used to scroll overflowing content.

## 🧪 Examples

Showcase: Basic usage. Import `@m3e/web/slide-group`.

```html
<m3e-slide-group>
  <div>Item 1</div>
  <!-- Additional items omitted for brevity -->
</m3e-slide-group>
```

Showcase: Orientation. Import `@m3e/web/slide-group`.

```html
<m3e-slide-group vertical>
  <div>Item 1</div>
  <!-- Additional items omitted for brevity -->
</m3e-slide-group>
```

## 📖 API Reference

This section details the attributes, slots and CSS custom properties available for the `m3e-slide-group` component.

### ⚙️ Attributes

| Attribute             | Type      | Default           | Description                                                                                        |
| --------------------- | --------- | ----------------- | -------------------------------------------------------------------------------------------------- |
| `disabled`            | `boolean` | `false`           | Whether scroll buttons are disabled.                                                               |
| `next-page-label`     | `string`  | `"Next page"`     | The accessible label given to the button used to move to the previous page.                        |
| `previous-page-label` | `string`  | `"Previous page"` | The accessible label given to the button used to move to the next page.                            |
| `threshold`           | `number`  | `0`               | A value, in pixels, indicating the scroll threshold at which to begin showing pagination controls. |
| `vertical`            | `boolean` | `false`           | Whether content is oriented vertically.                                                            |

#### 🧩 Slots

| Slot        | Description                                          |
| ----------- | ---------------------------------------------------- |
| _(default)_ | Renders the content to paginate.                     |
| `next-icon` | Renders the icon to present for the next button.     |
| `prev-icon` | Renders the icon to present for the previous button. |

### 🎛️ CSS Custom Properties

| Property                             | Description                                                                   |
| ------------------------------------ | ----------------------------------------------------------------------------- |
| `--m3e-slide-group-button-icon-size` | Sets icon size for scroll buttons; overrides default small icon size.         |
| `--m3e-slide-group-button-size`      | Defines scroll button size; used for width (horizontal) or height (vertical). |
| `--m3e-slide-group-divider-top`      | Adds top border to content container for visual separation.                   |
| `--m3e-slide-group-divider-bottom`   | Adds bottom border to content container for visual separation.                |
