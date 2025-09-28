# @m3e/progress-indicator

The `m3e-linear-progress-indicator` and `m3e-circular-progress-indicator` components provide accessible, animated progress indicators for tracking the completion of tasks or processes. Both components support multiple modes and are fully customizable via CSS custom properties.

> **Part of the [Material 3 Expressive (M3E)](../../README.md) monorepo**  
> This package is maintained within the unified M3E repository, which provides a suite of Material 3 web components.

## 📦 Installation

```bash
npm install @m3e/progress-indicator
```

## 🗂️ Elements

- `m3e-linear-progress-indicator` — A horizontal bar for indicating progress and activity.
- `m3e-circular-progress-indicator` — A circular indicator of progress and activity.

## 🧪 Example

The following example illustrates determinate progress indicators.

```html
<m3e-linear-progress-indicator value="30"></m3e-linear-progress-indicator>
<m3e-circular-progress-indicator value="30"></m3e-circular-progress-indicator>
```

The next example illustrates indeterminate progress indicators.

```html
<m3e-linear-progress-indicator mode="indeterminate"></m3e-linear-progress-indicator>
<m3e-circular-progress-indicator indeterminate></m3e-circular-progress-indicator>
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

| Property                                    | Description                                          |
| ------------------------------------------- | ---------------------------------------------------- |
| `--m3e-linear-progress-indicator-thickness` | Thickness (height) of the progress bar.              |
| `--m3e-linear-progress-indicator-shape`     | Border radius of the progress bar.                   |
| `--m3e-progress-indicator-track-color`      | Track color of the progress bar (background/buffer). |
| `--m3e-progress-indicator-color`            | Color of the progress indicator (foreground).        |

### 🗂️ m3e-circular-progress-indicator

This section details the attributes, slots, and CSS custom properties available for the `m3e-circular-progress-indicator` component.

#### ⚙️ Attributes

| Attribute     | Type      | Default | Description                                                        |
| ------------- | --------- | ------- | ------------------------------------------------------------------ |
| diameter      | `number`  | `40`    | The diameter, in pixels, of the progress spinner.                  |
| indeterminate | `boolean` | `false` | Whether to show something is happening without conveying progress. |
| max           | `number`  | `100`   | The maximum progress value.                                        |
| stroke-width  | `number`  | `10`    | The stroke width, in pixels, of the progress spinner.              |
| value         | `number`  | `0`     | A fractional value, between 0 and `max`, indicating progress.      |

#### 🧩 Slots

| Name      | Description                                        |
| --------- | -------------------------------------------------- |
| (default) | Renders the content inside the progress indicator. |

#### 🎛️ CSS Custom Properties

| Property                               | Description                                          |
| -------------------------------------- | ---------------------------------------------------- |
| `--m3e-progress-indicator-track-color` | Track color of the progress bar (background/buffer). |
| `--m3e-progress-indicator-color`       | Color of the progress indicator (foreground).        |

## 🤝 Contributing

See the root monorepo `CONTRIBUTING.md` for guidelines on contributing to this package.

## 📄 License

This package is licensed under the MIT License.
