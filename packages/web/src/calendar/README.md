# @m3e/web/calendar

The `m3e-calendar` component provides structured navigation and selection across month, year, and multi-year views. It supports single-date and range selection, applies disabled rules including minimum, maximum, and blackout constraints, and provides styling hooks for special date states.

```ts
import "@m3e/web/calendar";
```

## 🗂️ Elements

- `m3e-calendar` — A calendar used to select a date or date range.

## 🧪 Example

The following example illustrates use of the `m3e-calendar`. In this example, a calendar is displayed with a selected date.

```html
<m3e-calendar date="2025-12-13"></m3e-calendar>
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

| Event    | Description                             |
| -------- | --------------------------------------- |
| `change` | Emitted when the selected date changes. |

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
| `--m3e-calendar-date-font-size`                 | Font size of date cells in month view.                           |
| `--m3e-calendar-date-font-weight`               | Font weight of date cells in month view.                         |
| `--m3e-calendar-date-line-height`               | Line height of date cells in month view.                         |
| `--m3e-calendar-date-tracking`                  | Letter spacing of date cells in month view.                      |
| `--m3e-calendar-item-font-size`                 | Font size of items in year and multi-year views.                 |
| `--m3e-calendar-item-font-weight`               | Font weight of items in year and multi-year views.               |
| `--m3e-calendar-item-line-height`               | Line height of items in year and multi-year views.               |
| `--m3e-calendar-item-tracking`                  | Letter spacing of items in year and multi-year views.            |
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
