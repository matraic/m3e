# @m3e/list

The `@m3e/list` package provides expressive, accessible components for organizing and displaying lists of items. It includes list containers (`m3e-list`, `m3e-action-list`, `m3e-selection-list`), basic list items (`m3e-list-item`), interactive items (`m3e-list-action`, `m3e-list-option`), and hierarchical items (`m3e-expandable-list-item`). All components support rich content, flexible layout, keyboard navigation, and extensive theming via CSS custom properties following Material 3 design principles.

> **This package is part of [M3E](https://github.com/matraic/m3e) monorepo**, a unified suite of Material 3 web components. [Explore the docs](https://matraic.github.io/m3e) to see them in action.

## 📦 Installation

```bash
npm install @m3e/list
```

## 💻 Editor Integration

This package includes a [Custom Elements Manifest](https://github.com/webcomponents/custom-elements-manifest) to support enhanced editor tooling and developer experience.

### Visual Studio Code

To enable autocomplete and hover documentation for `@m3e/list`, install the [Custom Elements Manifest Language Server](https://marketplace.visualstudio.com/items?itemName=pwrs.cem-language-server-vscode) extension. It will automatically detect the manifest bundled with this package and surface tag names, attributes, slots, and events in supported files.

Alternately, you can explicitly reference the `html-custom-data.json` and `css-custom-data.json` in your workspace settings:

```json
{
  "html.customData": ["./node_modules/@m3e/list/dist/html-custom-data.json"],
  "css.customData": ["./node_modules/@m3e/list/dist/css-custom-data.json"]
}
```

## 🚀 Native Module Support

This package uses [JavaScript Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#module_specifiers). To use it directly in a browser without a bundler, use a module script similar to the following.

```html
<script type="module" src="/node_modules/@m3e/list/dist/index.js"></script>
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

> For production, use index.min.js for faster load times.

## 🗂️ Elements

- `m3e-list` — A list container for organizing and displaying multiple list items.
- `m3e-list-item` — A single item within a list with support for rich content and flexible layout.
- `m3e-list-action` — An interactive list item that performs a user-initiated action.
- `m3e-list-option` — A selectable option in a list with selection capabilities.
- `m3e-action-list` — A specialized list container for action-based interactions with keyboard navigation.
- `m3e-selection-list` — A list of selectable options with multi-select support.
- `m3e-expandable-list-item` — An item in a list that can be expanded to show nested items.

## 🧪 Examples

The following example illustrates a list with a single item using all supported slots.

> Note: This example uses the `@m3e/icon` package to present Material Design symbols, but any icon package can be substituted depending on your design system or preferences

```html
<m3e-list>
  <m3e-list-item>
    <m3e-icon slot="leading" name="person"></m3e-icon>
    <span slot="overline">Overline</span>
    Headline
    <span slot="supporting-text">Supporting text</span>
    <m3e-icon slot="trailing" name="arrow_right"></m3e-icon>
  </m3e-list-item>
</m3e-list>
```

## 📖 API Reference

### 🗂️ m3e-list

This section details the attributes, slots and CSS custom properties available for the `m3e-list` component.

#### 🧩 Slots

| Slot        | Description                    |
| ----------- | ------------------------------ |
| _(default)_ | Renders the items of the list. |

#### 📋 Attributes

| Attribute | Type                           | Default      | Description                         |
| --------- | ------------------------------ | ------------ | ----------------------------------- |
| `variant` | `"baseline"` \| `"expressive"` | `"standard"` | The appearance variant of the list. |

#### 🎛️ CSS Custom Properties

| Property                                              | Description                                                 |
| ----------------------------------------------------- | ----------------------------------------------------------- |
| `--m3e-list-divider-inset-start-size`                 | Start inset for dividers within the list.                   |
| `--m3e-list-divider-inset-end-size`                   | End inset for dividers within the list.                     |
| `--m3e-list-segmented-gap`                            | Gap between list items in segmented variant.                |
| `--m3e-expressive-list-container-shape`               | Border radius of the expressive list container.             |
| `--m3e-expressive-list-item-container-color`          | Background color of items in expressive variant.            |
| `--m3e-expressive-list-item-container-shape`          | Border radius of items in expressive variant.               |
| `--m3e-expressive-list-item-hover-container-shape`    | Border radius of items in expressive variant on hover.      |
| `--m3e-expressive-list-item-focus-container-shape`    | Border radius of items in expressive variant on focus.      |
| `--m3e-expressive-list-item-selected-container-shape` | Border radius of items in expressive variant when selected. |

### 🗂️ m3e-list-item

This section details the attributes, slots and CSS custom properties available for the `m3e-list-item` component.

#### 🧩 Slots

| Slot              | Description                                    |
| ----------------- | ---------------------------------------------- |
| _(default)_       | Renders the content of the list item.          |
| `leading`         | Renders the leading content of the list item.  |
| `overline`        | Renders the overline of the list item.         |
| `supporting-text` | Renders the supporting text of the list item.  |
| `trailing`        | Renders the trailing content of the list item. |

#### 🎛️ CSS Custom Properties

| Property                                           | Description                                         |
| -------------------------------------------------- | --------------------------------------------------- |
| `--m3e-list-item-between-space`                    | Horizontal gap between elements.                    |
| `--m3e-list-item-leading-space`                    | Horizontal padding for the leading side.            |
| `--m3e-list-item-trailing-space`                   | Horizontal padding for the trailing side.           |
| `--m3e-list-item-padding-inline`                   | Horizontal padding for the list item.               |
| `--m3e-list-item-padding-block`                    | Vertical padding for the list item.                 |
| `--m3e-list-item-one-line-top-space`               | Top padding for one-line items.                     |
| `--m3e-list-item-one-line-bottom-space`            | Bottom padding for one-line items.                  |
| `--m3e-list-item-two-line-top-space`               | Top padding for two-line items.                     |
| `--m3e-list-item-two-line-bottom-space`            | Bottom padding for two-line items.                  |
| `--m3e-list-item-three-line-top-space`             | Top padding for three-line items.                   |
| `--m3e-list-item-three-line-bottom-space`          | Bottom padding for three-line items.                |
| `--m3e-list-item-height`                           | Minimum height of the list item.                    |
| `--m3e-list-item-font-size`                        | Font size for main content.                         |
| `--m3e-list-item-font-weight`                      | Font weight for main content.                       |
| `--m3e-list-item-line-height`                      | Line height for main content.                       |
| `--m3e-list-item-tracking`                         | Letter spacing for main content.                    |
| `--m3e-list-item-overline-font-size`               | Font size for overline slot.                        |
| `--m3e-list-item-overline-font-weight`             | Font weight for overline slot.                      |
| `--m3e-list-item-overline-line-height`             | Line height for overline slot.                      |
| `--m3e-list-item-overline-tracking`                | Letter spacing for overline slot.                   |
| `--m3e-list-item-supporting-text-font-size`        | Font size for supporting text slot.                 |
| `--m3e-list-item-supporting-text-font-weight`      | Font weight for supporting text slot.               |
| `--m3e-list-item-supporting-text-line-height`      | Line height for supporting text slot.               |
| `--m3e-list-item-supporting-text-tracking`         | Letter spacing for supporting text slot.            |
| `--m3e-list-item-trailing-text-font-size`          | Font size for trailing supporting text slot.        |
| `--m3e-list-item-trailing-text-font-weight`        | Font weight for trailing supporting text slot.      |
| `--m3e-list-item-trailing-text-line-height`        | Line height for trailing supporting text slot.      |
| `--m3e-list-item-trailing-text-tracking`           | Letter spacing for trailing supporting text slot.   |
| `--m3e-list-item-icon-size`                        | Size for leading/trailing icons.                    |
| `--m3e-list-item-label-text-color`                 | Color for the main content.                         |
| `--m3e-list-item-overline-color`                   | Color for the overline slot.                        |
| `--m3e-list-item-supporting-text-color`            | Color for the supporting text slot.                 |
| `--m3e-list-item-leading-color`                    | Color for the leading content.                      |
| `--m3e-list-item-trailing-color`                   | Color for the trailing content.                     |
| `--m3e-list-item-container-color`                  | Background color of the list item.                  |
| `--m3e-list-item-container-shape`                  | Border radius of the list item.                     |
| `--m3e-list-item-hover-container-shape`            | Border radius of the list item on hover.            |
| `--m3e-list-item-focus-container-shape`            | Border radius of the list item on focus.            |
| `--m3e-list-item-video-width`                      | Width of the video slot.                            |
| `--m3e-list-item-video-height`                     | Height of the video slot.                           |
| `--m3e-list-item-video-shape`                      | Border radius of the video slot.                    |
| `--m3e-list-item-image-width`                      | Width of the image slot.                            |
| `--m3e-list-item-image-height`                     | Height of the image slot.                           |
| `--m3e-list-item-image-shape`                      | Border radius of the image slot.                    |
| `--m3e-list-item-disabled-label-text-color`        | Color for the main content when disabled.           |
| `--m3e-list-item-disabled-label-text-opacity`      | Opacity for the main content when disabled.         |
| `--m3e-list-item-disabled-overline-color`          | Color for the overline slot when disabled.          |
| `--m3e-list-item-disabled-overline-opacity`        | Opacity for the overline slot when disabled.        |
| `--m3e-list-item-disabled-supporting-text-color`   | Color for the supporting text slot when disabled.   |
| `--m3e-list-item-disabled-supporting-text-opacity` | Opacity for the supporting text slot when disabled. |
| `--m3e-list-item-disabled-leading-color`           | Color for the leading content when disabled.        |
| `--m3e-list-item-disabled-leading-opacity`         | Opacity for the leading content when disabled.      |
| `--m3e-list-item-disabled-trailing-color`          | Color for the trailing content when disabled.       |
| `--m3e-list-item-disabled-trailing-opacity`        | Opacity for the trailing content when disabled.     |
| `--m3e-list-item-hover-state-layer-color`          | Color for the hover state layer.                    |
| `--m3e-list-item-hover-state-layer-opacity`        | Opacity for the hover state layer.                  |
| `--m3e-list-item-focus-state-layer-color`          | Color for the focus state layer.                    |
| `--m3e-list-item-focus-state-layer-opacity`        | Opacity for the focus state layer.                  |
| `--m3e-list-item-pressed-state-layer-color`        | Color for the pressed state layer.                  |
| `--m3e-list-item-pressed-state-layer-opacity`      | Opacity for the pressed state layer.                |
| `--m3e-list-item-disabled-media-opacity`           | Opacity for media elements when disabled.           |
| `--m3e-list-item-three-line-top-offset`            | Top offset for media in three line items.           |

### 🗂️ m3e-list-action

This section details the attributes, slots, events, and CSS custom properties available for the `m3e-list-action` component.

#### 🧩 Slots

| Slot              | Description                                    |
| ----------------- | ---------------------------------------------- |
| _(default)_       | Renders the content of the list item.          |
| `leading`         | Renders the leading content of the list item.  |
| `overline`        | Renders the overline of the list item.         |
| `supporting-text` | Renders the supporting text of the list item.  |
| `trailing`        | Renders the trailing content of the list item. |

#### 📋 Attributes

| Attribute  | Type      | Default | Description                                                              |
| ---------- | --------- | ------- | ------------------------------------------------------------------------ |
| `disabled` | `boolean` | `false` | Whether the element is disabled.                                         |
| `download` | `string`  | —       | A value indicating whether the link button will be downloaded.           |
| `href`     | `string`  | —       | The URL to which the link button points.                                 |
| `rel`      | `string`  | —       | The relationship between the target of the link button and the document. |
| `target`   | `string`  | —       | The target of the link button.                                           |

#### 📡 Events

| Event   | Description                          |
| ------- | ------------------------------------ |
| `click` | Emitted when the element is clicked. |

#### 🎛️ CSS Custom Properties

| Property                                           | Description                                         |
| -------------------------------------------------- | --------------------------------------------------- |
| `--m3e-list-item-between-space`                    | Horizontal gap between elements.                    |
| `--m3e-list-item-padding-inline`                   | Horizontal padding for the list item.               |
| `--m3e-list-item-padding-block`                    | Vertical padding for the list item.                 |
| `--m3e-list-item-height`                           | Minimum height of the list item.                    |
| `--m3e-list-item-font-size`                        | Font size for main content.                         |
| `--m3e-list-item-font-weight`                      | Font weight for main content.                       |
| `--m3e-list-item-line-height`                      | Line height for main content.                       |
| `--m3e-list-item-tracking`                         | Letter spacing for main content.                    |
| `--m3e-list-item-overline-font-size`               | Font size for overline slot.                        |
| `--m3e-list-item-overline-font-weight`             | Font weight for overline slot.                      |
| `--m3e-list-item-overline-line-height`             | Line height for overline slot.                      |
| `--m3e-list-item-overline-tracking`                | Letter spacing for overline slot.                   |
| `--m3e-list-item-supporting-text-font-size`        | Font size for supporting text slot.                 |
| `--m3e-list-item-supporting-text-font-weight`      | Font weight for supporting text slot.               |
| `--m3e-list-item-supporting-text-line-height`      | Line height for supporting text slot.               |
| `--m3e-list-item-supporting-text-tracking`         | Letter spacing for supporting text slot.            |
| `--m3e-list-item-trailing-text-font-size`          | Font size for trailing supporting text slot.        |
| `--m3e-list-item-trailing-text-font-weight`        | Font weight for trailing supporting text slot.      |
| `--m3e-list-item-trailing-text-line-height`        | Line height for trailing supporting text slot.      |
| `--m3e-list-item-trailing-text-tracking`           | Letter spacing for trailing supporting text slot.   |
| `--m3e-list-item-icon-size`                        | Size for leading/trailing icons.                    |
| `--m3e-list-item-label-text-color`                 | Color for the main content.                         |
| `--m3e-list-item-overline-color`                   | Color for the overline slot.                        |
| `--m3e-list-item-supporting-text-color`            | Color for the supporting text slot.                 |
| `--m3e-list-item-leading-color`                    | Color for the leading content.                      |
| `--m3e-list-item-trailing-color`                   | Color for the trailing content.                     |
| `--m3e-list-item-container-color`                  | Background color of the list item.                  |
| `--m3e-list-item-container-shape`                  | Border radius of the list item.                     |
| `--m3e-list-item-hover-container-shape`            | Border radius of the list item on hover.            |
| `--m3e-list-item-focus-container-shape`            | Border radius of the list item on focus.            |
| `--m3e-list-item-video-width`                      | Width of the video slot.                            |
| `--m3e-list-item-video-height`                     | Height of the video slot.                           |
| `--m3e-list-item-video-shape`                      | Border radius of the video slot.                    |
| `--m3e-list-item-image-width`                      | Width of the image slot.                            |
| `--m3e-list-item-image-height`                     | Height of the image slot.                           |
| `--m3e-list-item-image-shape`                      | Border radius of the image slot.                    |
| `--m3e-list-item-avatar-size`                      | Size of the avatar slot.                            |
| `--m3e-list-item-avatar-shape`                     | Border radius of the avatar slot.                   |
| `--m3e-list-item-avatar-font-size`                 | Font size for avatar slot.                          |
| `--m3e-list-item-avatar-font-weight`               | Font weight for avatar slot.                        |
| `--m3e-list-item-avatar-line-height`               | Line height for avatar slot.                        |
| `--m3e-list-item-avatar-tracking`                  | Letter spacing for avatar slot.                     |
| `--m3e-list-item-avatar-color`                     | Background color of the avatar slot.                |
| `--m3e-list-item-avatar-label-color`               | Text color of the avatar slot.                      |
| `--m3e-list-item-disabled-label-text-color`        | Color for the main content when disabled.           |
| `--m3e-list-item-disabled-label-text-opacity`      | Opacity for the main content when disabled.         |
| `--m3e-list-item-disabled-overline-color`          | Color for the overline slot when disabled.          |
| `--m3e-list-item-disabled-overline-opacity`        | Opacity for the overline slot when disabled.        |
| `--m3e-list-item-disabled-supporting-text-color`   | Color for the supporting text slot when disabled.   |
| `--m3e-list-item-disabled-supporting-text-opacity` | Opacity for the supporting text slot when disabled. |
| `--m3e-list-item-disabled-leading-color`           | Color for the leading content when disabled.        |
| `--m3e-list-item-disabled-leading-opacity`         | Opacity for the leading content when disabled.      |
| `--m3e-list-item-disabled-trailing-color`          | Color for the trailing content when disabled.       |
| `--m3e-list-item-disabled-trailing-opacity`        | Opacity for the trailing content when disabled.     |
| `--m3e-list-item-hover-state-layer-color`          | Color for the hover state layer.                    |
| `--m3e-list-item-hover-state-layer-opacity`        | Opacity for the hover state layer.                  |
| `--m3e-list-item-focus-state-layer-color`          | Color for the focus state layer.                    |
| `--m3e-list-item-focus-state-layer-opacity`        | Opacity for the focus state layer.                  |
| `--m3e-list-item-pressed-state-layer-color`        | Color for the pressed state layer.                  |
| `--m3e-list-item-pressed-state-layer-opacity`      | Opacity for the pressed state layer.                |
| `--m3e-list-item-disabled-media-opacity`           | Opacity for media elements when disabled.           |
| `--m3e-list-item-three-line-top-offset`            | Top offset for media in three line items.           |

### 🗂️ m3e-list-option

This section details the attributes, slots, events, and CSS custom properties available for the `m3e-list-option` component.

#### 🧩 Slots

| Slot              | Description                                    |
| ----------------- | ---------------------------------------------- |
| _(default)_       | Renders the content of the list item.          |
| `leading`         | Renders the leading content of the list item.  |
| `overline`        | Renders the overline of the list item.         |
| `supporting-text` | Renders the supporting text of the list item.  |
| `trailing`        | Renders the trailing content of the list item. |

#### 📋 Attributes

| Attribute  | Type      | Default | Description                      |
| ---------- | --------- | ------- | -------------------------------- |
| `disabled` | `boolean` | `false` | Whether the element is disabled. |
| `selected` | `boolean` | `false` | Whether the element is selected. |

#### 📡 Events

| Event    | Description                              |
| -------- | ---------------------------------------- |
| `input`  | Emitted when the selected state changes. |
| `change` | Emitted when the selected state changes. |
| `click`  | Emitted when the element is clicked.     |

#### 🎛️ CSS Custom Properties

| Property                                               | Description                                         |
| ------------------------------------------------------ | --------------------------------------------------- |
| `--m3e-list-item-between-space`                        | Horizontal gap between elements.                    |
| `--m3e-list-item-padding-inline`                       | Horizontal padding for the list item.               |
| `--m3e-list-item-padding-block`                        | Vertical padding for the list item.                 |
| `--m3e-list-item-height`                               | Minimum height of the list item.                    |
| `--m3e-list-item-font-size`                            | Font size for main content.                         |
| `--m3e-list-item-font-weight`                          | Font weight for main content.                       |
| `--m3e-list-item-line-height`                          | Line height for main content.                       |
| `--m3e-list-item-tracking`                             | Letter spacing for main content.                    |
| `--m3e-list-item-overline-font-size`                   | Font size for overline slot.                        |
| `--m3e-list-item-overline-font-weight`                 | Font weight for overline slot.                      |
| `--m3e-list-item-overline-line-height`                 | Line height for overline slot.                      |
| `--m3e-list-item-overline-tracking`                    | Letter spacing for overline slot.                   |
| `--m3e-list-item-supporting-text-font-size`            | Font size for supporting text slot.                 |
| `--m3e-list-item-supporting-text-font-weight`          | Font weight for supporting text slot.               |
| `--m3e-list-item-supporting-text-line-height`          | Line height for supporting text slot.               |
| `--m3e-list-item-supporting-text-tracking`             | Letter spacing for supporting text slot.            |
| `--m3e-list-item-trailing-text-font-size`              | Font size for trailing supporting text slot.        |
| `--m3e-list-item-trailing-text-font-weight`            | Font weight for trailing supporting text slot.      |
| `--m3e-list-item-trailing-text-line-height`            | Line height for trailing supporting text slot.      |
| `--m3e-list-item-trailing-text-tracking`               | Letter spacing for trailing supporting text slot.   |
| `--m3e-list-item-icon-size`                            | Size for leading/trailing icons.                    |
| `--m3e-list-item-label-text-color`                     | Color for the main content.                         |
| `--m3e-list-item-overline-color`                       | Color for the overline slot.                        |
| `--m3e-list-item-supporting-text-color`                | Color for the supporting text slot.                 |
| `--m3e-list-item-leading-color`                        | Color for the leading content.                      |
| `--m3e-list-item-trailing-color`                       | Color for the trailing content.                     |
| `--m3e-list-item-container-color`                      | Background color of the list item.                  |
| `--m3e-list-item-container-shape`                      | Border radius of the list item.                     |
| `--m3e-list-item-hover-container-shape`                | Border radius of the list item on hover.            |
| `--m3e-list-item-focus-container-shape`                | Border radius of the list item on focus.            |
| `--m3e-list-item-video-width`                          | Width of the video slot.                            |
| `--m3e-list-item-video-height`                         | Height of the video slot.                           |
| `--m3e-list-item-video-shape`                          | Border radius of the video slot.                    |
| `--m3e-list-item-image-width`                          | Width of the image slot.                            |
| `--m3e-list-item-image-height`                         | Height of the image slot.                           |
| `--m3e-list-item-image-shape`                          | Border radius of the image slot.                    |
| `--m3e-list-item-disabled-label-text-color`            | Color for the main content when disabled.           |
| `--m3e-list-item-disabled-label-text-opacity`          | Opacity for the main content when disabled.         |
| `--m3e-list-item-disabled-overline-color`              | Color for the overline slot when disabled.          |
| `--m3e-list-item-disabled-overline-opacity`            | Opacity for the overline slot when disabled.        |
| `--m3e-list-item-disabled-supporting-text-color`       | Color for the supporting text slot when disabled.   |
| `--m3e-list-item-disabled-supporting-text-opacity`     | Opacity for the supporting text slot when disabled. |
| `--m3e-list-item-disabled-leading-color`               | Color for the leading content when disabled.        |
| `--m3e-list-item-disabled-leading-opacity`             | Opacity for the leading content when disabled.      |
| `--m3e-list-item-disabled-trailing-color`              | Color for the trailing content when disabled.       |
| `--m3e-list-item-disabled-trailing-opacity`            | Opacity for the trailing content when disabled.     |
| `--m3e-list-item-hover-state-layer-color`              | Color for the hover state layer.                    |
| `--m3e-list-item-hover-state-layer-opacity`            | Opacity for the hover state layer.                  |
| `--m3e-list-item-focus-state-layer-color`              | Color for the focus state layer.                    |
| `--m3e-list-item-focus-state-layer-opacity`            | Opacity for the focus state layer.                  |
| `--m3e-list-item-pressed-state-layer-color`            | Color for the pressed state layer.                  |
| `--m3e-list-item-pressed-state-layer-opacity`          | Opacity for the pressed state layer.                |
| `--m3e-list-item-disabled-media-opacity`               | Opacity for media elements when disabled.           |
| `--m3e-list-item-three-line-top-offset`                | Top offset for media in three line items.           |
| `--m3e-list-item-selected-label-text-color`            | Selected color for the main content.                |
| `--m3e-list-item-selected-overline-color`              | Selected color for the overline slot.               |
| `--m3e-list-item-selected-supporting-text-color`       | Selected color for the supporting text slot.        |
| `--m3e-list-item-selected-leading-color`               | Selected color for the leading content.             |
| `--m3e-list-item-selected-trailing-color`              | Selected color for the trailing content.            |
| `--m3e-list-item-selected-container-color`             | Selected background color of the list item.         |
| `--m3e-list-item-selected-container-shape`             | Selected border radius of the list item.            |
| `--m3e-list-item-selected-disabled-container-color`    | Selected background color when disabled.            |
| `--m3e-list-item-selected-disabled-container-opacity`  | Selected opacity when disabled.                     |
| `--m3e-list-item-selected-hover-state-layer-color`     | Color for the hover state layer when selected.      |
| `--m3e-list-item-selected-hover-state-layer-opacity`   | Opacity for the hover state layer when selected.    |
| `--m3e-list-item-selected-focus-state-layer-color`     | Color for the focus state layer when selected.      |
| `--m3e-list-item-selected-focus-state-layer-opacity`   | Opacity for the focus state layer when selected.    |
| `--m3e-list-item-selected-pressed-state-layer-color`   | Color for the pressed state layer when selected.    |
| `--m3e-list-item-selected-pressed-state-layer-opacity` | Opacity for the pressed state layer when selected.  |

### 🗂️ m3e-action-list

This section details the attributes, slots and CSS custom properties available for the `m3e-action-list` component.

#### 🧩 Slots

| Slot        | Description                    |
| ----------- | ------------------------------ |
| _(default)_ | Renders the items of the list. |

#### 📋 Attributes

| Attribute | Type                           | Default      | Description                         |
| --------- | ------------------------------ | ------------ | ----------------------------------- |
| `variant` | `"baseline"` \| `"expressive"` | `"standard"` | The appearance variant of the list. |

#### 🎛️ CSS Custom Properties

| Property                                              | Description                                                 |
| ----------------------------------------------------- | ----------------------------------------------------------- |
| `--m3e-list-divider-inset-start-size`                 | Start inset for dividers within the list.                   |
| `--m3e-list-divider-inset-end-size`                   | End inset for dividers within the list.                     |
| `--m3e-list-segmented-gap`                            | Gap between list items in segmented variant.                |
| `--m3e-expressive-list-container-shape`               | Border radius of the expressive list container.             |
| `--m3e-expressive-list-item-container-color`          | Background color of items in expressive variant.            |
| `--m3e-expressive-list-item-container-shape`          | Border radius of items in expressive variant.               |
| `--m3e-expressive-list-item-hover-container-shape`    | Border radius of items in expressive variant on hover.      |
| `--m3e-expressive-list-item-focus-container-shape`    | Border radius of items in expressive variant on focus.      |
| `--m3e-expressive-list-item-selected-container-shape` | Border radius of items in expressive variant when selected. |

### 🗂️ m3e-selection-list

This section details the attributes, slots and CSS custom properties available for the `m3e-selection-list` component.

#### 🧩 Slots

| Slot        | Description                    |
| ----------- | ------------------------------ |
| _(default)_ | Renders the items of the list. |

#### 📋 Attributes

| Attribute                  | Type                           | Default      | Description                              |
| -------------------------- | ------------------------------ | ------------ | ---------------------------------------- |
| `variant`                  | `"baseline"` \| `"expressive"` | `"standard"` | The appearance variant of the list.      |
| `multi`                    | `boolean`                      | `false`      | Whether multiple items can be selected.  |
| `hide-selection-indicator` | `boolean`                      | `false`      | Whether to hide the selection indicator. |

#### 📡 Events

| Event    | Description                                           |
| -------- | ----------------------------------------------------- |
| `input`  | Emitted when the selected state of an option changes. |
| `change` | Emitted when the selected state of an option changes. |

#### 🎛️ CSS Custom Properties

| Property                                              | Description                                                 |
| ----------------------------------------------------- | ----------------------------------------------------------- |
| `--m3e-list-divider-inset-start-size`                 | Start inset for dividers within the list.                   |
| `--m3e-list-divider-inset-end-size`                   | End inset for dividers within the list.                     |
| `--m3e-list-segmented-gap`                            | Gap between list items in segmented variant.                |
| `--m3e-expressive-list-container-shape`               | Border radius of the expressive list container.             |
| `--m3e-expressive-list-item-container-color`          | Background color of items in expressive variant.            |
| `--m3e-expressive-list-item-container-shape`          | Border radius of items in expressive variant.               |
| `--m3e-expressive-list-item-hover-container-shape`    | Border radius of items in expressive variant on hover.      |
| `--m3e-expressive-list-item-focus-container-shape`    | Border radius of items in expressive variant on focus.      |
| `--m3e-expressive-list-item-selected-container-shape` | Border radius of items in expressive variant when selected. |

### 🗂️ m3e-expandable-list-item

This section details the attributes, slots, events, and CSS custom properties available for the `m3e-expandable-list-item` component.

#### 🧩 Slots

| Slot              | Description                                             |
| ----------------- | ------------------------------------------------------- |
| _(default)_       | Renders the content of the list item.                   |
| `leading`         | Renders the leading content of the list item.           |
| `overline`        | Renders the overline of the list item.                  |
| `supporting-text` | Renders the supporting text of the list item.           |
| `toggle-icon`     | Renders a custom icon for the expand/collapse toggle.   |
| `items`           | Container for child list items displayed when expanded. |

#### 📋 Attributes

| Attribute  | Type      | Default | Description                      |
| ---------- | --------- | ------- | -------------------------------- |
| `disabled` | `boolean` | `false` | Whether the element is disabled. |
| `open`     | `boolean` | `false` | Whether the item is expanded.    |

#### 📡 Events

| Event     | Description                            |
| --------- | -------------------------------------- |
| `opening` | Emitted when the item begins to open.  |
| `opened`  | Emitted when the item has opened.      |
| `closing` | Emitted when the item begins to close. |
| `closed`  | Emitted when the item has closed.      |

#### 🎛️ CSS Custom Properties

| Property                                                          | Description                                                  |
| ----------------------------------------------------------------- | ------------------------------------------------------------ |
| `--m3e-expandable-list-item-toggle-icon-container-width`          | Width of the toggle icon container.                          |
| `--m3e-expandable-list-item-toggle-icon-container-shape`          | Border radius of the toggle icon container.                  |
| `--m3e-expandable-list-item-toggle-icon-size`                     | Size of the toggle icon.                                     |
| `--m3e-expandable-list-item-expanded-toggle-icon-container-color` | Background color of the toggle icon container when expanded. |
| `--m3e-expandable-list-item-bounce-duration`                      | Duration of the bounce animation when expanding.             |
| `--m3e-expandable-list-item-bounce-factor`                        | Multiplication factor for the bounce effect.                 |
| `--m3e-expandable-list-item-expand-duration`                      | Duration of the expand/collapse animation.                   |
| `--m3e-list-item-between-space`                                   | Horizontal gap between elements.                             |
| `--m3e-list-item-padding-inline`                                  | Horizontal padding for the list item.                        |
| `--m3e-list-item-padding-block`                                   | Vertical padding for the list item.                          |
| `--m3e-list-item-height`                                          | Minimum height of the list item.                             |
| `--m3e-list-item-font-size`                                       | Font size for main content.                                  |
| `--m3e-list-item-font-weight`                                     | Font weight for main content.                                |
| `--m3e-list-item-line-height`                                     | Line height for main content.                                |
| `--m3e-list-item-tracking`                                        | Letter spacing for main content.                             |
| `--m3e-list-item-overline-font-size`                              | Font size for overline slot.                                 |
| `--m3e-list-item-overline-font-weight`                            | Font weight for overline slot.                               |
| `--m3e-list-item-overline-line-height`                            | Line height for overline slot.                               |
| `--m3e-list-item-overline-tracking`                               | Letter spacing for overline slot.                            |
| `--m3e-list-item-supporting-text-font-size`                       | Font size for supporting text slot.                          |
| `--m3e-list-item-supporting-text-font-weight`                     | Font weight for supporting text slot.                        |
| `--m3e-list-item-supporting-text-line-height`                     | Line height for supporting text slot.                        |
| `--m3e-list-item-supporting-text-tracking`                        | Letter spacing for supporting text slot.                     |
| `--m3e-list-item-trailing-text-font-size`                         | Font size for trailing supporting text slot.                 |
| `--m3e-list-item-trailing-text-font-weight`                       | Font weight for trailing supporting text slot.               |
| `--m3e-list-item-trailing-text-line-height`                       | Line height for trailing supporting text slot.               |
| `--m3e-list-item-trailing-text-tracking`                          | Letter spacing for trailing supporting text slot.            |
| `--m3e-list-item-icon-size`                                       | Size for leading/trailing icons.                             |
| `--m3e-list-item-label-text-color`                                | Color for the main content.                                  |
| `--m3e-list-item-overline-color`                                  | Color for the overline slot.                                 |
| `--m3e-list-item-supporting-text-color`                           | Color for the supporting text slot.                          |
| `--m3e-list-item-leading-color`                                   | Color for the leading content.                               |
| `--m3e-list-item-trailing-color`                                  | Color for the trailing content.                              |
| `--m3e-list-item-container-color`                                 | Background color of the list item.                           |
| `--m3e-list-item-container-shape`                                 | Border radius of the list item.                              |
| `--m3e-list-item-hover-container-shape`                           | Border radius of the list item on hover.                     |
| `--m3e-list-item-focus-container-shape`                           | Border radius of the list item on focus.                     |
| `--m3e-list-item-video-width`                                     | Width of the video slot.                                     |
| `--m3e-list-item-video-height`                                    | Height of the video slot.                                    |
| `--m3e-list-item-video-shape`                                     | Border radius of the video slot.                             |
| `--m3e-list-item-image-width`                                     | Width of the image slot.                                     |
| `--m3e-list-item-image-height`                                    | Height of the image slot.                                    |
| `--m3e-list-item-image-shape`                                     | Border radius of the image slot.                             |
| `--m3e-list-item-disabled-label-text-color`                       | Color for the main content when disabled.                    |
| `--m3e-list-item-disabled-label-text-opacity`                     | Opacity for the main content when disabled.                  |
| `--m3e-list-item-disabled-overline-color`                         | Color for the overline slot when disabled.                   |
| `--m3e-list-item-disabled-overline-opacity`                       | Opacity for the overline slot when disabled.                 |
| `--m3e-list-item-disabled-supporting-text-color`                  | Color for the supporting text slot when disabled.            |
| `--m3e-list-item-disabled-supporting-text-opacity`                | Opacity for the supporting text slot when disabled.          |
| `--m3e-list-item-disabled-leading-color`                          | Color for the leading content when disabled.                 |
| `--m3e-list-item-disabled-leading-opacity`                        | Opacity for the leading content when disabled.               |
| `--m3e-list-item-disabled-trailing-color`                         | Color for the trailing content when disabled.                |
| `--m3e-list-item-disabled-trailing-opacity`                       | Opacity for the trailing content when disabled.              |
| `--m3e-list-item-hover-state-layer-color`                         | Color for the hover state layer.                             |
| `--m3e-list-item-hover-state-layer-opacity`                       | Opacity for the hover state layer.                           |
| `--m3e-list-item-focus-state-layer-color`                         | Color for the focus state layer.                             |
| `--m3e-list-item-focus-state-layer-opacity`                       | Opacity for the focus state layer.                           |
| `--m3e-list-item-pressed-state-layer-color`                       | Color for the pressed state layer.                           |
| `--m3e-list-item-pressed-state-layer-opacity`                     | Opacity for the pressed state layer.                         |
| `--m3e-list-item-three-line-top-offset`                           | Top offset for media in three line items.                    |
| `--m3e-list-item-disabled-media-opacity`                          | Opacity for media when disabled.                             |

## 🤝 Contributing

See the root monorepo `CONTRIBUTING.md` for guidelines on contributing to this package.

## 📄 License

This package is licensed under the MIT License.
