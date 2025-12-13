# @m3e/calendar

The `m3e-calendar` component provides structured navigation and selection across month, year, and multi-year views. It supports single-date and range selection, applies disabled rules including minimum, maximum, and blackout constraints, and provides styling hooks for special date states.

> **This package is part of [M3E](https://github.com/matraic/m3e) monorepo**, a unified suite of Material 3 web components. [Explore the docs](https://matraic.github.io/m3e) to see them in action.

## 📦 Installation

```bash
npm install @m3e/calendar
```

## 💻 Editor Integration

This package includes a [Custom Elements Manifest](https://github.com/webcomponents/custom-elements-manifest) to support enhanced editor tooling and developer experience.

### Visual Studio Code

To enable autocomplete and hover documentation for `@m3e/calendar`, install the [Custom Elements Manifest Language Server](https://marketplace.visualstudio.com/items?itemName=pwrs.cem-language-server-vscode) extension. It will automatically detect the manifest bundled with this package and surface tag names, attributes, slots, and events in supported files.

Alternately, you can explicitly reference the `html-custom-data.json` and `css-custom-data.json` in your workspace settings:

```json
{
  "html.customData": ["./node_modules/@m3e/calendar/dist/html-custom-data.json"],
  "css.customData": ["./node_modules/@m3e/calendar/dist/css-custom-data.json"]
}
```

## 🚀 Native Module Support

This package uses [JavaScript Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#module_specifiers). To use it directly in a browser without a bundler, use a module script similar to the following.

```html
<script type="module" src="/node_modules/@m3e/calendar/dist/index.js"></script>
```

You also need a module script for `@m3e/button`, `@m3e/icon-button`, and `@m3e/tooltip` due to being a dependency.

```html
<script type="module" src="/node_modules/@m3e/button/dist/index.js"></script>
<script type="module" src="/node_modules/@m3e/icon-button/dist/index.js"></script>
<script type="module" src="/node_modules/@m3e/tooltip/dist/index.js"></script>
```

In addition, you must use an [import map](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script/type/importmap) to include additional dependencies.

```html
<script type="importmap">
  {
    "imports": {
      "lit": "https://cdn.jsdelivr.net/npm/lit@3.3.0/+esm",
      "@m3e/core": "/node_modules/@m3e/core/dist/index.js",
      "@m3e/core/a11y": "/node_modules/@m3e/core/dist/a11y.js",
      "@m3e/core/anchoring": "/node_modules/@m3e/core/dist/anchoring.js",
      "@m3e/core/bidi": "/node_modules/@m3e/core/dist/bidi.js",
      "@m3e/core/platform": "/node_modules/@m3e/core/dist/platform.js"
    }
  }
</script>
```

> For production, use index.min.js, a11y.min.js, anchoring.min.js, bidi.min.js, and platform.min.js for faster load times.

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

| Slot     | Description                         |
| -------- | ----------------------------------- |
| `header` | Renders the header of the calendar. |

### 📡 Events

| Event    | Description                             |
| -------- | --------------------------------------- |
| `change` | Emitted when the selected date changes. |

### 🎨 CSS Custom Properties

| Property                                        | Description                                                      |
| ----------------------------------------------- | ---------------------------------------------------------------- |
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
| `--m3e-calendar-item-current-outline-thickness` | Outline thickness used to indicate the current date.             |
| `--m3e-calendar-item-current-outline-color`     | Outline color used to indicate the current date.                 |
| `--m3e-calendar-special-date-color`             | Text color for dates marked as special.                          |
| `--m3e-calendar-special-date-container-color`   | Background color for dates marked as special.                    |
| `--m3e-calendar-range-container-color`          | Background color applied to the selected date range.             |
| `--m3e-calendar-range-color`                    | Text color for dates within a selected range.                    |
| `--m3e-calendar-item-disabled-color`            | Color used for disabled date items.                              |
| `--m3e-calendar-item-disabled-color-opacity`    | Opacity applied to the disabled item color.                      |
| `--m3e-calendar-slide-animation-duration`       | Duration of slide transitions between calendar views.            |

## 🤝 Contributing

See the root monorepo `CONTRIBUTING.md` for guidelines on contributing to this package.

## 📄 License

This package is licensed under the MIT License.
