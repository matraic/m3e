# @m3e/web/textarea-autosize

The `m3e-textarea-autosize` component automatically adjusts the height of a linked `textarea` to fit its content, preserving layout integrity and user experience. This non-visual element listens to input changes and applies dynamic resizing, constrained by optional row limits. It supports declarative configuration via attributes and can be disabled when manual control is preferred.

```ts
import "@m3e/web/textarea-autosize";
```

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

| Attribute  | Type      | Default | Description                                                                  |
| ---------- | --------- | ------- | ---------------------------------------------------------------------------- |
| `disabled` | `boolean` | `false` | Whether auto-sizing is disabled.                                             |
| `for`      | `string`  |         | The identifier of the interactive control to which this element is attached. |
| `max-rows` | `number`  | `0`     | The maximum amount of rows in the `textarea`.                                |
| `min-rows` | `number`  | `0`     | The minimum amount of rows in the `textarea`.                                |
