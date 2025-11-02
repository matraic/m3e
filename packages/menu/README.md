# @m3e/menu

The `@m3e/menu` package provides a cohesive set of components for constructing accessible, anchored menus that align with Material 3 design guidance. It supports both single and multi-selection patterns, nested menu hierarchies, and dynamically positioned floating panels. Menus are triggered from interactive elements and present checkable or exclusive choices using item variants. Grouping primitives establish selection boundaries, while nested flows support layered navigation and progressive disclosure.

> **This package is part of [M3E](https://github.com/matraic/m3e) monorepo**, a unified suite of Material 3 web components. [Explore the docs](https://matraic.github.io/m3e) to see them in action.

## 📦 Installation

```bash
npm install @m3e/menu
```

## 💻 Editor Integration

This package includes a [Custom Elements Manifest](https://github.com/webcomponents/custom-elements-manifest) to support enhanced editor tooling and developer experience.

### Visual Studio Code

To enable autocomplete and hover documentation for `@m3e/menu`, install the [Custom Elements Manifest Language Server](https://marketplace.visualstudio.com/items?itemName=pwrs.cem-language-server-vscode) extension. It will automatically detect the manifest bundled with this package and surface tag names, attributes, slots, and events in supported files.

Alternately, you can explicitly reference the `html-custom-data.json` and `css-custom-data.json` in your workspace settings:

```json
{
  "html.customData": ["./node_modules/@m3e/menu/dist/html-custom-data.json"],
  "css.customData": ["./node_modules/@m3e/menu/dist/css-custom-data.json"]
}
```

## 🚀 Native Module Support

This package uses [JavaScript Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#module_specifiers). To use it directly in a browser without a bundler, use a module script similar to the following.

```html
<script type="module" src="/node_modules/@m3e/menu/dist/index.js"></script>
```

In addition, you must use an [import map](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script/type/importmap) to include dependencies.

```html
<script type="importmap">
  {
    "imports": {
      "lit": "https://cdn.jsdelivr.net/npm/lit@3.3.0/+esm",
      "@m3e/core": "/node_modules/@m3e/core/dist/index.js",
      "@m3e/core/a11y": "/node_modules/@m3e/core/dist/a11y.js",
      "@m3e/core/anchoring": "/node_modules/@m3e/core/dist/anchoring.js"
    }
  }
</script>
```

> For production, use index.min.js, a11y.min.js, and anchoring.min.js for faster load times.

## 🗂️ Elements

- `m3e-menu` — Presents a list of choices on a temporary surface.
- `m3e-menu-item` — An item of a menu.
- `m3e-menu-item-checkbox` — An item of a menu which supports a checkable state.
- `m3e-menu-item-radio` — An item of a menu which supports a mutually exclusive checkable state.
- `m3e-menu-item-group` — Groups related items (such a radios) in a menu.
- `m3e-menu-trigger` — An element, nested within a clickable element, used to open a menu.

## 🧪 Examples

The following example illustrates a basic menu. The `m3e-menu-trigger` is used to trigger a `m3e-menu` specified by the `for` attribute when its parenting element is activated.

```html
<m3e-button>
  <m3e-menu-trigger for="menu1">Basic menu</m3e-menu-trigger>
</m3e-button>
<m3e-menu id="menu1">
  <m3e-menu-item>Apple</m3e-menu-item>
  <m3e-menu-item>Apricot</m3e-menu-item>
  <m3e-menu-item>Avocado</m3e-menu-item>
  <m3e-menu-item>Green Apple</m3e-menu-item>
  <m3e-menu-item>Green Grapes</m3e-menu-item>
  <m3e-menu-item>Olive</m3e-menu-item>
  <m3e-menu-item>Orange</m3e-menu-item>
</m3e-menu>
```

The next example illustrates nested menus. Submenus are triggered by placing a `m3e-menu-trigger` inside a `m3e-menu-item`.

```html
<m3e-button>
  <m3e-menu-trigger for="menu2">Nested menus</m3e-menu-trigger>
</m3e-button>
<m3e-menu id="menu2">
  <m3e-menu-item>
    <m3e-menu-trigger for="menu3">Fruits with A</m3e-menu-trigger>
  </m3e-menu-item>
  <m3e-menu-item>Grapes</m3e-menu-item>
  <m3e-menu-item>Olive</m3e-menu-item>
  <m3e-menu-item>Orange</m3e-menu-item>
</m3e-menu>
<m3e-menu id="menu3">
  <m3e-menu-item>Apricot</m3e-menu-item>
  <m3e-menu-item>Avocado</m3e-menu-item>
  <m3e-menu-item>
    <m3e-menu-trigger for="menu4">Apples</m3e-menu-trigger>
  </m3e-menu-item>
</m3e-menu>
<m3e-menu id="menu4">
  <m3e-menu-item>Fuji</m3e-menu-item>
  <m3e-menu-item>Granny Smith</m3e-menu-item>
  <m3e-menu-item>Red Delicious</m3e-menu-item>
</m3e-menu>
```

## 📖 API Reference

### 🗂️ m3e-menu

This section details the attributes, events, slots and CSS custom properties available for the `m3e-menu` component.

#### ⚙️ Attributes

| Attribute    | Type                    | Default   | Description                              |
| ------------ | ----------------------- | --------- | ---------------------------------------- |
| `position-x` | `"before"` \| `"after"` | `"after"` | The position of the menu, on the x-axis. |
| `position-y` | `"above"` \| `"below"`  | `"below"` | The position of the menu, on the y-axis. |

#### 🔔 Events

| Event          | Description                                 |
| -------------- | ------------------------------------------- |
| `beforetoggle` | Dispatched before the toggle state changes. |
| `toggle`       | Dispatched after the toggle state changes.  |

#### 🧩 Slots

| Slot        | Description                       |
| ----------- | --------------------------------- |
| _(default)_ | Renders the contents of the menu. |

#### 🎛️ CSS Custom Properties

| Property                             | Description                                             |
| ------------------------------------ | ------------------------------------------------------- |
| `--m3e-menu-container-shape`         | Controls the corner radius of the menu container.       |
| `--m3e-menu-container-min-width`     | Minimum width of the menu container.                    |
| `--m3e-menu-container-max-width`     | Maximum width of the menu container.                    |
| `--m3e-menu-container-max-height`    | Maximum height of the menu container.                   |
| `--m3e-menu-container-padding-block` | Vertical padding inside the menu container.             |
| `--m3e-menu-container-color`         | Background color of the menu container.                 |
| `--m3e-menu-container-elevation`     | Box shadow elevation of the menu container.             |
| `--m3e-menu-divider-spacing`         | Vertical spacing around slotted `m3e-divider` elements. |

### 🗂️ m3e-menu-item

This section details the attributes, slots and CSS custom properties available for the `m3e-menu-item` component.

#### ⚙️ Attributes

| Attribute  | Type      | Default | Description                                                                                                 |
| ---------- | --------- | ------- | ----------------------------------------------------------------------------------------------------------- |
| `disabled` | `boolean` | `false` | Whether the element is disabled.                                                                            |
| `download` | `string`  |         | Whether the `target` of the link button will be downloaded, optionally specifying the new name of the file. |
| `href`     | `string`  |         | The URL to which the link button points.                                                                    |
| `rel`      | `string`  |         | The relationship between the `target` of the link button and the document.                                  |
| `target`   | `string`  |         | The target of the link button.                                                                              |

#### 🧩 Slots

| Slot            | Description                               |
| --------------- | ----------------------------------------- |
| _(default)_     | Renders the label of the item.            |
| `icon`          | Renders an icon before the items's label. |
| `trailing-icon` | Renders an icon after the item's label.   |

#### 🎛️ CSS Custom Properties

| Property                                         | Description                                      |
| ------------------------------------------------ | ------------------------------------------------ |
| `--m3e-menu-item-container-height`               | Height of the menu item container.               |
| `--m3e-menu-item-color`                          | Text color for unselected, enabled menu items.   |
| `--m3e-menu-item-container-hover-color`          | State layer hover color for unselected items.    |
| `--m3e-menu-item-container-focus-color`          | State layer focus color for unselected items.    |
| `--m3e-menu-item-ripple-color`                   | Ripple color for unselected items.               |
| `--m3e-menu-selected-color`                      | Text color for selected or expanded items.       |
| `--m3e-menu-selected-container-color`            | Background color for selected or expanded items. |
| `--m3e-menu-item-selected-container-hover-color` | State layer hover color for selected items.      |
| `--m3e-menu-item-selected-container-focus-color` | State layer focus color for selected items.      |
| `--m3e-menu-item-selected-ripple-color`          | Ripple color for selected items.                 |
| `--m3e-menu-item-disabled-color`                 | Base color for disabled items.                   |
| `--m3e-menu-item-disabled-opacity`               | Opacity percentage for disabled item color mix.  |
| `--m3e-menu-item-icon-label-space`               | Horizontal gap between icon and content.         |
| `--m3e-menu-item-padding-start`                  | Start padding for the item wrapper.              |
| `--m3e-menu-item-padding-end`                    | End padding for the item wrapper.                |
| `--m3e-menu-item-label-text-font-size`           | Font size for menu item text.                    |
| `--m3e-menu-item-label-text-font-weight`         | Font weight for menu item text.                  |
| `--m3e-menu-item-label-text-line-height`         | Line height for menu item text.                  |
| `--m3e-menu-item-label-text-tracking`            | Letter spacing for menu item text.               |
| `--m3e-menu-item-focus-ring-shape`               | Border radius for the focus ring.                |
| `--m3e-menu-item-icon-size`                      | Font size for leading and trailing icons.        |

### 🗂️ m3e-menu-item-checkbox

This section details the attributes, slots and CSS custom properties available for the `m3e-menu-item-checkbox` component.

#### ⚙️ Attributes

| Attribute  | Type      | Default | Description                      |
| ---------- | --------- | ------- | -------------------------------- |
| `disabled` | `boolean` | `false` | Whether the element is disabled. |
| `checked`  | `boolean` | `false` | Whether the element is checked.  |

#### 🧩 Slots

| Slot            | Description                               |
| --------------- | ----------------------------------------- |
| _(default)_     | Renders the label of the item.            |
| `icon`          | Renders an icon before the items's label. |
| `trailing-icon` | Renders an icon after the item's label.   |

#### 🎛️ CSS Custom Properties

| Property                                         | Description                                      |
| ------------------------------------------------ | ------------------------------------------------ |
| `--m3e-menu-item-container-height`               | Height of the menu item container.               |
| `--m3e-menu-item-color`                          | Text color for unselected, enabled menu items.   |
| `--m3e-menu-item-container-hover-color`          | State layer hover color for unselected items.    |
| `--m3e-menu-item-container-focus-color`          | State layer focus color for unselected items.    |
| `--m3e-menu-item-ripple-color`                   | Ripple color for unselected items.               |
| `--m3e-menu-selected-color`                      | Text color for selected or expanded items.       |
| `--m3e-menu-selected-container-color`            | Background color for selected or expanded items. |
| `--m3e-menu-item-selected-container-hover-color` | State layer hover color for selected items.      |
| `--m3e-menu-item-selected-container-focus-color` | State layer focus color for selected items.      |
| `--m3e-menu-item-selected-ripple-color`          | Ripple color for selected items.                 |
| `--m3e-menu-item-disabled-color`                 | Base color for disabled items.                   |
| `--m3e-menu-item-disabled-opacity`               | Opacity percentage for disabled item color mix.  |
| `--m3e-menu-item-icon-label-space`               | Horizontal gap between icon and content.         |
| `--m3e-menu-item-padding-start`                  | Start padding for the item wrapper.              |
| `--m3e-menu-item-padding-end`                    | End padding for the item wrapper.                |
| `--m3e-menu-item-label-text-font-size`           | Font size for menu item text.                    |
| `--m3e-menu-item-label-text-font-weight`         | Font weight for menu item text.                  |
| `--m3e-menu-item-label-text-line-height`         | Line height for menu item text.                  |
| `--m3e-menu-item-label-text-tracking`            | Letter spacing for menu item text.               |
| `--m3e-menu-item-focus-ring-shape`               | Border radius for the focus ring.                |
| `--m3e-menu-item-icon-size`                      | Font size for leading and trailing icons.        |

### 🗂️ m3e-menu-item-radio

This section details the attributes, slots and CSS custom properties available for the `m3e-menu-item-radio` component.

#### ⚙️ Attributes

| Attribute  | Type      | Default | Description                      |
| ---------- | --------- | ------- | -------------------------------- |
| `disabled` | `boolean` | `false` | Whether the element is disabled. |
| `checked`  | `boolean` | `false` | Whether the element is checked.  |

#### 🧩 Slots

| Slot            | Description                               |
| --------------- | ----------------------------------------- |
| _(default)_     | Renders the label of the item.            |
| `icon`          | Renders an icon before the items's label. |
| `trailing-icon` | Renders an icon after the item's label.   |

#### 🎛️ CSS Custom Properties

| Property                                         | Description                                      |
| ------------------------------------------------ | ------------------------------------------------ |
| `--m3e-menu-item-container-height`               | Height of the menu item container.               |
| `--m3e-menu-item-color`                          | Text color for unselected, enabled menu items.   |
| `--m3e-menu-item-container-hover-color`          | State layer hover color for unselected items.    |
| `--m3e-menu-item-container-focus-color`          | State layer focus color for unselected items.    |
| `--m3e-menu-item-ripple-color`                   | Ripple color for unselected items.               |
| `--m3e-menu-selected-color`                      | Text color for selected or expanded items.       |
| `--m3e-menu-selected-container-color`            | Background color for selected or expanded items. |
| `--m3e-menu-item-selected-container-hover-color` | State layer hover color for selected items.      |
| `--m3e-menu-item-selected-container-focus-color` | State layer focus color for selected items.      |
| `--m3e-menu-item-selected-ripple-color`          | Ripple color for selected items.                 |
| `--m3e-menu-item-disabled-color`                 | Base color for disabled items.                   |
| `--m3e-menu-item-disabled-opacity`               | Opacity percentage for disabled item color mix.  |
| `--m3e-menu-item-icon-label-space`               | Horizontal gap between icon and content.         |
| `--m3e-menu-item-padding-start`                  | Start padding for the item wrapper.              |
| `--m3e-menu-item-padding-end`                    | End padding for the item wrapper.                |
| `--m3e-menu-item-label-text-font-size`           | Font size for menu item text.                    |
| `--m3e-menu-item-label-text-font-weight`         | Font weight for menu item text.                  |
| `--m3e-menu-item-label-text-line-height`         | Line height for menu item text.                  |
| `--m3e-menu-item-label-text-tracking`            | Letter spacing for menu item text.               |
| `--m3e-menu-item-focus-ring-shape`               | Border radius for the focus ring.                |
| `--m3e-menu-item-icon-size`                      | Font size for leading and trailing icons.        |

### 🗂️ m3e-menu-item-group

This section details the slots available for the `m3e-menu-item-group` component.

#### 🧩 Slots

| Slot        | Description                        |
| ----------- | ---------------------------------- |
| _(default)_ | Renders the contents of the group. |

### 🗂️ m3e-menu-trigger

This section details the slots available for the `m3e-menu-trigger` component.

#### 🧩 Slots

| Slot        | Description                          |
| ----------- | ------------------------------------ |
| _(default)_ | Renders the contents of the trigger. |

## 🤝 Contributing

See the root monorepo `CONTRIBUTING.md` for guidelines on contributing to this package.

## 📄 License

This package is licensed under the MIT License.
