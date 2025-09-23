# @m3e/tooltip

The `m3e-tooltip` component provides contextual information in response to user interaction, enhancing comprehension and reducing ambiguity. Tooltips are positioned relative to a target element and support configurable delays for show and hide behavior. Use the `for` attribute to designate the element for which to provide a tooltip.

## 📦 Installation

```bash
npm install @m3e/tooltip
```

## 🗂️ Elements

- `m3e-tooltip` — Adds additional context to a button or other UI element.

## 🧪 Examples

The following example illustrates connecting a tooltip to a button using the `for` attribute.

```html
<m3e-icon-button id="button" aria-label="Back">
  <m3e-icon name="arrow_back"></m3e-icon>
</m3e-icon-button>
<m3e-tooltip for="button">Go Back</m3e-tooltip>
```

## 📖 API Reference

This section details the attributes, slots and CSS custom properties available for the `m3e-tooltip` component.

### ⚙️ Attributes

| Attribute    | Type      | Default | Description                                                             |
| ------------ | --------- | ------- | ----------------------------------------------------------------------- |
| `disabled`   | `boolean` | `false` | Whether the element is disabled.                                        |
| `for`        | `string`  |         | The query selector used to specify the element related to this element. |
| `hide-delay` | `number`  | `200`   | The amount of time, in milliseconds, before hiding the tooltip.         |
| `position`   | `string`  | `"top"` | The position of the tooltip.                                            |
| `show-delay` | `number`  | `0`     | The amount of time, in milliseconds, before showing the tooltip.        |

### 🧩 Slots

| Slot Name   | Description                         |
| ----------- | ----------------------------------- |
| _(default)_ | Renders the content of the tooltip. |

### 🎛️ CSS Custom Properties

| Property                                    | Description                                |
| ------------------------------------------- | ------------------------------------------ |
| `--m3e-tooltip-padding`                     | Internal spacing of the tooltip container. |
| `--m3e-tooltip-min-width`                   | Minimum width of the tooltip.              |
| `--m3e-tooltip-max-width`                   | Maximum width of the tooltip.              |
| `--m3e-tooltip-min-height`                  | Minimum height of the tooltip container.   |
| `--m3e-tooltip-max-height`                  | Maximum height of the tooltip.             |
| `--m3e-tooltip-shape`                       | Border radius of the tooltip container.    |
| `--m3e-tooltip-container-color`             | Background color of the tooltip.           |
| `--m3e-tooltip-supporting-text-color`       | Text color of supporting text.             |
| `--m3e-tooltip-supporting-text-font-size`   | Font size of supporting text.              |
| `--m3e-tooltip-supporting-text-font-weight` | Font weight of supporting text.            |
| `--m3e-tooltip-supporting-text-line-height` | Line height of supporting text.            |
| `--m3e-tooltip-supporting-text-tracking`    | Letter spacing of supporting text.         |

## 🤝 Contributing

See the root monorepo `CONTRIBUTING.md` for guidelines on contributing to this package.

## 📄 License

This package is licensed under the MIT License.
