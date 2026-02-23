# @m3e/web/option

The `m3e-option`, `m3e-option-panel`, and `m3e-optgroup` components provide a complete solution for displaying selectable options in menus and lists. They follow Material Design 3 principles with comprehensive support for single and multiple selection, dynamic positioning, keyboard navigation, and extensive theming via CSS custom properties.

```ts
import "@m3e/web/option";
```

## 🗂️ Elements

- `m3e-option` — A selectable item within a menu or list, providing visual feedback and selection state management.
- `m3e-option-panel` — A temporary surface that presents a scrollable list of options anchored to a trigger element.
- `m3e-optgroup` — A container that groups related options under a customizable label with semantic structure.

## 🧪 Example

```html
<m3e-option-panel>
  <m3e-option value="apple">Apple</m3e-option>
  <m3e-option value="banana">Banana</m3e-option>
  <m3e-optgroup>
    <span slot="label">Citrus</span>
    <m3e-option value="lemon">Lemon</m3e-option>
    <m3e-option value="orange">Orange</m3e-option>
  </m3e-optgroup>
</m3e-option-panel>
```

## 📖 API Reference

### 🗂️ m3e-option

This section details the attributes, slots, events and CSS custom properties available for the `m3e-option` component.

#### ⚙️ Attributes

| Attribute  | Type      | Default | Description                                    |
| ---------- | --------- | ------- | ---------------------------------------------- |
| `disabled` | `boolean` | `false` | Whether the element is disabled.               |
| `selected` | `boolean` | `false` | Whether the element is selected.               |
| `value`    | `string`  |         | A string representing the value of the option. |

#### 🧩 Slots

| Slot        | Description                      |
| ----------- | -------------------------------- |
| _(default)_ | Renders the label of the option. |

#### 🎛️ CSS Custom Properties

| Property                                      | Description                                       |
| --------------------------------------------- | ------------------------------------------------- |
| `--m3e-option-container-height`               | The height of the option container.               |
| `--m3e-option-color`                          | The text color of the option.                     |
| `--m3e-option-container-hover-color`          | The color for the hover state layer.              |
| `--m3e-option-container-focus-color`          | The color for the focus state layer.              |
| `--m3e-option-ripple-color`                   | The color of the ripple effect.                   |
| `--m3e-option-selected-color`                 | The text color when the option is selected.       |
| `--m3e-option-selected-container-color`       | The background color when the option is selected. |
| `--m3e-option-selected-container-hover-color` | The hover color for the selected state layer.     |
| `--m3e-option-selected-container-focus-color` | The focus color for the selected state layer.     |
| `--m3e-option-selected-ripple-color`          | The ripple color when the option is selected.     |
| `--m3e-option-disabled-color`                 | The text color when the option is disabled.       |
| `--m3e-option-disabled-opacity`               | The opacity level applied to the disabled text.   |
| `--m3e-option-icon-label-space`               | The spacing between the icon and label.           |
| `--m3e-option-padding-start`                  | The left padding of the option content.           |
| `--m3e-option-padding-end`                    | The right padding of the option content.          |
| `--m3e-option-label-text-font-size`           | The font size of the option label.                |
| `--m3e-option-label-text-font-weight`         | The font weight of the option label.              |
| `--m3e-option-label-text-line-height`         | The line height of the option label.              |
| `--m3e-option-label-text-tracking`            | The letter spacing of the option label.           |
| `--m3e-option-focus-ring-shape`               | The corner radius of the focus ring.              |
| `--m3e-option-icon-size`                      | The size of the option icons.                     |
| `--m3e-option-shape`                          | Base shape of the option.                         |
| `--m3e-option-selected-shape`                 | Shape used for a selected option.                 |
| `--m3e-option-first-child-shape`              | Shape for the first option in list.               |
| `--m3e-option-last-child-shape`               | Shape for the last option in a list.              |

### 🗂️ m3e-option-panel

This section details the attributes, slots, events and CSS custom properties available for the `m3e-option-panel` component.

#### 🔔 Events

| Event          | Description                                    |
| -------------- | ---------------------------------------------- |
| `beforetoggle` | Dispatched before the toggle state changes.    |
| `toggle`       | Dispatched after the toggle state has changed. |

#### 🧩 Slots

| Slot        | Description                       |
| ----------- | --------------------------------- |
| _(default)_ | Renders the contents of the list. |

#### 🎛️ CSS Custom Properties

| Property                                            | Description                                             |
| --------------------------------------------------- | ------------------------------------------------------- |
| `--m3e-option-panel-container-shape`                | Corner radius of the panel container.                   |
| `--m3e-option-panel-container-min-width`            | Minimum width of the panel container.                   |
| `--m3e-option-panel-container-max-width`            | Maximum width of the panel container.                   |
| `--m3e-option-panel-container-max-height`           | Maximum height of the panel container.                  |
| `--m3e-option-panel-container-padding-block`        | Vertical padding inside the panel container.            |
| `--m3e-option-panel-container-padding-inline`       | Horizontal padding inside the panel container.          |
| `--m3e-option-panel-container-color`                | Background color of the panel container.                |
| `--m3e-option-panel-container-elevation`            | Box shadow elevation of the panel container.            |
| `--m3e-option-panel-gap`                            | Vertical spacing between option items.                  |
| `--m3e-option-panel-divider-spacing`                | Vertical spacing around slotted `m3e-divider` elements. |
| `--m3e-option-panel-text-highlight-container-color` | Background color used for text highlight matches.       |
| `--m3e-option-panel-text-highlight-color`           | Text color used for text highlight matches.             |

### 🗂️ m3e-optgroup

This section details the attributes, slots, and CSS custom properties available for the `m3e-optgroup` component.

#### 🧩 Slots

| Slot        | Description                       |
| ----------- | --------------------------------- |
| _(default)_ | Renders the options of the group. |
| `label`     | Renders the label of the group.   |

#### 🎛️ CSS Custom Properties

| Property                     | Description                              |
| ---------------------------- | ---------------------------------------- |
| `--m3e-option-height`        | The height of the group label container. |
| `--m3e-option-font-size`     | The font size of the group label.        |
| `--m3e-option-font-weight`   | The font weight of the group label.      |
| `--m3e-option-line-height`   | The line height of the group label.      |
| `--m3e-option-tracking`      | The letter spacing of the group label.   |
| `--m3e-option-padding-end`   | The right padding of the label.          |
| `--m3e-option-padding-start` | The left padding of the label.           |
| `--m3e-option-color`         | The text color of the group label.       |
