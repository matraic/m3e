# @m3e/web/date-input

The `m3e-date-input` component provides a segmented input for editing date and/or time values. It supports date-only, time-only, and combined date/time entry, and integrates with `m3e-form-field`, `m3e-datepicker`, and `m3e-timepicker`. Each segment is independently editable for precise, accessible, form-friendly interaction.

Date string handling: date attributes accept ISO-style strings. `yyyy-MM-dd` is
interpreted as a local date, and `yyyy-MM-ddTHH:mm:ss` as local date and time.
A timestamp ending in `Z` or an offset such as `+05:30` represents an instant;
its local date may differ from the date in the string. Timestamps may include
three fractional-second digits. Unrecognized string formats convert to `null`.
Date properties are `Date` objects or `null`.

```ts
import "@m3e/web/date-input";
```

## 🗂️ Elements

- `m3e-date-input` — A segmented input for entering date and/or time values.

## 🧪 Examples

Use a date input in a form field. Import `@m3e/web/form-field` for the form field.

```html
<m3e-form-field variant="outlined">
  <label slot="label" for="field">Date Field</label>
  <m3e-date-input id="field"></m3e-date-input>
  <span slot="hint">MM/DD/YYYY</span>
</m3e-form-field>
```

Set the initial value with the `value` attribute. Import `@m3e/web/form-field` for the form field.

```html
<m3e-form-field variant="outlined">
  <label slot="label" for="field">Date Field</label>
  <m3e-date-input id="field" value="2026-01-01"></m3e-date-input>
  <span slot="hint">MM/DD/YYYY</span>
</m3e-form-field>
```

Use `type` to edit time or date and time. Import `@m3e/web/form-field` for the form field.

```html
<m3e-form-field variant="outlined">
  <label slot="label" for="field1">Time Field</label>
  <m3e-date-input id="field1" type="time" value="2026-01-01T23:30:00Z"></m3e-date-input>
  <span slot="hint">HH:MM</span>
</m3e-form-field>

<m3e-form-field variant="outlined">
  <label slot="label" for="field2">Date-time Field</label>
  <m3e-date-input id="field2" type="datetime" value="2026-01-01T23:30:00Z"></m3e-date-input>
  <span slot="hint">MM/DD/YYYY HH:MM</span>
</m3e-form-field>
```

Bind date and time pickers to the date input using `for`. Import `@m3e/web/form-field` for the form field. Import `@m3e/web/icon-button` and `@m3e/web/icon` for the icon button and icon. Import `@m3e/web/datepicker` and `@m3e/web/timepicker` for the pickers and toggles.

```html
<m3e-form-field variant="outlined">
  <label slot="label" for="field1">Date Picker</label>
  <m3e-date-input id="field1"></m3e-date-input>
  <m3e-icon-button aria-label="Open calendar" slot="suffix">
    <m3e-icon name="calendar_today"></m3e-icon>
    <m3e-datepicker-toggle for="datepicker1"></m3e-datepicker-toggle>
  </m3e-icon-button>
  <span slot="hint">MM/DD/YYYY</span>
</m3e-form-field>
<m3e-datepicker id="datepicker1" for="field1"></m3e-datepicker>

<m3e-form-field variant="outlined">
  <label slot="label" for="field2">Time Picker</label>
  <m3e-date-input id="field2" type="time"></m3e-date-input>
  <m3e-icon-button aria-label="Open time picker" slot="suffix">
    <m3e-icon name="schedule"></m3e-icon>
    <m3e-timepicker-toggle for="timepicker1"></m3e-timepicker-toggle>
  </m3e-icon-button>
  <span slot="hint">HH:MM</span>
</m3e-form-field>
<m3e-timepicker id="timepicker1" for="field2"></m3e-timepicker>

<m3e-form-field variant="outlined">
  <label slot="label" for="field3">Datetime Picker</label>
  <m3e-date-input id="field3" type="datetime"></m3e-date-input>
  <m3e-icon-button aria-label="Open calendar" slot="suffix">
    <m3e-icon name="calendar_today"></m3e-icon>
    <m3e-datepicker-toggle for="datepicker2"></m3e-datepicker-toggle>
  </m3e-icon-button>
  <m3e-icon-button aria-label="Open time picker" slot="suffix">
    <m3e-icon name="schedule"></m3e-icon>
    <m3e-timepicker-toggle for="timepicker2"></m3e-timepicker-toggle>
  </m3e-icon-button>
  <span slot="hint">MM/DD/YYYY HH:MM</span>
</m3e-form-field>
<m3e-datepicker id="datepicker2" for="field3"></m3e-datepicker>
<m3e-timepicker id="timepicker2" for="field3"></m3e-timepicker>
```

