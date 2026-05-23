# @m3e/web/radio-group

The `m3e-radio-group` and `m3e-radio` components enable single-choice selection within a set of mutually exclusive options. They support accessible state transitions, semantic grouping, and expressive styling across interaction states.

```ts
import "@m3e/web/radio-group";
```

## 🗂️ Elements

- `m3e-radio-group` — A container for a set of radio buttons.
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

| Attribute  | Type      | Default | Description                                                               |
| ---------- | --------- | ------- | ------------------------------------------------------------------------- |
| `disabled` | `boolean` | `false` | Whether the element is disabled.                                          |
| `name`     | `string`  | `""`    | The name that identifies the element when submitting the associated form. |
| `required` | `boolean` | `false` | Whether the element is required.                                          |

#### 🔔 Events

| Event         | Description                                                    |
| ------------- | -------------------------------------------------------------- |
| `beforeinput` | Dispatched before the checked state of a radio button changes. |
| `input`       | Dispatched when the checked state of a radio button changes.   |
| `change`      | Dispatched when the checked state of a radio button changes.   |

#### 🧩 Slots

| Slot        | Description                             |
| ----------- | --------------------------------------- |
| _(default)_ | Renders the radio buttons of the group. |

### 🗂️ m3e-radio

This section details the attributes, events and CSS custom properties available for the `m3e-radio` component.

#### ⚙️ Attributes

| Attribute  | Type      | Default | Description                                                               |
| ---------- | --------- | ------- | ------------------------------------------------------------------------- |
| `checked`  | `boolean` | `false` | Whether the element is checked.                                           |
| `disabled` | `boolean` | `false` | Whether the element is disabled.                                          |
| `name`     | `string`  | `""`    | The name that identifies the element when submitting the associated form. |
| `required` | `boolean` | `false` | Whether the element is required.                                          |
| `value`    | `string`  | `""`    | A string representing the value of the radio.                             |

#### 🔔 Events

| Event         | Description                                  |
| ------------- | -------------------------------------------- |
| `beforeinput` | Dispatched before the checked state changes. |
| `input`       | Dispatched when the checked state changes.   |
| `change`      | Dispatched when the checked state changes.   |

#### 🎛️ CSS Custom Properties

| Property                              | Description                                                       |
| ------------------------------------- | ----------------------------------------------------------------- |
| `--m3e-radio-container-size`          | Base size of the radio button container.                          |
| `--m3e-radio-icon-size`               | Size of the radio icon inside the wrapper.                        |
| `--m3e-radio-unselected-hover-color`  | Hover state layer color when radio is not selected.               |
| `--m3e-radio-unselected-focus-color`  | Focus state layer color when radio is not selected.               |
| `--m3e-radio-unselected-ripple-color` | Ripple color when radio is not selected.                          |
| `--m3e-radio-unselected-icon-color`   | Icon color when radio is not selected.                            |
| `--m3e-radio-selected-hover-color`    | Hover state layer color when radio is selected.                   |
| `--m3e-radio-selected-focus-color`    | Focus state layer color when radio is selected.                   |
| `--m3e-radio-selected-ripple-color`   | Ripple color when radio is selected.                              |
| `--m3e-radio-selected-icon-color`     | Icon color when radio is selected.                                |
| `--m3e-radio-disabled-icon-color`     | Icon color when radio is disabled.                                |
| `--m3e-radio-error-hover-color`       | Fallback hover color used when the radio is invalid and touched.  |
| `--m3e-radio-error-focus-color`       | Fallback focus color used when the radio is invalid and touched.  |
| `--m3e-radio-error-ripple-color`      | Fallback ripple color used when the radio is invalid and touched. |
| `--m3e-radio-error-icon-color`        | Fallback icon color used when the radio is invalid and touched.   |
