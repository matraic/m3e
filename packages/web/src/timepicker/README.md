# @m3e/web/timepicker

The `m3e-timepicker` component presents a temporary surface for selecting time using dial and
keyboard modes. It supports hour and minute selection across 12-hour and 24-hour formats, enforces minimum and
maximum constraints, and adapts between docked and modal layouts based on available space.

```ts
import "@m3e/web/timepicker";
```

## 🗂️ Elements

- `m3e-timepicker` — Presents a time picker on a temporary surface.
- `m3e-timepicker-input` — A keyboard-based time surface for choosing hours and minutes.
- `m3e-timepicker-dial` — A clock-face surface for selecting hours and minutes using a movable hand.
- `m3e-timepicker-toggle` — An element, nested within a clickable element, used to toggle a timepicker.

## 📖 API Reference

### 🗂️ Timepicker

This section details the attributes, events and CSS custom properties available for the `m3e-timepicker` component.

#### ⚙️ Attributes

| Attribute             | Type                                   | Default                 | Description                                  |
| --------------------- | -------------------------------------- | ----------------------- | -------------------------------------------- |
| `variant`             | `"docked" \| "modal" \| "auto"`        | `"docked"`              | The appearance variant of the picker.        |
| `mode`                | `"dial" \| "input" \| "auto"`          | `"dial"`                | The mode in which to select time.            |
| `orientation`         | `"vertical" \| "horizontal" \| "auto"` | `"vertical"`            | The orientation of the picker.               |
| `date`                | `string`                               |                         | The selected date/time value.                |
| `format`              | `"12" \| "24"`                         | `"12"`                  | Whether to use a 12-hour or 24-hour clock.   |
| `max-time`            | `string`                               |                         | The maximum time that can be selected.       |
| `min-time`            | `string`                               |                         | The minimum time that can be selected.       |
| `show-seconds`        | `boolean`                              | `false`                 | Whether to show seconds.                     |
| `confirm-label`       | `string`                               | `"OK"`                  | Label for the confirm button.                |
| `dismiss-label`       | `string`                               | `"Cancel"`              | Label for the dismiss button.                |
| `dial-label`          | `string`                               | `"Select time"`         | Label for the picker when in dial mode.      |
| `input-label`         | `string`                               | `"Edit time"`           | Label for the picker when in input mode.     |
| `hour-label`          | `string`                               | `"Hour"`                | Label for the hour field.                    |
| `minute-label`        | `string`                               | `"Minute"`              | Label for the minute field.                  |
| `second-label`        | `string`                               | `"Second"`              | Label for the second field.                  |
| `mode-toggle-label`   | `string`                               | `"Toggle input picker"` | Accessible label for the mode toggle button. |
| `hide-mode-toggle`    | `boolean`                              | `false`                 | Whether to hide the mode toggle button.      |
| `period-toggle-label` | `string`                               | `"AM or PM"`            | Accessible label for the period toggle.      |

#### 🔔 Events

| Event          | Description                                     |
| -------------- | ----------------------------------------------- |
| `change`       | Dispatched when the selected time is confirmed. |
| `beforetoggle` | Dispatched before the picker opens or closes.   |
| `toggle`       | Dispatched when the picker opens or closes.     |

#### 🎛️ CSS Custom Properties

| Property                                    | Description                                       |
| ------------------------------------------- | ------------------------------------------------- |
| `--m3e-timepicker-container-padding-block`  | Block padding inside the picker container.        |
| `--m3e-timepicker-container-padding-inline` | Inline padding inside the picker container.       |
| `--m3e-timepicker-container-color`          | Background color of the picker container.         |
| `--m3e-timepicker-container-elevation`      | Elevation shadow applied to the picker container. |
| `--m3e-timepicker-docked-container-color`   | Background color of the docked container.         |
| `--m3e-timepicker-docked-container-shape`   | Border radius of the docked container.            |
| `--m3e-timepicker-modal-container-color`    | Background color of the modal container.          |
| `--m3e-timepicker-modal-container-shape`    | Border radius of the modal container.             |
| `--m3e-timepicker-headline-color`           | Color of the headline text.                       |
| `--m3e-timepicker-actions-space`            | Space above the action buttons.                   |

> The `m3e-timepicker` container also exposes styling for the nested input and dial custom properties.

---

### 🗂️ Timepicker Input

