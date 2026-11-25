# @m3e/web/skeleton

The `m3e-skeleton` component provides a loading placeholder surface with flexible shape variants and motion-based animations that communicate loading state while preserving layout stability. It mimics the layout of content while it's still loading, ensuring a smooth user experience during data fetching or rendering delays. The component supports different animation effects (`pulse`, `wave`, `none`) and shape variants (`circular`, `rounded`, `square`, `auto`) to adapt to various content types. When the content is loaded, the skeleton fades out with a smooth transition.

```ts
import "@m3e/web/skeleton";
```

## 🗂️ Elements

- `m3e-skeleton` — A visual placeholder that mimics the layout of content while it's still loading.

## 🧪 Examples

Wrap a card in a skeleton to provide a placeholder while content loads.

```html
<m3e-skeleton>
  <m3e-card>
    <m3e-heading slot="header" variant="display" size="small">Card Header</m3e-heading>
    <div slot="content">Card Content</div>
    <div slot="actions">
      <m3e-button variant="filled">Action</m3e-button>
    </div>
    <div slot="footer">Card Footer</div>
  </m3e-card>
</m3e-skeleton>
```

Use `shape` to choose `circular`, `rounded`, `square`, or `auto`.

The default `auto` shape copies the underlying content's computed radius and corner shape, including mixed rounded/cut corners. When the content host has no radius and has a single shadow-root element, both values come from that surface instead. Explicit shape variants use the skeleton's own radius and shape-family properties, including when switching away from `auto`.

```html
<m3e-skeleton shape="circular">
  <div style="width: 100px; height: 100px"></div>
</m3e-skeleton>
<br />
<m3e-skeleton shape="rounded">
  <div style="width: 100px; height: 100px"></div>
</m3e-skeleton>
<br />
<m3e-skeleton shape="square">
  <div style="width: 100px; height: 100px"></div>
</m3e-skeleton>
<br />
<m3e-skeleton shape="auto">
  <div style="width: 100px; height: 100px; border-radius: 16px"></div>
</m3e-skeleton>
```

Use `animation="pulse"` to animate the skeleton with a fade.

```html
<m3e-skeleton shape="circular" animation="pulse">
  <div style="width: 100px; height: 100px"></div>
</m3e-skeleton>
<!-- Additional skeletons omitted for brevity -->
```

Use `animation="none"` to display a static skeleton.

```html
<m3e-skeleton shape="circular" animation="none">
  <div style="width: 100px; height: 100px"></div>
</m3e-skeleton>
<!-- Additional skeletons omitted for brevity -->
```

## 📖 API Reference

This section details the attributes, slots and CSS custom properties available for the `m3e-skeleton` component.

### ⚙️ Attributes

| Attribute   | Type                                            | Default  | Description                                          |
| ----------- | ----------------------------------------------- | -------- | ---------------------------------------------------- |
| `animation` | `"pulse" \| "wave" \| "none"`                   | `"wave"` | The animation effect of the skeleton.                |
| `shape`     | `"circular" \| "rounded" \| "square" \| "auto"` | `"auto"` | The shape of the skeleton.                           |
| `loaded`    | `boolean`                                       | `false`  | Whether the content of the skeleton has been loaded. |

### 🧩 Slots

| Slot        | Description                                         |
| ----------- | --------------------------------------------------- |
| _(default)_ | Renders the content to be mimicked by the skeleton. |

### 🎛️ CSS Custom Properties

| Property                                  | Description                                                        |
| ----------------------------------------- | ------------------------------------------------------------------ |
| `--m3e-skeleton-color`                    | Base fill color for the skeleton surface.                          |
| `--m3e-skeleton-tint-color`               | Tint fill color for the skeleton surface.                          |
| `--m3e-skeleton-tint-opacity`             | Tint opacity applied when the skeleton animation is not pulsating. |
| `--m3e-skeleton-accent-color`             | Accent color used in wave animation.                               |
| `--m3e-skeleton-accent-opacity`           | Opacity of the accent effect in animations.                        |
| `--m3e-skeleton-rounded-shape`            | Corner radius for the rounded skeleton shape.                      |
| `--m3e-skeleton-circular-shape`           | Corner radius for the circular skeleton shape.                     |
| `--m3e-skeleton-square-shape`             | Corner radius for the square skeleton shape.                       |
| `--m3e-skeleton-shape`                    | Corner radius for the skeleton shape.                              |
| `--m3e-skeleton-shape-family`             | Corner family applied to all corners of the skeleton surface.      |
| `--m3e-skeleton-shape-family-start-start` | Corner family of the block-start, inline-start corner.             |
| `--m3e-skeleton-shape-family-start-end`   | Corner family of the block-start, inline-end corner.               |
| `--m3e-skeleton-shape-family-end-start`   | Corner family of the block-end, inline-start corner.               |
| `--m3e-skeleton-shape-family-end-end`     | Corner family of the block-end, inline-end corner.                 |
