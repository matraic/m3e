# @m3e/web/content-pane

The `m3e-content-pane` component renders a shaped surface with padding and vertical scrolling for document‑like content.

```ts
import "@m3e/web/content-pane";
```

## 🗂️ Elements

- `m3e-content-pane` — A shaped surface for vertically scrollable content.

## 🧪 Examples

The following example illustrates basic usage of the content pane.

```html
<m3e-content-pane>
  <p>This is some scrollable content.</p>
  <p>More content here...</p>
</m3e-content-pane>
```

## 📖 API Reference

This section details the slots and CSS custom properties available for the `m3e-content-pane` component.

### 🧩 Slots

| Slot        | Description                      |
| ----------- | -------------------------------- |
| _(default)_ | Renders the content of the pane. |

### 🎛️ CSS Custom Properties

| Property                               | Description                                                      |
| -------------------------------------- | ---------------------------------------------------------------- |
| `--m3e-content-pane-container-shape`   | Corner radius applied to the pane's outer surface.               |
| `--m3e-content-pane-container-color`   | Background color of the pane's surface.                          |
| `--m3e-content-pane-container-padding` | Internal padding applied to all sides of the scrollable content. |
