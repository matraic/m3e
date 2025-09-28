# @m3e/card

The `m3e-card` component is a flexible, expressive container for presenting a unified subject—text, media, and actions—on a visually distinct surface. It supports multiple appearance variants via the `variant` attribute: `filled` (default, for solid emphasis), `outlined` (for subtle framing with a border), and `elevated` (for depth and motion with shadow elevation).

Cards can be made actionable, responding to user interaction when the `actionable` attribute is set, and can be presented inline with surrounding content using the `inline` attribute.

It supports both vertical and horizontal layouts through the `orientation` attribute. Content organization is enabled via dedicated slots for `header`, `content`, `actions`, and `footer`, or developers can use the default slot for custom layouts.

The component provides dynamic elevation, adaptive shape, and expressive color theming, and responds to interaction states (hover, focus, press, disabled) with smooth motion and visual feedback, ensuring clarity, accessibility, and a cohesive user experience in accordance with Material Design 3 guidelines.

> **Part of the [Material 3 Expressive (M3E)](../../README.md) monorepo**  
> This package is maintained within the unified M3E repository, which provides a suite of Material 3 web components.

## 📦 Installation

```bash
npm install @m3e/card
```

## 🗂️ Elements

- `m3e-card` — A content container for text, images (or other media), and actions in the context of a single subject.

## 🧪 Examples

The following example illustrates each of the dedicated slots of a card.

```html
<m3e-card>
  <div slot="header">Header section</div>
  <div slot="content">Content section</div>
  <div slot="actions">Actions section</div>
  <div slot="footer">Footer section</div>
</m3e-card>
```

## 📖 API Reference

This section details the attributes, slots and CSS custom properties available for the `m3e-card` component.

### ⚙️ Attributes

| Attribute     | Type                                   | Default      | Description                                                           |
| ------------- | -------------------------------------- | ------------ | --------------------------------------------------------------------- |
| `actionable`  | `boolean`                              | `false`      | Whether the card is "actionable" and will respond to use interaction. |
| `inline`      | `boolean`                              | `false`      | Whether to present the card inline with surrounding content.          |
| `orientation` | `"horizontal" \| "vertical"`           | `"vertical"` | The orientation of the card.                                          |
| `variant`     | `"filled" \| "outlined" \| "elevated"` | `"filled"`   | The appearance variant of the card.                                   |

### 🧩 Slots

| Slot Name   | Description                      |
| ----------- | -------------------------------- |
| _(default)_ | Renders content without padding. |
| `header`    | Renders the header section.      |
| `content`   | Renders padded content.          |
| `actions`   | Renders interactive controls.    |
| `footer`    | Renders footer content.          |

### 🎛️ CSS Custom Properties

The `m3e-card` element supports extensive theming via scoped CSS custom properties. These properties enable fine-grained control over layout, shape, elevation, color, and interaction states across all appearance variants.

#### 🧱 Global Properties

| Property             | Description                               |
| -------------------- | ----------------------------------------- |
| `--m3e-card-padding` | Internal spacing for all slotted regions. |
| `--m3e-card-shape`   | Corner radius of the card container.      |

#### 🟫 Filled Variant

##### Base

| Property                                | Description                        |
| --------------------------------------- | ---------------------------------- |
| `--m3e-filled-card-text-color`          | Foreground color for text content. |
| `--m3e-filled-card-container-color`     | Background color of the container. |
| `--m3e-filled-card-container-elevation` | Elevation level of the container.  |

##### Disabled

| Property                                                 | Description                              |
| -------------------------------------------------------- | ---------------------------------------- |
| `--m3e-filled-card-disabled-text-color`                  | Text color when disabled.                |
| `--m3e-filled-card-disabled-text-opacity`                | Opacity applied to text when disabled.   |
| `--m3e-filled-card-disabled-container-color`             | Background color when disabled.          |
| `--m3e-filled-card-disabled-container-elevation`         | Elevation level when disabled.           |
| `--m3e-filled-card-disabled-container-elevation-color`   | Shadow color when disabled.              |
| `--m3e-filled-card-disabled-container-elevation-opacity` | Shadow opacity when disabled.            |
| `--m3e-filled-card-disabled-container-opacity`           | Overall container opacity when disabled. |

##### Hover

| Property                                      | Description                   |
| --------------------------------------------- | ----------------------------- |
| `--m3e-filled-card-hover-text-color`          | Text color on hover.          |
| `--m3e-filled-card-hover-state-layer-color`   | State layer color on hover.   |
| `--m3e-filled-card-hover-state-layer-opacity` | State layer opacity on hover. |
| `--m3e-filled-card-hover-container-elevation` | Elevation level on hover.     |

##### Focus

| Property                                      | Description                   |
| --------------------------------------------- | ----------------------------- |
| `--m3e-filled-card-focus-text-color`          | Text color on focus.          |
| `--m3e-filled-card-focus-state-layer-color`   | State layer color on focus.   |
| `--m3e-filled-card-focus-state-layer-opacity` | State layer opacity on focus. |
| `--m3e-filled-card-focus-container-elevation` | Elevation level on focus.     |

##### Pressed

| Property                                        | Description                   |
| ----------------------------------------------- | ----------------------------- |
| `--m3e-filled-card-pressed-text-color`          | Text color on press.          |
| `--m3e-filled-card-pressed-state-layer-color`   | State layer color on press.   |
| `--m3e-filled-card-pressed-state-layer-opacity` | State layer opacity on press. |
| `--m3e-filled-card-pressed-container-elevation` | Elevation level on press.     |

