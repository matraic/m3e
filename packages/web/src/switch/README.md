# @m3e/web/switch

The `m3e-switch` component is a semantic, accessible toggle control that reflects a binary state. Designed according to Material Design 3 guidelines, it supports shape transitions, and adaptive color theming across selected, unselected, and disabled states. The component responds to user interaction with smooth motion and expressive feedback. It supports optional icons (`none`, `selected`, or `both`) and integrates with form-associated behavior, emitting `input` and `change` events when toggled.

```ts
import "@m3e/web/switch";
```

## 🗂️ Elements

- `m3e-switch` — An on/off control that can be toggled by clicking.

## 🧪 Examples

The following example illustrates a switch wrapped by a `label`.

```html
<label>Switch label&nbsp;<m3e-switch></m3e-switch></label>
```

By default, icons are not presented. Use the `icons` attribute to control which icons to show. The next example illustrates showing both the unselected and selected icons.

```html
<label>Switch label&nbsp;<m3e-switch icons="both"></m3e-switch></label>
```

## 📖 API Reference

This section details the attributes, events and CSS custom properties available for the `m3e-switch` component.

### ⚙️ Attributes

| Attribute  | Type                                 | Default  | Description                                                               |
| ---------- | ------------------------------------ | -------- | ------------------------------------------------------------------------- |
| `checked`  | `boolean`                            | `false`  | Whether the element is checked.                                           |
| `disabled` | `boolean`                            | `false`  | Whether the element is disabled.                                          |
| `icons`    | `"none"` \| `"selected"` \| `"both"` | `"none"` | The icons to present.                                                     |
| `name`     | `string`                             |          | The name that identifies the element when submitting the associated form. |
| `value`    | `string`                             | `"on"`   | A string representing the value of the switch.                            |
| `icons`    | `boolean`                            | `false`  | Whether to present icons.                                                 |

#### 🔔 Events

| Event    | Description                             |
| -------- | --------------------------------------- |
| `input`  | Emitted when the checked state changes. |
| `change` | Emitted when the checked state changes. |

### 🎛️ CSS Custom Properties

