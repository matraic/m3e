# @m3e/fab-menu

The `m3e-fab-menu` component presents a dynamic menu of related actions, elegantly revealed from a floating action button (FAB). Designed using expressive, adaptive surfaces, it enables seamless access to contextual actions in modern, visually rich interfaces.

> **Part of the [M3E](../../README.md) monorepo**  
> This package is maintained within the unified M3E repository, which provides a suite of Material 3 web components.

## 📦 Installation

```bash
npm install @m3e/fab-menu
```

## 💻 Editor Integration

This package includes a [Custom Elements Manifest](https://github.com/webcomponents/custom-elements-manifest) to support enhanced editor tooling and developer experience.

### Visual Studio Code

To enable autocomplete and hover documentation for `@m3e/fab-menu`, install the [Custom Elements Manifest Language Server](https://marketplace.visualstudio.com/items?itemName=pwrs.cem-language-server-vscode) extension. It will automatically detect the manifest bundled with this package and surface tag names, attributes, slots, and events in supported files.

Alternately, you can explicitly reference the `html-custom-data.json` and `css-custom-data.json` in your workspace settings:

```json
{
  "html.customData": ["./node_modules/@m3e/fab-menu/dist/html-custom-data.json"],
  "css.customData": ["./node_modules/@m3e/fab-menu/dist/css-custom-data.json"]
}
```

## 🚀 Browser Usage

This package uses [JavaScript Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#module_specifiers). To use it directly in a browser without a bundler, use a module script similar to the following.

```html
<script type="module" src="/node_modules/@m3e/fab-menu/dist/index.js"></script>
```

You also need a module script for `@m3e/fab` due to it being a dependency.

```html
<script type="module" src="/node_modules/@m3e/fab/dist/index.js"></script>
```

In addition, you must use an [import map](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script/type/importmap) to include dependencies.

```html
<script type="importmap">
  {
    "imports": {
      "lit": "https://cdn.jsdelivr.net/npm/lit@3.3.0/+esm",
      "@m3e/core": "/node_modules/@m3e/core/dist/index.js",
      "@m3e/core/a11y": "/node_modules/@m3e/core/dist/a11y.js",
      "@m3e/core/anchoring": "/node_modules/@m3e/core/dist/anchoring.js",
      "@m3e/core/bidi": "/node_modules/@m3e/core/dist/bidi.js"
    }
  }
</script>
```

> For production, use index.min.js, a11y.min.js, anchoring.min.js, and bidi.min.js for faster load times.

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
