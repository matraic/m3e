# @m3e/web/textarea-autosize

The `m3e-textarea-autosize` component automatically adjusts the height of a linked `textarea` to fit its content, preserving layout integrity and user experience. This non-visual element listens to input changes and applies dynamic resizing, constrained by optional row limits. It supports declarative configuration via attributes and can be disabled when manual control is preferred.

```ts
import "@m3e/web/textarea-autosize";
```

## 🗂️ Elements

- `m3e-textarea-autosize` — A non-visual element used to automatically resize a `textarea` to fit its content.

## 🧪 Examples

Attach textarea autosize to a textarea by its id.

```html
<m3e-form-field variant="filled">
  <label slot="label" for="field">Textarea Autosize</label>
  <textarea id="field">
    <!-- Content omitted for brevity -->
  </textarea>
</m3e-form-field>
<m3e-textarea-autosize for="field"></m3e-textarea-autosize>
```

Use `min-rows` and `max-rows` to constrain the textarea height.

```html
<m3e-form-field variant="filled">
  <label slot="label" for="field">Textarea Autosize</label>
  <textarea id="field">
    <!-- Content omitted for brevity -->
  </textarea>
</m3e-form-field>
<m3e-textarea-autosize for="field" max-rows="5"></m3e-textarea-autosize>
```

Use `disabled` to turn off autosizing.

```html
<m3e-textarea-autosize for="field" disabled></m3e-textarea-autosize>
```

## 📖 API Reference

This section details the attributes available for the `m3e-textarea-autosize` component.

### ⚙️ Attributes

| Attribute  | Type      | Default | Description                                                                  |
| ---------- | --------- | ------- | ---------------------------------------------------------------------------- |
| `disabled` | `boolean` | `false` | Whether auto-sizing is disabled.                                             |
| `for`      | `string`  |         | The identifier of the interactive control to which this element is attached. |
| `max-rows` | `number`  | `0`     | The maximum amount of rows in the `textarea`.                                |
| `min-rows` | `number`  | `0`     | The minimum amount of rows in the `textarea`.                                |
