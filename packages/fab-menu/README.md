# @m3e/fab-menu

The `m3e-fab-menu` component presents a dynamic menu of related actions, elegantly revealed from a floating action button (FAB). Designed using expressive, adaptive surfaces, it enables seamless access to contextual actions in modern, visually rich interfaces.

## 📦 Installation

```bash
npm install @m3e/fab-menu
```

## 🗂️ Elements

- `m3e-fab-menu` — A menu, opened from a floating action button (FAB), used to display multiple related actions.
- `m3e-fab-menu-item` — An item of a floating action button (FAB) menu.

- `m3e-fab-menu-trigger` — An element used to trigger the opening of a `m3e-fab-menu` from a FAB.

## 🧪 Examples

The following example illustrates triggering a `m3e-fab-menu` from an `m3e-fab` using a `m3e-fab-menu-trigger`:

```html
<m3e-fab variant="primary" size="large">
  <m3e-fab-menu-trigger for="fabmenu">
    <m3e-icon name="edit"></m3e-icon>
  </m3e-fab-menu-trigger>
</m3e-fab>
<m3e-fab-menu id="fabmenu" variant="secondary">
  <m3e-fab-menu-item>First</m3e-fab-menu-item>
  <m3e-fab-menu-item>Second</m3e-fab-menu-item>
  <m3e-fab-menu-item>Third</m3e-fab-menu-item>
  <m3e-fab-menu-item>Forth</m3e-fab-menu-item>
  <m3e-fab-menu-item>Fifth</m3e-fab-menu-item>
  <m3e-fab-menu-item>Sixth</m3e-fab-menu-item>
</m3e-fab-menu>
```

## 📖 API Reference

### 🗂️ `m3e-fab-menu`

This section details the attributes, slots and CSS custom properties available for the `m3e-fab-menu` component.

#### ⚙️ Attributes

| Attribute | Type                                     | Default     | Description                         |
| --------- | ---------------------------------------- | ----------- | ----------------------------------- |
| `variant` | `"primary" \| "secondary" \| "tertiary"` | `"primary"` | The appearance variant of the menu. |

#### 🧩 Slots

- (default): Renders the contents of the menu.

### 🎛️ CSS Custom Properties

| Property                              | Description                                         |
| ------------------------------------- | --------------------------------------------------- |
| `--m3e-fab-menu-spacing`              | Vertical gap between menu items.                    |
| `--m3e-fab-menu-max-width`            | Maximum width of the menu.                          |
| `--m3e-primary-fab-color`             | Foreground color for primary variant items.         |
| `--m3e-primary-fab-container-color`   | Container color for primary variant items.          |
| `--m3e-primary-fab-hover-color`       | Hover background color for primary variant items.   |
| `--m3e-primary-fab-focus-color`       | Focus background color for primary variant items.   |
| `--m3e-primary-fab-ripple-color`      | Ripple color for primary variant items.             |
| `--m3e-secondary-fab-color`           | Foreground color for secondary variant items.       |
| `--m3e-secondary-fab-container-color` | Container color for secondary variant items.        |
| `--m3e-secondary-fab-hover-color`     | Hover background color for secondary variant items. |
| `--m3e-secondary-fab-focus-color`     | Focus background color for secondary variant items. |
| `--m3e-secondary-fab-ripple-color`    | Ripple color for secondary variant items.           |
| `--m3e-tertiary-fab-color`            | Foreground color for tertiary variant items.        |
| `--m3e-tertiary-fab-container-color`  | Container color for tertiary variant items.         |
| `--m3e-tertiary-fab-hover-color`      | Hover background color for tertiary variant items.  |
| `--m3e-tertiary-fab-focus-color`      | Focus background color for tertiary variant items.  |
| `--m3e-tertiary-fab-ripple-color`     | Ripple color for tertiary variant items.            |

### 🗂️ `m3e-fab-menu-item`

This section details the attributes, slots and CSS custom properties available for the `m3e-fab-menu-item` component.

#### ⚙️ Attributes

| Attribute  | Type      | Default | Description                                           |
| ---------- | --------- | ------- | ----------------------------------------------------- |
| `disabled` | `boolean` | `false` | Whether the element is disabled.                      |
| `download` | `string`  |         | Download target for the link button.                  |
| `href`     | `string`  |         | The URL to which the link button points.              |
| `rel`      | `string`  |         | The relationship between the target and the document. |
| `target`   | `string`  |         | The target of the link button.                        |

#### 🧩 Slots

- (default): Renders the label of the item.
- `icon`: Renders an icon before the item's label.

### 🎛️ CSS Custom Properties

| Property                             | Description                            |
| ------------------------------------ | -------------------------------------- |
| `--m3e-fab-menu-item-height`         | Height of the menu item.               |
| `--m3e-fab-menu-item-font-size`      | Font size of the menu item label.      |
| `--m3e-fab-menu-item-font-weight`    | Font weight of the menu item label.    |
| `--m3e-fab-menu-item-line-height`    | Line height of the menu item label.    |
| `--m3e-fab-menu-item-tracking`       | Letter spacing of the menu item label. |
| `--m3e-fab-menu-item-shape`          | Border radius of the menu item.        |
| `--m3e-fab-menu-item-leading-space`  | Padding at the start of the menu item. |
| `--m3e-fab-menu-item-trailing-space` | Padding at the end of the menu item.   |
| `--m3e-fab-menu-item-spacing`        | Gap between icon and label.            |
| `--m3e-fab-menu-item-icon-size`      | Size of the icon in the menu item.     |

## 🤝 Contributing

See the root monorepo `CONTRIBUTING.md` for guidelines on contributing to this package.

## 📄 License

This package is licensed under the MIT License.