Use `time-format` to select the hour format. Import `@m3e/web/form-field` for the form field.

```html
<m3e-form-field variant="outlined">
  <label slot="label" for="field1">Time Field</label>
  <m3e-date-input id="field1" type="time" time-format="24" value="2026-01-01T23:30:00Z">
  </m3e-date-input>
  <span slot="hint">HH:MM</span>
</m3e-form-field>

<m3e-form-field variant="outlined">
  <label slot="label" for="field2">Date-time Field</label>
  <m3e-date-input id="field2" type="datetime" time-format="24" value="2026-01-01T23:30:00Z">
  </m3e-date-input>
  <span slot="hint">MM/DD/YYYY HH:MM</span>
</m3e-form-field>
```

Use `show-seconds` to display the seconds segment. Import `@m3e/web/form-field` for the form field.

```html
<m3e-form-field variant="outlined">
  <label slot="label" for="field1">Time Field</label>
  <m3e-date-input id="field1" type="time" show-seconds value="2026-01-01T23:30:00Z">
  </m3e-date-input>
  <span slot="hint">HH:MM:SS</span>
</m3e-form-field>

<m3e-form-field variant="outlined">
  <label slot="label" for="field2">Date-time Field</label>
  <m3e-date-input id="field2" type="datetime" show-seconds value="2026-01-01T23:30:00Z">
  </m3e-date-input>
  <span slot="hint">MM/DD/YYYY HH:MM:SS</span>
</m3e-form-field>
```

Use `disabled` to disable the input. Import `@m3e/web/form-field` for the form field.

```html
<m3e-form-field variant="outlined">
  <label slot="label" for="field">Date Field</label>
  <m3e-date-input id="field" value="2026-01-01" disabled></m3e-date-input>
  <span slot="hint">MM/DD/YYYY</span>
</m3e-form-field>
```

Use `readonly` to prevent editing while retaining focus and segment navigation. Import `@m3e/web/form-field` for the form field.

```html
<m3e-form-field variant="outlined">
  <label slot="label" for="field">Date Field</label>
  <m3e-date-input id="field" value="2026-01-01" readonly></m3e-date-input>
  <span slot="hint">MM/DD/YYYY</span>
</m3e-form-field>
```

Use `required` to require a value. Import `@m3e/web/form-field` for the form field.

```html
<m3e-form-field variant="outlined">
  <label slot="label" for="field">Date Field</label>
  <m3e-date-input id="field" required></m3e-date-input>
  <span slot="hint">MM/DD/YYYY</span>
</m3e-form-field>
```

Use `min-date` and `max-date` to validate date bounds. Import `@m3e/web/form-field` for the form field.

```html
<m3e-form-field variant="outlined">
  <label slot="label" for="field">Date Field</label>
  <m3e-date-input id="field" value="2026-01-01" min-date="2026-01-01" max-date="2026-04-30">
  </m3e-date-input>
  <span slot="hint">MM/DD/YYYY</span>
</m3e-form-field>
```

Set `blackoutDates` to a predicate that marks dates invalid. Provide an input with id `blackout-dates` and an `isWeekend(date)` function that returns a boolean. Run the script after the element is available and upgraded.

