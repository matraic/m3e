# @m3e/web/chips

The `@m3e/web/chips` module provides expressive, accessible chip components for actions, input, filtering, and suggestions, each supporting two appearance variants—`outlined` and `elevated`. Use `outlined` for lightweight, unobtrusive chips such as tags or filters, and `elevated` for chips that require stronger visual affordance, like assist actions or selected states. These variants help convey interaction weight, visual hierarchy, and contextual emphasis across static and interactive use cases.

```ts
import "@m3e/web/chips";
```

## 🗂️ Elements

- `m3e-chip` — A non-interactive chip used to convey small pieces of information.
- `m3e-chip-set` — A container used to organize chips into a cohesive unit.
- `m3e-assist-chip` — A chip users interact with to perform a smart or automated action that can span multiple applications.
- `m3e-input-chip` — A chip which represents a discrete piece of information entered by a user.
- `m3e-input-chip-set` — A container that transforms user input into a cohesive set of interactive chips, supporting entry, editing, and removal of discrete values.
- `m3e-filter-chip` — A chip users interact with to select/deselect options.
- `m3e-filter-chip-set` — A container that organizes filter chips into a cohesive group, enabling selection and deselection of values used to refine content or trigger contextual behavior.
- `m3e-suggestion-chip` — A chip used to help narrow a user's intent by presenting dynamically generated suggestions, such as suggested responses or search filters.

## 🧪 Examples

### 🗂️ Chip

The following example illustrates use of the `m3e-chip` and `m3e-chip-set` components to present non-interactive chips.

```html
<m3e-chip-set>
  <m3e-chip><m3e-icon slot="icon" name="palette"></m3e-icon>Design</m3e-chip>
  <m3e-chip><m3e-icon slot="icon" name="accessibility_new"></m3e-icon>Accessibility</m3e-chip>
  <m3e-chip><m3e-icon slot="icon" name="motion_photos_on"></m3e-icon>Motion</m3e-chip>
  <m3e-chip><m3e-icon slot="icon" name="description"></m3e-icon>Documentation</m3e-chip>
</m3e-chip-set>
```

### 🗂️ Assist Chip

The following example illustrates use of the `m3e-assist-chip`. In this example, multiple chips are nested inside a `m3e-chip-set` container to create a cohesive set of chips. The container is given the ARIA `role="group"` to convey to assistive technologies that the chips are part of a related set of element.

```html
<m3e-chip-set role="group" aria-label="Quick actions">
  <m3e-assist-chip><m3e-icon slot="icon" name="edit"></m3e-icon>Edit</m3e-assist-chip>
  <m3e-assist-chip><m3e-icon slot="icon" name="delete"></m3e-icon>Delete</m3e-assist-chip>
  <m3e-assist-chip><m3e-icon slot="icon" name="content_copy"></m3e-icon>Copy</m3e-assist-chip>
  <m3e-assist-chip><m3e-icon slot="icon" name="share"></m3e-icon>Share</m3e-assist-chip>
</m3e-chip-set>
```

### 🗂️ Input Chip

The following example illustrates the use of the `m3e-input-chip-set` inside a `m3e-form-field`. In this example, the `input` slot specifies the `input` element used to add input chips and the field label's `for` attribute targets the `input` element to provide an accessible label.

```html
<m3e-form-field>
  <label slot="label" for="keywords">Keywords</label>
  <m3e-input-chip-set aria-label="Enter keywords">
    <input id="keywords" slot="input" placeholder="New keyword..." />
  </m3e-input-chip-set>
</m3e-form-field>
```

### 🗂️ Filter Chip

- The following example illustrates a single-select `m3e-filter-chip-set` containing multiple `m3e-filter-chip` components that allow a user to choose an option. You can use the `multi` attribute to enable multiselect.

