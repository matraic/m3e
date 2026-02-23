# @m3e/web/menu

The `@m3e/web/menu` module provides a cohesive set of components for constructing accessible, anchored menus that align with Material 3 design guidance. It supports both single and multi-selection patterns, nested menu hierarchies, and dynamically positioned floating panels. Menus are triggered from interactive elements and present checkable or exclusive choices using item variants. Grouping primitives establish selection boundaries, while nested flows support layered navigation and progressive disclosure.

```ts
import "@m3e/web/menu";
```

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

| Attribute    | Type                        | Default      | Description                              |
| ------------ | --------------------------- | ------------ | ---------------------------------------- |
| `position-x` | `"before"` \| `"after"`     | `"after"`    | The position of the menu, on the x-axis. |
| `position-y` | `"above"` \| `"below"`      | `"below"`    | The position of the menu, on the y-axis. |
| `variant`    | `"standard"` \| `"vibrant"` | `"standard"` | The appearance variant of the menu.      |

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

| Property                              | Description                                                   |
| ------------------------------------- | ------------------------------------------------------------- |
| `--m3e-menu-container-shape`          | Controls the corner radius of the menu container.             |
| `--m3e-menu-active-container-shape`   | Controls the corner radius of the menu container when active. |
| `--m3e-menu-container-min-width`      | Minimum width of the menu container.                          |
| `--m3e-menu-container-max-width`      | Maximum width of the menu container.                          |
| `--m3e-menu-container-max-height`     | Maximum height of the menu container.                         |
| `--m3e-menu-container-padding-block`  | Vertical padding inside the menu container.                   |
| `--m3e-menu-container-padding-inline` | Horizontal padding inside the menu container.                 |
| `--m3e-menu-container-color`          | Background color of the menu container.                       |
| `--m3e-menu-container-elevation`      | Box shadow elevation of the menu container.                   |
| `--m3e-vibrant-menu-container-color`  | Background color of the menu container for vibrant variant.   |
| `--m3e-menu-divider-spacing`          | Vertical spacing around slotted `m3e-divider` elements.       |
| `--m3e-menu-gap`                      | Gap between content in the menu.                              |

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

| Property                                                 | Description                                                        |
| -------------------------------------------------------- | ------------------------------------------------------------------ |
| `--m3e-menu-item-container-height`                       | Height of the menu item container.                                 |
| `--m3e-menu-item-color`                                  | Text color for unselected, enabled menu items.                     |
| `--m3e-menu-item-container-hover-color`                  | State layer hover color for unselected items.                      |
| `--m3e-menu-item-container-focus-color`                  | State layer focus color for unselected items.                      |
| `--m3e-menu-item-ripple-color`                           | Ripple color for unselected items.                                 |
| `--m3e-menu-item-selected-color`                         | Text color for selected items.                                     |
| `--m3e-menu-item-selected-container-color`               | Background color for selected items.                               |
| `--m3e-menu-item-selected-container-hover-color`         | State layer hover color for selected items.                        |
| `--m3e-menu-item-selected-container-focus-color`         | State layer focus color for selected items.                        |
| `--m3e-menu-item-selected-ripple-color`                  | Ripple color for selected items.                                   |
| `--m3e-menu-item-active-state-layer-color`               | State layer color for expanded items.                              |
| `--m3e-menu-item-active-state-layer-opacity`             | State layer opacity for expanded items.                            |
| `--m3e-menu-item-disabled-color`                         | Base color for disabled items.                                     |
| `--m3e-menu-item-disabled-opacity`                       | Opacity percentage for disabled item color mix.                    |
| `--m3e-vibrant-menu-item-color`                          | Text color for unselected, enabled menu items for vibrant variant. |
| `--m3e-vibrant-menu-item-container-hover-color`          | State layer hover color for unselected items for vibrant variant.  |
| `--m3e-vibrant-menu-item-container-focus-color`          | State layer focus color for unselected items for vibrant variant.  |
| `--m3e-vibrant-menu-item-ripple-color`                   | Ripple color for unselected items for vibrant variant.             |
| `--m3e-vibrant-menu-item-selected-color`                 | Text color for selected items for vibrant variant.                 |
| `--m3e-vibrant-menu-item-selected-container-color`       | Background color for selected items for vibrant variant.           |
| `--m3e-vibrant-menu-item-selected-container-hover-color` | State layer hover color for selected items for vibrant variant.    |
| `--m3e-vibrant-menu-item-selected-container-focus-color` | State layer focus color for selected items for vibrant variant.    |
| `--m3e-vibrant-menu-item-selected-ripple-color`          | Ripple color for selected items for vibrant variant.               |
| `--m3e-vibrant-menu-item-active-state-layer-color`       | State layer color for expanded items for vibrant variant.          |
| `--m3e-vibrant-menu-item-disabled-color`                 | Base color for disabled items for vibrant variant.                 |
| `--m3e-menu-item-icon-label-space`                       | Horizontal gap between icon and content.                           |
| `--m3e-menu-item-padding-start`                          | Start padding for the item wrapper.                                |
| `--m3e-menu-item-padding-end`                            | End padding for the item wrapper.                                  |
| `--m3e-menu-item-label-text-font-size`                   | Font size for menu item text.                                      |
| `--m3e-menu-item-label-text-font-weight`                 | Font weight for menu item text.                                    |
| `--m3e-menu-item-label-text-line-height`                 | Line height for menu item text.                                    |
| `--m3e-menu-item-label-text-tracking`                    | Letter spacing for menu item text.                                 |
| `--m3e-menu-item-focus-ring-shape`                       | Border radius for the focus ring.                                  |
| `--m3e-menu-item-icon-size`                              | Font size for leading and trailing icons.                          |
| `--m3e-menu-item-shape`                                  | Base shape of the menu item.                                       |
| `--m3e-menu-item-first-child-shape`                      | Shape for the first menu item in a menu.                           |
| `--m3e-menu-item-last-child-shape`                       | Shape for the last menu item in a menu.                            |

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

