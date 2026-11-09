# @m3e/web/datepicker

The `m3e-datepicker` component presents a temporary, structured surface for selecting dates across
month, year, and multi-year views. It supports single-date and range selection, enforces minimum, maximum, and
blackout constraints, and exposes styling hooks for highlighting special date states.

Date string handling: date attributes accept ISO-style strings. `yyyy-MM-dd` is
interpreted as a local date, and `yyyy-MM-ddTHH:mm:ss` as local date and time.
A timestamp ending in `Z` or an offset such as `+05:30` represents an instant;
its local date may differ from the date in the string. Timestamps may include
three fractional-second digits. Unrecognized string formats convert to `null`.
Date properties are `Date` objects or `null`.

```ts
import "@m3e/web/datepicker";
```

## 🗂️ Elements

- `m3e-datepicker` — A Material 3 date picker displayed on a temporary surface.
- `m3e-datepicker-toggle` — An element used to toggle a date picker from a parent clickable element.

## 🧪 Examples

Nest a datepicker toggle in a clickable element and connect it to the picker using `for`. Import `@m3e/web/form-field` for the form field. Import `@m3e/web/icon-button` and `@m3e/web/icon` for the icon button and icon. Give the icon button an accessible label. With a native input, handle the picker's `change` event to update the field.

```html
<m3e-form-field variant="outlined">
  <label slot="label" for="field">Date Field</label>
  <input autocomplete="off" id="field" />
  <m3e-icon-button slot="suffix">
    <m3e-icon name="calendar_today"></m3e-icon>
    <m3e-datepicker-toggle for="datepicker"></m3e-datepicker-toggle>
  </m3e-icon-button>
  <span slot="hint">MM/DD/YYYY</span>
</m3e-form-field>
<m3e-datepicker id="datepicker"></m3e-datepicker>
```

Bind the datepicker to a segmented date input using `for`. Import `@m3e/web/form-field` for the form field. Import `@m3e/web/icon-button` and `@m3e/web/icon` for the icon button and icon. Import `@m3e/web/date-input` for the input.

```html
<m3e-form-field variant="outlined">
  <label slot="label" for="field">Date Picker</label>
  <m3e-date-input id="field"></m3e-date-input>
  <m3e-icon-button aria-label="Open calendar" slot="suffix">
    <m3e-icon name="calendar_today"></m3e-icon>
    <m3e-datepicker-toggle for="datepicker"></m3e-datepicker-toggle>
  </m3e-icon-button>
  <span slot="hint">MM/DD/YYYY</span>
</m3e-form-field>
<m3e-datepicker id="datepicker" for="field"></m3e-datepicker>
```

Use `variant` to select `docked` (default), `modal`, or `auto`. Provide a toggle or open the picker programmatically.

```html
<m3e-datepicker variant="auto"></m3e-datepicker>
```

Set `date` and use `clearable` to allow clearing. The form field and toggle are omitted; provide a native input with id `field` and a `toLocaleDateString(date)` function that formats a `Date` or `null`. Run the script after the element is available and upgraded.

```html
<!-- Form field omitted for brevity -->
<m3e-datepicker id="datepicker" date="2026-01-01" clearable></m3e-datepicker>
```
```js
const picker = document.querySelector("#datepicker");
const field = document.querySelector("#field");
field.value = toLocaleDateString(picker.date);
picker.addEventListener("change", () => {
  field.value = toLocaleDateString(picker.date);
});
```

Use `start-at` to select the initially displayed period. The form field and toggle are omitted.

```html
<!-- Form field omitted for brevity -->
<m3e-datepicker id="datepicker" start-at="2026-01-01"></m3e-datepicker>
```

Use `start-view` to select `month` (default), `year`, or `multi-year`. The form field and toggle are omitted.

```html
<!-- Form field omitted for brevity -->
<m3e-datepicker id="datepicker" start-view="multi-year"></m3e-datepicker>
```

Use `range-start` and `range-end` for a date range. Import `@m3e/web/form-field` for the form field. Import `@m3e/web/icon-button` and `@m3e/web/icon` for the icon button and icon. Give the icon button an accessible label. Provide `toLocaleDateString(date)` to format a `Date` or `null`, and run the script after the elements are available and upgraded.

```html
<m3e-form-field variant="outlined">
  <label slot="label" for="field">Date Range Field</label>
  <input autocomplete="off" id="field" />
  <m3e-icon-button slot="suffix">
    <m3e-icon name="calendar_today"></m3e-icon>
    <m3e-datepicker-toggle for="range-picker"></m3e-datepicker-toggle>
  </m3e-icon-button>
  <span slot="hint">MM/DD/YYYY - MM/DD/YYYY</span>
</m3e-form-field>

<m3e-datepicker
  id="range-picker"
  range-start="2026-01-01"
  range-end="2026-01-09"
  start-at="2026-01-01"
></m3e-datepicker>
```
```js
const picker = document.querySelector("#range-picker");
const field = document.querySelector("#field");
field.value = toLocaleDateString(picker.rangeStart) + " - " + toLocaleDateString(picker.rangeEnd);
picker.addEventListener("change", () => {
  field.value = toLocaleDateString(picker.rangeStart) + " - " + toLocaleDateString(picker.rangeEnd);
});
```

Use `min-date` and `max-date` to restrict selectable dates. The form field and toggle are omitted.

```html
<!-- Form field omitted for brevity -->
<m3e-datepicker
  id="picker1"
  start-at="2026-04-01"
  min-date="2026-01-01"
  max-date="2026-04-30"
></m3e-datepicker>
```

Set `blackoutDates` to a predicate that disables dates. Provide a picker with id `blackout-dates` and an `isWeekend(date)` function that returns a boolean. Run the script after the element is available and upgraded.

```js
document.querySelector("#blackout-dates").blackoutDates = (date) => isWeekend(date);
```

Set `specialDates` to a predicate that highlights dates. Provide a picker with id `special-dates` and an `isHoliday(date)` function that returns a boolean. Run the script after the element is available and upgraded.

```js
document.querySelector("#special-dates").specialDates = (date) => isHoliday(date);
```

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
| `range`                     | `boolean`                           | `false`               | Whether a range of dates can be selected.                                             |
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

| Event          | Description                                         |
| -------------- | --------------------------------------------------- |
| `change`       | Dispatched when the selected date or range changes. |
| `beforetoggle` | Emitted before the toggle state changes.            |
| `toggle`       | Emitted after the toggle state has changed.         |

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
