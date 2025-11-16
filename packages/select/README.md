# @m3e/select

The `m3e-select` component provides a form control for selecting a value from a set of predefined options. Following Material Design 3 principles, it supports both single and multiple selection modes, customizable validation states, accessible keyboard navigation, and extensive theming via CSS custom properties.

> **This package is part of [M3E](https://github.com/matraic/m3e) monorepo**, a unified suite of Material 3 web components. [Explore the docs](https://matraic.github.io/m3e) to see them in action.

## 📦 Installation

```bash
npm install @m3e/select
```

## 💻 Editor Integration

This package includes a [Custom Elements Manifest](https://github.com/webcomponents/custom-elements-manifest) to support enhanced editor tooling and developer experience.

### Visual Studio Code

To enable autocomplete and hover documentation for `@m3e/select`, install the [Custom Elements Manifest Language Server](https://marketplace.visualstudio.com/items?itemName=pwrs.cem-language-server-vscode) extension. It will automatically detect the manifest bundled with this package and surface tag names, attributes, slots, and events in supported files.

Alternately, you can explicitly reference the `html-custom-data.json` and `css-custom-data.json` in your workspace settings:

```json
{
  "html.customData": ["./node_modules/@m3e/select/dist/html-custom-data.json"],
  "css.customData": ["./node_modules/@m3e/select/dist/css-custom-data.json"]
}
```

## 🚀 Native Module Support

This package uses [JavaScript Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#module_specifiers). To use it directly in a browser without a bundler, use a module script similar to the following.

```html
<script type="module" src="/node_modules/@m3e/select/dist/index.js"></script>
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

- `m3e-select` — A form control that allows users to select a value from a set of predefined options with support for single and multiple selection.

## 🧪 Example

```html
<m3e-select>
  <m3e-option value="apple">Apple</m3e-option>
  <m3e-option value="banana">Banana</m3e-option>
  <m3e-option-group>
    <span slot="label">Citrus</span>
    <m3e-option value="lemon">Lemon</m3e-option>
    <m3e-option value="orange">Orange</m3e-option>
  </m3e-option-group>
</m3e-select>
```

Multiple selection:

```html
<m3e-select multi>
  <m3e-option value="javascript">JavaScript</m3e-option>
  <m3e-option value="typescript">TypeScript</m3e-option>
  <m3e-option value="python">Python</m3e-option>
</m3e-select>
```

## 📖 API Reference

### 🗂️ m3e-select

This section details the attributes, slots, events and CSS custom properties available for the `m3e-select` component.

#### ⚙️ Attributes

| Attribute                  | Type      | Default | Description                                                               |
| -------------------------- | --------- | ------- | ------------------------------------------------------------------------- |
| `disabled`                 | `boolean` | `false` | Whether the element is disabled.                                          |
| `hide-selection-indicator` | `boolean` | `false` | Whether to hide the selection indicator for single select options.        |
| `multi`                    | `boolean` | `false` | Whether multiple options can be selected.                                 |
| `name`                     | `string`  |         | The name that identifies the element when submitting the associated form. |
| `required`                 | `boolean` | `false` | Whether the element is required.                                          |

#### 🔔 Events

| Event    | Description                              |
| -------- | ---------------------------------------- |
| `input`  | Emitted when the selected state changes. |
| `change` | Emitted when the selected state changes. |

#### 🧩 Slots

| Slot        | Description                        |
| ----------- | ---------------------------------- |
| _(default)_ | Renders the options of the select. |
| `arrow`     | Renders the dropdown arrow.        |
| `value`     | Renders the selected value(s).     |

#### 🎛️ CSS Custom Properties

| Property                              | Description                                           |
| ------------------------------------- | ----------------------------------------------------- |
| `--m3e-form-field-font-size`          | The font size of the select control.                  |
| `--m3e-form-field-font-weight`        | The font weight of the select control.                |
| `--m3e-form-field-line-height`        | The line height of the select control.                |
| `--m3e-form-field-tracking`           | The letter spacing of the select control.             |
| `--m3e-select-container-shape`        | The corner radius of the select container.            |
| `--m3e-select-disabled-color`         | The text color when the select is disabled.           |
| `--m3e-select-disabled-color-opacity` | The opacity level applied to the disabled text color. |
| `--m3e-select-icon-size`              | The size of the dropdown arrow icon.                  |

## 🤝 Contributing

See the root monorepo `CONTRIBUTING.md` for guidelines on contributing to this package.

## 📄 License

This package is licensed under the MIT License.
