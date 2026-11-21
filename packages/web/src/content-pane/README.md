# @m3e/web/content-pane

The `m3e-content-pane` component renders a shaped surface with padding and vertical scrolling for document‑like content.

```ts
import "@m3e/web/content-pane";
```

## 🗂️ Elements

- `m3e-content-pane` — A shaped surface for vertically scrollable content.

## 🧪 Examples

Place document content in an `m3e-content-pane` for consistent padding. Constrain the pane's height to let overflowing content scroll vertically.

```html
<m3e-content-pane>
  <m3e-heading variant="display" size="large">Content header</m3e-heading>
  <p>
    <!-- Content omitted for brevity -->
  </p>
</m3e-content-pane>
```

## 📖 API Reference

This section details the slots and CSS custom properties available for the `m3e-content-pane` component.

### 🧩 Slots

| Slot        | Description                      |
| ----------- | -------------------------------- |
| _(default)_ | Renders the content of the pane. |

### 🎛️ CSS Custom Properties

| Property                                                | Description                                                       |
| ------------------------------------------------------- | ----------------------------------------------------------------- |
| `--m3e-content-pane-container-shape`                    | Corner radius applied to the pane's outer surface.                |
| `--m3e-content-pane-container-shape-family`             | Corner family applied to all corners of the pane's outer surface. |
| `--m3e-content-pane-container-shape-family-start-start` | Corner family of the block-start, inline-start corner.            |
| `--m3e-content-pane-container-shape-family-start-end`   | Corner family of the block-start, inline-end corner.              |
| `--m3e-content-pane-container-shape-family-end-start`   | Corner family of the block-end, inline-start corner.              |
| `--m3e-content-pane-container-shape-family-end-end`     | Corner family of the block-end, inline-end corner.                |
| `--m3e-content-pane-container-color`                    | Background color of the pane's surface.                           |
| `--m3e-content-pane-container-padding`                  | Internal padding applied to all sides of the scrollable content.  |
