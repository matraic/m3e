# @m3e/web/segmented-button

The `m3e-segmented-button` and `m3e-button-segment` components allows users to select one or more options from a horizontal group. Each segment behaves like a toggle-able button, supporting icon and label content, selection state, and accessibility roles. Built with Material Design 3 principles, it adapts shape, color, and ripple feedback based on interaction state and input modality. Segments are visually unified but independently interactive.

```ts
import "@m3e/web/segmented-button";
```

## 🗂️ Elements

- `m3e-segmented-button` — A button that allows a user to select from a limited set of options.
- `m3e-button-segment` — A option that can be selected within a segmented button.

## 🧪 Example

The following example illustrates a single-select segmented button with four segments.

```html
<m3e-segmented-button>
  <m3e-button-segment checked>8 oz</m3e-button-segment>
  <m3e-button-segment>12 oz</m3e-button-segment>
  <m3e-button-segment>16 oz</m3e-button-segment>
  <m3e-button-segment>20 oz</m3e-button-segment>
</m3e-segmented-button>
```

## 📖 API Reference

### 🗂️ m3e-segmented-button

This section details the attributes, slots, events and CSS custom properties available for the `m3e-segmented-button` component.

#### 🛠️ Attributes

| Attribute                  | Type      | Default | Description                                                               |
| -------------------------- | --------- | ------- | ------------------------------------------------------------------------- |
| `disabled`                 | `boolean` | `false` | Whether the element is disabled.                                          |
| `hide-selection-indicator` | `boolean` | `false` | Whether to hide the selection indicator.                                  |
| `multi`                    | `boolean` | `false` | Whether multiple options can be selected.                                 |
| `name`                     | `string`  |         | The name that identifies the element when submitting the associated form. |

#### 🔔 Events

| Event    | Description                                          |
| -------- | ---------------------------------------------------- |
| `input`  | Emitted when the checked state of a segment changes. |
| `change` | Emitted when the checked state of a segment changes. |

#### 🧩 Slots

| Slot        | Description                         |
| ----------- | ----------------------------------- |
| _(default)_ | Renders the segments of the button. |

#### 🎛️ CSS Custom Properties

| Property                             | Description                                                |
| ------------------------------------ | ---------------------------------------------------------- |
| `--m3e-segmented-button-start-shape` | Border radius for the first segment in a segmented button. |
| `--m3e-segmented-button-end-shape`   | Border radius for the last segment in a segmented button.  |

### 🗂️ m3e-button-segment

This section details the attributes, slots, events and CSS custom properties available for the `m3e-button-segment` component.

#### 🛠️ Attributes

| Attribute  | Type      | Default | Description                                     |
| ---------- | --------- | ------- | ----------------------------------------------- |
| `checked`  | `boolean` | `false` | Whether the element is checked.                 |
| `disabled` | `boolean` | `false` | Whether the element is disabled.                |
| `value`    | `string`  | `"on"`  | A string representing the value of the segment. |

#### 🔔 Events

| Event    | Description                             |
| -------- | --------------------------------------- |
| `input`  | Emitted when the checked state changes. |
| `change` | Emitted when the checked state changes. |

#### 🧩 Slots

| Slot        | Description                                |
| ----------- | ------------------------------------------ |
| _(default)_ | Renders the label of the option.           |
| `icon`      | Renders an icon before the option's label. |

#### 🎛️ CSS Custom Properties

| Property                                                  | Description                                         |
| --------------------------------------------------------- | --------------------------------------------------- |
| `--m3e-segmented-button-height`                           | Total height of the segmented button.               |
| `--m3e-segmented-button-outline-thickness`                | Thickness of the button’s border.                   |
| `--m3e-segmented-button-outline-color`                    | Color of the button’s border.                       |
| `--m3e-segmented-button-padding-start`                    | Padding on the leading edge of the button content.  |
| `--m3e-segmented-button-padding-end`                      | Padding on the trailing edge of the button content. |
| `--m3e-segmented-button-spacing`                          | Horizontal gap between icon and label.              |
| `--m3e-segmented-button-font-size`                        | Font size of the label text.                        |
| `--m3e-segmented-button-font-weight`                      | Font weight of the label text.                      |
| `--m3e-segmented-button-line-height`                      | Line height of the label text.                      |
| `--m3e-segmented-button-tracking`                         | Letter spacing of the label text.                   |
| `--m3e-segmented-button-with-icon-padding-start`          | Leading padding when an icon is present.            |
| `--m3e-segmented-button-icon-size`                        | Font size of the icon.                              |
| `--m3e-segmented-button-selected-container-color`         | Background color of a selected segment.             |
| `--m3e-segmented-button-selected-container-hover-color`   | Hover state-layer color for selected segments.      |
| `--m3e-segmented-button-selected-container-focus-color`   | Focus state-layer color for selected segments.      |
| `--m3e-segmented-button-selected-ripple-color`            | Ripple color for selected segments.                 |
| `--m3e-segmented-button-selected-label-text-color`        | Label text color for selected segments.             |
| `--m3e-segmented-button-selected-icon-color`              | Icon color for selected segments.                   |
| `--m3e-segmented-button-unselected-container-hover-color` | Hover state-layer color for unselected segments.    |
| `--m3e-segmented-button-unselected-container-focus-color` | Focus state-layer color for unselected segments.    |
| `--m3e-segmented-button-unselected-ripple-color`          | Ripple color for unselected segments.               |
| `--m3e-segmented-button-unselected-label-text-color`      | Label text color for unselected segments.           |
| `--m3e-segmented-button-unselected-icon-color`            | Icon color for unselected segments.                 |
| `--m3e-segmented-button-disabled-outline-color`           | Base color for disabled segment borders.            |
| `--m3e-segmented-button-disabled-outline-opacity`         | Opacity applied to disabled segment borders.        |
| `--m3e-segmented-button-disabled-label-text-color`        | Base color for disabled label text.                 |
| `--m3e-segmented-button-disabled-label-text-opacity`      | Opacity applied to disabled label text.             |
| `--m3e-segmented-button-disabled-icon-color`              | Base color for disabled icons.                      |
| `--m3e-segmented-button-disabled-icon-opacity`            | Opacity applied to disabled icons.                  |
