# @m3e/web/progress-indicator

The `m3e-linear-progress-indicator` and `m3e-circular-progress-indicator` components provide accessible, animated progress indicators for tracking the completion of tasks or processes. Both components support multiple modes and are fully customizable via CSS custom properties.

```ts
import "@m3e/web/progress-indicator";
```

## 🗂️ Elements

- `m3e-linear-progress-indicator` — A horizontal bar for indicating progress and activity.
- `m3e-circular-progress-indicator` — A circular indicator of progress and activity.

## 🧪 Example

Set `value` to show circular progress toward `max`. The default slot can display the value.

```html
<m3e-circular-progress-indicator value="25">25</m3e-circular-progress-indicator>
<m3e-circular-progress-indicator variant="wavy" value="25">25</m3e-circular-progress-indicator>
```

Use `indeterminate` when circular progress cannot be measured.

```html
<m3e-circular-progress-indicator indeterminate></m3e-circular-progress-indicator>
<m3e-circular-progress-indicator variant="wavy" indeterminate></m3e-circular-progress-indicator>
```

Set `value` to show linear progress toward `max`.

```html
<m3e-linear-progress-indicator value="25"></m3e-linear-progress-indicator>
<m3e-linear-progress-indicator variant="wavy" value="25"></m3e-linear-progress-indicator>
```

Use `mode="indeterminate"` when linear progress cannot be measured.

```html
<m3e-linear-progress-indicator mode="indeterminate"></m3e-linear-progress-indicator>
<m3e-linear-progress-indicator variant="wavy" mode="indeterminate"></m3e-linear-progress-indicator>
```

Use buffer mode with `value` and `buffer-value` to show progress and buffered progress.

```html
<m3e-linear-progress-indicator mode="buffer" value="10" buffer-value="25"></m3e-linear-progress-indicator>
<m3e-linear-progress-indicator variant="wavy" mode="buffer" value="10" buffer-value="25"></m3e-linear-progress-indicator>
```

Use query mode to indicate pre-loading before progress begins.

```html
<m3e-linear-progress-indicator mode="query"></m3e-linear-progress-indicator>
<m3e-linear-progress-indicator variant="wavy" mode="query"></m3e-linear-progress-indicator>
```

## 📖 API Reference

### 🗂️ m3e-linear-progress-indicator

This section details the attributes and CSS custom properties available for the `m3e-linear-progress-indicator` component.

#### ⚙️ Attributes

| Attribute    | Type                                                      | Default         | Description                                                          |
| ------------ | --------------------------------------------------------- | --------------- | -------------------------------------------------------------------- |
| buffer-value | `number`                                                  | `0`             | A fractional value, between 0 and `max`, indicating buffer progress. |
| max          | `number`                                                  | `100`           | The maximum progress value.                                          |
| mode         | `"determinate" \| "indeterminate" \| "buffer" \| "query"` | `"determinate"` | The mode of the progress bar.                                        |
| value        | `number`                                                  | `0`             | A fractional value, between 0 and `max`, indicating progress.        |

#### 🎛️ CSS Custom Properties

| Property                                                        | Description                                           |
| --------------------------------------------------------------- | ----------------------------------------------------- |
| `--m3e-linear-progress-indicator-thickness`                     | Thickness (height) of the progress bar.               |
| `--m3e-linear-progress-indicator-shape`                         | Border radius of the progress bar.                    |
| `--m3e-progress-indicator-track-color`                          | Track color of the progress bar (background/buffer).  |
| `--m3e-progress-indicator-color`                                | Color of the progress indicator (foreground).         |
| `--m3e-linear-wavy-progress-indicator-amplitude`                | Amplitude of the `wavy` variant.                      |
| `--m3e-linear-wavy-progress-indicator-wavelength`               | Wavelength of the `wavy` variant.                     |
| `--m3e-linear-wavy-indeterminate-progress-indicator-wavelength` | Wavelength of the indeterminate/query `wavy` variant. |

### 🗂️ m3e-circular-progress-indicator

This section details the attributes, slots, and CSS custom properties available for the `m3e-circular-progress-indicator` component.

#### ⚙️ Attributes

| Attribute     | Type      | Default | Description                                                        |
| ------------- | --------- | ------- | ------------------------------------------------------------------ |
| indeterminate | `boolean` | `false` | Whether to show something is happening without conveying progress. |
| max           | `number`  | `100`   | The maximum progress value.                                        |
| value         | `number`  | `0`     | A fractional value, between 0 and `max`, indicating progress.      |

#### 🧩 Slots

| Slot        | Description                                        |
| ----------- | -------------------------------------------------- |
| _(default)_ | Renders the content inside the progress indicator. |

#### 🎛️ CSS Custom Properties

| Property                                            | Description                                         |
| --------------------------------------------------- | --------------------------------------------------- |
| `--m3e-circular-flat-progress-indicator-diameter`   | Diameter of the `flat` variant.                     |
| `--m3e-circular-wavy-progress-indicator-diameter`   | Diameter of the `wavy` variant.                     |
| `--m3e-circular-wavy-progress-indicator-amplitude`  | Amplitude of the `wavy` variant.                    |
| `--m3e-circular-wavy-progress-indicator-wavelength` | Wavelength of the `wavy` variant.                   |
| `--m3e-circular-progress-indicator-thickness`       | Thickness of the progress indicator.                |
| `--m3e-progress-indicator-track-color`              | Track color of the progress indicator (background). |
| `--m3e-progress-indicator-color`                    | Color of the progress indicator (foreground).       |
