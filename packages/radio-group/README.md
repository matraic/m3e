# @m3e/radio-group

The `m3e-radio-group` and `m3e-radio` components enable single-choice selection within a set of mutually exclusive options. They support accessible state transitions, semantic grouping, and expressive styling across interaction states.

> **Part of the [Material 3 Expressive (M3E)](../../README.md) monorepo**  
> This package is maintained within the unified M3E repository, which provides a suite of Material 3 web components.

## 📦 Installation

```bash
npm install @m3e/radio-group
```

## 💻 Editor Integration

This package includes a [Custom Elements Manifest](https://github.com/webcomponents/custom-elements-manifest) to support enhanced editor tooling and developer experience.

### Visual Studio Code

To enable autocomplete and hover documentation for `@m3e/radio-group`, install the [Custom Elements Manifest Language Server](https://marketplace.visualstudio.com/items?itemName=pwrs.cem-language-server-vscode) extension. It will automatically detect the manifest bundled with this package and surface tag names, attributes, slots, and events in supported files.

Alternately, you can explicitly reference the `html-custom-data.json` and `css-custom-data.json` in your workspace settings:

```json
{
  "html.customData": ["./node_modules/@m3e/radio-group/dist/html-custom-data.json"],
  "css.customData": ["./node_modules/@m3e/radio-group/dist/css-custom-data.json"]
}
```

## 🚀 Browser Usage

This package uses [JavaScript Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#module_specifiers). To use it directly in a browser without a bundler, use a module script similar to the following.

```html
<script type="module" src="/node_modules/@m3e/radio-group/dist/index.js"></script>
```

In addition, you must use an [import map](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script/type/importmap) to include dependencies.

```html
<script type="importmap">
  {
    "imports": {
      "lit": "https://cdn.jsdelivr.net/npm/lit@3.3.0/+esm",
      "@m3e/core": "/node_modules/@m3e/core/dist/index.js",
      "@m3e/core/a11y": "/node_modules/@m3e/core/dist/a11y.js"
    }
  }
</script>
```

> For production, use index.min.js and a11y.min.js for faster load times.

## 🗂️ Elements

- `m3e-radio-group` — A container for a set of radio buttons that enforces single selection.
- `m3e-radio` — A radio button that allows a user to select one option from a set of options.

## 🧪 Example

The following example illustrates using `m3e-radio-group` and `m3e-radio` to present a group of options.

```html
<label for="rdg1">Radio group</label>
<br />
<m3e-radio-group id="rdg1">
  <label><m3e-radio value="1"></m3e-radio> Value 1</label>
  <label><m3e-radio value="2"></m3e-radio> Value 2</label>
  <label><m3e-radio value="3"></m3e-radio> Value 3</label>
  <label><m3e-radio value="4"></m3e-radio> Value 4</label>
</m3e-radio-group>
```

## 📖 API Reference

### 🗂️ m3e-radio-group

This section details the attributes, slots, events and CSS custom properties available for the `m3e-radio-group` component.

#### ⚙️ Attributes

| Attribute  | Type      | Default | Description                                   |
| ---------- | --------- | ------- | --------------------------------------------- |
| `checked`  | `boolean` | `false` | Whether the element is checked.               |
| `disabled` | `boolean` | `false` | Whether the element is disabled.              |
| `value`    | `string`  | `""`    | A string representing the value of the radio. |

#### 🔔 Events

| Event    | Description                                               |
| -------- | --------------------------------------------------------- |
| `change` | Emitted when the checked state of a radio button changes. |

#### 🧩 Slots

| Slot        | Description                             |
| ----------- | --------------------------------------- |
| _(default)_ | Renders the radio buttons of the group. |

#### 🎛️ CSS Custom Properties

| Property                         | Description                                                       |
| -------------------------------- | ----------------------------------------------------------------- |
| `--m3e-radio-error-hover-color`  | Fallback hover color used when the radio is invalid and touched.  |
| `--m3e-radio-error-focus-color`  | Fallback focus color used when the radio is invalid and touched.  |
| `--m3e-radio-error-ripple-color` | Fallback ripple color used when the radio is invalid and touched. |
| `--m3e-radio-error-icon-color`   | Fallback icon color used when the radio is invalid and touched.   |

### 🗂️ m3e-radio

This section details the attributes, events and CSS custom properties available for the `m3e-radio` component.

#### ⚙️ Attributes

| Attribute  | Type      | Default | Description                                   |
| ---------- | --------- | ------- | --------------------------------------------- |
| `checked`  | `boolean` | `false` | Whether the element is checked.               |
| `disabled` | `boolean` | `false` | Whether the element is disabled.              |
| `value`    | `string`  | `""`    | A string representing the value of the radio. |

#### 🔔 Events

| Event    | Description                             |
| -------- | --------------------------------------- |
| `input`  | Emitted when the checked state changes. |
| `change` | Emitted when the checked state changes. |

#### 🎛️ CSS Custom Properties

| Property                              | Description                                         |
| ------------------------------------- | --------------------------------------------------- |
| `--m3e-radio-container-size`          | Base size of the radio button container.            |
| `--m3e-radio-icon-size`               | Size of the radio icon inside the wrapper.          |
| `--m3e-radio-unselected-hover-color`  | Hover state layer color when radio is not selected. |
| `--m3e-radio-unselected-focus-color`  | Focus state layer color when radio is not selected. |
| `--m3e-radio-unselected-ripple-color` | Ripple color when radio is not selected.            |
| `--m3e-radio-unselected-icon-color`   | Icon color when radio is not selected.              |
| `--m3e-radio-selected-hover-color`    | Hover state layer color when radio is selected.     |
| `--m3e-radio-selected-focus-color`    | Focus state layer color when radio is selected.     |
| `--m3e-radio-selected-ripple-color`   | Ripple color when radio is selected.                |
| `--m3e-radio-selected-icon-color`     | Icon color when radio is selected.                  |
| `--m3e-radio-disabled-icon-color`     | Icon color when radio is disabled.                  |

## 🤝 Contributing

See the root monorepo `CONTRIBUTING.md` for guidelines on contributing to this package.

## 📄 License

This package is licensed under the MIT License.
