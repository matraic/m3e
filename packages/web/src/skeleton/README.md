# @m3e/web/skeleton

The `m3e-skeleton` component provides a loading placeholder surface with flexible shape variants and motion-based animations that communicate loading state while preserving layout stability. It mimics the layout of content while it's still loading, ensuring a smooth user experience during data fetching or rendering delays. The component supports different animation effects (`pulse`, `wave`, `none`) and shape variants (`circular`, `rounded`, `square`, `auto`) to adapt to various content types. When the content is loaded, the skeleton fades out with a smooth transition.

```ts
import "@m3e/web/skeleton";
```

## 🗂️ Elements

- `m3e-skeleton` — A visual placeholder that mimics the layout of content while it's still loading.

## 🧪 Examples

The following example illustrates a skeleton shaped and sized by the slotted `m3e-card`.

```html
<m3e-skeleton>
  <m3e-card></m3e-card>
</m3e-skeleton>
```

## 📖 API Reference

This section details the attributes, slots and CSS custom properties available for the `m3e-skeleton` component.

### ⚙️ Attributes

| Attribute   | Type                                            | Default  | Description                                          |
| ----------- | ----------------------------------------------- | -------- | ---------------------------------------------------- |
| `animation` | `"pulse" \| "wave" \| "none"`                   | `"none"` | The animation effect of the skeleton.                |
| `shape`     | `"circular" \| "rounded" \| "square" \| "auto"` | `"auto"` | The shape of the skeleton.                           |
| `loaded`    | `boolean`                                       | `false`  | Whether the content of the skeleton has been loaded. |

### 🧩 Slots

| Slot        | Description                                         |
| ----------- | --------------------------------------------------- |
| _(default)_ | Renders the content to be mimicked by the skeleton. |

### 🎛️ CSS Custom Properties

| Property                        | Description                                                        |
| ------------------------------- | ------------------------------------------------------------------ |
| `--m3e-skeleton-color`          | Base fill color for the skeleton surface.                          |
| `--m3e-skeleton-tint-color`     | Tint fill color for the skeleton surface.                          |
| `--m3e-skeleton-tint-opacity`   | Tint opacity applied when the skeleton animation is not pulsating. |
| `--m3e-skeleton-accent-color`   | Accent color used in wave animation.                               |
| `--m3e-skeleton-accent-opacity` | Opacity of the accent effect in animations.                        |
| `--m3e-skeleton-rounded-shape`  | Corner radius for the rounded skeleton shape.                      |
| `--m3e-skeleton-circular-shape` | Corner radius for the circular skeleton shape.                     |
| `--m3e-skeleton-square-shape`   | Corner radius for the square skeleton shape.                       |
| `--m3e-skeleton-shape`          | Corner radius for the skeleton shape.                              |