```html
<m3e-filter-chip-set aria-label="Filter by topic">
  <m3e-filter-chip><m3e-icon slot="icon" name="palette"></m3e-icon>Design</m3e-filter-chip>
  <m3e-filter-chip><m3e-icon slot="icon" name="accessibility_new"></m3e-icon>Accessibility</m3e-filter-chip>
  <m3e-filter-chip><m3e-icon slot="icon" name="motion_photos_on"></m3e-icon>Motion</m3e-filter-chip>
  <m3e-filter-chip><m3e-icon slot="icon" name="description"></m3e-icon>Documentation</m3e-filter-chip>
</m3e-filter-chip-set>
```

### 🗂️ Suggestion Chip

The following example illustrates use of the `m3e-suggestion-chip`. In this example, multiple chips are nested inside a `m3e-chip-set` container to create a cohesive set of chips. The container is given the ARIA `role="group"` to convey to assistive technologies that the chips are part of a related set of element.

```html
<m3e-chip-set role="group" aria-label="Suggested replies">
  <m3e-suggestion-chip>Sounds good!</m3e-suggestion-chip>
  <m3e-suggestion-chip>Can you clarify?</m3e-suggestion-chip>
  <m3e-suggestion-chip>Let's do it.</m3e-suggestion-chip>
  <m3e-suggestion-chip>Maybe later.</m3e-suggestion-chip>
</m3e-chip-set>
```

## 📖 API Reference

### 🗂️ Chip

This section details the attributes, slots, and CSS custom properties available for the `m3e-chip` component.

#### ⚙️ Attributes

| Attribute | Type                         | Default      | Description             |
| --------- | ---------------------------- | ------------ | ----------------------- |
| `value`   | `string`                     |              | The value of the chip.  |
| `variant` | `"outlined"` \| `"elevated"` | `"outlined"` | The appearance variant. |

#### 🧩 Slots

| Slot            | Description                              |
| --------------- | ---------------------------------------- |
| _(default)_     | Renders the label of the chip.           |
| `icon`          | Renders an icon before the chip's label. |
| `trailing-icon` | Renders an icon after the chip's label.  |

#### 🎛️ CSS Custom Properties

| Property                                | Description                                                 |
| --------------------------------------- | ----------------------------------------------------------- |
| `--m3e-chip-container-shape`            | Border radius of the chip container                         |
| `--m3e-chip-container-height`           | Base height of the chip container before density adjustment |
| `--m3e-chip-label-text-font-size`       | Font size of the chip label text                            |
| `--m3e-chip-label-text-font-weight`     | Font weight of the chip label text                          |
| `--m3e-chip-label-text-line-height`     | Line height of the chip label text                          |
| `--m3e-chip-label-text-tracking`        | Letter spacing of the chip label text                       |
| `--m3e-chip-label-text-color`           | Label text color in default state                           |
| `--m3e-chip-icon-color`                 | Icon color in default state                                 |
| `--m3e-chip-icon-size`                  | Font size of leading/trailing icons                         |
| `--m3e-chip-spacing`                    | Horizontal gap between chip content elements                |
| `--m3e-chip-padding-start`              | Default start padding when no icon is present               |
| `--m3e-chip-padding-end`                | Default end padding when no trailing icon is present        |
| `--m3e-chip-with-icon-padding-start`    | Start padding when leading icon is present                  |
| `--m3e-chip-with-icon-padding-end`      | End padding when trailing icon is present                   |
| `--m3e-elevated-chip-container-color`   | Background color for elevated variant                       |
| `--m3e-elevated-chip-elevation`         | Elevation level for elevated variant                        |
| `--m3e-elevated-chip-hover-elevation`   | Elevation level on hover                                    |
| `--m3e-outlined-chip-outline-thickness` | Outline thickness for outlined variant                      |
| `--m3e-outlined-chip-outline-color`     | Outline color for outlined variant                          |

### 🗂️ Chip Set

This section details the attributes, slots, and CSS custom properties available for the `m3e-chip-set` component.

#### ⚙️ Attributes

| Attribute  | Type      | Default | Description                           |
| ---------- | --------- | ------- | ------------------------------------- |
| `vertical` | `boolean` | `false` | Whether chips are stacked vertically. |

#### 🧩 Slots

| Slot        | Description                   |
| ----------- | ----------------------------- |
| _(default)_ | Renders the chips of the set. |

