# @m3e/web/callout

The `m3e-callout` component provides a visually distinct supporting container for contextual or supplemental information. It can include an icon and label, and supports multiple appearance variants and shapes.

```ts
import "@m3e/web/callout";
```

## 🗂️ Elements

- `m3e-callout` — A supporting container used to present content with visual emphasis.

## 🧪 Example

The following example illustrates a callout with an icon, label, and text-based content.

```html
<m3e-callout>
  <m3e-icon slot="icon" name="info"></m3e-icon>
  <span slot="label">Important information</span>
  Supporting details go here.
</m3e-callout>
```

Set the appearance with the `variant` attribute (`primary`, `secondary`, `tertiary`, `error`, or `surface`) and the shape with `shape` (`rounded` or `square`).

```html
<m3e-callout variant="error" shape="square">
  <span slot="label">Action required</span>
  Review the details before continuing.
</m3e-callout>
```

## 📖 API Reference

This section details the attributes, slots, events, and CSS custom properties available for the `m3e-callout` component.

### ⚙️ Attributes

| Attribute | Type                                                             | Default       | Description                        |
| --------- | ---------------------------------------------------------------- | ------------- | ---------------------------------- |
| `variant` | `"primary" \| "secondary" \| "tertiary" \| "error" \| "surface"` | `"secondary"` | Appearance variant of the callout. |
| `shape`   | `"rounded" \| "square"`                                          | `"rounded"`   | Shape of the callout.              |

### 🎰 Slots

| Slot        | Description                                    |
| ----------- | ---------------------------------------------- |
| _(default)_ | Renders the text-based content of the callout. |
| `icon`      | Renders the icon of the callout.               |
| `label`     | Renders the label of the callout.              |

### 🎨 CSS Custom Properties

#### 🎨 Appearance Variant Properties

All appearance variants (`primary`, `secondary`, `tertiary`, `error`, `surface`) support the following properties. Replace `[variant]` with `primary-container`, `secondary-container`, `tertiary-container`, `error-container`, or `surface`, respectively. The unprefixed fallback properties below apply to all variants when a variant-specific property is not set.

| Property                                       | Description                 |
| ---------------------------------------------- | --------------------------- |
| `--m3e-[variant]-callout-container-color`      | Container background color. |
| `--m3e-[variant]-callout-label-text-color`     | Label text color.           |
| `--m3e-[variant]-callout-icon-color`           | Icon color.                 |
| `--m3e-[variant]-callout-content-color`        | Content color.              |
| `--m3e-[variant]-callout-leading-accent-color` | Leading accent color.       |

#### Unprefixed Fallback Properties

These properties provide a fallback color for all variants.

| Property                             | Description                          |
| ------------------------------------ | ------------------------------------ |
| `--m3e-callout-container-color`      | Fallback container background color. |
| `--m3e-callout-label-text-color`     | Fallback label text color.           |
| `--m3e-callout-icon-color`           | Fallback icon color.                 |
| `--m3e-callout-content-color`        | Fallback content color.              |
| `--m3e-callout-leading-accent-color` | Fallback leading accent color.       |

#### 📐 Layout, Typography, and Shape Properties

These properties are shared by all variants.

| Property                            | Description                           |
| ----------------------------------- | ------------------------------------- |
| `--m3e-callout-leading-space`       | Padding at the start of the callout.  |
| `--m3e-callout-trailing-space`      | Padding at the end of the callout.    |
| `--m3e-callout-top-space`           | Padding at the top of the callout.    |
| `--m3e-callout-bottom-space`        | Padding at the bottom of the callout. |
| `--m3e-callout-leading-accent-size` | Width of the leading accent.          |
| `--m3e-callout-icon-label-space`    | Space between the icon and label.     |
| `--m3e-callout-icon-size`           | Size of the icon.                     |
| `--m3e-callout-label-font-size`     | Font size of the label.               |
| `--m3e-callout-label-font-weight`   | Font weight of the label.             |
| `--m3e-callout-label-line-height`   | Line height of the label.             |
| `--m3e-callout-label-tracking`      | Letter spacing of the label.          |
| `--m3e-callout-content-font-size`   | Font size of the content.             |
| `--m3e-callout-content-font-weight` | Font weight of the content.           |
| `--m3e-callout-content-line-height` | Line height of the content.           |
| `--m3e-callout-content-tracking`    | Letter spacing of the content.        |
| `--m3e-callout-label-content-space` | Space between the header and content. |
| `--m3e-callout-rounded-shape`       | Corner radius of the rounded shape.   |
| `--m3e-callout-square-shape`        | Corner radius of the square shape.    |
