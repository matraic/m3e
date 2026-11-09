# @m3e/web/split-pane

The `m3e-split-pane` component delivers a Material 3-inspired split view with a movable drag handle, enabling responsive layout composition and precise pane resizing. It supports keyboard interaction, adaptive orientation, and optional detent snapping for consistent, accessible content distribution.

```ts
import "@m3e/web/split-pane";
```

## 🗂️ Elements

- `m3e-split-pane` — A dual-view layout that separates content with a movable drag handle.

## 🧪 Examples

Showcase: Basic usage. Import `@m3e/web/split-pane`. Also import `@m3e/web/card`.

```html
<m3e-split-pane value="50">
  <m3e-card slot="start"></m3e-card>
  <m3e-card slot="end"></m3e-card>
</m3e-split-pane>
```

Showcase: Orientation. Import `@m3e/web/split-pane`. Also import `@m3e/web/card`.

```html
<m3e-split-pane value="50" orientation="vertical">
  <m3e-card slot="start"></m3e-card>
  <m3e-card slot="end"></m3e-card>
</m3e-split-pane>
```

Showcase: Min and max sizes. Import `@m3e/web/split-pane`. Also import `@m3e/web/card`.

```html
<m3e-split-pane value="50" min="25" max="75">
  <m3e-card slot="start"></m3e-card>
  <m3e-card slot="end"></m3e-card>
</m3e-split-pane>
```

Showcase: Step size. Import `@m3e/web/split-pane`. Also import `@m3e/web/card`.

```html
<m3e-split-pane value="50" step="10">
  <m3e-card slot="start"></m3e-card>
  <m3e-card slot="end"></m3e-card>
</m3e-split-pane>
```

Showcase: Detents. Import `@m3e/web/split-pane`. Also import `@m3e/web/card`.

```html
<m3e-split-pane value="50" detents="0 25 50 75 100"  wrap-detents>
  <m3e-card slot="start"></m3e-card>
  <m3e-card slot="end"></m3e-card>
</m3e-split-pane>
```

Showcase: Disabling. Import `@m3e/web/split-pane`. Also import `@m3e/web/card`.

```html
<m3e-split-pane value="50" disabled>
  <m3e-card slot="start"></m3e-card>
  <m3e-card slot="end"></m3e-card>
</m3e-split-pane>
```

Showcase: Conditional rendering. Import `@m3e/web/split-pane`. Also import `@m3e/web/card`.

```html
<m3e-split-pane value="50">
  <m3e-card slot="start"></m3e-card>
  <m3e-card slot="end" hidden></m3e-card>
</m3e-split-pane>
```

Showcase: Nested panes. Import `@m3e/web/split-pane`. Also import `@m3e/web/card`. Apply the required styling for the illustrated classes in your application.

```html
<m3e-split-pane value="25" class="complex">
  <m3e-card slot="start"></m3e-card>
  <m3e-split-pane slot="end" value="50" orientation="vertical">
    <m3e-card slot="start"></m3e-card>
    <m3e-card slot="end"></m3e-card>
  </m3e-split-pane>
</m3e-split-pane>
```

## 📖 API Reference

This section details the attributes, slots, and CSS custom properties available for the `m3e-split-pane` component.

### ⚙️ Attributes

| Attribute         | Type                                   | Default          | Description                                                                                                                            |
| ----------------- | -------------------------------------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `detents`         | `string`                               |                  | Detents (discrete sizes) the start pane can snap to.                                                                                   |
| `label`           | `string`                               | `"Resize panes"` | The accessible label given to the movable drag handle.                                                                                 |
| `max`             | `number`                               | `100`            | A fractional value, between 0 and 100, indicating the maximum size of the start pane.                                                  |
| `min`             | `number`                               | `0`              | A fractional value, between 0 and 100, indicating the minimum size of the start pane.                                                  |
| `orientation`     | `"horizontal" \| "vertical" \| "auto"` | `"horizontal"`   | The orientation of the split.                                                                                                          |
| `overshoot-limit` | `number`                               | `4`              | A fractional value, between 0 and 100, indicating the maximum visual overshoot allowed when dragging past the minimum or maximum size. |
| `step`            | `number`                               | `1`              | A fractional value, between 0 and 100, indicating the increment by which to adjust the value when resized via keyboard.                |
| `value`           | `number`                               | `50`             | A fractional value, between 0 and 100, indicating the size of the start pane.                                                          |
| `wrap-detents`    | `boolean`                              | `false`          | Whether cycling through detents will wrap.                                                                                             |

### 🧩 Slots

| Slot    | Description                                            |
| ------- | ------------------------------------------------------ |
| `start` | Renders content at the logical start side of the pane. |
| `end`   | Renders content at the logical end side of the pane.   |

### 🔔 Events

| Event         | Description                                                      |
| ------------- | ---------------------------------------------------------------- |
| `beforeinput` | Dispatched continuously before the user adjusts the drag handle. |
| `input`       | Dispatched continuously while the user adjusts the drag handle.  |
| `change`      | Dispatched when the user finishes adjusting the drag handle.     |

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