#### 🎛️ CSS Custom Properties

| Property                 | Description                      |
| ------------------------ | -------------------------------- |
| `--m3e-chip-set-spacing` | The spacing (gap) between chips. |

### 🗂️ Assist Chip

This section details the attributes, slots, and CSS custom properties available for the `m3e-assist-chip` component.

#### ⚙️ Attributes

| Attribute              | Type                         | Default      | Description                                   |
| ---------------------- | ---------------------------- | ------------ | --------------------------------------------- |
| `disabled`             | `boolean`                    | `false`      | Whether the chip is disabled.                 |
| `disabled-interactive` | `boolean`                    | `false`      | Whether the chip is disabled and interactive. |
| `download`             | `string`                     |              | Download attribute for link button.           |
| `href`                 | `string`                     |              | URL for the link button.                      |
| `name`                 | `string`                     |              | Name for form submission.                     |
| `rel`                  | `string`                     |              | Relationship for the link button.             |
| `target`               | `string`                     |              | Target for the link button.                   |
| `type`                 | `string`                     |              | Type of the element.                          |
| `value`                | `string`                     |              | The value of the chip.                        |
| `variant`              | `"outlined"` \| `"elevated"` | `"outlined"` | The appearance variant.                       |

#### 🧩 Slots

| Slot        | Description                              |
| ----------- | ---------------------------------------- |
| _(default)_ | Renders the label of the chip.           |
| `icon`      | Renders an icon before the chip's label. |

#### 🎛️ CSS Custom Properties

| Property                                         | Description                                                 |
| ------------------------------------------------ | ----------------------------------------------------------- |
| `--m3e-chip-container-shape`                     | Border radius of the chip container                         |
| `--m3e-chip-container-height`                    | Base height of the chip container before density adjustment |
| `--m3e-chip-label-text-font-size`                | Font size of the chip label text                            |
| `--m3e-chip-label-text-font-weight`              | Font weight of the chip label text                          |
| `--m3e-chip-label-text-line-height`              | Line height of the chip label text                          |
| `--m3e-chip-label-text-tracking`                 | Letter spacing of the chip label text                       |
| `--m3e-chip-label-text-color`                    | Label text color in default state                           |
| `--m3e-chip-icon-color`                          | Icon color in default state                                 |
| `--m3e-chip-icon-size`                           | Font size of leading/trailing icons                         |
| `--m3e-chip-spacing`                             | Horizontal gap between chip content elements                |
| `--m3e-chip-padding-start`                       | Default start padding when no icon is present               |
| `--m3e-chip-padding-end`                         | Default end padding when no trailing icon is present        |
| `--m3e-chip-with-icon-padding-start`             | Start padding when leading icon is present                  |
| `--m3e-chip-with-icon-padding-end`               | End padding when trailing icon is present                   |
| `--m3e-chip-disabled-label-text-color`           | Base color for disabled label text                          |
| `--m3e-chip-disabled-label-text-opacity`         | Opacity applied to disabled label text                      |
| `--m3e-chip-disabled-icon-color`                 | Base color for disabled icons                               |
| `--m3e-chip-disabled-icon-opacity`               | Opacity applied to disabled icons                           |
| `--m3e-elevated-chip-container-color`            | Background color for elevated variant                       |
| `--m3e-elevated-chip-elevation`                  | Elevation level for elevated variant                        |
| `--m3e-elevated-chip-hover-elevation`            | Elevation level on hover                                    |
| `--m3e-elevated-chip-disabled-container-color`   | Background color for disabled elevated variant              |
| `--m3e-elevated-chip-disabled-container-opacity` | Opacity applied to disabled elevated background             |
| `--m3e-elevated-chip-disabled-elevation`         | Elevation level for disabled elevated variant               |
| `--m3e-outlined-chip-outline-thickness`          | Outline thickness for outlined variant                      |
| `--m3e-outlined-chip-outline-color`              | Outline color for outlined variant                          |
| `--m3e-outlined-chip-disabled-outline-color`     | Outline color for disabled outlined variant                 |
| `--m3e-outlined-chip-disabled-outline-opacity`   | Opacity applied to disabled outline                         |

