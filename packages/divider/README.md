# @m3e/divider

The `m3e-divider` component visually separates content within layouts, lists, or containers using a thin, unobtrusive line. It supports horizontal and vertical orientation, with optional inset variants to align with layout padding and visual hierarchy. The divider thickness, color, and inset behavior are customizable via CSS properties to maintain consistency across surfaces. It is designed to reinforce spatial relationships without drawing attention, preserving focus on primary content.

## 📦 Installation

```bash
npm install @m3e/divider
```

## 🗂️ Elements

- `m3e-divider` — A thin line that separates content in lists or other containers.

## 🧪 Examples

The following example illustrates a basic horizontal divider.

```html
<m3e-divider></m3e-divider>
```

## 📖 API Reference

This section details the attributes and CSS custom properties available for the `m3e-divider` component.

### ⚙️ Attributes

| Attribute     | Type      | Default | Description                                                        |
| ------------- | --------- | ------- | ------------------------------------------------------------------ |
| `inset`       | `boolean` | `false` | Whether the divider is indented with equal padding on both sides.  |
| `inset-start` | `boolean` | `false` | Whether the divider is indented with padding on the leading side.  |
| `inset-end`   | `boolean` | `false` | Whether the divider is indented with padding on the trailing side. |
| `vertical`    | `boolean` | `false` | Whether the divider is vertically aligned with adjacent content.   |

### 🎛️ CSS Custom Properties

| Property                         | Description                                                          |
| -------------------------------- | -------------------------------------------------------------------- |
| `--m3e-divider-thickness`        | Thickness of the divider line.                                       |
| `--m3e-divider-color`            | Color of the divider line.                                           |
| `--m3e-divider-inset-size`       | Fallback inset size when no specific start or end inset is provided. |
| `--m3e-divider-inset-start-size` | Leading inset size.                                                  |
| `--m3e-divider-inset-end-size`   | Trailing inset size.                                                 |

## 🤝 Contributing

See the root monorepo `CONTRIBUTING.md` for guidelines on contributing to this package.

## 📄 License

This package is licensed under the MIT License.
