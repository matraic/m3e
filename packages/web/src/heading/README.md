# @m3e/web/heading

The `m3e-heading` component provides expressive, accessible headings for pages and sections, supporting display, headline, title, and label variants in multiple sizes. It applies Material 3 typographic tokens for font size, weight, line height, and letter spacing, ensuring visual hierarchy and clarity.

```ts
import "@m3e/web/heading";
```

## 🗂️ Elements

- `m3e-heading` — A heading to a page or section.

## 🧪 Examples

The following example illustrates use of the `m3e-heading` to present each variant and size.

```html
<m3e-heading variant="display" size="large">Display Large</m3e-heading>
<m3e-heading variant="display" size="medium">Display Medium</m3e-heading>
<m3e-heading variant="display" size="small">Display Small</m3e-heading>
<m3e-heading variant="headline" size="large">Headline Large</m3e-heading>
<m3e-heading variant="headline" size="medium">Headline Medium</m3e-heading>
<m3e-heading variant="headline" size="small">Headline Small</m3e-heading>
<m3e-heading variant="title" size="large">Title Large</m3e-heading>
<m3e-heading variant="title" size="medium">Title Medium</m3e-heading>
<m3e-heading variant="title" size="small">Title Small</m3e-heading>
<m3e-heading variant="label" size="large">Label Large</m3e-heading>
<m3e-heading variant="label" size="medium">Label Medium</m3e-heading>
<m3e-heading variant="label" size="small">Label Small</m3e-heading>
```

The next example illustrates use of the `level` attribute to designate the accessibility level of a heading.
When specified, ARIA `role="heading"` is applied and the `level` is propagated to `aria-level`.

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
