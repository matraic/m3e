# @m3e/web/stepper

The `m3e-stepper` component orchestrates a structured, wizard-like workflow by dividing content into discrete, navigable steps. It supports horizontal and vertical orientations, linear progression, and configurable label and header positioning.

```ts
import "@m3e/web/stepper";
```

## 🗂️ Elements

- `m3e-step` — A step in a wizard-like workflow.
- `m3e-step-panel` — A panel presented for a step in a wizard-like workflow.
- `m3e-stepper` — Provides a wizard-like workflow by dividing content into logical steps.
- `m3e-stepper-next` — An element, nested within a clickable element, used to move a stepper to the next step.
- `m3e-stepper-previous` — An element, nested within a clickable element, used to move a stepper to the previous step.
- `m3e-stepper-reset` — An element, nested within a clickable element, used to reset a stepper to its initial state.

## 🧪 Examples

The following example demonstrates a linear multi-step form flow using the `m3e-stepper` component. Each `m3e-step` defines a navigable step label, linked to its corresponding `m3e-step-panel` via the `for` attribute. Navigation is orchestrated using the `m3e-stepper-next`, `m3e-stepper-previous`, and `m3e-stepper-reset` components.

```html
<m3e-stepper>
  <m3e-step for="step1">Fill out your name</m3e-step>
  <m3e-step for="step2">Fill out your address</m3e-step>
  <m3e-step for="step3">Done</m3e-step>
  <m3e-step-panel id="step1">
    <form>
      <m3e-form-field>
        <label slot="label" for="name">Name</label>
        <input name="name" id="name" required />
      </m3e-form-field>
    </form>
    <div slot="actions">
      <m3e-button><m3e-stepper-next>Next</m3e-stepper-next></m3e-button>
    </div>
  </m3e-step-panel>
  <m3e-step-panel id="step2">
    <form>
      <m3e-form-field>
        <label slot="label" for="address">Address</label>
        <input name="address" id="address" required />
      </m3e-form-field>
    </form>
    <div slot="actions">
      <m3e-button><m3e-stepper-previous>Back</m3e-stepper-previous></m3e-button>
      <m3e-button><m3e-stepper-next>Next</m3e-stepper-next></m3e-button>
    </div>
  </m3e-step-panel>
  <m3e-step-panel id="step3"
    >Done
    <div slot="actions">
      <m3e-button><m3e-stepper-previous>Back</m3e-stepper-previous></m3e-button>
      <m3e-button><m3e-stepper-reset>Reset</m3e-stepper-reset></m3e-button>
    </div>
  </m3e-step-panel>
</m3e-stepper>
```

## 📖 API Reference

### 🗂️ m3e-step

This section details the attributes, slots, events and CSS custom properties available for the `m3e-step` component.

#### 🛠️ Attributes

| Attribute   | Type      | Default | Description                                                                  |
| ----------- | --------- | ------- | ---------------------------------------------------------------------------- |
| `completed` | `boolean` | `false` | Whether the step has been completed.                                         |
| `disabled`  | `boolean` | `false` | Whether the element is disabled.                                             |
| `editable`  | `boolean` | `false` | Whether the step is editable and users can return to it after completion.    |
| `for`       | `string`  |         | The identifier of the interactive control to which this element is attached. |
| `optional`  | `boolean` | `false` | Whether the step is optional.                                                |
| `selected`  | `boolean` | `false` | Whether the element is selected.                                             |

#### 🔔 Events

| Event    | Description                              |
| -------- | ---------------------------------------- |
| `input`  | Emitted when the selected state changes. |
| `change` | Emitted when the selected state changes. |

#### 🧩 Slots

| Slot         | Description                                    |
| ------------ | ---------------------------------------------- |
| _(default)_  | Renders the label of the step.                 |
| `icon`       | Renders the icon of the step.                  |
| `done-icon`  | Renders the icon of a completed step.          |
| `edit-icon`  | Renders the icon of a completed editable step. |
| `error-icon` | Renders the icon of an invalid step.           |
| `hint`       | Renders the hint text of the step.             |
| `error`      | Renders the error message for an invalid step. |

#### 🎛️ CSS Custom Properties

