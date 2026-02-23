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

## 📖 API Reference

This section details the attributes and CSS custom properties available for the `m3e-loading-indicator` component.

### ⚙️ Attributes

| Attribute | Type                           | Default         | Description                              |
| --------- | ------------------------------ | --------------- | ---------------------------------------- |
| `variant` | `"uncontained" \| "contained"` | `"uncontained"` | The appearance variant of the indicator. |

### 🎛️ CSS Custom Properties

| Property                                                   | Description                             |
| ---------------------------------------------------------- | --------------------------------------- |
| `--m3e-loading-indicator-active-indicator-color`           | Uncontained active indicator color.     |
| `--m3e-loading-indicator-contained-active-indicator-color` | Contained active indicator color.       |
| `--m3e-loading-indicator-contained-container-color`        | Contained container (background) color. |
| `--m3e-loading-indicator-active-indicator-size`            | Size of the active indicator.           |
| `--m3e-loading-indicator-container-shape`                  | Container shape.                        |
| `--m3e-loading-indicator-container-size`                   | Container size.                         |
