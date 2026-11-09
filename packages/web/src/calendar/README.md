# @m3e/web/calendar

The `m3e-calendar` component provides structured navigation and selection across month, year, and multi-year views. It supports single-date and range selection, applies disabled rules including minimum, maximum, and blackout constraints, and provides styling hooks for special date states.

Date string handling: date attributes accept ISO-style strings. `yyyy-MM-dd` is interpreted as a local date, and `yyyy-MM-ddTHH:mm:ss` as local date and time. A timestamp ending in `Z` or an offset such as `+05:30` represents an instant; its local date may differ from the date in the string. Timestamps may include three fractional-second digits. Unrecognized string formats convert to `null`. Date properties are `Date` objects or `null`.

```ts
import "@m3e/web/calendar";
```

## 🗂️ Elements

- `m3e-calendar` — A calendar used to select a date or date range.

## 🧪 Examples

Set the selected date and listen for changes. Provide `toLocaleDateString(date)`
to format a `Date` or `null`, and run the script after the elements are available
and the calendar is upgraded.

```html
<m3e-calendar id="calendar" date="2026-01-01"></m3e-calendar>
<div id="selected-date"></div>
```

```js
const calendar = document.querySelector("#calendar");
const selectedDate = document.querySelector("#selected-date");
selectedDate.textContent = "Selected Date:" + toLocaleDateString(calendar.date);
calendar.addEventListener("change", () => {
  selectedDate.textContent = "Selected Date:" + toLocaleDateString(calendar.date);
});
```

Use `start-at` to choose the initially displayed period.

```html
<m3e-calendar start-at="2026-01-01"></m3e-calendar>
```

Use `start-view` to choose `month` (default), `year`, or `multi-year`.

```html
<m3e-calendar start-view="multi-year"></m3e-calendar>
```

Set `range-start` to enable range selection and `range-end` for the end of the range.

```html
<m3e-calendar range-start="2026-01-01" range-end="2026-01-09" start-at="2026-01-01"></m3e-calendar>
```

Use `min-date` and `max-date` to restrict selectable dates.

```html
<m3e-calendar start-at="2026-04-01" min-date="2026-01-01" max-date="2026-04-30"></m3e-calendar>
```

Set the `blackoutDates` property to disable dates. Provide an `isWeekend(date)`
function that returns a boolean and run the script after the element is available
and upgraded.

```html
<m3e-calendar id="blackout-dates"></m3e-calendar>
```

```js
document.querySelector("#blackout-dates").blackoutDates = (date) => isWeekend(date);
```

Set the `specialDates` property to highlight dates. Provide an `isHoliday(date)`
function that returns a boolean and run the script after the element is available
and upgraded.

```html
<m3e-calendar id="special-dates" start-at="2026-04-01"></m3e-calendar>
```

```js
document.querySelector("#special-dates").specialDates = (date) => isHoliday(date);
```

## 📖 API Reference

This section details the attributes, slots, events and CSS custom properties available for the `m3e-calendar` component.

### ⚙️ Attributes

| Attribute                   | Type                                | Default               | Description                                                                     |
| --------------------------- | ----------------------------------- | --------------------- | ------------------------------------------------------------------------------- |
| `date`                      | `string`                            |                       | The selected date.                                                              |
| `start-at`                  | `string`                            |                       | A date specifying the period (month or year) to start the calendar in.          |
| `min-date`                  | `string`                            |                       | The minimum date that can be selected.                                          |
| `max-date`                  | `string`                            |                       | The maximum date that can be selected.                                          |
| `range-start`               | `string`                            |                       | Start of a date range.                                                          |
| `range-end`                 | `string`                            |                       | End of a date range.                                                            |
| `start-view`                | `"month" \| "year" \| "multi-year"` | `"month"`             | The initial view used to select a date.                                         |
| `previous-month-label`      | `string`                            | `"Previous month"`    | The accessible label given to the button used to move to the previous month.    |
| `next-month-label`          | `string`                            | `"Next month"`        | The accessible label given to the button used to move to the next month.        |
| `previous-year-label`       | `string`                            | `"Previous year"`     | The accessible label given to the button used to move to the previous year.     |
| `next-year-label`           | `string`                            | `"Next year"`         | The accessible label given to the button used to move to the next year.         |
| `previous-multi-year-label` | `string`                            | `"Previous 24 years"` | The accessible label given to the button used to move to the previous 24 years. |
| `next-multi-year-label`     | `string`                            | `"Next 24 years"`     | The accessible label given to the button used to move to the next 24 years.     |

