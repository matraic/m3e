# @m3e/web/split-pane

The `m3e-split-pane` component delivers a Material 3-inspired split view with a movable drag handle, enabling responsive layout composition and precise pane resizing. It supports keyboard interaction, adaptive orientation, and optional detent snapping for consistent, accessible content distribution.

```ts
import "@m3e/web/split-pane";
```

## 🗂️ Elements

- `m3e-split-pane` — A dual-view layout that separates content with a movable drag handle.

## 🧪 Examples

The following example illustrates a basic horizontal split pane with start and end content.

```html
<m3e-split-pane>
  <div slot="start">Start content</div>
  <div slot="end">End content</div>
</m3e-split-pane>
```

This example shows a vertical split pane with detents for snapping to specific sizes.

```html
<m3e-split-pane orientation="vertical" detents="25 50 75">
  <div slot="start">Top content</div>
  <div slot="end">Bottom content</div>
</m3e-split-pane>
```

## 📖 API Reference

This section details the attributes, slots, and CSS custom properties available for the `m3e-split-pane` component.

### ⚙️ Attributes

| Attribute      | Type                                   | Default          | Description                                                                                                             |
| -------------- | -------------------------------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `detents`      | `string`                               |                  | Detents (discrete sizes) the start pane can snap to.                                                                    |
| `label`        | `string`                               | `"Resize panes"` | The accessible label given to the movable drag handle.                                                                  |
| `max`          | `number`                               | `100`            | A fractional value, between 0 and 100, indicating the maximum size of the start pane.                                   |
| `min`          | `number`                               | `0`              | A fractional value, between 0 and 100, indicating the minimum size of the start pane.                                   |
| `orientation`  | `"horizontal" \| "vertical" \| "auto"` | `"horizontal"`   | The orientation of the split.                                                                                           |
| `step`         | `number`                               | `1`              | A fractional value, between 0 and 100, indicating the increment by which to adjust the value when resized via keyboard. |
| `value`        | `number`                               | `50`             | A fractional value, between 0 and 100, indicating the size of the start pane.                                           |
| `wrap-detents` | `boolean`                              | `false`          | Whether cycling through detents will wrap.                                                                              |

### 🧩 Slots

| Slot    | Description                                            |
| ------- | ------------------------------------------------------ |
| `start` | Renders content at the logical start side of the pane. |
| `end`   | Renders content at the logical end side of the pane.   |

### 🎛️ CSS Custom Properties

| Property                                       | Description                                           |
| ---------------------------------------------- | ----------------------------------------------------- |
| `--m3e-split-pane-drag-handle-hover-color`     | Color used for the drag handle hover state.           |
| `--m3e-split-pane-drag-handle-hover-opacity`   | Opacity used for the drag handle hover state.         |
| `--m3e-split-pane-drag-handle-focus-color`     | Color used for the drag handle focus state.           |
| `--m3e-split-pane-drag-handle-focus-opacity`   | Opacity used for the drag handle focus state.         |
| `--m3e-split-pane-drag-handle-color`           | Background color of the drag handle when not pressed. |
| `--m3e-split-pane-drag-handle-shape`           | Corner shape of the drag handle when not pressed.     |
| `--m3e-split-pane-drag-handle-pressed-color`   | Background color of the drag handle when pressed.     |
| `--m3e-split-pane-drag-handle-pressed-shape`   | Corner shape of the drag handle when pressed.         |
| `--m3e-split-pane-drag-handle-container-width` | Width of the drag handle container.                   |
| `--m3e-split-pane-drag-handle-width`           | Thickness of the drag handle when not pressed.        |
| `--m3e-split-pane-drag-handle-height`          | Length of the drag handle when not pressed.           |
| `--m3e-split-pane-drag-handle-pressed-width`   | Thickness of the drag handle when pressed.            |
| `--m3e-split-pane-drag-handle-pressed-height`  | Length of the drag handle when pressed.               |