### 🗂️ Input Chip

This section details the attributes, events, slots, and CSS custom properties available for the `m3e-input-chip` component.

#### ⚙️ Attributes

| Attribute              | Type                         | Default      | Description                                   |
| ---------------------- | ---------------------------- | ------------ | --------------------------------------------- |
| `disabled`             | `boolean`                    | `false`      | Whether the chip is disabled.                 |
| `disabled-interactive` | `boolean`                    | `false`      | Whether the chip is disabled and interactive. |
| `removable`            | `boolean`                    | `false`      | Whether the chip is removable.                |
| `remove-label`         | `string`                     | `"Remove"`   | Accessible label for the remove button.       |
| `value`                | `string`                     |              | The value of the chip.                        |
| `variant`              | `"outlined"` \| `"elevated"` | `"outlined"` | The appearance variant.                       |

#### 🧩 Slots

| Slot          | Description                                |
| ------------- | ------------------------------------------ |
| _(default)_   | Renders the label of the chip.             |
| `avatar`      | Renders an avatar before the chip's label. |
| `icon`        | Renders an icon before the chip's label.   |
| `remove-icon` | Renders the icon for the remove button.    |

#### 🔔 Events

| Event    | Description                                                                  |
| -------- | ---------------------------------------------------------------------------- |
| `remove` | Emitted when the remove button is clicked or DELETE or BACKSPACE is pressed. |

#### 🎛️ CSS Custom Properties

| Property                                         | Description                                                 |
| ------------------------------------------------ | ----------------------------------------------------------- |
| `--m3e-chip-container-shape`                     | Border radius of the chip container                         |
| `--m3e-chip-container-height`                    | Base height of the chip container before density adjustment |
| `--m3e-chip-label-text-font-size`                | Font size of the chip label text                            |
| `--m3e-chip-label-text-font-weight`              | Font weight of the chip label text                          |
| `--m3e-chip-label-text-line-height`              | Line height of the chip label text                          |
| `--m3e-chip-label-text-tracking`                 | Letter spacing of the chip label text                       |
| `--m3e-chip-label-text-color`                    | Label text color in default state                           |
| `--m3e-chip-icon-color`                          | Icon color in default state                                 |
| `--m3e-chip-icon-size`                           | Font size of leading/trailing icons                         |
| `--m3e-chip-spacing`                             | Horizontal gap between chip content elements                |
| `--m3e-chip-padding-start`                       | Default start padding when no icon is present               |
| `--m3e-chip-padding-end`                         | Default end padding when no trailing icon is present        |
| `--m3e-chip-with-icon-padding-start`             | Start padding when leading icon is present                  |
| `--m3e-chip-with-icon-padding-end`               | End padding when trailing icon is present                   |
| `--m3e-chip-disabled-label-text-color`           | Base color for disabled label text                          |
| `--m3e-chip-disabled-label-text-opacity`         | Opacity applied to disabled label text                      |
| `--m3e-chip-disabled-icon-color`                 | Base color for disabled icons                               |
| `--m3e-chip-disabled-icon-opacity`               | Opacity applied to disabled icons                           |
| `--m3e-elevated-chip-container-color`            | Background color for elevated variant                       |
| `--m3e-elevated-chip-elevation`                  | Elevation level for elevated variant                        |
| `--m3e-elevated-chip-hover-elevation`            | Elevation level on hover                                    |
| `--m3e-elevated-chip-disabled-container-color`   | Background color for disabled elevated variant              |
| `--m3e-elevated-chip-disabled-container-opacity` | Opacity applied to disabled elevated background             |
| `--m3e-elevated-chip-disabled-elevation`         | Elevation level for disabled elevated variant               |
| `--m3e-outlined-chip-outline-thickness`          | Outline thickness for outlined variant                      |
| `--m3e-outlined-chip-outline-color`              | Outline color for outlined variant                          |
| `--m3e-outlined-chip-disabled-outline-color`     | Outline color for disabled outlined variant                 |
| `--m3e-outlined-chip-disabled-outline-opacity`   | Opacity applied to disabled outline                         |
| `--m3e-chip-avatar-size`                         | Font size of the avatar slot content                        |
| `--m3e-chip-disabled-avatar-opacity`             | Opacity applied to the avatar when disabled                 |
| `--m3e-chip-with-avatar-padding-start`           | Start padding when an avatar is present                     |

