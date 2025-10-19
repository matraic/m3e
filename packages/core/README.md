# @m3e/core

The `@m3e/core` package delivers the essential primitives, utilities, and behavioral mixins for building Material 3 web components. It serves as the foundation for accessibility, layout, platform detection, design tokens, keycodes, and more—enabling consistent, scalable, and maintainable development across the monorepo.

> **Part of the [M3E](../../README.md) monorepo**  
> This package is maintained within the unified M3E repository, which provides a suite of Material 3 web components.

## ✨ Features

- **Design Tokens**: Centralized design values for color, typography, shape, and elevation
- **Primitives**: Reusable elements used to depict elevation, state layer, ripples, and more
- **Controllers**: Focus, hover, long press, mutation, pressed, and resize behaviors
- **Mixins**: Easily create new components using behavioral mixins
- **Accessibility**: ARIA roles, keyboard navigation, and state management
- **Utilities**: Platform detection, keycode mapping, and layout helpers

## 📦 Installation

```bash
npm install @m3e/core
```

## 💻 Editor Integration

This package includes a [Custom Elements Manifest](https://github.com/webcomponents/custom-elements-manifest) to support enhanced editor tooling and developer experience.

### Visual Studio Code

To enable autocomplete and hover documentation for `@m3e/core`, install the [Custom Elements Manifest Language Server](https://marketplace.visualstudio.com/items?itemName=pwrs.cem-language-server-vscode) extension. It will automatically detect the manifest bundled with this package and surface tag names, attributes, slots, and events in supported files.

Alternately, you can explicitly reference the `html-custom-data.json` and `css-custom-data.json` in your workspace settings:

```json
{
  "html.customData": ["./node_modules/@m3e/core/dist/html-custom-data.json"],
  "css.customData": ["./node_modules/@m3e/core/dist/css-custom-data.json"]
}
```

## 🚀 Usage

### 🗂️ Entry Points

The following entry points are available as defined in the package's `exports` field:

- `@m3e/core` (default): Main entry point for core exports
- `@m3e/core/a11y`: Accessibility utilities and primitives
- `@m3e/core/anchoring`: Anchoring utilities and primitives
- `@m3e/core/bidi`: Bidirectional text utilities
- `@m3e/core/layout`: Layout utilities and primitives
- `@m3e/core/platform`: Platform detection utilities

## 🤝 Contributing

See the root monorepo `CONTRIBUTING.md` for guidelines on contributing to this package.

## 📄 License

This package is licensed under the MIT License.
