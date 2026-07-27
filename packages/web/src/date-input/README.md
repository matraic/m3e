# @m3e/web/date-input

The `m3e-date-input` component provides a segmented input for editing date and/or time values. It supports date-only, time-only, and combined date/time entry, and integrates with `m3e-form-field`, `m3e-datepicker`, and `m3e-timepicker`. Each segment is independently editable for precise, accessible, form-friendly interaction.

```ts
import "@m3e/web/date-input";
```

## 🗂️ Elements

- `m3e-date-input` — A segmented input for entering date and/or time values.

## 🧪 Examples

The following example shows the `m3e-date-input` used with `m3e-form-field` and `m3e-datepicker`.

```html
<m3e-form-field>
  <label slot="label" for="fld1">Date Field</label>
  <m3e-date-input id="fld1"></m3e-date-input>
  <m3e-icon-button slot="suffix">
    <m3e-icon name="calendar_today"></m3e-icon>
    <m3e-datepicker-toggle for="picker"></m3e-datepicker-toggle>
  </m3e-icon-button>
  <span slot="hint">MM/DD/YYYY</span>
</m3e-form-field>
<m3e-datepicker id="picker" for="fld1"></m3e-datepicker>
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

| Property                            | Description                                      |
| ----------------------------------- | ------------------------------------------------ |
| `--m3e-date-input-color`            | Color of the date input text when enabled.       |
| `--m3e-date-input-disabled-color`   | Color of the date input text when disabled.      |
| `--m3e-date-input-disabled-opacity` | Opacity applied to the disabled date input text. |
