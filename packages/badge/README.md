# @m3e/badge

The `m3e-badge` component is a compact visual indicator used to label content. Designed according to Material Design 3 guidelines, it can display counts, presence, or semantic emphasis, and is attachable to icons, buttons, or other components. Badges support dynamic sizing, color, and shape, ensuring clarity and accessibility while maintaining a consistent, expressive appearance across surfaces.

> **Part of the [Material 3 Expressive (M3E)](../../README.md) monorepo**  
> This package is maintained within the unified M3E repository, which provides a suite of Material 3 web components.

## 📦 Installation

```bash
npm install @m3e/badge
```

## 🗂️ Elements

- `m3e-badge` — A visual indicator used to label content.

## 🧪 Examples

The following example illustrates attaching a `m3e-badge` to another element using the `for` attribute.

```html
<m3e-button id="button">Button</m3e-button><m3e-badge for="button">10</m3e-badge>
```

## 📖 API Reference

This section details the attributes, slots and CSS custom properties available for the `m3e-badge` component.

### ⚙️ Attributes

| Attribute  | Type                                                                                                              | Default         | Description                                                  |
| ---------- | ----------------------------------------------------------------------------------------------------------------- | --------------- | ------------------------------------------------------------ |
| `size`     | `"small" \| "medium" \| "large"`                                                                                  | `"medium"`      | The size of the badge.                                       |
| `position` | `"above-after" \| "above-before" \| "below-before" \| "below-after" \| "before" \| "after" \| "above" \| "below"` | `"above-after"` | The position of the badge, when attached to another element. |

### 🧩 Slots

| Slot Name   | Description                       |
| ----------- | --------------------------------- |
| _(default)_ | Renders the content of the badge. |

### 🎛️ CSS Custom Properties

The `m3e-badge` element supports scoped CSS custom properties for shape, color, sizing, and typography across badge sizes. These tokens enable consistent theming, semantic clarity, and expressive control.

#### 🧱 Global Properties

| Property                      | Description                              |
| ----------------------------- | ---------------------------------------- |
| `--m3e-badge-shape`           | Corner radius of the badge container.    |
| `--m3e-badge-color`           | Foreground color of badge content.       |
| `--m3e-badge-container-color` | Background color of the badge container. |

#### 🟢 Small Badge

Used for minimal indicators such as presence dots or unread markers.

| Property                 | Description                       |
| ------------------------ | --------------------------------- |
| `--m3e-badge-small-size` | Fixed dimensions for small badge. |

#### 🟡 Medium Badge

Used for numeric counts or short labels.

| Property                         | Description                            |
| -------------------------------- | -------------------------------------- |
| `--m3e-badge-medium-size`        | Height and minimum width of the badge. |
| `--m3e-badge-medium-font-size`   | Font size for badge label.             |
| `--m3e-badge-medium-font-weight` | Font weight for badge label.           |
| `--m3e-badge-medium-line-height` | Line height for badge label.           |
| `--m3e-badge-medium-tracking`    | Letter spacing for badge label.        |

#### 🔵 Large Badge

Used for longer labels or emphasis in dense layouts.

| Property                        | Description                            |
| ------------------------------- | -------------------------------------- |
| `--m3e-badge-large-size`        | Height and minimum width of the badge. |
| `--m3e-badge-large-font-size`   | Font size for badge label.             |
| `--m3e-badge-large-font-weight` | Font weight for badge label.           |
| `--m3e-badge-large-line-height` | Line height for badge label.           |
| `--m3e-badge-large-tracking`    | Letter spacing for badge label.        |

## 🤝 Contributing

See the root monorepo `CONTRIBUTING.md` for guidelines on contributing to this package.

## 📄 License

This package is licensed under the MIT License.
