# @m3e/web/fab-menu

The `m3e-fab-menu` component presents a dynamic menu of related actions, elegantly revealed from a floating action button (FAB). Designed using expressive, adaptive surfaces, it enables seamless access to contextual actions in modern, visually rich interfaces.

When the items do not fit above the FAB, they scroll behind it and can be revealed below it up to the viewport edge.
On devices with a touch-capable pointer, the scrollable menu also receives touches in its empty space.

```ts
import "@m3e/web/fab-menu";
```

## 🗂️ Elements

- `m3e-fab-menu` — A menu, opened from a floating action button (FAB), used to display multiple related actions.
- `m3e-fab-menu-item` — An item of a floating action button (FAB) menu.

- `m3e-fab-menu-trigger` — An element used to trigger the opening of a `m3e-fab-menu` from a FAB.

## 🧪 Examples

Nest a menu trigger in a FAB and associate it with the menu by id. Import `@m3e/web/fab` and `@m3e/web/icon` for the FAB and icons. Give the icon-only FAB an accessible label.

```html
<m3e-fab variant="primary" size="large">
  <m3e-fab-menu-trigger for="fabmenu">
    <m3e-icon name="edit"></m3e-icon>
  </m3e-fab-menu-trigger>
</m3e-fab>
<m3e-fab-menu id="fabmenu">
  <m3e-fab-menu-item>
    <m3e-icon slot="icon" name="email" filled></m3e-icon>
    Email
  </m3e-fab-menu-item>
  <m3e-fab-menu-item>
    <m3e-icon slot="icon" name="chat" filled></m3e-icon>
    Message
  </m3e-fab-menu-item>
  <m3e-fab-menu-item>
    <m3e-icon slot="icon" name="folder" filled></m3e-icon>
    Folder
  </m3e-fab-menu-item>
</m3e-fab-menu>
```

Use `variant` to select the menu appearance. Import `@m3e/web/fab` and `@m3e/web/icon` for the FAB and icon. Give the icon-only FAB an accessible label.

```html
<m3e-fab variant="secondary" size="large">
  <m3e-fab-menu-trigger for="fabmenu">
    <m3e-icon name="edit"></m3e-icon>
  </m3e-fab-menu-trigger>
</m3e-fab>
<m3e-fab-menu id="fabmenu" variant="secondary">
  <!-- Items omitted for brevity -->
</m3e-fab-menu>
<!-- Other variants omitted for brevity -->
```

## 📖 API Reference

### 🗂️ `m3e-fab-menu`

This section details the attributes, slots and CSS custom properties available for the `m3e-fab-menu` component.

#### ⚙️ Attributes

| Attribute | Type                                     | Default     | Description                         |
| --------- | ---------------------------------------- | ----------- | ----------------------------------- |
| `variant` | `"primary" \| "secondary" \| "tertiary"` | `"primary"` | The appearance variant of the menu. |

#### 🧩 Slots

| Slot        | Description                       |
| ----------- | --------------------------------- |
| _(default)_ | Renders the contents of the menu. |

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

| Slot        | Description                              |
| ----------- | ---------------------------------------- |
| _(default)_ | Renders the label of the item.           |
| `icon`      | Renders an icon before the item's label. |

### 🎛️ CSS Custom Properties

| Property                             | Description                             |
| ------------------------------------ | --------------------------------------- |
| `--m3e-fab-menu-item-height`         | Height of the menu item.                |
| `--m3e-fab-menu-item-font-size`      | Font size of the menu item label.       |
| `--m3e-fab-menu-item-font-weight`    | Font weight of the menu item label.     |
| `--m3e-fab-menu-item-line-height`    | Line height of the menu item label.     |
| `--m3e-fab-menu-item-tracking`       | Letter spacing of the menu item label.  |
| `--m3e-fab-menu-item-shape`          | Border radius of the menu item.         |
| `--m3e-fab-menu-item-leading-space`  | Padding at the start of the menu item.  |
| `--m3e-fab-menu-item-trailing-space` | Padding at the end of the menu item.    |
| `--m3e-fab-menu-item-top-space`      | Padding at the top of the menu item.    |
| `--m3e-fab-menu-item-bottom-space`   | Padding at the bottom of the menu item. |
| `--m3e-fab-menu-item-spacing`        | Gap between icon and label.             |
| `--m3e-fab-menu-item-icon-size`      | Size of the icon in the menu item.      |
