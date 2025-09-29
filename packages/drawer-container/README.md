# @m3e/drawer-container

The `m3e-drawer-container` component provides a responsive layout container for managing one or two sliding drawers alongside main content. It supports multiple drawer modes (`over`, `push`, `side`, and `auto`), adapts to breakpoint size, and encodes spatial hierarchy, motion transitions, and accessibility semantics for modal, dismissible, and permanent navigation.

> **Part of the [Material 3 Expressive (M3E)](../../README.md) monorepo**  
> This package is maintained within the unified M3E repository, which provides a suite of Material 3 web components.

## 📦 Installation

```bash
npm install @m3e/drawer-container
```

## 🚀 Browser Usage

This package uses [JavaScript Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#module_specifiers). To use it directly in a browser without a bundler, use a module script similar to the following.

```html
<script type="module" src="/node_modules/@m3e/drawer-container/dist/index.js"></script>
```

In addition, you must use an [import map](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script/type/importmap) to include dependencies.

```html
<script type="importmap">
  {
    "imports": {
      "lit": "https://cdn.jsdelivr.net/npm/lit@3.3.0/+esm",
      "@m3e/core": "/node_modules/@m3e/core/dist/index.js",
      "@m3e/core/layout": "/node_modules/@m3e/core/dist/layout.js"
    }
  }
</script>
```

> For production, use index.min.js and layout.min.js for faster load times.

## 🗂️ Elements

- `m3e-drawer-container` — A container for one or two sliding drawers.
- `m3e-drawer-toggle` — An element, nested within a clickable element, used to toggle the opened state of a drawer.

## 🧪 Examples

The following example illustrates a typical drawer layout.

```html
<m3e-drawer-container>
  <nav slot="start">
    <!-- Start drawer content -->
  </nav>
  <main>
    <!-- Main content -->
  </main>
  <aside slot="end">
    <!-- End drawer content -->
  </aside>
</m3e-drawer-container>
```

The next example illustrates the use of a `m3e-drawer-toggle`, nested inside a `m3e-icon-button` component, which toggles the open state of the start drawer.

```html
<m3e-icon-button slot="leading-icon" aria-label="Menu" toggle selected>
  <m3e-drawer-toggle for="startDrawer"></m3e-drawer-toggle>
  <m3e-icon name="menu"></m3e-icon>
  <m3e-icon slot="selected" name="menu_open"></m3e-icon>
</m3e-icon-button>

<m3e-drawer-container start>
  <nav slot="start" id="startDrawer" aria-label="Navigation">
    <!-- Start drawer content -->
  </nav>
  <!-- Container content -->
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

| Slot Name   | Description               |
| ----------- | ------------------------- |
| _(default)_ | Renders the main content. |
| `start`     | Renders the start drawer. |
| `end`       | Renders the end drawer.   |

### 🎛️ CSS Custom Properties

| Property                               | Description                                                   |
| -------------------------------------- | ------------------------------------------------------------- |
| `--m3e-drawer-container-color`         | The background color of the drawer container.                 |
| `--m3e-drawer-container-elevation`     | The elevation level of the drawer container.                  |
| `--m3e-drawer-container-width`         | The width of the drawer container.                            |
| `--m3e-drawer-container-scrim-opacity` | The opacity of the scrim behind the drawer.                   |
| `--m3e-modal-drawer-start-shape`       | The shape of the drawer’s start edge (typically left in LTR). |
| `--m3e-modal-drawer-end-shape`         | The shape of the drawer’s end edge (typically right in LTR).  |
| `--m3e-modal-drawer-container-color`   | The background color of the modal drawer container.           |
| `--m3e-modal-drawer-elevation`         | The elevation level of the modal drawer container.            |
| `--m3e-drawer-divider-color`           | The color of the divider between drawer sections.             |
| `--m3e-drawer-divider-thickness`       | The thickness of the divider line.                            |

## 🤝 Contributing

See the root monorepo `CONTRIBUTING.md` for guidelines on contributing to this package.

## 📄 License

This package is licensed under the MIT License.
