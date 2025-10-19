# @m3e/textarea-autosize

The `m3e-textarea-autosize` component automatically adjusts the height of a linked `textarea` to fit its content, preserving layout integrity and user experience. This non-visual element listens to input changes and applies dynamic resizing, constrained by optional row limits. It supports declarative configuration via attributes and can be disabled when manual control is preferred.

> **Part of the [Material 3 Expressive (M3E)](../../README.md) monorepo**  
> This package is maintained within the unified M3E repository, which provides a suite of Material 3 web components.

## 📦 Installation

```bash
npm install @m3e/textarea-autosize
```

## 💻 Editor Integration

This package includes a [Custom Elements Manifest](https://github.com/webcomponents/custom-elements-manifest) to support enhanced editor tooling and developer experience.

### Visual Studio Code

To enable autocomplete and hover documentation for `@m3e/textarea-autosize`, install the [Custom Elements Manifest Language Server](https://marketplace.visualstudio.com/items?itemName=pwrs.cem-language-server-vscode) extension. It will automatically detect the manifest bundled with this package and surface tag names, attributes, slots, and events in supported files.

Alternately, you can explicitly reference the `html-custom-data.json` and `css-custom-data.json` in your workspace settings:

```json
{
  "html.customData": ["./node_modules/@m3e/textarea-autosize/dist/html-custom-data.json"],
  "css.customData": ["./node_modules/@m3e/textarea-autosize/dist/css-custom-data.json"]
}
```

## 🚀 Browser Usage

This package uses [JavaScript Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#module_specifiers). To use it directly in a browser without a bundler, use a module script similar to the following.

```html
<script type="module" src="/node_modules/@m3e/textarea-autosize/dist/index.js"></script>
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

- `m3e-textarea-autosize` — A non-visual element used to automatically resize a `textarea` to fit its content.

## 🧪 Examples

The following example illustrates the `m3e-textarea-autosize` in conjunction with the `m3e-form-field` to automatically resize a field's `textarea` with a 5 row limit.

```html
<m3e-form-field>
  <label slot="label" for="fld">Textarea Autosize</label>
  <textarea id="fld"></textarea>
  <m3e-textarea-autosize for="fld" max-rows="5"></m3e-textarea-autosize>
</m3e-form-field>
```

## 📖 API Reference

This section details the attributes available for the `m3e-textarea-autosize` component.

### ⚙️ Attributes

| Attribute  | Type      | Default | Description                                                             |
| ---------- | --------- | ------- | ----------------------------------------------------------------------- |
| `disabled` | `boolean` | `false` | Whether auto-sizing is disabled.                                        |
| `for`      | `string`  |         | The query selector used to specify the element related to this element. |
| `max-rows` | `number`  | `0`     | The maximum amount of rows in the `textarea`.                           |
| `min-rows` | `number`  | `0`     | The minimum amount of rows in the `textarea`.                           |

## 🤝 Contributing

See the root monorepo `CONTRIBUTING.md` for guidelines on contributing to this package.

## 📄 License

This package is licensed under the MIT License.
