# @m3e/paginator

The `m3e-paginator` component is a compact, accessible paginator control for navigating paged data sets. It provides semantic first/previous/next/last navigation controls and an optional page-size selector that integrates with Material design tokens and `m3e-form-field` variants to ensure consistent typography, density, and spacing across applications.

> **This package is part of [M3E](https://github.com/matraic/m3e) monorepo**, a unified suite of Material 3 web components. [Explore the docs](https://matraic.github.io/m3e) to see them in action.

## 📦 Installation

```bash
npm install @m3e/paginator
```

## 💻 Editor Integration

This package includes a [Custom Elements Manifest](https://github.com/webcomponents/custom-elements-manifest) to support enhanced editor tooling and developer experience.

### Visual Studio Code

To enable autocomplete and hover documentation for `@m3e/paginator`, install the [Custom Elements Manifest Language Server](https://marketplace.visualstudio.com/items?itemName=pwrs.cem-language-server-vscode) extension. It will automatically detect the manifest bundled with this package and surface tag names, attributes, slots, and events in supported files.

Alternately, you can explicitly reference the `html-custom-data.json` and `css-custom-data.json` in your workspace settings:

```json
{
  "html.customData": ["./node_modules/@m3e/paginator/dist/html-custom-data.json"],
  "css.customData": ["./node_modules/@m3e/paginator/dist/css-custom-data.json"]
}
```

## 🚀 Native Module Support

This package uses [JavaScript Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#module_specifiers). To use it directly in a browser without a bundler, use a module script similar to the following.

```html
<script type="module" src="/node_modules/@m3e/paginator/dist/index.js"></script>
```

You also need a module script for `@m3e/form-field`, `@m3e/select`, `@m3e/option`, `@m3e/icon-button`, and `@m3e/tooltip` due to being a dependency.

```html
<script type="module" src="/node_modules/@m3e/form-field/dist/index.js"></script>
<script type="module" src="/node_modules/@m3e/select/dist/index.js"></script>
<script type="module" src="/node_modules/@m3e/option/dist/index.js"></script>
<script type="module" src="/node_modules/@m3e/icon-button/dist/index.js"></script>
<script type="module" src="/node_modules/@m3e/tooltip/dist/index.js"></script>
```

In addition, you must use an [import map](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script/type/importmap) to include dependencies.

```html
<script type="importmap">
  {
    "imports": {
      "lit": "https://cdn.jsdelivr.net/npm/lit@3.3.0/+esm",
      "@m3e/core": "/node_modules/@m3e/core/dist/index.js",
      "@m3e/core/a11y": "/node_modules/@m3e/core/dist/a11y.js",
      "@m3e/core/anchoring": "/node_modules/@m3e/core/dist/anchoring.js",
      "@m3e/core/platform": "/node_modules/@m3e/core/dist/platform.js"
    }
  }
</script>
```

> For production, use index.min.js, a11y.min.js, anchoring.min.js, and platform.min.js for faster load times.

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

| Attribute                 | Type              | Default                | Description                                                                 |
| ------------------------- | ----------------- | ---------------------- | --------------------------------------------------------------------------- |
| `disabled`                | `boolean`         | `false`                | Whether the element is disabled.                                            |
| `first-page-label`        | `string`          | `"First page"`         | The accessible label given to the button used to move to the first page.    |
| `hide-page-size`          | `boolean`         | `false`                | Whether to hide page size selection.                                        |
| `items-per-page-label`    | `string`          | `"Items per page:"`    | The label for the page size selector.                                       |
| `last-page-label`         | `string`          | `"Last page"`          | The accessible label given to the button used to move to the last page.     |
| `length`                  | `number`          | `0`                    | The length of the total number of items which are being paginated.          |
| `next-page-label`         | `string`          | `"Next page"`          | The accessible label given to the button used to move to the next page.     |
| `page-index`              | `number`          | `0`                    | The zero-based page index of the displayed list of items.                   |
| `page-size`               | `number \| "all"` | `50`                   | The number of items to display in a page.                                   |
| `page-sizes`              | `string`          | `"5,10,25,50,100,all"` | A comma separated list of available page sizes.                             |
| `page-size-variant`       | `string`          | `"outlined"`           | The appearance variant of the page size field.                              |
| `previous-page-label`     | `string`          | `"Previous page"`      | The accessible label given to the button used to move to the previous page. |
| `show-first-last-buttons` | `boolean`         | `false`                | Whether to show first/last buttons.                                         |

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

## 🤝 Contributing

See the root monorepo `CONTRIBUTING.md` for guidelines on contributing to this package.

## 📄 License

This package is licensed under the MIT License.
