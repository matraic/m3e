# @m3e/web/loading-indicator

The `m3e-loading-indicator` component uses animation to grab attention, mitigate perceived latency, and indicate that an activity is in progress. Use the `variant` attribute to switch between `uncontained` (default) and `contained` appearances for contrast and context.

```ts
import "@m3e/web/loading-indicator";
```

## 🗂️ Elements

- `m3e-loading-indicator` — Shows indeterminate progress for a short wait time.

## 🧪 Examples

The following example illustrates an uncontained loading indicator.

```html
<m3e-loading-indicator></m3e-loading-indicator>
```

For pull-to-refresh, update `pull-progress` as the gesture changes. Each increment of `1` rotates the indicator counterclockwise by one full turn, so progress can exceed `1` for longer pulls. Negative values are clamped to `0`. The indicator stops when progress stops changing. Remove the attribute (or set `pullProgress` to `null`) to indicate that no pull gesture is active.

```html
<m3e-loading-indicator pull-progress="1"></m3e-loading-indicator>
```

## 📖 API Reference

This section details the attributes and CSS custom properties available for the `m3e-loading-indicator` component.

### ⚙️ Attributes

| Attribute       | Type                           | Default         | Description                                                                                                         |
| --------------- | ------------------------------ | --------------- | ------------------------------------------------------------------------------------------------------------------- |
| `variant`       | `"uncontained" \| "contained"` | `"uncontained"` | The appearance variant of the indicator.                                                                            |
| `pull-progress` | `number \| null`               | `null`          | Pull-to-refresh progress; each increment of 1 rotates the indicator counterclockwise by one turn. Negative values are clamped to 0; `null` indicates no pull gesture is active. |

### 🎛️ CSS Custom Properties

| Property                                                   | Description                             |
| ---------------------------------------------------------- | --------------------------------------- |
| `--m3e-loading-indicator-active-indicator-color`           | Uncontained active indicator color.     |
| `--m3e-loading-indicator-contained-active-indicator-color` | Contained active indicator color.       |
| `--m3e-loading-indicator-contained-container-color`        | Contained container (background) color. |
| `--m3e-loading-indicator-active-indicator-size`            | Size of the active indicator.           |
| `--m3e-loading-indicator-container-shape`                  | Container shape.                        |
| `--m3e-loading-indicator-container-size`                   | Container size.                         |