| Property                                     | Description                                                          |
| -------------------------------------------- | -------------------------------------------------------------------- |
| `--m3e-step-shape`                           | Border radius of the step container, defining its visual shape.      |
| `--m3e-step-padding`                         | Internal padding of the step container, used for layout spacing.     |
| `--m3e-step-icon-shape`                      | Border radius of the icon container, controlling its geometric form. |
| `--m3e-step-icon-size`                       | Width and height of the icon container and icon glyph.               |
| `--m3e-step-selected-icon-container-color`   | Background color of the icon when the step is selected.              |
| `--m3e-step-selected-icon-color`             | Foreground color of the icon when the step is selected.              |
| `--m3e-step-completed-icon-container-color`  | Background color of the icon when the step is completed.             |
| `--m3e-step-completed-icon-color`            | Foreground color of the icon when the step is completed.             |
| `--m3e-step-unselected-icon-container-color` | Background color of the icon when the step is inactive.              |
| `--m3e-step-unselected-icon-color`           | Foreground color of the icon when the step is inactive.              |
| `--m3e-step-icon-error-color`                | Foreground color of the icon when the step is invalid.               |
| `--m3e-step-disabled-icon-container-color`   | Base color used to mix the disabled icon background.                 |
| `--m3e-step-disabled-icon-color`             | Base color used to mix the disabled icon foreground.                 |
| `--m3e-step-label-color`                     | Text color of the step label in its default state.                   |
| `--m3e-step-label-error-color`               | Text color of the step label when the step is invalid.               |
| `--m3e-step-disabled-label-color`            | Base color used to mix the disabled label foreground.                |
| `--m3e-step-font-size`                       | Font size of the step label.                                         |
| `--m3e-step-font-weight`                     | Font weight of the step label.                                       |
| `--m3e-step-line-height`                     | Line height of the step label.                                       |
| `--m3e-step-tracking`                        | Letter spacing of the step label.                                    |
| `--m3e-step-icon-label-space`                | Gap between icon and label.                                          |
| `--m3e-step-hint-font-size`                  | Font size of hint and error messages.                                |
| `--m3e-step-hint-font-weight`                | Font weight of hint and error messages.                              |
| `--m3e-step-hint-line-height`                | Line height of hint and error messages.                              |
| `--m3e-step-hint-tracking`                   | Letter spacing of hint and error messages.                           |
| `--m3e-step-hint-color`                      | Text color of hint messages in valid state.                          |
| `--m3e-step-disabled-hint-color`             | Base color used to mix the disabled hint foreground.                 |

### 🗂️ m3e-step-panel

This section details the slots and CSS custom properties available for the `m3e-step-panel` component.

#### 🧩 Slots

| Slot        | Description                           |
| ----------- | ------------------------------------- |
| _(default)_ | Renders the content of the panel.     |
| `actions`   | Renders the actions bar of the panel. |

#### 🎛️ CSS Custom Properties

| Property                          | Description                                                                        |
| --------------------------------- | ---------------------------------------------------------------------------------- |
| `--m3e-step-panel-padding`        | Padding inside the step panel container, defining internal spacing around content. |
| `--m3e-step-panel-spacing`        | Vertical gap between stacked elements within the step panel.                       |
| `--m3e-step-panel-actions-height` | Minimum height of the slotted actions container.                                   |

### 🗂️ m3e-stepper

This section details the attributes, slots, events and CSS custom properties available for the `m3e-stepper` component.

#### 🛠️ Attributes

| Attribute         | Type                                       | Default        | Description                                                      |
| ----------------- | ------------------------------------------ | -------------- | ---------------------------------------------------------------- |
| `header-position` | `"above"` \|`"below"`                      | `"above"`      | The position of the step header, when oriented horizontally.     |
| `label-position`  | `"below"` \|`"end"`                        | `"end"`        | The position of the step labels, when oriented horizontally.     |
| `linear`          | `boolean`                                  | `false`        | Whether the validity of previous steps should be checked or not. |
| `orientation`     | `"horizontal"` \| `"vertical"` \| `"auto"` | `"horizontal"` | The orientation of the stepper.                                  |

#### 🔔 Events

| Event    | Description                             |
| -------- | --------------------------------------- |
| `change` | Emitted when the selected step changes. |

#### 🧩 Slots

| Slot    | Description      |
| ------- | ---------------- |
| `step`  | Renders a step.  |
| `panel` | Renders a panel. |

#### 🎛️ CSS Custom Properties

| Property                       | Description                                            |
| ------------------------------ | ------------------------------------------------------ |
| `--m3e-step-divider-thickness` | Thickness of the divider line between steps.           |
| `--m3e-step-divider-color`     | Color of the divider line between steps.               |
| `--m3e-step-divider-inset`     | Inset offset for divider alignment within step layout. |

### 🗂️ m3e-stepper-next

This section details the slots available for the `m3e-stepper-next` component.

#### 🧩 Slots

| Slot        | Description                        |
| ----------- | ---------------------------------- |
| _(default)_ | Renders the content of the action. |

### 🗂️ m3e-stepper-previous

This section details the slots available for the `m3e-stepper-previous` component.

#### 🧩 Slots

| Slot        | Description                        |
| ----------- | ---------------------------------- |
| _(default)_ | Renders the content of the action. |

### 🗂️ m3e-stepper-reset

This section details the slots available for the `m3e-stepper-reset` component.

#### 🧩 Slots

| Slot        | Description                        |
| ----------- | ---------------------------------- |
| _(default)_ | Renders the content of the action. |
