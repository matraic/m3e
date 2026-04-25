# @m3e/web/tree

The `m3e-tree` component presents hierarchical data in a structure that users can navigate, with nested levels that open and collapse as needed.

```ts
import "@m3e/web/tree";
```

## 🗂️ Elements

- `m3e-tree` — Presents hierarchical data in a tree structure.
- `m3e-tree-item` — An expandable item in a tree.

## 🧪 Examples

The following example illustrates a simple tree with nested child items.

```html
<m3e-tree>
  <m3e-tree-item open>
    <span slot="label">Getting Started</span>
    <m3e-tree-item>
      <span slot="label">Overview</span>
    </m3e-tree-item>
    <m3e-tree-item>
      <span slot="label">Installation</span>
    </m3e-tree-item>
  </m3e-tree-item>
  <m3e-tree-item>
    <span slot="label">Components</span>
    <m3e-tree-item>
      <span slot="label">Button</span>
    </m3e-tree-item>
    <m3e-tree-item>
      <span slot="label">Card</span>
    </m3e-tree-item>
  </m3e-tree-item>
</m3e-tree>
```

The next example demonstrates multi-selection with cascading selection state.

```html
<m3e-tree multi cascade>
  <m3e-tree-item>
    <span slot="label">Fruits</span>
    <m3e-tree-item>
      <span slot="label">Apples</span>
    </m3e-tree-item>
    <m3e-tree-item>
      <span slot="label">Oranges</span>
    </m3e-tree-item>
    <m3e-tree-item>
      <span slot="label">Bananas</span>
    </m3e-tree-item>
  </m3e-tree-item>
  <m3e-tree-item>
    <span slot="label">Vegetables</span>
    <m3e-tree-item>
      <span slot="label">Carrots</span>
    </m3e-tree-item>
    <m3e-tree-item>
      <span slot="label">Broccoli</span>
    </m3e-tree-item>
    <m3e-tree-item>
      <span slot="label">Spinach</span>
    </m3e-tree-item>
  </m3e-tree-item>
</m3e-tree>
```

## 📖 API Reference

### 🗂️ m3e-tree

#### ⚙️ Attributes

| Attribute | Type      | Default | Description                                              |
| --------- | --------- | ------- | -------------------------------------------------------- |
| `multi`   | `boolean` | `false` | Whether multiple items can be selected.                  |
| `cascade` | `boolean` | `false` | Whether multiple item selection cascades to child items. |

#### 🔔 Events

| Event    | Description                              |
| -------- | ---------------------------------------- |
| `change` | Emitted when the selected state changes. |

#### 🧩 Slots

| Slot        | Description                    |
| ----------- | ------------------------------ |
| _(default)_ | Renders the items of the tree. |

#### 🎛️ CSS Custom Properties

| Property                     | Description                  |
| ---------------------------- | ---------------------------- |
| `--m3e-tree-scrollbar-width` | Width of the tree scrollbar. |
| `--m3e-tree-scrollbar-color` | Color of the tree scrollbar. |

### 🗂️ m3e-tree-item

#### ⚙️ Attributes

| Attribute       | Type      | Default | Description                                           |
| --------------- | --------- | ------- | ----------------------------------------------------- |
| `disabled`      | `boolean` | `false` | Whether the element is disabled.                      |
| `indeterminate` | `boolean` | `false` | Whether the element's checked state is indeterminate. |
| `open`          | `boolean` | `false` | Whether the item is expanded.                         |
| `selected`      | `boolean` | `false` | Whether the item is selected.                         |

#### 🔔 Events

| Event     | Description                            |
| --------- | -------------------------------------- |
| `opening` | Emitted when the item begins to open.  |
| `opened`  | Emitted when the item has opened.      |
| `closing` | Emitted when the item begins to close. |
| `closed`  | Emitted when the item has closed.      |
| `click`   | Emitted when the element is clicked.   |

#### 🧩 Slots

| Slot               | Description                                 |
| ------------------ | ------------------------------------------- |
| _(default)_        | Renders the nested child items.             |
| `label`            | Renders the label of the item.              |
| `icon`             | Renders the icon of the item.               |
| `selected-icon`    | Renders the icon of the item when selected. |
| `toggle-icon`      | Renders the toggle icon.                    |
| `open-toggle-icon` | Renders the toggle icon when selected.      |

#### 🎛️ CSS Custom Properties

| Property                                           | Description                                |
| -------------------------------------------------- | ------------------------------------------ |
| `--m3e-tree-item-font-size`                        | Font size for the item label.              |
| `--m3e-tree-item-font-weight`                      | Font weight for the item label.            |
| `--m3e-tree-item-line-height`                      | Line height for the item label.            |
| `--m3e-tree-item-tracking`                         | Letter spacing for the item label.         |
| `--m3e-tree-item-padding`                          | Inline padding for the item.               |
| `--m3e-tree-item-height`                           | Height of the item.                        |
| `--m3e-tree-item-shape`                            | Border radius of the item and focus ring.  |
| `--m3e-tree-item-icon-size`                        | Size of the icon.                          |
| `--m3e-tree-item-inset`                            | Indentation for nested items.              |
| `--m3e-tree-item-label-color`                      | Text color for the item label.             |
| `--m3e-tree-item-selected-label-color`             | Text color for selected item label.        |
| `--m3e-tree-item-selected-container-color`         | Background color for selected item.        |
| `--m3e-tree-item-selected-container-focus-color`   | Focus color for selected item container.   |
| `--m3e-tree-item-selected-container-hover-color`   | Hover color for selected item container.   |
| `--m3e-tree-item-selected-ripple-color`            | Ripple color for selected item.            |
| `--m3e-tree-item-unselected-container-focus-color` | Focus color for unselected item container. |
| `--m3e-tree-item-unselected-container-hover-color` | Hover color for unselected item container. |
| `--m3e-tree-item-unselected-ripple-color`          | Ripple color for unselected item.          |
| `--m3e-tree-item-disabled-color`                   | Text color for disabled item.              |
| `--m3e-tree-item-disabled-color-opacity`           | Opacity for disabled item text color.      |
