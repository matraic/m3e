# @m3e/nav-bar

The `m3e-nav-bar` and `m3e-nav-item` components provide a navigation bar and interactive items for switching between primary destinations in your application. Designed for smaller devices, they support 3-5 interactive items, orientation, selection, and extensive theming via CSS custom properties.

> **Part of the [Material 3 Expressive (M3E)](../../README.md) monorepo**  
> This package is maintained within the unified M3E repository, which provides a suite of Material 3 web components.

## 📦 Installation

```bash
npm install @m3e/nav-bar
```

## 🚀 Browser Usage

This package uses [JavaScript Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#module_specifiers). To use it directly in a browser without a bundler, use a module script similar to the following.

```html
<script type="module" src="/node_modules/@m3e/nav-bar/dist/index.js"></script>
```

In addition, you must use an [import map](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script/type/importmap) to include dependencies.

```html
<script type="importmap">
  {
    "imports": {
      "lit": "https://cdn.jsdelivr.net/npm/lit@3.3.0/+esm",
      "@m3e/core": "/node_modules/@m3e/core/dist/index.js",
      "@m3e/core/a11y": "/node_modules/@m3e/core/dist/a11y.js",
      "@m3e/core/layout": "/node_modules/@m3e/core/dist/layout.js"
    }
  }
</script>
```

> For production, use index.min.js, a11y.min.js, and layout.min.js for faster load times.

## 🗂️ Elements

- `m3e-nav-bar` — A horizontal bar, typically used on smaller devices, that allows a user to switch between 3-5 views.
- `m3e-nav-item` — An item, placed in a navigation bar or rail, used to navigate to destinations in an application.

## 🧪 Example

```html
<m3e-nav-bar>
  <m3e-nav-item><m3e-icon slot="icon" name="news"></m3e-icon>News</m3e-nav-item>
  <m3e-nav-item><m3e-icon slot="icon" name="globe"></m3e-icon>Global</m3e-nav-item>
  <m3e-nav-item><m3e-icon slot="icon" name="star"></m3e-icon>For you</m3e-nav-item>
  <m3e-nav-item><m3e-icon slot="icon" name="newsstand"></m3e-icon>Trending</m3e-nav-item>
</m3e-nav-bar>
```

## 📖 API Reference

### 🗂️ m3e-nav-bar

This section details the attributes, slots, events and CSS custom properties available for the `m3e-nav-bar` component.

#### ⚙️ Attributes

| Attribute | Type                                    | Default     | Description                                       |
| --------- | --------------------------------------- | ----------- | ------------------------------------------------- |
| `mode`    | `"compact"` \| `"expanded"` \| `"auto"` | `"compact"` | The mode in which items in the bar are presented. |

#### 🔔 Events

| Event    | Description                                        |
| -------- | -------------------------------------------------- |
| `change` | Emitted when the selected state of an item changes |

#### 🧩 Slots

| Slot        | Description                   |
| ----------- | ----------------------------- |
| _(default)_ | Renders the items of the bar. |

#### 🎛️ CSS Custom Properties

| Property                            | Description                             |
| ----------------------------------- | --------------------------------------- |
| `--m3e-nav-bar-height`              | Height of the navigation bar.           |
| `--m3e-nav-bar-container-color`     | Background color of the navigation bar. |
| `--m3e-nav-bar-vertical-item-width` | Minimum width of vertical nav items.    |

### 🗂️ m3e-nav-item

This section details the attributes, slots, events and CSS custom properties available for the `m3e-nav-item` component.

#### ⚙️ Attributes

| Attribute              | Type                           | Default      | Description                                  |
| ---------------------- | ------------------------------ | ------------ | -------------------------------------------- |
| `disabled`             | `boolean`                      | `false`      | Whether the item is disabled.                |
| `disabled-interactive` | `boolean`                      | `false`      | Whether the item is disabled and interactive |
| `download`             | `string`                       |              | Download target for link button.             |
| `href`                 | `string`                       |              | URL for the link button.                     |
| `orientation`          | `"vertical"` \| `"horizontal"` | `"vertical"` | The layout orientation of the item.          |
| `rel`                  | `string`                       |              | Relationship for the link button.            |
| `selected`             | `boolean`                      | `false`      | Whether the item is selected.                |
| `target`               | `string`                       |              | Target for the link button.                  |

#### 🔔 Events

| Event    | Description                              |
| -------- | ---------------------------------------- |
| `input`  | Emitted when the selected state changes. |
| `change` | Emitted when the selected state changes. |

#### 🧩 Slots

| Slot            | Description                                 |
| --------------- | ------------------------------------------- |
| _(default)_     | Renders the label of the item.              |
| `icon`          | Renders the icon of the item.               |
| `selected-icon` | Renders the icon when the item is selected. |

#### 🎛️ CSS Custom Properties

| Property                                            | Description                                  |
| --------------------------------------------------- | -------------------------------------------- |
| `--m3e-nav-item-label-text-font-size`               | Font size for the label text.                |
| `--m3e-nav-item-label-text-font-weight`             | Font weight for the label text.              |
| `--m3e-nav-item-label-text-line-height`             | Line height for the label text.              |
| `--m3e-nav-item-label-text-tracking`                | Letter spacing for the label text.           |
| `--m3e-nav-item-shape`                              | Border radius of the nav item.               |
| `--m3e-nav-item-icon-size`                          | Size of the icon.                            |
| `--m3e-nav-item-spacing`                            | Spacing between icon and label.              |
| `--m3e-nav-item-inactive-label-text-color`          | Color of the label text when inactive.       |
| `--m3e-nav-item-inactive-icon-color`                | Color of the icon when inactive.             |
| `--m3e-nav-item-inactive-hover-state-layer-color`   | State layer color on hover when inactive.    |
| `--m3e-nav-item-inactive-focus-state-layer-color`   | State layer color on focus when inactive.    |
| `--m3e-nav-item-inactive-pressed-state-layer-color` | State layer color on press when inactive.    |
| `--m3e-nav-item-active-label-text-color`            | Color of the label text when active.         |
| `--m3e-nav-item-active-icon-color`                  | Color of the icon when active.               |
| `--m3e-nav-item-active-container-color`             | Container color when active.                 |
| `--m3e-nav-item-active-hover-state-layer-color`     | State layer color on hover when active.      |
| `--m3e-nav-item-active-focus-state-layer-color`     | State layer color on focus when active.      |
| `--m3e-nav-item-active-pressed-state-layer-color`   | State layer color on press when active.      |
| `--m3e-nav-item-focus-ring-shape`                   | Border radius for the focus ring.            |
| `--m3e-nav-item-disabled-label-text-color`          | Color of the label text when disabled.       |
| `--m3e-nav-item-disabled-label-text-opacity`        | Opacity of the label text when disabled.     |
| `--m3e-nav-item-disabled-icon-color`                | Color of the icon when disabled.             |
| `--m3e-nav-item-disabled-icon-opacity`              | Opacity of the icon when disabled.           |
| `--m3e-horizontal-nav-item-padding`                 | Padding for horizontal orientation.          |
| `--m3e-horizontal-nav-item-active-indicator-height` | Height of the active indicator (horizontal). |
| `--m3e-vertical-nav-item-active-indicator-width`    | Width of the active indicator (vertical).    |
| `--m3e-vertical-nav-item-active-indicator-height`   | Height of the active indicator (vertical).   |
| `--m3e-vertical-nav-item-active-indicator-margin`   | Margin for the active indicator (vertical).  |

## 🤝 Contributing

See the root monorepo `CONTRIBUTING.md` for guidelines on contributing to this package.

## 📄 License

This package is licensed under the MIT License.