### 🎰 Slots

| Slot | Description |

| -------- | ----------------------------------- |

| `header` | Renders the header of the calendar. |

### 📡 Events

| Event    | Description                                |
| -------- | ------------------------------------------ |
| `change` | Dispatched when the selected date changes. |

### 🎨 CSS Custom Properties

| Property                                        | Description                                                      |
| ----------------------------------------------- | ---------------------------------------------------------------- |
| `--m3e-calendar-container-color`                | Background color of the container surface.                       |
| `--m3e-calendar-container-elevation`            | Elevation shadow applied to the container surface.               |
| `--m3e-calendar-container-shape`                | Corner radius of the container surface.                          |
| `--m3e-calendar-padding`                        | Padding applied to the calendar header and body.                 |
| `--m3e-calendar-period-button-text-color`       | Text color used for the period-navigation buttons in the header. |
| `--m3e-calendar-weekday-font-size`              | Font size of weekday labels in month view.                       |
| `--m3e-calendar-weekday-font-weight`            | Font weight of weekday labels in month view.                     |
| `--m3e-calendar-weekday-line-height`            | Line height of weekday labels in month view.                     |
| `--m3e-calendar-weekday-tracking`               | Letter spacing of weekday labels in month view.                  |
| `--m3e-calendar-weekday-color`                  | Text color for weekday labels in month view.                     |
| `--m3e-calendar-date-font-size`                 | Font size of date cells in month view.                           |
| `--m3e-calendar-date-font-weight`               | Font weight of date cells in month view.                         |
| `--m3e-calendar-date-line-height`               | Line height of date cells in month view.                         |
| `--m3e-calendar-date-tracking`                  | Letter spacing of date cells in month view.                      |
| `--m3e-calendar-item-font-size`                 | Font size of items in year and multi-year views.                 |
| `--m3e-calendar-item-font-weight`               | Font weight of items in year and multi-year views.               |
| `--m3e-calendar-item-line-height`               | Line height of items in year and multi-year views.               |
| `--m3e-calendar-item-tracking`                  | Letter spacing of items in year and multi-year views.            |
| `--m3e-calendar-item-color`                     | Text color for date items.                                       |
| `--m3e-calendar-item-selected-color`            | Text color for selected date items.                              |
| `--m3e-calendar-item-selected-container-color`  | Background color for selected date items.                        |
| `--m3e-calendar-item-selected-ripple-color`     | Ripple color used when interacting with selected date items.     |
| `--m3e-calendar-item-selected-hover-color`      | Hover color used when interacting with selected date items.      |
| `--m3e-calendar-item-selected-focus-color`      | Hover color used when interacting with selected date items.      |
| `--m3e-calendar-date-current-outline-thickness` | Outline thickness used to indicate the current date.             |
| `--m3e-calendar-item-current-outline-color`     | Outline color used to indicate the current date.                 |
| `--m3e-calendar-item-special-color`             | Text color for dates marked as special.                          |
| `--m3e-calendar-item-special-container-color`   | Background color for dates marked as special.                    |
| `--m3e-calendar-item-special-ripple-color`      | Ripple color used when interacting with dates marked as special. |
| `--m3e-calendar-item-special-hover-color`       | Hover color used when interacting with dates marked as special.  |
| `--m3e-calendar-item-special-focus-color`       | Focus color used when interacting with dates marked as special.  |
| `--m3e-calendar-range-container-color`          | Background color applied to the selected date range.             |
| `--m3e-calendar-range-color`                    | Text color for dates within a selected range.                    |
| `--m3e-calendar-item-disabled-color`            | Color used for disabled date items.                              |
| `--m3e-calendar-item-disabled-color-opacity`    | Opacity applied to the disabled item color.                      |
| `--m3e-calendar-slide-animation-duration`       | Duration of slide transitions between calendar views.            |
