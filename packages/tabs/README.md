# @m3e/tabs

The `m3e-tabs` component provides a structured navigation surface for organizing content into distinct views, where only one view is visible at a time. It supports scrollable tab headers with optional pagination, accessible labeling for navigation controls, and configurable header positioning to suit various layout contexts. Two visual variants are available: `primary`, which emphasizes active indicators and shape styling for prominent navigation, and `secondary`, which offers a more subtle presentation with reduced indicator thickness. Stretch behavior allows tabs to expand and align rhythmically within their container, consistent with Material 3 guidance.

> **Part of the [Material 3 Expressive (M3E)](../../README.md) monorepo**  
> This package is maintained within the unified M3E repository, which provides a suite of Material 3 web components.

## 📦 Installation

```bash
npm install @m3e/tabs
```

## 🚀 Browser Usage

This package uses [JavaScript Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#module_specifiers). To use it directly in a browser without a bundler, use a module script similar to the following.

```html
<script type="module" src="/node_modules/@m3e/tabs/dist/index.js"></script>
```

You also need a module script for `@m3e/icon-button` and `m3e/slide-group` due to these being a dependency.

```html
<script type="module" src="/node_modules/@m3e/icon-button/dist/index.js"></script>
<script type="module" src="/node_modules/@m3e/slide-group/dist/index.js"></script>
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

- `m3e-tabs` — Organizes content into separate views where only one view can be visible at a time.
- `m3e-tab` — An interactive element that, when activated, presents an associated tab panel.
- `m3e-tab-panel` — A panel presented for a tab.

## 🧪 Examples

The following example illustrates using the `m3e-tabs`, `m3e-tab`, and `m3e-tab-panel` components to present secondary tabs.

```html
<m3e-tabs>
  <m3e-tab selected for="videos"><m3e-icon slot="icon" name="videocam"></m3e-icon>Video</m3e-tab>
  <m3e-tab for="photos"><m3e-icon slot="icon" name="photo"></m3e-icon>Photos</m3e-tab>
  <m3e-tab for="audio"><m3e-icon slot="icon" name="music_note"></m3e-icon>Audio</m3e-tab>
  <m3e-tab-panel id="videos">Videos</m3e-tab-panel>
  <m3e-tab-panel id="photos">Photos</m3e-tab-panel>
  <m3e-tab-panel id="audio">Audio</m3e-tab-panel>
</m3e-tabs>
```

## 📖 API Reference

### 🗂️ m3e-tabs

This section details the attributes, events, slots and CSS custom properties available for the `m3e-tabs` component.

#### ⚙️ Attributes

| Attribute             | Type                         | Default           | Description                                                                 |
| --------------------- | ---------------------------- | ----------------- | --------------------------------------------------------------------------- |
| `disable-pagination`  | `boolean`                    | `false`           | Whether scroll buttons are disabled.                                        |
| `header-position`     | `"before"` \| `"after"`      | `"before"`        | The position of the tab headers.                                            |
| `next-page-label`     | `string`                     | `"Next page"`     | The accessible label given to the button used to move to the previous page. |
| `previous-page-label` | `string`                     | `"Previous page"` | The accessible label given to the button used to move to the next page.     |
| `stretch`             | `boolean`                    | `false`           | Whether tabs are stretched to fill the header.                              |
| `variant`             | `"primary"` \| `"secondary"` | `"secondary"`     | The appearance variant of the tabs.                                         |

#### 🔔 Events

| Event    | Description                            |
| -------- | -------------------------------------- |
| `change` | Emitted when the selected tab changes. |

#### 🧩 Slots

| Slot Name   | Description                                                           |
| ----------- | --------------------------------------------------------------------- |
| _(default)_ | Renders the tabs.                                                     |
| `panel`     | Renders the panels of the tabs.                                       |
| `next-icon` | Renders the icon to present for the next button used to paginate.     |
| `prev-icon` | Renders the icon to present for the previous button used to paginate. |

#### 🎛️ CSS Custom Properties

| Property                                           | Description                                                                      |
| -------------------------------------------------- | -------------------------------------------------------------------------------- |
| `--m3e-tabs-paginator-button-icon-size`            | Overrides the icon size for paginator buttons.                                   |
| `--m3e-tabs-active-indicator-color`                | Color of the active tab indicator.                                               |
| `--m3e-tabs-primary-before-active-indicator-shape` | Border radius for active indicator when header is before and variant is primary. |
| `--m3e-tabs-primary-after-active-indicator-shape`  | Border radius for active indicator when header is after and variant is primary.  |
| `--m3e-tabs-primary-active-indicator-inset`        | Inset for primary variant's active indicator.                                    |
| `--m3e-tabs-primary-active-indicator-thickness`    | Thickness for primary variant's active indicator.                                |
| `--m3e-tabs-secondary-active-indicator-thickness`  | Thickness for secondary variant's active indicator.                              |

### 🗂️ m3e-tab

This section details the attributes, slots and CSS custom properties available for the `m3e-tab` component.

#### ⚙️ Attributes

| Attribute  | Type      | Default | Description                                                             |
| ---------- | --------- | ------- | ----------------------------------------------------------------------- |
| `disabled` | `boolean` | `false` | Whether the element is disabled.                                        |
| `for`      | `string`  |         | The query selector used to specify the element related to this element. |
| `selected` | `boolean` | `false` | Whether the element is selected.                                        |

#### 🧩 Slots

| Slot Name   | Description                             |
| ----------- | --------------------------------------- |
| _(default)_ | Renders the label of the tab.           |
| `icon`      | Renders an icon before the tab's label. |

#### 🎛️ CSS Custom Properties

| Property                                     | Description                                 |
| -------------------------------------------- | ------------------------------------------- |
| `--m3e-tab-font-size`                        | Font size for tab label.                    |
| `--m3e-tab-font-weight`                      | Font weight for tab label.                  |
| `--m3e-tab-line-height`                      | Line height for tab label.                  |
| `--m3e-tab-tracking`                         | Letter spacing for tab label.               |
| `--m3e-tab-padding-start`                    | Padding on the inline start of the tab.     |
| `--m3e-tab-padding-end`                      | Padding on the inline end of the tab.       |
| `--m3e-tab-focus-ring-shape`                 | Border radius for the focus ring.           |
| `--m3e-tab-selected-color`                   | Text color for selected tab.                |
| `--m3e-tab-selected-container-hover-color`   | Hover state-layer color for selected tab.   |
| `--m3e-tab-selected-container-focus-color`   | Focus state-layer color for selected tab.   |
| `--m3e-tab-selected-ripple-color`            | Ripple color for selected tab.              |
| `--m3e-tab-unselected-color`                 | Text color for unselected tab.              |
| `--m3e-tab-unselected-container-hover-color` | Hover state-layer color for unselected tab. |
| `--m3e-tab-unselected-container-focus-color` | Focus state-layer color for unselected tab. |
| `--m3e-tab-unselected-ripple-color`          | Ripple color for unselected tab.            |
| `--m3e-tab-disabled-color`                   | Text color for disabled tab.                |
| `--m3e-tab-spacing`                          | Column gap between icon and label.          |
| `--m3e-tab-icon-size`                        | Font size for slotted icon.                 |

### 🗂️ m3e-tab-panel

This section details the slots available for the `m3e-tab-panel` component.

#### 🧩 Slots

| Name        | Description                       |
| ----------- | --------------------------------- |
| _(default)_ | Renders the content of the panel. |

## 🤝 Contributing

See the root monorepo `CONTRIBUTING.md` for guidelines on contributing to this package.

## 📄 License

This package is licensed under the MIT License.