```js
document.querySelector("#blackout-dates").blackoutDates = (date) => isWeekend(date);
```

Use `min-time` and `max-time` to validate time bounds. Import `@m3e/web/form-field` for the form field.

```html
<m3e-form-field variant="outlined">
  <label slot="label" for="field">Time Field</label>
  <m3e-date-input
    id="field"
    type="time"
    value="2026-01-01T13:15:00Z"
    min-time="8:15 AM"
    max-time="5:30 PM"
  ></m3e-date-input>
  <span slot="hint">HH:MM</span>
</m3e-form-field>
```

Set `blackoutTimes` to a predicate that marks times invalid. Provide an input with id `blackout-times`. Run the script after the element is available and upgraded.

```js
document.querySelector("#blackout-times").blackoutTimes = (t) => t.hour < 8 || t.hour > 18;
```

## 📖 API Reference

This section details the attributes, events, and CSS custom properties available for the `m3e-date-input` component.

### ⚙️ Attributes

| Attribute      | Type                             | Default    | Description                                                               |
| -------------- | -------------------------------- | ---------- | ------------------------------------------------------------------------- |
| `value`        | `Date \| null`                   | `null`     | The value of the input.                                                   |
| `type`         | `"date" \| "time" \| "datetime"` | `"date"`   | The interaction mode for editing date and/or time values.                 |
| `show-seconds` | `boolean`                        | `false`    | Whether to show seconds.                                                  |
| `time-format`  | `"12" \| "24"`                   | `"12"`     | Format used when editing time values.                                     |
| `min-date`     | `Date \| null`                   | `null`     | The minimum date that can be selected.                                    |
| `max-date`     | `Date \| null`                   | `null`     | The maximum date that can be selected.                                    |
| `min-time`     | `TimeParts \| null`              | `null`     | The minimum time that can be selected.                                    |
| `max-time`     | `TimeParts \| null`              | `null`     | The maximum time that can be selected.                                    |
| `month-label`  | `string`                         | `"Month"`  | Accessible label for the month segment.                                   |
| `day-label`    | `string`                         | `"Day"`    | Accessible label for the day segment.                                     |
| `year-label`   | `string`                         | `"Year"`   | Accessible label for the year segment.                                    |
| `hour-label`   | `string`                         | `"Hour"`   | Accessible label for the hour segment.                                    |
| `minute-label` | `string`                         | `"Minute"` | Accessible label for the minute segment.                                  |
| `second-label` | `string`                         | `"Second"` | Accessible label for the second segment.                                  |
| `period-label` | `string`                         | `"Period"` | Accessible label for the period segment.                                  |
| `disabled`     | `boolean`                        | `false`    | Whether the element is disabled.                                          |
| `readonly`     | `boolean`                        | `false`    | Whether the element is read-only.                                         |
| `required`     | `boolean`                        | `false`    | Whether a value is required for the element.                              |
| `name`         | `string`                         | `""`       | The name that identifies the element when submitting the associated form. |

### 🔔 Events

| Event         | Description                                                                      |
| ------------- | -------------------------------------------------------------------------------- |
| `beforeinput` | Dispatched before the value changes.                                             |
| `input`       | Dispatched when the value changes.                                               |
| `change`      | Dispatched when the value changes.                                               |
| `invalid`     | Dispatched when a form is submitted and the element fails constraint validation. |

### 🎛️ CSS Custom Properties

| Property                                   | Description                                                       |
| ------------------------------------------ | ----------------------------------------------------------------- |
| `--m3e-date-input-color`                   | Color of the date input text when enabled.                        |
| `--m3e-date-input-disabled-color`          | Color of the date input text when disabled.                       |
| `--m3e-date-input-disabled-opacity`        | Opacity applied to the disabled date input text.                  |
| `--m3e-date-input-focused-container-color` | Background color of the selected date input segment when focused. |
| `--m3e-date-input-focused-color`           | Text color of the selected date input segment when focused.       |