This section details the attributes, events and CSS custom properties available for the `m3e-timepicker-input` component.

#### ⚙️ Attributes

| Attribute             | Type                             | Default        | Description                                |
| --------------------- | -------------------------------- | -------------- | ------------------------------------------ |
| `format`              | `"12" \| "24"`                   | `"12"`         | Whether to use a 12-hour or 24-hour clock. |
| `hide-labels`         | `boolean`                        | `false`        | Whether to hide the input field labels.    |
| `hour`                | `number`                         |                | The hour value, from 0..23.                |
| `max-time`            | `string`                         |                | The maximum time that can be selected.     |
| `min-time`            | `string`                         |                | The minimum time that can be selected.     |
| `minute`              | `number`                         |                | The minute value, from 0..59.              |
| `second`              | `number`                         |                | The second value, from 0..59.              |
| `show-seconds`        | `boolean`                        | `false`        | Whether to show seconds.                   |
| `orientation`         | `"horizontal" \| "vertical"`     | `"horizontal"` | The orientation of the input.              |
| `period`              | `string`                         |                | The 12-hour time period.                   |
| `view`                | `"hour" \| "minute" \| "second"` |                | The input view state.                      |
| `hour-label`          | `string`                         | `"Hour"`       | Label for the hour field.                  |
| `minute-label`        | `string`                         | `"Minute"`     | Label for the minute field.                |
| `second-label`        | `string`                         | `"Second"`     | Label for the second field.                |
| `period-toggle-label` | `string`                         | `"AM or PM"`   | Accessible label for the period toggle.    |

#### 🔔 Events

| Event         | Description                                |
| ------------- | ------------------------------------------ |
| `change`      | Dispatched when the selected time changes. |
| `view-change` | Dispatched when the input view changes.    |

#### 🎛️ CSS Custom Properties

| Property                                                  | Description                                  |
| --------------------------------------------------------- | -------------------------------------------- |
| `--m3e-timepicker-input-field-container-width`            | Width of the input field container.          |
| `--m3e-timepicker-input-field-height`                     | Height of the input fields.                  |
| `--m3e-timepicker-input-field-container-shape`            | Corner radius of the input field container.  |
| `--m3e-timepicker-input-field-font-size`                  | Font size of the input field text.           |
| `--m3e-timepicker-input-field-unselected-container-color` | Background color of unselected input fields. |

---

### �️ Timepicker Dial

This section details the attributes, events and CSS custom properties available for the `m3e-timepicker-dial` component.

#### ⚙️ Attributes

| Attribute      | Type                             | Default | Description                                |
| -------------- | -------------------------------- | ------- | ------------------------------------------ |
| `format`       | `"12" \| "24"`                   | `"12"`  | Whether to use a 12-hour or 24-hour clock. |
| `hour`         | `number`                         |         | The hour value, from 0..23.                |
| `max-time`     | `string`                         |         | The maximum time that can be selected.     |
| `min-time`     | `string`                         |         | The minimum time that can be selected.     |
| `minute`       | `number`                         |         | The minute value, from 0..59.              |
| `second`       | `number`                         |         | The second value, from 0..59.              |
| `show-seconds` | `boolean`                        | `false` | Whether to show seconds.                   |
| `period`       | `string`                         |         | The 12-hour time period.                   |
| `view`         | `"hour" \| "minute" \| "second"` |         | The current dial view.                     |

#### 🔔 Events

| Event         | Description                                |
| ------------- | ------------------------------------------ |
| `change`      | Dispatched when the selected time changes. |
| `view-change` | Dispatched when the dial view changes.     |

#### 🎛️ CSS Custom Properties

| Property                                | Description                             |
| --------------------------------------- | --------------------------------------- |
| `--m3e-timepicker-dial-container-size`  | Size of the dial container.             |
| `--m3e-timepicker-dial-container-color` | Background color of the dial container. |
| `--m3e-timepicker-dial-center-size`     | Size of the dial center indicator.      |
| `--m3e-timepicker-dial-handle-color`    | Color of the active handle.             |
| `--m3e-timepicker-dial-numeral-size`    | Size of the dial numerals.              |

---

### 🗂️ Timepicker Toggle

The `m3e-timepicker-toggle` element is used within a clickable parent element to open and close a connected `m3e-timepicker`. It manages ARIA popup semantics and invokes the picker through its parent control.
