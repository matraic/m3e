# @m3e/toc

The `m3e-toc` and `m3e-toc-item` components provide a hierarchical, interactive table of contents for in-page navigation. The TOC automatically detects headings or sections in a target element, builds a navigable list, and highlights the active section as the user scrolls. It supports custom header slots, depth limiting, smooth scrolling, and extensive theming via CSS custom properties.

> To exclude a heading from the generated table of contents, add the `m3e-toc-ignore` attribute to that heading element.

> **Part of the [Material 3 Expressive (M3E)](../../README.md) monorepo**  
> This package is maintained within the unified M3E repository, which provides a suite of Material 3 web components.

## 📦 Installation

```bash
npm install @m3e/toc
```

## 💻 Editor Integration

This package includes a [Custom Elements Manifest](https://github.com/webcomponents/custom-elements-manifest) to support enhanced editor tooling and developer experience.

### Visual Studio Code

To enable autocomplete and hover documentation for `@m3e/toc`, install the [Custom Elements Manifest Language Server](https://marketplace.visualstudio.com/items?itemName=pwrs.cem-language-server-vscode) extension. It will automatically detect the manifest bundled with this package and surface tag names, attributes, slots, and events in supported files.

Alternately, you can explicitly reference the `html-custom-data.json` and `css-custom-data.json` in your workspace settings:

```json
{
  "html.customData": ["./node_modules/@m3e/toc/dist/html-custom-data.json"],
  "css.customData": ["./node_modules/@m3e/toc/dist/css-custom-data.json"]
}
```

## 🚀 Browser Usage

This package uses [JavaScript Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#module_specifiers). To use it directly in a browser without a bundler, use a module script similar to the following.

```html
<script type="module" src="/node_modules/@m3e/toc/dist/index.js"></script>
```

In addition, you must use an [import map](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script/type/importmap) to include dependencies.

```html
<script type="importmap">
  {
    "imports": {
      "lit": "https://cdn.jsdelivr.net/npm/lit@3.3.0/+esm",
      "@m3e/core": "/node_modules/@m3e/core/dist/index.js",
      "@m3e/core/a11y": "/node_modules/@m3e/core/dist/a11y.js"
    }
  }
</script>
```

> For production, use index.min.js and a11y.min.js for faster load times.

## 🗂️ Elements

- `m3e-toc` — A table of contents navigation component for in-page scroll navigation.
- `m3e-toc-item` — An item representing a section or heading in the table of contents.

## 🧪 Example

```html
<m3e-toc for="content" max-depth="3">
  <span slot="overline">Contents</span>
  <span slot="title">Documentation</span>
</m3e-toc>
<div id="content">
  <h2>Introduction</h2>
  <h2>Getting Started</h2>
  <h3>Installation</h3>
  <h3>Usage</h3>
  <h2>API Reference</h2>
</div>
```

## 📖 API Reference

### 🗂️ m3e-toc

#### ⚙️ Attributes

| Attribute   | Type     | Default | Description                                              |
| ----------- | -------- | ------- | -------------------------------------------------------- |
| `for`       | `string` |         | Query selector for the element to generate the TOC from. |
| `max-depth` | `number` | `2`     | The maximum depth of the table of contents.              |

#### 🧩 Slots

| Slot        | Description                                    |
| ----------- | ---------------------------------------------- |
| _(default)_ | Renders content between the header and items.  |
| `overline`  | Renders the overline of the table of contents. |
| `title`     | Renders the title of the table of contents.    |

#### 🎛️ CSS Custom Properties

| Property                                        | Description                                      |
| ----------------------------------------------- | ------------------------------------------------ |
| `--m3e-toc-width`                               | Width of the table of contents.                  |
| `--m3e-toc-item-shape`                          | Border radius of TOC items and active indicator. |
| `--m3e-toc-active-indicator-color`              | Border color of the active indicator.            |
| `--m3e-toc-active-indicator-animation-duration` | Animation duration for the active indicator.     |
| `--m3e-toc-item-padding`                        | Inline padding for TOC items and header.         |
| `--m3e-toc-header-space`                        | Block space below and between header elements.   |
| `--m3e-toc-overline-font-size`                  | Font size for the overline slot.                 |
| `--m3e-toc-overline-font-weight`                | Font weight for the overline slot.               |
| `--m3e-toc-overline-line-height`                | Line height for the overline slot.               |
| `--m3e-toc-overline-tracking`                   | Letter spacing for the overline slot.            |
| `--m3e-toc-overline-color`                      | Text color for the overline slot.                |
| `--m3e-toc-title-font-size`                     | Font size for the title slot.                    |
| `--m3e-toc-title-font-weight`                   | Font weight for the title slot.                  |
| `--m3e-toc-title-line-height`                   | Line height for the title slot.                  |
| `--m3e-toc-title-tracking`                      | Letter spacing for the title slot.               |
| `--m3e-toc-title-color`                         | Text color for the title slot.                   |

### 🗂️ m3e-toc-item

#### ⚙️ Attributes

| Attribute  | Type      | Default | Description                   |
| ---------- | --------- | ------- | ----------------------------- |
| `disabled` | `boolean` | `false` | Whether the item is disabled. |
| `selected` | `boolean` | `false` | Whether the item is selected. |

#### 🧩 Slots

| Slot        | Description                    |
| ----------- | ------------------------------ |
| _(default)_ | Renders the label of the item. |

#### 🎛️ CSS Custom Properties

| Property                                        | Description                                  |
| ----------------------------------------------- | -------------------------------------------- |
| `--m3e-toc-item-shape`                          | Border radius of the TOC item.               |
| `--m3e-toc-item-padding-block`                  | Block padding for the TOC item.              |
| `--m3e-toc-item-padding`                        | Inline padding for the TOC item.             |
| `--m3e-toc-item-inset`                          | Indentation per level for the TOC item.      |
| `--m3e-toc-active-indicator-animation-duration` | Animation duration for the active indicator. |
| `--m3e-toc-item-font-size`                      | Font size for unselected items.              |
| `--m3e-toc-item-font-weight`                    | Font weight for unselected items.            |
| `--m3e-toc-item-line-height`                    | Line height for unselected items.            |
| `--m3e-toc-item-tracking`                       | Letter spacing for unselected items.         |
| `--m3e-toc-item-color`                          | Text color for unselected items.             |
| `--m3e-toc-item-selected-font-size`             | Font size for selected items.                |
| `--m3e-toc-item-selected-font-weight`           | Font weight for selected items.              |
| `--m3e-toc-item-selected-line-height`           | Line height for selected items.              |
| `--m3e-toc-item-selected-tracking`              | Letter spacing for selected items.           |
| `--m3e-toc-item-selected-color`                 | Text color for selected items.               |
| `--m3e-state-layer-focus-opacity`               | Opacity of the state layer focus effect.     |

## 🤝 Contributing

See the root monorepo `CONTRIBUTING.md` for guidelines on contributing to this package.

## 📄 License

This package is licensed under the MIT License.
