# @m3e/slide-group

The `m3e-slide-group` component presents directional pagination controls for navigating overflowing content. It orchestrates scrollable layouts with expressive slot-based icons and adaptive orientation, revealing navigation affordances only when content exceeds a defined threshold. It supports both horizontal and vertical flows, and encodes accessibility through customizable labels and interaction states.

> **Part of the [Material 3 Expressive (M3E)](../../README.md) monorepo**  
> This package is maintained within the unified M3E repository, which provides a suite of Material 3 web components.

## 📦 Installation

```bash
npm install @m3e/slide-group
```

## 🚀 Browser Usage

This package uses [JavaScript Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#module_specifiers). To use it directly in a browser without a bundler, use a module script similar to the following.

```html
<script type="module" src="/node_modules/@m3e/slide-group/dist/index.js"></script>
```

You also need a module script for `@m3e/icon-button` due to it being a dependency.

```html
<script type="module" src="/node_modules/@m3e/icon-button/dist/index.js"></script>
```

In addition, you must use an [import map](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script/type/importmap) to include dependencies.

```html
<script type="importmap">
  {
    "imports": {
      "lit": "https://cdn.jsdelivr.net/npm/lit@3.3.0/+esm",
      "@m3e/core": "/node_modules/@m3e/core/dist/index.js"
    }
  }
</script>
```

> For production, use index.min.js for faster load times.

## 🗂️ Elements

- `m3e-slide-group` — Presents pagination controls used to scroll overflowing content.

## 🧪 Examples

- The following example illustrates a horizontally scrollable group of items with directional pagination buttons.
  The scroll controls appear when content exceeds the `48px` threshold.

```html
<m3e-slide-group threshold="48">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <div>Item 4</div>
  <div>Item 5</div>
</m3e-slide-group>
```

## 📖 API Reference

This section details the attributes, slots and CSS custom properties available for the `m3e-slide-group` component.

### ⚙️ Attributes

| Attribute             | Type      | Default           | Description                                                                                        |
| --------------------- | --------- | ----------------- | -------------------------------------------------------------------------------------------------- |
| `disabled`            | `boolean` | `false`           | Whether scroll buttons are disabled.                                                               |
| `next-page-label`     | `string`  | `"Next page"`     | The accessible label given to the button used to move to the previous page.                        |
| `previous-page-label` | `string`  | `"Previous page"` | The accessible label given to the button used to move to the next page.                            |
| `threshold`           | `number`  | `0`               | A value, in pixels, indicating the scroll threshold at which to begin showing pagination controls. |
| `vertical`            | `boolean` | `false`           | Whether content is oriented vertically.                                                            |

#### 🧩 Slots

| Slot Name   | Description                                          |
| ----------- | ---------------------------------------------------- |
| _(default)_ | Renders the content to paginate.                     |
| `next-icon` | Renders the icon to present for the next button.     |
| `prev-icon` | Renders the icon to present for the previous button. |

### 🎛️ CSS Custom Properties

| Property                             | Description                                                                   |
| ------------------------------------ | ----------------------------------------------------------------------------- |
| `--m3e-slide-group-button-icon-size` | Sets icon size for scroll buttons; overrides default small icon size.         |
| `--m3e-slide-group-button-size`      | Defines scroll button size; used for width (horizontal) or height (vertical). |
| `--m3e-slide-group-divider-top`      | Adds top border to content container for visual separation.                   |
| `--m3e-slide-group-divider-bottom`   | Adds bottom border to content container for visual separation.                |

## 🤝 Contributing

See the root monorepo `CONTRIBUTING.md` for guidelines on contributing to this package.

## 📄 License

This package is licensed under the MIT License.