### 🗂️ Input Chip Set

This section details the attributes, events, slots, and CSS custom properties available for the `m3e-input-chip-set` component.

#### ⚙️ Attributes

| Attribute  | Type      | Default | Description                                                               |
| ---------- | --------- | ------- | ------------------------------------------------------------------------- |
| `disabled` | `boolean` | `false` | Whether the element is disabled.                                          |
| `name`     | `string`  |         | The name that identifies the element when submitting the associated form. |
| `required` | `boolean` | `false` | Whether a value is required for the element.                              |
| `vertical` | `boolean` | `false` | Whether chips are stacked vertically.                                     |

#### 🔔 Events

| Event    | Description                                                |
| -------- | ---------------------------------------------------------- |
| `change` | Emitted when a chip is added to, or removed from, the set. |

#### 🧩 Slots

| Slot        | Description                                                 |
| ----------- | ----------------------------------------------------------- |
| _(default)_ | Renders the chips of the set.                               |
| `input`     | Renders the input element used to add new chips to the set. |

#### 🎛️ CSS Custom Properties

| Property                 | Description                      |
| ------------------------ | -------------------------------- |
| `--m3e-chip-set-spacing` | The spacing (gap) between chips. |

### 🗂️ Filter Chip

This section details the attributes, events, slots, and CSS custom properties available for the `m3e-filter-chip` component.

#### ⚙️ Attributes

| Attribute              | Type                         | Default      | Description                                   |
| ---------------------- | ---------------------------- | ------------ | --------------------------------------------- |
| `disabled`             | `boolean`                    | `false`      | Whether the chip is disabled.                 |
| `disabled-interactive` | `boolean`                    | `false`      | Whether the chip is disabled and interactive. |
| `selected`             | `boolean`                    | `false`      | Whether the chip is selected.                 |
| `value`                | `string`                     |              | The value of the chip.                        |
| `variant`              | `"outlined"` \| `"elevated"` | `"outlined"` | The appearance variant.                       |

#### 🧩 Slots

| Slot            | Description                              |
| --------------- | ---------------------------------------- |
| _(default)_     | Renders the label of the chip.           |
| `icon`          | Renders an icon before the chip's label. |
| `trailing-icon` | Renders an icon after the chip's label.  |

#### 🔔 Events

| Event    | Description                              |
| -------- | ---------------------------------------- |
| `input`  | Emitted when the selected state changes. |
| `change` | Emitted when the selected state changes. |

#### 🎛️ CSS Custom Properties