| Property                                                 | Description                                                        |
| -------------------------------------------------------- | ------------------------------------------------------------------ |
| `--m3e-menu-item-container-height`                       | Height of the menu item container.                                 |
| `--m3e-menu-item-color`                                  | Text color for unselected, enabled menu items.                     |
| `--m3e-menu-item-container-hover-color`                  | State layer hover color for unselected items.                      |
| `--m3e-menu-item-container-focus-color`                  | State layer focus color for unselected items.                      |
| `--m3e-menu-item-ripple-color`                           | Ripple color for unselected items.                                 |
| `--m3e-menu-item-selected-color`                         | Text color for selected items.                                     |
| `--m3e-menu-item-selected-container-color`               | Background color for selected items.                               |
| `--m3e-menu-item-selected-container-hover-color`         | State layer hover color for selected items.                        |
| `--m3e-menu-item-selected-container-focus-color`         | State layer focus color for selected items.                        |
| `--m3e-menu-item-selected-ripple-color`                  | Ripple color for selected items.                                   |
| `--m3e-menu-item-active-state-layer-color`               | State layer color for expanded items.                              |
| `--m3e-menu-item-active-state-layer-opacity`             | State layer opacity for expanded items.                            |
| `--m3e-menu-item-disabled-color`                         | Base color for disabled items.                                     |
| `--m3e-menu-item-disabled-opacity`                       | Opacity percentage for disabled item color mix.                    |
| `--m3e-vibrant-menu-item-color`                          | Text color for unselected, enabled menu items for vibrant variant. |
| `--m3e-vibrant-menu-item-container-hover-color`          | State layer hover color for unselected items for vibrant variant.  |
| `--m3e-vibrant-menu-item-container-focus-color`          | State layer focus color for unselected items for vibrant variant.  |
| `--m3e-vibrant-menu-item-ripple-color`                   | Ripple color for unselected items for vibrant variant.             |
| `--m3e-vibrant-menu-item-selected-color`                 | Text color for selected items for vibrant variant.                 |
| `--m3e-vibrant-menu-item-selected-container-color`       | Background color for selected items for vibrant variant.           |
| `--m3e-vibrant-menu-item-selected-container-hover-color` | State layer hover color for selected items for vibrant variant.    |
| `--m3e-vibrant-menu-item-selected-container-focus-color` | State layer focus color for selected items for vibrant variant.    |
| `--m3e-vibrant-menu-item-selected-ripple-color`          | Ripple color for selected items for vibrant variant.               |
| `--m3e-vibrant-menu-item-active-state-layer-color`       | State layer color for expanded items for vibrant variant.          |
| `--m3e-vibrant-menu-item-disabled-color`                 | Base color for disabled items for vibrant variant.                 |
| `--m3e-menu-item-icon-label-space`                       | Horizontal gap between icon and content.                           |
| `--m3e-menu-item-padding-start`                          | Start padding for the item wrapper.                                |
| `--m3e-menu-item-padding-end`                            | End padding for the item wrapper.                                  |
| `--m3e-menu-item-label-text-font-size`                   | Font size for menu item text.                                      |
| `--m3e-menu-item-label-text-font-weight`                 | Font weight for menu item text.                                    |
| `--m3e-menu-item-label-text-line-height`                 | Line height for menu item text.                                    |
| `--m3e-menu-item-label-text-tracking`                    | Letter spacing for menu item text.                                 |
| `--m3e-menu-item-focus-ring-shape`                       | Border radius for the focus ring.                                  |
| `--m3e-menu-item-icon-size`                              | Font size for leading and trailing icons.                          |
| `--m3e-menu-item-shape`                                  | Base shape of the menu item.                                       |
| `--m3e-menu-item-selected-shape`                         | Shape used for a selected menu item.                               |
| `--m3e-menu-item-first-child-shape`                      | Shape for the first menu item in a menu.                           |
| `--m3e-menu-item-last-child-shape`                       | Shape for the last menu item in a menu.                            |

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

