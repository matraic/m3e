# @m3e/checkbox

The `m3e-checkbox` component enables users to select one or more options from a set. It supports selected, unselected, and indeterminate states, and communicates selection through visual cues and accessible semantics. This component reflects user intent, form participation, and validation feedback, adapting to disabled and required contexts. It emits `input` and `change` events to signal state transitions and integrates with form submission via `name` and `value`.

> **Part of the [Material 3 Expressive (M3E)](../../README.md) monorepo**  
> This package is maintained within the unified M3E repository, which provides a suite of Material 3 web components.

## 📦 Installation

```bash
npm install @m3e/checkbox
```

## 🚀 Browser Usage

This package uses [JavaScript Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#module_specifiers). To use it directly in a browser without a bundler, use a module script similar to the following.

```html
<script type="module" src="/node_modules/@m3e/checkbox/dist/index.js"></script>
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

- `m3e-checkbox` — A checkbox that allows a user to select one or more options from a limited number of choices.

## 🧪 Examples

The following example illustrates wrapping a `m3e-checkbox` within a `label`.

```html
<label>
  <m3e-checkbox></m3e-checkbox>
  Checkbox label
</label>
```

The next example illustrates use of the `for` attribute to label a checkbox.

```html
<m3e-checkbox id="chk"></m3e-checkbox><label for="chk">Checkbox label </label>
```

## 📖 API Reference

This section details the attributes, events and CSS custom properties available for the `m3e-checkbox` component.

### ⚙️ Attributes

| Attribute       | Type      | Default | Description                                                               |
| --------------- | --------- | ------- | ------------------------------------------------------------------------- |
| `checked`       | `boolean` | `false` | Whether the element is checked.                                           |
| `disabled`      | `boolean` | `false` | Whether the element is disabled.                                          |
| `indeterminate` | `boolean` | `false` | Whether the element's checked state is indeterminate.                     |
| `name`          | `string`  |         | The name that identifies the element when submitting the associated form. |
| `required`      | `boolean` | `false` | Whether the element is required.                                          |
| `value`         | `string`  | `"on"`  | A string representing the value of the checkbox.                          |

#### 🔔 Events

| Event    | Description                             |
| -------- | --------------------------------------- |
| `input`  | Emitted when the checked state changes. |
| `change` | Emitted when the checked state changes. |

### 🎛️ CSS Custom Properties

| Property                                             | Description                                      |
| ---------------------------------------------------- | ------------------------------------------------ |
| `--m3e-checkbox-icon-size`                           | Size of the checkbox icon inside the container.  |
| `--m3e-checkbox-container-size`                      | Base size of the checkbox container.             |
| `--m3e-checkbox-container-shape`                     | Border radius of the icon container.             |
| `--m3e-checkbox-unselected-outline-thickness`        | Border thickness for unselected state.           |
| `--m3e-checkbox-unselected-outline-color`            | Border color for unselected state.               |
| `--m3e-checkbox-unselected-hover-outline-color`      | Border color on hover when unselected.           |
| `--m3e-checkbox-unselected-disabled-outline-color`   | Base color for disabled unselected outline.      |
| `--m3e-checkbox-unselected-disabled-outline-opacity` | Opacity for disabled unselected outline.         |
| `--m3e-checkbox-unselected-error-outline-color`      | Border color for invalid unselected state.       |
| `--m3e-checkbox-selected-container-color`            | Background color for selected container.         |
| `--m3e-checkbox-selected-icon-color`                 | Icon color for selected state.                   |
| `--m3e-checkbox-selected-disabled-container-color`   | Base color for disabled selected container.      |
| `--m3e-checkbox-selected-disabled-container-opacity` | Opacity for disabled selected container.         |
| `--m3e-checkbox-selected-disabled-icon-color`        | Base color for disabled selected icon.           |
| `--m3e-checkbox-selected-disabled-icon-opacity`      | Opacity for disabled selected icon.              |
| `--m3e-checkbox-unselected-hover-color`              | Ripple hover color for unselected state.         |
| `--m3e-checkbox-unselected-focus-color`              | Ripple focus color for unselected state.         |
| `--m3e-checkbox-unselected-ripple-color`             | Ripple base color for unselected state.          |
| `--m3e-checkbox-selected-hover-color`                | Ripple hover color for selected state.           |
| `--m3e-checkbox-selected-focus-color`                | Ripple focus color for selected state.           |
| `--m3e-checkbox-selected-ripple-color`               | Ripple base color for selected state.            |
| `--m3e-checkbox-unselected-error-hover-color`        | Ripple hover color for invalid unselected state. |
| `--m3e-checkbox-unselected-error-focus-color`        | Ripple focus color for invalid unselected state. |
| `--m3e-checkbox-unselected-error-ripple-color`       | Ripple base color for invalid unselected state.  |
| `--m3e-checkbox-selected-error-hover-color`          | Ripple hover color for invalid selected state.   |
| `--m3e-checkbox-selected-error-focus-color`          | Ripple focus color for invalid selected state.   |
| `--m3e-checkbox-selected-error-ripple-color`         | Ripple base color for invalid selected state.    |

## 🤝 Contributing

See the root monorepo `CONTRIBUTING.md` for guidelines on contributing to this package.

## 📄 License

This package is licensed under the MIT License.