| Property                                         | Description                                                 |
| ------------------------------------------------ | ----------------------------------------------------------- |
| `--m3e-chip-container-shape`                     | Border radius of the chip container                         |
| `--m3e-chip-container-height`                    | Base height of the chip container before density adjustment |
| `--m3e-chip-label-text-font-size`                | Font size of the chip label text                            |
| `--m3e-chip-label-text-font-weight`              | Font weight of the chip label text                          |
| `--m3e-chip-label-text-line-height`              | Line height of the chip label text                          |
| `--m3e-chip-label-text-tracking`                 | Letter spacing of the chip label text                       |
| `--m3e-chip-icon-size`                           | Font size of leading/trailing icons                         |
| `--m3e-chip-spacing`                             | Horizontal gap between chip content elements                |
| `--m3e-chip-padding-start`                       | Default start padding when no icon is present               |
| `--m3e-chip-padding-end`                         | Default end padding when no trailing icon is present        |
| `--m3e-chip-with-icon-padding-start`             | Start padding when leading icon is present                  |
| `--m3e-chip-with-icon-padding-end`               | End padding when trailing icon is present                   |
| `--m3e-chip-disabled-label-text-color`           | Base color for disabled label text                          |
| `--m3e-chip-disabled-label-text-opacity`         | Opacity applied to disabled label text                      |
| `--m3e-chip-disabled-icon-color`                 | Base color for disabled icons                               |
| `--m3e-chip-disabled-icon-opacity`               | Opacity applied to disabled icons                           |
| `--m3e-elevated-chip-container-color`            | Background color for elevated variant                       |
| `--m3e-elevated-chip-elevation`                  | Elevation level for elevated variant                        |
| `--m3e-elevated-chip-hover-elevation`            | Elevation level on hover                                    |
| `--m3e-elevated-chip-disabled-container-color`   | Background color for disabled elevated variant              |
| `--m3e-elevated-chip-disabled-container-opacity` | Opacity applied to disabled elevated background             |
| `--m3e-elevated-chip-disabled-elevation`         | Elevation level for disabled elevated variant               |
| `--m3e-outlined-chip-outline-thickness`          | Outline thickness for outlined variant                      |
| `--m3e-outlined-chip-outline-color`              | Outline color for outlined variant                          |
| `--m3e-outlined-chip-disabled-outline-color`     | Outline color for disabled outlined variant                 |
| `--m3e-outlined-chip-disabled-outline-opacity`   | Opacity applied to disabled outline                         |
| `--m3e-chip-selected-outline-thickness`          | Outline thickness for selected state                        |
| `--m3e-chip-selected-label-text-color`           | Text color in selected state                                |
| `--m3e-chip-selected-container-color`            | Background color in selected state                          |
| `--m3e-chip-selected-container-hover-color`      | Hover state layer color in selected state                   |
| `--m3e-chip-selected-container-focus-color`      | Focus state layer color in selected state                   |
| `--m3e-chip-selected-hover-elevation`            | Elevation on hover in selected state                        |
| `--m3e-chip-selected-ripple-color`               | Ripple color in selected state                              |
| `--m3e-chip-selected-state-layer-focus-color`    | Focus state layer color in selected state                   |
| `--m3e-chip-selected-state-layer-hover-color`    | Hover state layer color in selected state                   |
| `--m3e-chip-selected-leading-icon-color`         | Leading icon color in selected state                        |
| `--m3e-chip-selected-trailing-icon-color`        | Trailing icon color in selected state                       |
| `--m3e-chip-unselected-label-text-color`         | Text color in unselected state                              |
| `--m3e-chip-unselected-ripple-color`             | Ripple color in unselected state                            |
| `--m3e-chip-unselected-state-layer-focus-color`  | Focus state layer color in unselected state                 |
| `--m3e-chip-unselected-state-layer-hover-color`  | Hover state layer color in unselected state                 |
| `--m3e-chip-unselected-leading-icon-color`       | Leading icon color in unselected state                      |
| `--m3e-chip-unselected-trailing-icon-color`      | Trailing icon color in unselected state                     |

### 🗂️ Filter Chip Set

This section details the attributes, events, slots, and CSS custom properties available for the `m3e-filter-chip-set` component.

#### ⚙️ Attributes

| Attribute                  | Type      | Default | Description                                                               |
| -------------------------- | --------- | ------- | ------------------------------------------------------------------------- |
| `disabled`                 | `boolean` | `false` | Whether the element is disabled.                                          |
| `hide-selection-indicator` | `boolean` | `false` | Whether to hide the selection indicator.                                  |
| `multi`                    | `boolean` | `false` | Whether multiple chips can be selected.                                   |
| `name`                     | `string`  |         | The name that identifies the element when submitting the associated form. |
| `vertical`                 | `boolean` | `false` | Whether chips are stacked vertically.                                     |

#### 🔔 Events

| Event    | Description                                        |
| -------- | -------------------------------------------------- |
| `input`  | Emitted when the selected state of a chip changes. |
| `change` | Emitted when the selected state of a chip changes. |

#### 🧩 Slots

| Slot        | Description                   |
| ----------- | ----------------------------- |
| _(default)_ | Renders the chips of the set. |

#### 🎛️ CSS Custom Properties