#### 🟪 Elevated Variant

##### Base

| Property                                  | Description                        |
| ----------------------------------------- | ---------------------------------- |
| `--m3e-elevated-card-text-color`          | Foreground color for text content. |
| `--m3e-elevated-card-container-color`     | Background color of the container. |
| `--m3e-elevated-card-container-elevation` | Elevation level of the container.  |

##### Disabled

| Property                                                   | Description                              |
| ---------------------------------------------------------- | ---------------------------------------- |
| `--m3e-elevated-card-disabled-text-color`                  | Text color when disabled.                |
| `--m3e-elevated-card-disabled-text-opacity`                | Opacity applied to text when disabled.   |
| `--m3e-elevated-card-disabled-container-color`             | Background color when disabled.          |
| `--m3e-elevated-card-disabled-container-elevation`         | Elevation level when disabled.           |
| `--m3e-elevated-card-disabled-container-elevation-color`   | Shadow color when disabled.              |
| `--m3e-elevated-card-disabled-container-elevation-opacity` | Shadow opacity when disabled.            |
| `--m3e-elevated-card-disabled-container-opacity`           | Overall container opacity when disabled. |

##### Hover

| Property                                        | Description                   |
| ----------------------------------------------- | ----------------------------- |
| `--m3e-elevated-card-hover-text-color`          | Text color on hover.          |
| `--m3e-elevated-card-hover-state-layer-color`   | State layer color on hover.   |
| `--m3e-elevated-card-hover-state-layer-opacity` | State layer opacity on hover. |
| `--m3e-elevated-card-hover-container-elevation` | Elevation level on hover.     |

##### Focus

| Property                                        | Description                   |
| ----------------------------------------------- | ----------------------------- |
| `--m3e-elevated-card-focus-text-color`          | Text color on focus.          |
| `--m3e-elevated-card-focus-state-layer-color`   | State layer color on focus.   |
| `--m3e-elevated-card-focus-state-layer-opacity` | State layer opacity on focus. |
| `--m3e-elevated-card-focus-container-elevation` | Elevation level on focus.     |

##### Pressed

| Property                                          | Description                   |
| ------------------------------------------------- | ----------------------------- |
| `--m3e-elevated-card-pressed-text-color`          | Text color on press.          |
| `--m3e-elevated-card-pressed-state-layer-color`   | State layer color on press.   |
| `--m3e-elevated-card-pressed-state-layer-opacity` | State layer opacity on press. |
| `--m3e-elevated-card-pressed-container-elevation` | Elevation level on press.     |

#### 🟦 Outlined Variant

##### Base

| Property                                  | Description                        |
| ----------------------------------------- | ---------------------------------- |
| `--m3e-outlined-card-text-color`          | Foreground color for text content. |
| `--m3e-outlined-card-container-elevation` | Elevation level of the container.  |
| `--m3e-outlined-card-outline-color`       | Border color of the card.          |
| `--m3e-outlined-card-outline-thickness`   | Border thickness of the card.      |

##### Disabled

| Property                                                   | Description                            |
| ---------------------------------------------------------- | -------------------------------------- |
| `--m3e-outlined-card-disabled-text-color`                  | Text color when disabled.              |
| `--m3e-outlined-card-disabled-text-opacity`                | Opacity applied to text when disabled. |
| `--m3e-outlined-card-disabled-container-elevation`         | Elevation level when disabled.         |
| `--m3e-outlined-card-disabled-container-elevation-color`   | Shadow color when disabled.            |
| `--m3e-outlined-card-disabled-container-elevation-opacity` | Shadow opacity when disabled.          |
| `--m3e-outlined-card-disabled-outline-color`               | Border color when disabled.            |
| `--m3e-outlined-card-disabled-outline-opacity`             | Border opacity when disabled.          |

##### Hover

| Property                                        | Description                   |
| ----------------------------------------------- | ----------------------------- |
| `--m3e-outlined-card-hover-text-color`          | Text color on hover.          |
| `--m3e-outlined-card-hover-state-layer-color`   | State layer color on hover.   |
| `--m3e-outlined-card-hover-state-layer-opacity` | State layer opacity on hover. |
| `--m3e-outlined-card-hover-container-elevation` | Elevation level on hover.     |
| `--m3e-outlined-card-hover-outline-color`       | Border color on hover.        |

##### Focus

| Property                                        | Description                   |
| ----------------------------------------------- | ----------------------------- |
| `--m3e-outlined-card-focus-text-color`          | Text color on focus.          |
| `--m3e-outlined-card-focus-state-layer-color`   | State layer color on focus.   |
| `--m3e-outlined-card-focus-state-layer-opacity` | State layer opacity on focus. |
| `--m3e-outlined-card-focus-container-elevation` | Elevation level on focus.     |
| `--m3e-outlined-card-focus-outline-color`       | Border color on focus.        |

##### Pressed

| Property                                          | Description                   |
| ------------------------------------------------- | ----------------------------- |
| `--m3e-outlined-card-pressed-text-color`          | Text color on press.          |
| `--m3e-outlined-card-pressed-state-layer-color`   | State layer color on press.   |
| `--m3e-outlined-card-pressed-state-layer-opacity` | State layer opacity on press. |
| `--m3e-outlined-card-pressed-container-elevation` | Elevation level on press.     |
| `--m3e-outlined-card-pressed-outline-color`       | Border color on press.        |

## 🤝 Contributing

See the root monorepo `CONTRIBUTING.md` for guidelines on contributing to this package.

## 📄 License

This package is licensed under the MIT License.
