# @m3e/fab

The `m3e-fab` component is a prominent, expressive UI component that represents the primary action on a screen. Designed according to Material Design 3 guidelines, it supports seven visual variants, specified using the `variant` attribute—`primary`, `primary-container`, `secondary`, `secondary-container`, `tertiary`, `tertiary-container` and `surface`—each with dynamic elevation and adaptive color theming.

The component is accessible by default, with ARIA roles, contrast-safe color tokens, and strong focus indicators. It can be extended to display a label alongside its icon, and responds to interaction states (hover, focus, press, disabled) with smooth motion transitions, elevation changes, and adaptive color theming. It can also function as a link or be used to submit form data.

Native disabled `<button>` elements cannot receive focus. This can be problematic in some cases because it can prevent you from telling the user why the button is disabled. You can use the `disabled-interactive` attribute to style a `m3e-fab` as disabled but allow for it to receive focus. The button will have `aria-disabled="true"` for assistive technology.

> **Part of the [Material 3 Expressive (M3E)](../../README.md) monorepo**  
> This package is maintained within the unified M3E repository, which provides a suite of Material 3 web components.

## 📦 Installation

```bash
npm install @m3e/fab
```

## 🚀 Browser Usage

This package uses [JavaScript Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#module_specifiers). To use it directly in a browser without a bundler, use a module script similar to the following.

```html
<script type="module" src="/node_modules/@m3e/fab/dist/index.js"></script>
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

- `m3e-fab` — A floating action button (FAB) used to present important actions.

## 🧪 Examples

The following example illustrates a basic floating action button.

```html
<m3e-fab>
  <m3e-icon>add</m3e-icon>
</m3e-fab>
```

The next example illustrates an extended floating action button.

```html
<m3e-fab extended>
  <m3e-icon>add</m3e-icon>
  <span slot="label">Add</span>
</m3e-fab>
```

## 📖 API Reference

This section details the attributes, slots and CSS custom properties available for the `m3e-fab` component.

### ⚙️ Attributes

| Attribute              | Type                                                                                                                          | Default               | Description                                                                                                                            |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------- | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `variant`              | `"primary" \| "primary-container" \| "secondary" \| "secondary-container" \| "tertiary" \| "tertiary-container" \| "surface"` | `"primary-container"` | The appearance variant of the FAB.                                                                                                     |
| `size`                 | `"small" \| "medium" \| "large"`                                                                                              | `"medium"`            | The size of the FAB.                                                                                                                   |
| `extended`             | `boolean`                                                                                                                     | `false`               | Whether the FAB is extended to show the label.                                                                                         |
| `lowered`              | `boolean`                                                                                                                     | `false`               | Whether to present a lowered elevation.                                                                                                |
| `disabled`             | `boolean`                                                                                                                     | `false`               | Whether the element is disabled.                                                                                                       |
| `disabled-interactive` | `boolean`                                                                                                                     | `false`               | Whether the element is disabled and interactive.                                                                                       |
| `type`                 | `"button" \| "submit" \| "reset"`                                                                                             | `"button"`            | The type of the element.                                                                                                               |
| `name`                 | `string`                                                                                                                      |                       | The name of the element, submitted as a pair with the element's value as part of form data, when the element is used to submit a form. |
| `value`                | `string`                                                                                                                      |                       | The value associated with the element's name when it's submitted with form data.                                                       |
| `href`                 | `string`                                                                                                                      |                       | The URL to which the link FAB points.                                                                                                  |
| `target`               | `string`                                                                                                                      |                       | The target of the link FAB.                                                                                                            |
| `rel`                  | `string`                                                                                                                      |                       | The relationship between the target of the link FAB and the document.                                                                  |
| `download`             | `string`                                                                                                                      |                       | A value indicating whether the target of the link FAB will be downloaded, optionally specifying the new name of the file.              |

### 🧩 Slots

| Slot Name    | Description                                          |
| ------------ | ---------------------------------------------------- |
| _(default)_  | Renders the icon of the button.                      |
| `label`      | Renders the label of an extended FAB.                |
| `close-icon` | Renders the close icon when used to open a FAB menu. |

### 🎛️ CSS Custom Properties

#### 🧱 Size Properties

All size variants (`small`, `medium`, `large`) support:

| Property                                  | Description                  |
| ----------------------------------------- | ---------------------------- |
| `--m3e-fab-[size]-container-height`       | Height of the FAB container  |
| `--m3e-fab-[size]-label-text-font-size`   | Font size for label          |
| `--m3e-fab-[size]-label-text-font-weight` | Font weight for label        |
| `--m3e-fab-[size]-label-text-line-height` | Line height for label        |
| `--m3e-fab-[size]-label-text-tracking`    | Letter tracking for label    |
| `--m3e-fab-[size]-icon-size`              | Icon size                    |
| `--m3e-fab-[size]-shape`                  | Corner radius                |
| `--m3e-fab-[size]-leading-space`          | Space before icon/label      |
| `--m3e-fab-[size]-trailing-space`         | Space after icon/label       |
| `--m3e-fab-[size]-icon-label-space`       | Space between icon and label |

#### 🎨 Appearance Variant Properties

All appearance variants (`primary`, `primary-container`, `secondary`, `secondary-container`, `tertiary`, `tertiary-container`, `surface`) support:

| Property                                          | Description                |
| ------------------------------------------------- | -------------------------- |
| `--m3e-[variant]-fab-label-text-color`            | Label color                |
| `--m3e-[variant]-fab-icon-color`                  | Icon color                 |
| `--m3e-[variant]-fab-container-color`             | Container background color |
| `--m3e-[variant]-fab-container-elevation`         | Elevation                  |
| `--m3e-[variant]-fab-lowered-container-elevation` | Lowered elevation          |

#### 🟫 State Properties

Each variant supports state properties for disabled, hover, focus, and pressed. For each variant, the following properties are available (replace `[variant]` with the variant name):

| Property                                                   | Description                     |
| ---------------------------------------------------------- | ------------------------------- |
| `--m3e-[variant]-fab-disabled-label-text-color`            | Label color when disabled       |
| `--m3e-[variant]-fab-disabled-label-text-opacity`          | Label opacity when disabled     |
| `--m3e-[variant]-fab-disabled-icon-color`                  | Icon color when disabled        |
| `--m3e-[variant]-fab-disabled-icon-opacity`                | Icon opacity when disabled      |
| `--m3e-[variant]-fab-disabled-container-color`             | Container color when disabled   |
| `--m3e-[variant]-fab-disabled-container-opacity`           | Container opacity when disabled |
| `--m3e-[variant]-fab-disabled-container-elevation`         | Elevation when disabled         |
| `--m3e-[variant]-fab-lowered-disabled-container-elevation` | Lowered elevation when disabled |
| `--m3e-[variant]-fab-hover-label-text-color`               | Label color on hover            |
| `--m3e-[variant]-fab-hover-icon-color`                     | Icon color on hover             |
| `--m3e-[variant]-fab-hover-state-layer-color`              | State layer color on hover      |
| `--m3e-[variant]-fab-hover-state-layer-opacity`            | State layer opacity on hover    |
| `--m3e-[variant]-fab-hover-container-elevation`            | Elevation on hover              |
| `--m3e-[variant]-fab-lowered-hover-container-elevation`    | Lowered elevation on hover      |
| `--m3e-[variant]-fab-focus-label-text-color`               | Label color on focus            |
| `--m3e-[variant]-fab-focus-icon-color`                     | Icon color on focus             |
| `--m3e-[variant]-fab-focus-state-layer-color`              | State layer color on focus      |
| `--m3e-[variant]-fab-focus-state-layer-opacity`            | State layer opacity on focus    |
| `--m3e-[variant]-fab-focus-container-elevation`            | Elevation on focus              |
| `--m3e-[variant]-fab-lowered-focus-container-elevation`    | Lowered elevation on focus      |
| `--m3e-[variant]-fab-pressed-label-text-color`             | Label color on press            |
| `--m3e-[variant]-fab-pressed-icon-color`                   | Icon color on press             |
| `--m3e-[variant]-fab-pressed-state-layer-color`            | State layer color on press      |
| `--m3e-[variant]-fab-pressed-state-layer-opacity`          | State layer opacity on press    |
| `--m3e-[variant]-fab-pressed-container-elevation`          | Elevation on press              |
| `--m3e-[variant]-fab-lowered-pressed-container-elevation`  | Lowered elevation on press      |

## 🤝 Contributing

See the root monorepo `CONTRIBUTING.md` for guidelines on contributing to this package.

## 📄 License

This package is licensed under the MIT License.
