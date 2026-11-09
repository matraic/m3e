# @m3e/web/loading-indicator

The `m3e-loading-indicator` component uses animation to grab attention, mitigate perceived latency, and indicate that an activity is in progress. Use the `variant` attribute to switch between `uncontained` (default) and `contained` appearances for contrast and context.

For pull-to-refresh, each increment of 1 in `pull-progress` rotates the indicator counterclockwise by one full turn. Progress can exceed 1, negative values are clamped to 0, and the indicator stops when progress stops changing. Remove the attribute or set `pullProgress` to `null` when no pull gesture is active.

```ts
import "@m3e/web/loading-indicator";
```

## 🗂️ Elements

- `m3e-loading-indicator` — Shows indeterminate progress for a short wait time.

## 🧪 Examples

Showcase: Variants. Import `@m3e/web/loading-indicator`.

```html
<m3e-loading-indicator></m3e-loading-indicator>
<m3e-loading-indicator variant="contained"></m3e-loading-indicator>
```

Showcase: Pull to refresh. Import `@m3e/web/loading-indicator`. Also import `@m3e/web/gestures/pan`.

```html
<div id="pull-target">
  <m3e-loading-indicator id="indicator" variant="contained"></m3e-loading-indicator>
</div>
<m3e-pan-gesture id="pull-gesture" for="pull-target" lock-axis="y"></m3e-pan-gesture>

<script>
  const target = document.getElementById("pull-target");
  const indicator = document.getElementById("indicator");
  const gesture = document.getElementById("pull-gesture");
  const pullDistancePerTurn = 120;

  gesture.addEventListener("gesture", ({ detail }) => {
    switch (detail.phase) {
      case "start":
        indicator.pullProgress = 0;
        break;
      case "update":
        indicator.pullProgress = Math.max(0, detail.totalDeltaY / pullDistancePerTurn);
        break;
      case "cancel":
      case "end":
        indicator.pullProgress = null;
        break;
    }
  });
</script>
```

## 📖 API Reference

This section details the attributes and CSS custom properties available for the `m3e-loading-indicator` component.

### ⚙️ Attributes

| Attribute       | Type                           | Default         | Description                                                                                                                                                                     |
| --------------- | ------------------------------ | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `variant`       | `"uncontained" \| "contained"` | `"uncontained"` | The appearance variant of the indicator.                                                                                                                                        |
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
