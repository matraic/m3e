# @m3e/web/heading

The `m3e-heading` component provides expressive, accessible headings for pages and sections, supporting display, headline, title, and label variants in multiple sizes. It applies Material 3 typographic tokens for font size, weight, line height, and letter spacing, ensuring visual hierarchy and clarity.

```ts
import "@m3e/web/heading";
```

## 🗂️ Elements

- `m3e-heading` — A heading to a page or section.

## 🧪 Examples

Use `variant` and `size` to select the typescale. Set `level` from 1 to 6 when the heading should have heading semantics.

```html
<m3e-heading variant="display" size="large">Display Large</m3e-heading>
<m3e-heading variant="display" size="medium">Display Medium</m3e-heading>
<m3e-heading variant="display" size="small">Display Small</m3e-heading>
<!-- Additional variants omitted for brevity -->
```

Use `emphasized` to apply the emphasized typescale.

```html
<m3e-heading variant="display" size="large" emphasized>Display Large</m3e-heading>
<m3e-heading variant="display" size="medium" emphasized>Display Medium</m3e-heading>
<m3e-heading variant="display" size="small" emphasized>Display Small</m3e-heading>
<!-- Additional variants omitted for brevity -->
```

Set `level` to apply `role="heading"` and the corresponding `aria-level`. Without `level`, the component has no heading role by default.

```html
<m3e-heading variant="headline" size="large" level="1">Page title</m3e-heading>
```

## 📖 API Reference

This section details the attributes and slots available for the `m3e-heading` component.

### ⚙️ Attributes

| Attribute    | Type                                                  | Default     | Description                                       |
| ------------ | ----------------------------------------------------- | ----------- | ------------------------------------------------- |
| `emphasized` | `boolean`                                             | `false`     | Whether the heading uses an emphasized typescale. |
| `variant`    | `"display"` \| `"headline"` \| `"title"` \| `"label"` | `"display"` | The appearance variant of the heading.            |
| `size`       | `"small"` \| `"medium"` \| `"large"`                  | "medium"    | The size of the heading.                          |
| `level`      | `1` \| `2` \| `3` \| `4` \| `5` \| `6`                |             | The accessibility level of the heading.           |

### 🧩 Slots

| Slot        | Description                         |
| ----------- | ----------------------------------- |
| _(default)_ | Renders the content of the heading. |
