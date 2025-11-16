# @m3e/autocomplete

The `m3e-autocomplete` component enhances a text input field with a dynamically positioned menu of filterable suggestions. Following Material Design 3 principles, it provides real-time filtering, keyboard navigation, automatic option activation, and text highlighting to guide user selection.

> **This package is part of [M3E](https://github.com/matraic/m3e) monorepo**, a unified suite of Material 3 web components. [Explore the docs](https://matraic.github.io/m3e) to see them in action.

## 📦 Installation

```bash
npm install @m3e/autocomplete
```

## 💻 Editor Integration

This package includes a [Custom Elements Manifest](https://github.com/webcomponents/custom-elements-manifest) to support enhanced editor tooling and developer experience.

### Visual Studio Code

To enable autocomplete and hover documentation for `@m3e/autocomplete`, install the [Custom Elements Manifest Language Server](https://marketplace.visualstudio.com/items?itemName=pwrs.cem-language-server-vscode) extension. It will automatically detect the manifest bundled with this package and surface tag names, attributes, slots, and events in supported files.

Alternately, you can explicitly reference the `html-custom-data.json` and `css-custom-data.json` in your workspace settings:

```json
{
  "html.customData": ["./node_modules/@m3e/autocomplete/dist/html-custom-data.json"],
  "css.customData": ["./node_modules/@m3e/autocomplete/dist/css-custom-data.json"]
}
```

## 🚀 Native Module Support

This package uses [JavaScript Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#module_specifiers). To use it directly in a browser without a bundler, use a module script similar to the following.

```html
<script type="module" src="/node_modules/@m3e/autocomplete/dist/index.js"></script>
```

You also need a module script for `@m3e/option` due to it being a dependency.

```html
<script type="module" src="/node_modules/@m3e/option/dist/index.js"></script>
```

In addition, you must use an [import map](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script/type/importmap) to include additional dependencies.

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

- `m3e-autocomplete` — An input enhancement that displays a filtered menu of suggestions, providing real-time filtering and keyboard navigation.

## 🧪 Example

```html
<m3e-form-field>
  <label slot="label" for="fruit">Choose your favorite fruit</label>
  <input id="fruit" />
</m3e-form-field>
<m3e-autocomplete for="fruit">
  <m3e-option>Apples</m3e-option>
  <m3e-option>Oranges</m3e-option>
  <m3e-option>Bananas</m3e-option>
  <m3e-option>Grapes</m3e-option>
</m3e-autocomplete>
```

With auto-activation and required selection:

```html
<m3e-autocomplete for="fruit" auto-activate required>
  <m3e-option>Apples</m3e-option>
  <m3e-option>Oranges</m3e-option>
  <m3e-option>Bananas</m3e-option>
  <m3e-option>Grapes</m3e-option>
</m3e-autocomplete>
```

## 📖 API Reference

This section details the attributes and slots available for the `m3e-autocomplete` component.

### ⚙️ Attributes

| Attribute                  | Type      | Default | Description                                                                              |
| -------------------------- | --------- | ------- | ---------------------------------------------------------------------------------------- |
| `auto-activate`            | `boolean` | `false` | Whether the first option should be automatically activated.                              |
| `hide-selection-indicator` | `boolean` | `false` | Whether to hide the selection indicator for options.                                     |
| `required`                 | `boolean` | `false` | Whether the user is required to make a selection when interacting with the autocomplete. |

### 🧩 Slots

| Slot        | Description                    |
| ----------- | ------------------------------ |
| _(default)_ | Renders the options available. |

## 🤝 Contributing

See the root monorepo `CONTRIBUTING.md` for guidelines on contributing to this package.

## 📄 License

This package is licensed under the MIT License.