| Property                                               | Description                                     |
| ------------------------------------------------------ | ----------------------------------------------- |
| `--m3e-switch-selected-icon-color`                     | Icon color when selected                        |
| `--m3e-switch-selected-icon-size`                      | Icon size when selected                         |
| `--m3e-switch-unselected-icon-color`                   | Icon color when unselected                      |
| `--m3e-switch-unselected-icon-size`                    | Icon size when unselected                       |
| `--m3e-switch-track-height`                            | Track height                                    |
| `--m3e-switch-track-width`                             | Track width                                     |
| `--m3e-switch-track-outline-color`                     | Track outline color                             |
| `--m3e-switch-track-outline-width`                     | Track outline thickness                         |
| `--m3e-switch-track-shape`                             | Track corner shape                              |
| `--m3e-switch-selected-track-color`                    | Track color when selected                       |
| `--m3e-switch-unselected-track-color`                  | Track color when unselected                     |
| `--m3e-switch-unselected-handle-height`                | Handle height when unselected                   |
| `--m3e-switch-unselected-handle-width`                 | Handle width when unselected                    |
| `--m3e-switch-with-icon-handle-height`                 | Handle height when icons are present            |
| `--m3e-switch-with-icon-handle-width`                  | Handle width when icons are present             |
| `--m3e-switch-selected-handle-height`                  | Handle height when selected                     |
| `--m3e-switch-selected-handle-width`                   | Handle width when selected                      |
| `--m3e-switch-pressed-handle-height`                   | Handle height when pressed                      |
| `--m3e-switch-pressed-handle-width`                    | Handle width when pressed                       |
| `--m3e-switch-handle-shape`                            | Handle corner shape                             |
| `--m3e-switch-selected-handle-color`                   | Handle color when selected                      |
| `--m3e-switch-unselected-handle-color`                 | Handle color when unselected                    |
| `--m3e-switch-state-layer-size`                        | Diameter of the state layer overlay             |
| `--m3e-switch-state-layer-shape`                       | Corner shape of the state layer                 |
| `--m3e-switch-disabled-selected-icon-color`            | Icon color when selected and disabled           |
| `--m3e-switch-disabled-selected-icon-opacity`          | Icon opacity when selected and disabled         |
| `--m3e-switch-disabled-unselected-icon-color`          | Icon color when unselected and disabled         |
| `--m3e-switch-disabled-unselected-icon-opacity`        | Icon opacity when unselected and disabled       |
| `--m3e-switch-disabled-track-opacity`                  | Track opacity when disabled                     |
| `--m3e-switch-disabled-selected-track-color`           | Track color when selected and disabled          |
| `--m3e-switch-disabled-unselected-track-color`         | Track color when unselected and disabled        |
| `--m3e-switch-disabled-unselected-track-outline-color` | Outline color when unselected and disabled      |
| `--m3e-switch-disabled-unselected-handle-opacity`      | Handle opacity when unselected and disabled     |
| `--m3e-switch-disabled-selected-handle-opacity`        | Handle opacity when selected and disabled       |
| `--m3e-switch-disabled-selected-handle-color`          | Handle color when selected and disabled         |
| `--m3e-switch-disabled-unselected-handle-color`        | Handle color when unselected and disabled       |
| `--m3e-switch-selected-hover-icon-color`               | Icon color when selected and hovered            |
| `--m3e-switch-unselected-hover-icon-color`             | Icon color when unselected and hovered          |
| `--m3e-switch-selected-hover-track-color`              | Track color when selected and hovered           |
| `--m3e-switch-selected-hover-state-layer-color`        | State layer color when selected and hovered     |
| `--m3e-switch-selected-hover-state-layer-opacity`      | State layer opacity when selected and hovered   |
| `--m3e-switch-unselected-hover-track-color`            | Track color when unselected and hovered         |
| `--m3e-switch-unselected-hover-track-outline-color`    | Outline color when unselected and hovered       |
| `--m3e-switch-unselected-hover-state-layer-color`      | State layer color when unselected and hovered   |
| `--m3e-switch-unselected-hover-state-layer-opacity`    | State layer opacity when unselected and hovered |
| `--m3e-switch-selected-hover-handle-color`             | Handle color when selected and hovered          |
| `--m3e-switch-unselected-hover-handle-color`           | Handle color when unselected and hovered        |
| `--m3e-switch-selected-focus-icon-color`               | Icon color when selected and focused            |
| `--m3e-switch-unselected-focus-icon-color`             | Icon color when unselected and focused          |
| `--m3e-switch-selected-focus-track-color`              | Track color when selected and focused           |
| `--m3e-switch-selected-focus-state-layer-color`        | State layer color when selected and focused     |
| `--m3e-switch-selected-focus-state-layer-opacity`      | State layer opacity when selected and focused   |
| `--m3e-switch-unselected-focus-track-color`            | Track color when unselected and focused         |
| `--m3e-switch-unselected-focus-track-outline-color`    | Outline color when unselected and focused       |
| `--m3e-switch-unselected-focus-state-layer-color`      | State layer color when unselected and focused   |
| `--m3e-switch-unselected-focus-state-layer-opacity`    | State layer opacity when unselected and focused |
| `--m3e-switch-selected-focus-handle-color`             | Handle color when selected and focused          |
| `--m3e-switch-unselected-focus-handle-color`           | Handle color when unselected and focused        |
| `--m3e-switch-selected-pressed-icon-color`             | Icon color when selected and pressed            |
| `--m3e-switch-unselected-pressed-icon-color`           | Icon color when unselected and pressed          |
| `--m3e-switch-selected-pressed-track-color`            | Track color when selected and pressed           |
| `--m3e-switch-selected-pressed-state-layer-color`      | State layer color when selected and pressed     |
| `--m3e-switch-selected-pressed-state-layer-opacity`    | State layer opacity when selected and pressed   |
| `--m3e-switch-unselected-pressed-track-color`          | Track color when unselected and pressed         |
| `--m3e-switch-unselected-pressed-track-outline-color`  | Outline color when unselected and pressed       |
| `--m3e-switch-unselected-pressed-state-layer-color`    | State layer color when unselected and pressed   |
| `--m3e-switch-unselected-pressed-state-layer-opacity`  | State layer opacity when unselected and pressed |
| `--m3e-switch-selected-pressed-handle-color`           | Handle color when selected and pressed          |
| `--m3e-switch-unselected-pressed-handle-color`         | Handle color when unselected and pressed        |