| Property                 | Description                      |
| ------------------------ | -------------------------------- |
| `--m3e-chip-set-spacing` | The spacing (gap) between chips. |

### 🗂️ Suggestion Chip

This section details the attributes, slots, and CSS custom properties available for the `m3e-suggestion-chip` component.

#### ⚙️ Attributes

| Attribute              | Type                         | Default      | Description                                   |
| ---------------------- | ---------------------------- | ------------ | --------------------------------------------- |
| `disabled`             | `boolean`                    | `false`      | Whether the chip is disabled.                 |
| `disabled-interactive` | `boolean`                    | `false`      | Whether the chip is disabled and interactive. |
| `download`             | `string`                     |              | Download attribute for link button.           |
| `href`                 | `string`                     |              | URL for the link button.                      |
| `name`                 | `string`                     |              | Name for form submission.                     |
| `rel`                  | `string`                     |              | Relationship for the link button.             |
| `target`               | `string`                     |              | Target for the link button.                   |
| `type`                 | `string`                     |              | Type of the element.                          |
| `value`                | `string`                     |              | The value of the chip.                        |
| `variant`              | `"outlined"` \| `"elevated"` | `"outlined"` | The appearance variant.                       |

#### 🧩 Slots

| Slot        | Description                              |
| ----------- | ---------------------------------------- |
| _(default)_ | Renders the label of the chip.           |
| `icon`      | Renders an icon before the chip's label. |

#### 🎛️ CSS Custom Properties

| Property                                         | Description                                                 |
| ------------------------------------------------ | ----------------------------------------------------------- |
| `--m3e-chip-container-shape`                     | Border radius of the chip container                         |
| `--m3e-chip-container-height`                    | Base height of the chip container before density adjustment |
| `--m3e-chip-label-text-font-size`                | Font size of the chip label text                            |
| `--m3e-chip-label-text-font-weight`              | Font weight of the chip label text                          |
| `--m3e-chip-label-text-line-height`              | Line height of the chip label text                          |
| `--m3e-chip-label-text-tracking`                 | Letter spacing of the chip label text                       |
| `--m3e-chip-label-text-color`                    | Label text color in default state                           |
| `--m3e-chip-icon-color`                          | Icon color in default state                                 |
| `--m3e-chip-icon-size`                           | Font size of leading/trailing icons                         |
| `--m3e-chip-spacing`                             | Horizontal gap between chip content elements                |
| `--m3e-chip-padding-start`                       | Default start padding when no icon is present               |
| `--m3e-chip-padding-end`                         | Default end padding when no trailing icon is present        |
| `--m3e-chip-with-icon-padding-start`             | Start padding when leading icon is present                  |
| `--m3e-chip-with-icon-padding-end`               | End padding when trailing icon is present                   |
| `--m3e-chip-disabled-label-text-color`           | Base color for disabled label text                          |
| `--m3e-chip-disabled-label-text-opacity`         | Opacity applied to disabled label text                      |
| `--m3e-chip-disabled-icon-color`                 | Base color for disabled icons                               |
| `--m3e-chip-disabled-icon-opacity`               | Opacity applied to disabled icons                           |
| `--m3e-elevated-chip-container-color`            | Background color for elevated variant                       |
| `--m3e-elevated-chip-elevation`                  | Elevation level for elevated variant                        |
| `--m3e-elevated-chip-hover-elevation`            | Elevation level on hover                                    |
| `--m3e-elevated-chip-disabled-container-color`   | Background color for disabled elevated variant              |
| `--m3e-elevated-chip-disabled-container-opacity` | Opacity applied to disabled elevated background             |
| `--m3e-elevated-chip-disabled-elevation`         | Elevation level for disabled elevated variant               |
| `--m3e-outlined-chip-outline-thickness`          | Outline thickness for outlined variant                      |
| `--m3e-outlined-chip-outline-color`              | Outline color for outlined variant                          |
| `--m3e-outlined-chip-disabled-outline-color`     | Outline color for disabled outlined variant                 |
| `--m3e-outlined-chip-disabled-outline-opacity`   | Opacity applied to disabled outline                         |
