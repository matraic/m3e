# @m3e/avatar

The `m3e-avatar` component is a reusable identity primitive that displays visual or textual representation with consistent sizing, shape, and typography.

> **This package is part of [M3E](https://github.com/matraic/m3e) monorepo**, a unified suite of Material 3 web components. [Explore the docs](https://matraic.github.io/m3e) to see them in action.

## 📦 Installation

```bash
npm install @m3e/avatar
```

## 💻 Editor Integration

This package includes a [Custom Elements Manifest](https://github.com/webcomponents/custom-elements-manifest) to support enhanced editor tooling and developer experience.

### Visual Studio Code

To enable autocomplete and hover documentation for `@m3e/avatar`, install the [Custom Elements Manifest Language Server](https://marketplace.visualstudio.com/items?itemName=pwrs.cem-language-server-vscode) extension. It will automatically detect the manifest bundled with this package and surface tag names, attributes, slots, and events in supported files.

Alternately, you can explicitly reference the `html-custom-data.json` and `css-custom-data.json` in your workspace settings:

```json
{
  "html.customData": ["./node_modules/@m3e/avatar/dist/html-custom-data.json"],
  "css.customData": ["./node_modules/@m3e/avatar/dist/css-custom-data.json"]
}
```

## 🚀 Native Module Support

This package uses [JavaScript Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#module_specifiers). To use it directly in a browser without a bundler, use a module script similar to the following.

```html
<script type="module" src="/node_modules/@m3e/avatar/dist/index.js"></script>
```

In addition, you must use an [import map](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script/type/importmap) to include dependencies.

```html
<script type="importmap">
  {
    "imports": {
      "lit": "https://cdn.jsdelivr.net/npm/lit@3.3.0/+esm",
      "@m3e/core": "/node_modules/@m3e/core/dist/index.js"
    }
  }
</script>
```

> For production, use index.min.js for faster load times.

## 🗂️ Elements

- `m3e-avatar` — An image, icon or textual initials representing a user or other identity.

## 🧪 Examples

The following example illustrates use of the `m3e-avatar` to present textual initials.

```html
<m3e-avatar>AB</m3e-avatar>
```

The next example illustrates use of the `m3e-avatar` to present an icon.

> This example uses the `@m3e/icon` package to present Material Design symbols, but any icon package can be substituted depending on your design system or preferences

```html
<m3e-avatar>
  <m3e-icon name="person"></m3e-icon>
</m3e-avatar>
```

The last example illustrates use of the `m3e-avatar` to present an image.

```html
<m3e-avatar>
  <img src="https://avatars.githubusercontent.com/u/224686995?s=48&v=4" />
</m3e-avatar>
```

## 📖 API Reference

This section details the slots and CSS custom properties available for the `m3e-avatar` component.

### 🧩 Slots

| Slot        | Description                        |
| ----------- | ---------------------------------- |
| _(default)_ | Renders the content of the avatar. |

### 🎛️ CSS Custom Properties

| Property                   | Description                     |
| -------------------------- | ------------------------------- |
| `--m3e-avatar-size`        | Size of the avatar.             |
| `--m3e-avatar-shape`       | Border radius of the avatar.    |
| `--m3e-avatar-font-size`   | Font size for the avatar.       |
| `--m3e-avatar-font-weight` | Font weight for the avatar.     |
| `--m3e-avatar-line-height` | Line height for the avatar.     |
| `--m3e-avatar-tracking`    | Letter spacing for the avatar.  |
| `--m3e-avatar-color`       | Background color of the avatar. |
| `--m3e-avatar-label-color` | Text color of the avatar.       |

## 🤝 Contributing

See the root monorepo `CONTRIBUTING.md` for guidelines on contributing to this package.

## 📄 License

This package is licensed under the MIT License.
