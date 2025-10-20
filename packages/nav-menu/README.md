# @m3e/nav-menu

The `m3e-nav-menu` and `m3e-nav-menu-item` components provide a hierarchical, accessible navigation menu. Designed for sidebars, navigation drawers, and complex menu structures, they support nested expandable items, keyboard navigation, selection, and extensive theming via CSS custom properties.

> **This package is part of [M3E](https://github.com/matraic/m3e) monorepo**, a unified suite of Material 3 web components. [Explore the docs](https://matraic.github.io/m3e) to see them in action.

## 📦 Installation

```bash
npm install @m3e/nav-menu
```

## 💻 Editor Integration

This package includes a [Custom Elements Manifest](https://github.com/webcomponents/custom-elements-manifest) to support enhanced editor tooling and developer experience.

### Visual Studio Code

To enable autocomplete and hover documentation for `@m3e/nav-menu`, install the [Custom Elements Manifest Language Server](https://marketplace.visualstudio.com/items?itemName=pwrs.cem-language-server-vscode) extension. It will automatically detect the manifest bundled with this package and surface tag names, attributes, slots, and events in supported files.

Alternately, you can explicitly reference the `html-custom-data.json` and `css-custom-data.json` in your workspace settings:

```json
{
  "html.customData": ["./node_modules/@m3e/nav-menu/dist/html-custom-data.json"],
  "css.customData": ["./node_modules/@m3e/nav-menu/dist/css-custom-data.json"]
}
```

## 🚀 Browser Usage

This package uses [JavaScript Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#module_specifiers). To use it directly in a browser without a bundler, use a module script similar to the following.

```html
<script type="module" src="/node_modules/@m3e/nav-menu/dist/index.js"></script>
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

- `m3e-nav-menu` — Presents a hierarchical menu.
- `m3e-nav-menu-item` — An expandable item in a navigation menu.

## 🧪 Example

```html
<m3e-nav-menu>
  <m3e-nav-menu-item open>
    <m3e-icon slot="icon" name="rocket_launch"></m3e-icon>
    <span slot="label">Getting Started</span>
    <m3e-nav-menu-item>
      <m3e-icon slot="icon" name="widgets"></m3e-icon>
      <span slot="label">Overview</span>
    </m3e-nav-menu-item>
    <m3e-nav-menu-item>
      <m3e-icon slot="icon" name="package_2"></m3e-icon>
      <span slot="label">Installation</span>
    </m3e-nav-menu-item>
  </m3e-nav-menu-item>
  <m3e-nav-menu-item>
    <span slot="label">Actions</span>
    <m3e-nav-menu-item><span slot="label">Button</span></m3e-nav-menu-item>
    <m3e-nav-menu-item><span slot="label">Icon</span></m3e-nav-menu-item>
    <m3e-nav-menu-item><span slot="label">Icon Button</span></m3e-nav-menu-item>
  </m3e-nav-menu-item>
</m3e-nav-menu>
```

## 📖 API Reference

### 🗂️ m3e-nav-menu

This section details the slots and CSS custom properties available for the `m3e-nav-menu` component.

#### 🧩 Slots

| Slot        | Description                    |
| ----------- | ------------------------------ |
| _(default)_ | Renders the items of the menu. |

#### 🎛️ CSS Custom Properties

| Property                         | Description                              |
| -------------------------------- | ---------------------------------------- |
| `--m3e-nav-menu-padding-top`     | Top padding for the menu.                |
| `--m3e-nav-menu-padding-bottom`  | Bottom padding for the menu.             |
| `--m3e-nav-menu-padding-left`    | Left padding for the menu.               |
| `--m3e-nav-menu-padding-right`   | Right padding for the menu.              |
| `--m3e-nav-menu-divider-margin`  | Margin for divider elements in the menu. |
| `--m3e-nav-menu-scrollbar-width` | Width of the menu scrollbar.             |
| `--m3e-nav-menu-scrollbar-color` | Color of the menu scrollbar.             |

### 🗂️ m3e-nav-menu-item

This section details the attributes, slots, events, and CSS custom properties available for the `m3e-nav-menu-item` component.

#### ⚙️ Attributes

| Attribute       | Type      | Default | Description                                                 |
| --------------- | --------- | ------- | ----------------------------------------------------------- |
| `disabled`      | `boolean` | `false` | Whether the item is disabled.                               |
| `indeterminate` | `boolean` | `false` | Whether the item's selected/checked state is indeterminate. |
| `open`          | `boolean` | `false` | Whether the item is expanded.                               |
| `selected`      | `boolean` | `false` | Whether the item is selected.                               |

#### 🔔 Events

| Event     | Description                            |
| --------- | -------------------------------------- |
| `opening` | Emitted when the item begins to open.  |
| `opened`  | Emitted when the item has opened.      |
| `closing` | Emitted when the item begins to close. |
| `closed`  | Emitted when the item has closed.      |

#### 🧩 Slots

| Slot            | Description                                 |
| --------------- | ------------------------------------------- |
| _(default)_     | Renders the nested child items.             |
| `label`         | Renders the label of the item.              |
| `icon`          | Renders the icon of the item.               |
| `selected-icon` | Renders the icon of the item when selected. |
| `toggle-icon`   | Renders the toggle icon.                    |
| `badge`         | Renders a badge for the item.               |

#### 🎛️ CSS Custom Properties

| Property                                               | Description                                   |
| ------------------------------------------------------ | --------------------------------------------- |
| `--m3e-nav-menu-item-font-size`                        | Font size for the item label.                 |
| `--m3e-nav-menu-item-font-weight`                      | Font weight for the item label.               |
| `--m3e-nav-menu-item-line-height`                      | Line height for the item label.               |
| `--m3e-nav-menu-item-tracking`                         | Letter spacing for the item label.            |
| `--m3e-nav-menu-item-padding`                          | Inline padding for the item.                  |
| `--m3e-nav-menu-item-height`                           | Height of the item.                           |
| `--m3e-nav-menu-item-spacing`                          | Spacing between icon and label.               |
| `--m3e-nav-menu-item-shape`                            | Border radius of the item and focus ring.     |
| `--m3e-nav-menu-item-icon-size`                        | Size of the icon.                             |
| `--m3e-nav-menu-item-inset`                            | Indentation for nested items.                 |
| `--m3e-nav-menu-item-label-color`                      | Text color for the item label.                |
| `--m3e-nav-menu-item-selected-label-color`             | Text color for selected item label.           |
| `--m3e-nav-menu-item-selected-container-color`         | Background color for selected item.           |
| `--m3e-nav-menu-item-selected-container-focus-color`   | Focus color for selected item container.      |
| `--m3e-nav-menu-item-selected-container-hover-color`   | Hover color for selected item container.      |
| `--m3e-nav-menu-item-selected-ripple-color`            | Ripple color for selected item.               |
| `--m3e-nav-menu-item-unselected-container-focus-color` | Focus color for unselected item container.    |
| `--m3e-nav-menu-item-unselected-container-hover-color` | Hover color for unselected item container.    |
| `--m3e-nav-menu-item-unselected-ripple-color`          | Ripple color for unselected item.             |
| `--m3e-nav-menu-item-open-container-color`             | Background color for open item with children. |
| `--m3e-nav-menu-item-open-container-focus-color`       | Focus color for open item container.          |
| `--m3e-nav-menu-item-open-container-hover-color`       | Hover color for open item container.          |
| `--m3e-nav-menu-item-open-ripple-color`                | Ripple color for open item.                   |
| `--m3e-nav-menu-item-disabled-color`                   | Text color for disabled item.                 |
| `--m3e-nav-menu-item-disabled-color-opacity`           | Opacity for disabled item text color.         |
| `--m3e-nav-menu-item-badge-font-size`                  | Font size for badge slot.                     |
| `--m3e-nav-menu-item-badge-font-weight`                | Font weight for badge slot.                   |
| `--m3e-nav-menu-item-badge-line-height`                | Line height for badge slot.                   |
| `--m3e-nav-menu-badge-item-tracking`                   | Letter spacing for badge slot.                |
| `--m3e-nav-menu-divider-margin`                        | Margin for divider elements.                  |
| `--m3e-nav-menu-item-vertical-inset`                   | Vertical margin for first/last child items.   |

## 🤝 Contributing

See the root monorepo `CONTRIBUTING.md` for guidelines on contributing to this package.

## 📄 License

This package is licensed under the MIT License.
