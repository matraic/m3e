# @m3e/web/datepicker

The `m3e-datepicker` component presents a Material 3‑aligned date‑selection experience. It supports single‑date and range selection, docked and modal variants, anchored positioning, ARIA accessibility, focus management, and theming via CSS custom properties.

```ts
import "@m3e/web/datepicker";
```

## 🗂️ Elements

- `m3e-datepicker` — A Material 3 date picker displayed on a temporary surface.
- `m3e-datepicker-toggle` — An element used to toggle a date picker from a parent clickable element.

## 📖 API Reference

This section details the attributes, events, and CSS custom properties available for the m3e-datepicker component.

### ⚙️ Attributes

| Attribute                   | Type                                | Default               | Description                                                                           |
| --------------------------- | ----------------------------------- | --------------------- | ------------------------------------------------------------------------------------- |
| `variant`                   | `"docked" \| "modal" \| "auto"`     | `"docked"`            | The appearance variant of the picker.                                                 |
| `date`                      | `string`                            |                       | The selected date.                                                                    |
| `start-at`                  | `string`                            |                       | A date specifying the period (month or year) to start the calendar in.                |
| `min-date`                  | `string`                            |                       | The minimum date that can be selected.                                                |
| `max-date`                  | `string`                            |                       | The maximum date that can be selected.                                                |
| `range-start`               | `string`                            |                       | Start of a date range.                                                                |
| `range-end`                 | `string`                            |                       | End of a date range.                                                                  |
| `start-view`                | `"month" \| "year" \| "multi-year"` | `"month"`             | The initial view used to select a date.                                               |
| `previous-month-label`      | `string`                            | `"Previous month"`    | The accessible label given to the button used to move to the previous month.          |
| `next-month-label`          | `string`                            | `"Next month"`        | The accessible label given to the button used to move to the next month.              |
| `previous-year-label`       | `string`                            | `"Previous year"`     | The accessible label given to the button used to move to the previous year.           |
| `next-year-label`           | `string`                            | `"Next year"`         | The accessible label given to the button used to move to the next year.               |
| `previous-multi-year-label` | `string`                            | `"Previous 24 years"` | The accessible label given to the button used to move to the previous 24 years.       |
| `next-multi-year-label`     | `string`                            | `"Next 24 years"`     | The accessible label given to the button used to move to the next 24 years.           |
| `clearable`                 | `boolean`                           | `false`               | Whether the user can clear the selected date and close the picker.                    |
| `clear-label`               | `string`                            | `"Clear"`             | The label given to the button used to clear the selected date and close the picker.   |
| `confirm-label`             | `string`                            | `"OK"`                | The label given to the button used to apply the selected date and close the picker.   |
| `dismiss-label`             | `string`                            | `"Cancel"`            | The label given to the button used to discard the selected date and close the picker. |
| `label`                     | `string`                            | `"Select date"`       | The label given to the picker.                                                        |

### 🔔 Events

| Event          | Description                                      |
| -------------- | ------------------------------------------------ |
| `change`       | Emitted when the selected date or range changes. |
| `beforetoggle` | Emitted before the toggle state changes.         |
| `toggle`       | Emitted after the toggle state has changed.      |

### 🎛️ CSS Custom Properties

| Property                                             | Description                                            |
| ---------------------------------------------------- | ------------------------------------------------------ |
| `--m3e-datepicker-container-padding-block`           | Block‑axis padding of the date picker container.       |
| `--m3e-datepicker-container-padding-inline`          | Inline‑axis padding of the date picker container.      |
| `--m3e-datepicker-container-color`                   | Background color of the standard container surface.    |
| `--m3e-datepicker-container-elevation`               | Elevation shadow applied to the container surface.     |
| `--m3e-datepicker-modal-headline-color`              | Color used for the modal headline text.                |
| `--m3e-datepicker-modal-headline-font-size`          | Font size used for the modal headline text.            |
| `--m3e-datepicker-modal-headline-font-weight`        | Font weight used for the modal headline text.          |
| `--m3e-datepicker-modal-headline-line-height`        | Line height used for the modal headline text.          |
| `--m3e-datepicker-modal-headline-tracking`           | Letter spacing used for the modal headline text.       |
| `--m3e-datepicker-modal-supporting-text-color`       | Color used for supporting text in modal mode.          |
| `--m3e-datepicker-modal-supporting-text-font-size`   | Font size used for supporting text in modal mode.      |
| `--m3e-datepicker-modal-supporting-text-font-weight` | Font weight used for supporting text in modal mode.    |
| `--m3e-datepicker-modal-supporting-text-line-height` | Line height used for supporting text in modal mode.    |
| `--m3e-datepicker-modal-supporting-text-tracking`    | Letter spacing used for supporting text in modal mode. |
| `--m3e-datepicker-actions-padding-inline`            | Inline‑axis padding of the action row.                 |
| `--m3e-datepicker-docked-container-color`            | Background color of the container in docked mode.      |
| `--m3e-datepicker-docked-container-shape`            | Corner radius of the container in docked mode.         |
| `--m3e-datepicker-modal-container-color`             | Background color of the container in modal mode.       |
| `--m3e-datepicker-modal-container-shape`             | Corner radius of the container in modal mode.          |
| `--m3e-divider-thickness`                            | Thickness of divider elements within the picker.       |
| `--m3e-divider-color`                                | Color of divider rules within the picker.              |
| `--m3e-dialog-scrim-color`                           | Base color used for the modal scrim behind the picker. |
| `--m3e-dialog-scrim-opacity`                         | Opacity applied to the scrim color in modal mode.      |
