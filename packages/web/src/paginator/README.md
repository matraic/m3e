# @m3e/web/paginator

The `m3e-paginator` component is a compact, accessible paginator control for navigating paged data sets. It provides semantic first/previous/next/last navigation controls and an optional page-size selector.

```ts
import "@m3e/web/paginator";
```

## 🗂️ Elements

- `m3e-paginator` — Provides navigation for paged information, typically used with a table.

## 🧪 Example

The following example illustrates use of the `m3e-paginator`. In this example, there are 300 total records and the first/last navigation controls are shown.

```html
<m3e-paginator show-first-last-buttons length="300"></m3e-paginator>
```

## 📖 API Reference

This section details the attributes, slots, events and CSS custom properties available for the `m3e-paginator` component.

### ⚙️ Attributes

| Attribute                 | Type              | Default             | Description                                                                 |
| ------------------------- | ----------------- | ------------------- | --------------------------------------------------------------------------- |
| `disabled`                | `boolean`         | `false`             | Whether the element is disabled.                                            |
| `first-page-label`        | `string`          | `"First page"`      | The accessible label given to the button used to move to the first page.    |
| `hide-page-size`          | `boolean`         | `false`             | Whether to hide page size selection.                                        |
| `items-per-page-label`    | `string`          | `"Items per page:"` | The label for the page size selector.                                       |
| `last-page-label`         | `string`          | `"Last page"`       | The accessible label given to the button used to move to the last page.     |
| `length`                  | `number`          | `0`                 | The length of the total number of items which are being paginated.          |
| `next-page-label`         | `string`          | `"Next page"`       | The accessible label given to the button used to move to the next page.     |
| `page-index`              | `number`          | `0`                 | The zero-based page index of the displayed list of items.                   |
| `page-size`               | `number \| "all"` | `50`                | The number of items to display in a page.                                   |
| `page-sizes`              | `string`          | `"5,10,25,50,100"`  | A comma separated list of available page sizes.                             |
| `page-size-variant`       | `string`          | `"outlined"`        | The appearance variant of the page size field.                              |
| `previous-page-label`     | `string`          | `"Previous page"`   | The accessible label given to the button used to move to the previous page. |
| `show-first-last-buttons` | `boolean`         | `false`             | Whether to show first/last buttons.                                         |

### 🔔 Events

| Event  | Description                                                                                                                                         |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `page` | Emitted when a user selects a different page size or navigates to another page. Event detail: `{ previousPageIndex, pageIndex, pageSize, length }`. |

### 🧩 Slots

| Slot                 | Description                           |
| -------------------- | ------------------------------------- |
| `first-page-icon`    | Slot for a custom first-page icon.    |
| `previous-page-icon` | Slot for a custom previous-page icon. |
| `next-page-icon`     | Slot for a custom next-page icon.     |
| `last-page-icon`     | Slot for a custom last-page icon.     |

### 🎛️ CSS Custom Properties

| Property                      | Description                                 |
| ----------------------------- | ------------------------------------------- |
| `--m3e-paginator-font-size`   | The font size used for paginator text.      |
| `--m3e-paginator-font-weight` | The font weight used for paginator text.    |
| `--m3e-paginator-line-height` | The line height used for paginator text.    |
| `--m3e-paginator-tracking`    | The letter-spacing used for paginator text. |
