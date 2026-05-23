# @m3e/web/expansion-panel

The `@m3e/web/expansion-panel` module provides expressive, accessible components for organizing content in collapsible sections and coordinated groups. It includes:

- **`m3e-expansion-panel`** — An accessible, animated details-summary view for organizing content in collapsible sections. Supports custom header, content, actions, and toggle icon slots, configurable toggle position and direction, open/close states, lifecycle events, and rich theming via CSS custom properties for elevation, shape, spacing, and color.

- **`m3e-accordion`** — Organizes multiple expansion panels into a coordinated, accessible group. Supports single or multiple open panels via the `multi` attribute, expressive theming and shape control for grouped layouts, and manages open/close state across child panels for interactive disclosure patterns.

```ts
import "@m3e/web/expansion-panel";
```

## 🗂️ Elements

- `m3e-expansion-panel` — An expandable details-summary view.
- `m3e-accordion` — Combines multiple expansion panels in to an accordion.

## 🧪 Examples

The following example illustrates the basic use of the `m3e-accordion` and `m3e-expansion-panel` components.

```html
<m3e-accordion>
  <m3e-expansion-panel>
    <span slot="header">Panel 1</span>
    I am content for the first expansion panel
  </m3e-expansion-panel>
  <m3e-expansion-panel>
    <span slot="header">Panel 2</span>
    I am content for the second expansion panel
  </m3e-expansion-panel>
</m3e-accordion>
```

## 📖 API Reference

### 🗂️ Accordion

This section details the attributes, slots and CSS custom properties available for the `m3e-accordion` component.

#### ⚙️ Attributes

| Attribute | Type      | Default | Description                                                     |
| --------- | --------- | ------- | --------------------------------------------------------------- |
| `multi`   | `boolean` | `false` | Whether multiple expansion panels can be open at the same time. |

#### 🧩 Slots

| Slot        | Description                          |
| ----------- | ------------------------------------ |
| _(default)_ | Renders the panels of the accordion. |

#### 🎛️ CSS Custom Properties (applies to slotted panels)

| Property                                | Description                          |
| --------------------------------------- | ------------------------------------ |
| `--m3e-expansion-panel-container-color` | Background color for grouped panels. |
| `--m3e-expansion-panel-elevation`       | Elevation for grouped panels.        |
| `--m3e-expansion-panel-open-shape`      | Shape for open grouped panels.       |
| `--m3e-expansion-panel-shape`           | Shape for closed grouped panels.     |

---

### 🗂️ Expansion Panel

This section details the attributes, events, slots and CSS custom properties available for the `m3e-expansion-panel` component.

#### 🏷️ Attributes

| Attribute          | Type               | Default | Description                            |
| ------------------ | ------------------ | ------- | -------------------------------------- |
| `disabled`         | `boolean`          | `false` | Whether the element is disabled.       |
| `hide-toggle`      | `boolean`          | `false` | Whether to hide the expansion toggle.  |
| `open`             | `boolean`          | `false` | Whether the panel is expanded.         |
| `toggle-direction` | `"start" \| "end"` | `"end"` | The direction of the expansion toggle. |
| `toggle-position`  | `"start" \| "end"` | `"end"` | The position of the expansion toggle.  |

#### 🔔 Events

| Event Name | Description                                          |
| ---------- | ---------------------------------------------------- |
| `opening`  | Dispatched when the expansion panel begins to open.  |
| `opened`   | Dispatched when the expansion panel has opened.      |
| `closing`  | Dispatched when the expansion panel begins to close. |
| `closed`   | Dispatched when the expansion panel has closed.      |

#### 🧩 Slots

| Slot          | Description                           |
| ------------- | ------------------------------------- |
| _(default)_   | Renders the detail of the panel.      |
| `header`      | Renders the header content.           |
| `actions`     | Renders the actions bar of the panel. |
| `toggle-icon` | Renders the expansion toggle icon.    |

#### 🎛️ CSS Custom Properties

| Property                                          | Description                                         |
| ------------------------------------------------- | --------------------------------------------------- |
| `--m3e-expansion-header-collapsed-height`         | Height of the header when collapsed.                |
| `--m3e-expansion-header-expanded-height`          | Height of the header when expanded.                 |
| `--m3e-expansion-header-padding-left`             | Left padding inside the header.                     |
| `--m3e-expansion-header-padding-right`            | Right padding inside the header.                    |
| `--m3e-expansion-header-spacing`                  | Spacing between header elements.                    |
| `--m3e-expansion-header-toggle-icon-size`         | Size of the toggle icon.                            |
| `--m3e-expansion-header-font-size`                | Font size of the header text.                       |
| `--m3e-expansion-header-font-weight`              | Font weight of the header text.                     |
| `--m3e-expansion-header-line-height`              | Line height of the header text.                     |
| `--m3e-expansion-header-tracking`                 | Letter spacing of the header text.                  |
| `--m3e-expansion-panel-text-color`                | Color of the panel's text content.                  |
| `--m3e-expansion-panel-disabled-text-color`       | Color of the panel's text content, when disabled.   |
| `--m3e-expansion-panel-disabled-text-opacity`     | Opacity of the panel's text content, when disabled. |
| `--m3e-expansion-panel-container-color`           | Background color of the panel container.            |
| `--m3e-expansion-panel-elevation`                 | Elevation level when collapsed.                     |
| `--m3e-expansion-panel-shape`                     | Shape (e.g. border radius) when collapsed.          |
| `--m3e-expansion-panel-open-elevation`            | Elevation level when expanded.                      |
| `--m3e-expansion-panel-open-shape`                | Shape (e.g. border radius) when expanded.           |
| `--m3e-expansion-panel-content-padding`           | Padding around the content area.                    |
| `--m3e-expansion-panel-actions-spacing`           | Spacing between action buttons/elements.            |
| `--m3e-expansion-panel-actions-padding`           | Padding around the actions section.                 |
| `--m3e-expansion-panel-actions-divider-thickness` | Thickness of the divider above actions.             |
| `--m3e-expansion-panel-actions-divider-color`     | Color of the divider above actions.                 |
