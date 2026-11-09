# @m3e/web/drawer-container

The `m3e-drawer-container` component provides a responsive layout container for managing one or two sliding drawers alongside main content. It supports multiple drawer modes (`over`, `push`, `side`, and `auto`), adapts to breakpoint size, and encodes spatial hierarchy, motion transitions, and accessibility semantics for modal, dismissible, and permanent navigation.

```ts
import "@m3e/web/drawer-container";
```

## 🗂️ Elements

- `m3e-drawer-container` — A container for one or two sliding drawers.
- `m3e-drawer-toggle` — An element, nested within a clickable element, used to toggle the opened state of a drawer.

## 🧪 Examples

Use the `start` and `end` slots for drawers and the default slot for main content.

```html
<m3e-drawer-container start end>
  <div slot="start">Start drawer</div>
  <div>Main content</div>
  <div slot="end">End drawer</div>
</m3e-drawer-container>
```

Set the width of a drawer on its slotted element.

```html
<m3e-drawer-container start>
  <div slot="start" style="width: 200px;">Start drawer</div>
  <div>Main content</div>
</m3e-drawer-container>
```

Use `start-mode="push"` to move content when the drawer opens.

```html
<m3e-drawer-container start start-mode="push">
  <div slot="start">Start drawer</div>
  <div>Main content</div>
</m3e-drawer-container>
```

Use `start-mode="over"` to overlay the main content.

```html
<m3e-drawer-container start start-mode="over">
  <div slot="start">Start drawer</div>
  <div>Main content</div>
</m3e-drawer-container>
```

Use `end-divider` to show a divider for a side-mode drawer.

```html
<m3e-drawer-container end end-mode="side" end-divider>
  <div>Main content</div>
  <div slot="end">End drawer</div>
</m3e-drawer-container>
```

Nest a drawer toggle in a clickable element and connect `for` to the drawer's id. Import `@m3e/web/icon-button` and `@m3e/web/icon` for the button and icons; place the button in an element that supports its `leading-icon` slot.

```html
<m3e-icon-button slot="leading-icon" aria-label="Menu" toggle>
  <m3e-icon name="menu"></m3e-icon>
  <m3e-icon slot="selected" name="menu_open"></m3e-icon>
  <m3e-drawer-toggle for="nav-drawer"></m3e-drawer-toggle>
</m3e-icon-button>
<m3e-drawer-container start-mode="over">
  <div slot="start" id="nav-drawer">Start drawer</div>
  <div>Main content</div>
</m3e-drawer-container>
```

Use semantic elements for drawer and main content as appropriate.

```html
<m3e-drawer-container>
  <nav slot="start"></nav>
  <main></main>
  <aside slot="end"></aside>
</m3e-drawer-container>
```

## 📖 API Reference

This section details the attributes and CSS custom properties available for the `m3e-drawer-container` component.

### ⚙️ Attributes

| Attribute       | Type                                   | Default  | Description                                                                               |
| --------------- | -------------------------------------- | -------- | ----------------------------------------------------------------------------------------- |
| `start`         | `boolean`                              | `false`  | Whether the start drawer is open.                                                         |
| `start-mode`    | `"over" \| "push" \| "side" \| "auto"` | `"side"` | The behavior mode of the start drawer. Supports `over`, `push`, `side`, and `auto` modes. |
| `start-divider` | `boolean`                              | `false`  | Whether to show a divider between the start drawer and content for `side` mode.           |
| `end`           | `boolean`                              | `false`  | Whether the end drawer is open.                                                           |
| `end-mode`      | `"over" \| "push" \| "side" \| "auto"` | `"side"` | The behavior mode of the end drawer. Supports `over`, `push`, `side`, and `auto` modes.   |
| `end-divider`   | `boolean`                              | `false`  | Whether to show a divider between the end drawer and content for `side` mode.             |

### 🧩 Slots

| Slot        | Description               |
| ----------- | ------------------------- |
| _(default)_ | Renders the main content. |
| `start`     | Renders the start drawer. |
| `end`       | Renders the end drawer.   |

### 🎛️ CSS Custom Properties

| Property                               | Description                                                                                |
| -------------------------------------- | ------------------------------------------------------------------------------------------ |
| `--m3e-drawer-container-color`         | The background color of the drawer container.                                              |
| `--m3e-drawer-container-elevation`     | The elevation level of the drawer container.                                               |
| `--m3e-drawer-container-width`         | The width of the drawer container.                                                         |
| `--m3e-drawer-container-scrim-opacity` | The opacity of the scrim behind the drawer.                                                |
| `--m3e-modal-drawer-start-shape`       | The shape of the drawer's start edge (typically left in LTR), used by a modal end drawer.  |
| `--m3e-modal-drawer-end-shape`         | The shape of the drawer's end edge (typically right in LTR), used by a modal start drawer. |
| `--m3e-modal-drawer-container-color`   | The background color of the modal drawer container.                                        |
| `--m3e-modal-drawer-elevation`         | The elevation level of the modal drawer container.                                         |
| `--m3e-drawer-divider-color`           | The color of the divider between drawer sections.                                          |
| `--m3e-drawer-divider-thickness`       | The thickness of the divider line.                                                         |
