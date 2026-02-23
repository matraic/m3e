# @m3e/web/tooltip

The `@m3e/web/tooltip` module provides tooltip and rich‑tooltip components for delivering contextual guidance, from simple hover descriptions to multi‑line, expressive content anchored to a control.

```ts
import "@m3e/web/tooltip";
```

## 🗂️ Elements

- `m3e-rich-tooltip-action` — An element, nested within a clickable element, used to dismiss a parenting rich tooltip.
- `m3e-rich-tooltip` — Provides contextual details for a control, such as explaining the value or purpose of a feature.
- `m3e-tooltip` — Adds additional context to a button or other UI element.

## 🧪 Examples

The following example illustrates connecting a tooltip to a button using the `for` attribute.

```html
<m3e-icon-button id="button" aria-label="Back">
  <m3e-icon name="arrow_back"></m3e-icon>
</m3e-icon-button>
<m3e-tooltip for="button">Go Back</m3e-tooltip>
```

The next example illustrates connecting an interactive rich tooltip to a button using the `for` attribute.

```html
<m3e-icon-button id="btnSettings">
  <m3e-icon name="settings"></m3e-icon>
</m3e-icon-button>
<m3e-rich-tooltip for="btnSettings">
  <span slot="subhead">New settings available</span>
  Now you can adjust the uploaded image quality, and upgrade your available storage space.
  <div slot="actions">
    <m3e-button>
      <m3e-rich-tooltip-action>Learn more</m3e-rich-tooltip-action>
    </m3e-button>
  </div>
</m3e-rich-tooltip>
```

## 📖 API Reference

### 🗂️ m3e-rich-tooltip

This section details the attributes, slots and CSS custom properties available for the `m3e-rich-tooltip` component.

#### ⚙️ Attributes

| Attribute    | Type                                                                                                              | Default         | Description                                                                  |
| ------------ | ----------------------------------------------------------------------------------------------------------------- | --------------- | ---------------------------------------------------------------------------- |
| `disabled`   | `boolean`                                                                                                         | `false`         | Whether the element is disabled.                                             |
| `for`        | `string`                                                                                                          |                 | The identifier of the interactive control to which this element is attached. |
| `hide-delay` | `number`                                                                                                          | `200`           | The amount of time, in milliseconds, before hiding the tooltip.              |
| `position`   | `"above-after" \| "above-before" \| "below-before" \| "below-after" \| "before" \| "after" \| "above" \| "below"` | `"below-after"` | The position of the tooltip.                                                 |
| `show-delay` | `number`                                                                                                          | `0`             | The amount of time, in milliseconds, before showing the tooltip.             |

#### 🧩 Slots

| Slot        | Description                                                      |
| ----------- | ---------------------------------------------------------------- |
| _(default)_ | The main supporting text of the tooltip.                         |
| `subhead`   | Optional subhead text displayed above the supporting content.    |
| `actions`   | Optional action elements displayed at the bottom of the tooltip. |

#### 🎛️ CSS Custom Properties

| Property                                         | Description                                                            |
| ------------------------------------------------ | ---------------------------------------------------------------------- |
| `--m3e-rich-tooltip-padding-top`                 | Top padding of the tooltip container.                                  |
| `--m3e-rich-tooltip-padding-bottom`              | Bottom padding of the tooltip container (when no actions are present). |
| `--m3e-rich-tooltip-padding-inline`              | Horizontal padding of the tooltip container.                           |
| `--m3e-rich-tooltip-max-width`                   | Maximum width of the tooltip surface.                                  |
| `--m3e-rich-tooltip-shape`                       | Border‑radius of the tooltip container.                                |
| `--m3e-rich-tooltip-container-color`             | Background color of the tooltip surface.                               |
| `--m3e-rich-tooltip-subhead-color`               | Color of the subhead text.                                             |
| `--m3e-rich-tooltip-subhead-font-size`           | Font size of the subhead text.                                         |
| `--m3e-rich-tooltip-subhead-font-weight`         | Font weight of the subhead text.                                       |
| `--m3e-rich-tooltip-subhead-line-height`         | Line height of the subhead text.                                       |
| `--m3e-rich-tooltip-subhead-tracking`            | Letter‑spacing of the subhead text.                                    |
| `--m3e-rich-tooltip-subhead-bottom-space`        | Space below the subhead before the supporting text.                    |
| `--m3e-rich-tooltip-supporting-text-color`       | Color of the supporting text.                                          |
| `--m3e-rich-tooltip-supporting-text-font-size`   | Font size of the supporting text.                                      |
| `--m3e-rich-tooltip-supporting-text-font-weight` | Font weight of the supporting text.                                    |
| `--m3e-rich-tooltip-supporting-text-line-height` | Line height of the supporting text.                                    |
| `--m3e-rich-tooltip-supporting-text-tracking`    | Letter‑spacing of the supporting text.                                 |
| `--m3e-rich-tooltip-actions-padding-inline`      | Horizontal padding applied to the actions slot area.                   |
| `--m3e-rich-tooltip-actions-top-space`           | Space above the actions slot.                                          |
| `--m3e-rich-tooltip-actions-bottom-space`        | Space below the actions slot.                                          |

### 🗂️ m3e-tooltip

This section details the attributes, slots and CSS custom properties available for the `m3e-tooltip` component.

#### ⚙️ Attributes

| Attribute    | Type                                        | Default   | Description                                                                  |
| ------------ | ------------------------------------------- | --------- | ---------------------------------------------------------------------------- |
| `disabled`   | `boolean`                                   | `false`   | Whether the element is disabled.                                             |
| `for`        | `string`                                    |           | The identifier of the interactive control to which this element is attached. |
| `hide-delay` | `number`                                    | `200`     | The amount of time, in milliseconds, before hiding the tooltip.              |
| `position`   | `"before" \| "after" \| "above" \| "below"` | `"below"` | The position of the tooltip.                                                 |
| `show-delay` | `number`                                    | `0`       | The amount of time, in milliseconds, before showing the tooltip.             |

#### 🧩 Slots

| Slot        | Description                         |
| ----------- | ----------------------------------- |
| _(default)_ | Renders the content of the tooltip. |

#### 🎛️ CSS Custom Properties

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
