# @m3e/toc

The `m3e-toc` and `m3e-toc-item` components provide a hierarchical, interactive table of contents for in-page navigation. The TOC automatically detects headings or sections in a target element, builds a navigable list, and highlights the active section as the user scrolls. It supports custom header slots, depth limiting, smooth scrolling, and extensive theming via CSS custom properties.

> To exclude a heading from the generated table of contents, add the `m3e-toc-ignore` attribute to that heading element.

## 📦 Installation

```bash
npm install @m3e/toc
```

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

| Attribute | Type   | Default | Description                                              |
| --------- | ------ | ------- | -------------------------------------------------------- |
| for       | string |         | Query selector for the element to generate the TOC from. |
| max-depth | number | 2       | The maximum depth of the table of contents.              |

#### 🧩 Slots

| Name      | Description                                    |
| --------- | ---------------------------------------------- |
| (default) | Renders content between the header and items.  |
| overline  | Renders the overline of the table of contents. |
| title     | Renders the title of the table of contents.    |

#### 🎛️ CSS Custom Properties

| Property                                      | Description                                      |
| --------------------------------------------- | ------------------------------------------------ |
| --m3e-toc-width                               | Width of the table of contents.                  |
| --m3e-toc-item-shape                          | Border radius of TOC items and active indicator. |
| --m3e-toc-active-indicator-color              | Border color of the active indicator.            |
| --m3e-toc-active-indicator-animation-duration | Animation duration for the active indicator.     |
| --m3e-toc-item-padding                        | Inline padding for TOC items and header.         |
| --m3e-toc-header-space                        | Block space below and between header elements.   |
| --m3e-toc-overline-font-size                  | Font size for the overline slot.                 |
| --m3e-toc-overline-font-weight                | Font weight for the overline slot.               |
| --m3e-toc-overline-line-height                | Line height for the overline slot.               |
| --m3e-toc-overline-tracking                   | Letter spacing for the overline slot.            |
| --m3e-toc-overline-color                      | Text color for the overline slot.                |
| --m3e-toc-title-font-size                     | Font size for the title slot.                    |
| --m3e-toc-title-font-weight                   | Font weight for the title slot.                  |
| --m3e-toc-title-line-height                   | Line height for the title slot.                  |
| --m3e-toc-title-tracking                      | Letter spacing for the title slot.               |
| --m3e-toc-title-color                         | Text color for the title slot.                   |

### 🗂️ m3e-toc-item

#### ⚙️ Attributes

| Attribute | Type    | Default | Description                   |
| --------- | ------- | ------- | ----------------------------- |
| disabled  | boolean | false   | Whether the item is disabled. |
| selected  | boolean | false   | Whether the item is selected. |

#### 🧩 Slots

| Name      | Description                    |
| --------- | ------------------------------ |
| (default) | Renders the label of the item. |

#### 🎛️ CSS Custom Properties

| Property                                      | Description                                  |
| --------------------------------------------- | -------------------------------------------- |
| --m3e-toc-item-shape                          | Border radius of the TOC item.               |
| --m3e-toc-item-padding-block                  | Block padding for the TOC item.              |
| --m3e-toc-item-padding                        | Inline padding for the TOC item.             |
| --m3e-toc-item-inset                          | Indentation per level for the TOC item.      |
| --m3e-toc-active-indicator-animation-duration | Animation duration for the active indicator. |
| --m3e-toc-item-font-size                      | Font size for unselected items.              |
| --m3e-toc-item-font-weight                    | Font weight for unselected items.            |
| --m3e-toc-item-line-height                    | Line height for unselected items.            |
| --m3e-toc-item-tracking                       | Letter spacing for unselected items.         |
| --m3e-toc-item-color                          | Text color for unselected items.             |
| --m3e-toc-item-selected-font-size             | Font size for selected items.                |
| --m3e-toc-item-selected-font-weight           | Font weight for selected items.              |
| --m3e-toc-item-selected-line-height           | Line height for selected items.              |
| --m3e-toc-item-selected-tracking              | Letter spacing for selected items.           |
| --m3e-toc-item-selected-color                 | Text color for selected items.               |
| --m3e-state-layer-focus-opacity               | Opacity of the state layer focus effect.     |

## 🤝 Contributing

See the root monorepo `CONTRIBUTING.md` for guidelines on contributing to this package.

## 📄 License

This package is licensed under the MIT License.