| Property                                                 | Description                                                        |
| -------------------------------------------------------- | ------------------------------------------------------------------ |
| `--m3e-menu-item-container-height`                       | Height of the menu item container.                                 |
| `--m3e-menu-item-color`                                  | Text color for unselected, enabled menu items.                     |
| `--m3e-menu-item-container-hover-color`                  | State layer hover color for unselected items.                      |
| `--m3e-menu-item-container-focus-color`                  | State layer focus color for unselected items.                      |
| `--m3e-menu-item-ripple-color`                           | Ripple color for unselected items.                                 |
| `--m3e-menu-item-selected-color`                         | Text color for selected items.                                     |
| `--m3e-menu-item-selected-container-color`               | Background color for selected items.                               |
| `--m3e-menu-item-selected-container-hover-color`         | State layer hover color for selected items.                        |
| `--m3e-menu-item-selected-container-focus-color`         | State layer focus color for selected items.                        |
| `--m3e-menu-item-selected-ripple-color`                  | Ripple color for selected items.                                   |
| `--m3e-menu-item-active-state-layer-color`               | State layer color for expanded items.                              |
| `--m3e-menu-item-active-state-layer-opacity`             | State layer opacity for expanded items.                            |
| `--m3e-menu-item-disabled-color`                         | Base color for disabled items.                                     |
| `--m3e-menu-item-disabled-opacity`                       | Opacity percentage for disabled item color mix.                    |
| `--m3e-vibrant-menu-item-color`                          | Text color for unselected, enabled menu items for vibrant variant. |
| `--m3e-vibrant-menu-item-container-hover-color`          | State layer hover color for unselected items for vibrant variant.  |
| `--m3e-vibrant-menu-item-container-focus-color`          | State layer focus color for unselected items for vibrant variant.  |
| `--m3e-vibrant-menu-item-ripple-color`                   | Ripple color for unselected items for vibrant variant.             |
| `--m3e-vibrant-menu-item-selected-color`                 | Text color for selected items for vibrant variant.                 |
| `--m3e-vibrant-menu-item-selected-container-color`       | Background color for selected items for vibrant variant.           |
| `--m3e-vibrant-menu-item-selected-container-hover-color` | State layer hover color for selected items for vibrant variant.    |
| `--m3e-vibrant-menu-item-selected-container-focus-color` | State layer focus color for selected items for vibrant variant.    |
| `--m3e-vibrant-menu-item-selected-ripple-color`          | Ripple color for selected items for vibrant variant.               |
| `--m3e-vibrant-menu-item-active-state-layer-color`       | State layer color for expanded items for vibrant variant.          |
| `--m3e-vibrant-menu-item-disabled-color`                 | Base color for disabled items for vibrant variant.                 |
| `--m3e-menu-item-icon-label-space`                       | Horizontal gap between icon and content.                           |
| `--m3e-menu-item-padding-start`                          | Start padding for the item wrapper.                                |
| `--m3e-menu-item-padding-end`                            | End padding for the item wrapper.                                  |
| `--m3e-menu-item-label-text-font-size`                   | Font size for menu item text.                                      |
| `--m3e-menu-item-label-text-font-weight`                 | Font weight for menu item text.                                    |
| `--m3e-menu-item-label-text-line-height`                 | Line height for menu item text.                                    |
| `--m3e-menu-item-label-text-tracking`                    | Letter spacing for menu item text.                                 |
| `--m3e-menu-item-focus-ring-shape`                       | Border radius for the focus ring.                                  |
| `--m3e-menu-item-icon-size`                              | Font size for leading and trailing icons.                          |
| `--m3e-menu-item-shape`                                  | Base shape of the menu item.                                       |
| `--m3e-menu-item-selected-shape`                         | Shape used for a selected menu item.                               |
| `--m3e-menu-item-first-child-shape`                      | Shape for the first menu item in a menu.                           |
| `--m3e-menu-item-last-child-shape`                       | Shape for the last menu item in a menu.                            |

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
