# @m3e/web/nav-bar

The `m3e-nav-bar` and `m3e-nav-item` components provide a navigation bar and interactive items for switching between primary destinations in your application. Designed for smaller devices, they support 3-5 interactive items, orientation, selection, and extensive theming via CSS custom properties.

```ts
import "@m3e/web/nav-bar";
```

## 🗂️ Elements

- `m3e-nav-bar` — A horizontal bar, typically used on smaller devices, that allows a user to switch between 3-5 views.
- `m3e-nav-item` — An item, placed in a navigation bar or rail, used to navigate to destinations in an application.

## 🧪 Example

```html
<m3e-nav-bar>
  <m3e-nav-item><m3e-icon slot="icon" name="news"></m3e-icon>News</m3e-nav-item>
  <m3e-nav-item><m3e-icon slot="icon" name="globe"></m3e-icon>Global</m3e-nav-item>
  <m3e-nav-item><m3e-icon slot="icon" name="star"></m3e-icon>For you</m3e-nav-item>
  <m3e-nav-item><m3e-icon slot="icon" name="newsstand"></m3e-icon>Trending</m3e-nav-item>
</m3e-nav-bar>
```

## 📖 API Reference

### 🗂️ m3e-nav-bar

This section details the attributes, slots, events and CSS custom properties available for the `m3e-nav-bar` component.

#### ⚙️ Attributes

| Attribute | Type                                    | Default     | Description                                       |
| --------- | --------------------------------------- | ----------- | ------------------------------------------------- |
| `mode`    | `"compact"` \| `"expanded"` \| `"auto"` | `"compact"` | The mode in which items in the bar are presented. |

#### 🔔 Events

| Event         | Description                                              |
| ------------- | -------------------------------------------------------- |
| `beforeinput` | Dispatched before the selected state of an item changes. |
| `input`       | Dispatched when the selected state of an item changes.   |
| `change`      | Dispatched when the selected state of an item changes    |

#### 🧩 Slots

| Slot        | Description                   |
| ----------- | ----------------------------- |
| _(default)_ | Renders the items of the bar. |

#### 🎛️ CSS Custom Properties

| Property                                           | Description                                                                                                    |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `--m3e-nav-bar-height`                             | Height of the navigation bar.                                                                                  |
| `--m3e-nav-bar-container-color`                    | Background color of the navigation bar.                                                                        |
| `--m3e-nav-bar-vertical-item-width`                | Minimum width a vertical (compact) item may shrink to. Defaults to the active indicator width, at least 48px. |
| `--m3e-nav-bar-horizontal-item-width`              | Minimum width of a horizontal (expanded) item. Defaults to `7rem`.                                            |
| `--m3e-nav-bar-horizontal-nav-item-leading-space`  | Leading space for horizontal nav items.                                                                       |
| `--m3e-nav-bar-horizontal-nav-item-trailing-space` | Trailing space for horizontal nav items.                                                                      |

## 📐 Fitting destinations to the bar

The bar sizes its destinations to the space it has, so a bar with the supported 3-5 destinations
fits within its own width at phone widths without any configuration.

**Compact mode** (vertical items, the default) — items divide the bar's width equally. They shrink
as the bar narrows, down to a floor of `--m3e-nav-bar-vertical-item-width`, which defaults to the
active indicator width (`3.5rem`) and is never less than the 48px minimum touch target. A label too
long for a narrow item wraps, up to two lines; beyond that it is clipped. Five destinations
therefore fit inside a 320px-wide bar (64px each) and remain fully tappable.

**Expanded mode** (horizontal items) — items are sized to their content, with a minimum of
`--m3e-nav-bar-horizontal-item-width` (`7rem`), and the set is centred in the bar. Because a
horizontal label is not wrapped or truncated, a set of long labels can need more width than a phone
provides. In that case the bar scrolls horizontally rather than painting destinations outside
itself, so every destination stays reachable. Prefer `mode="auto"`, which selects compact
presentation at compact widths and avoids the scroll.

In both modes the bar never renders a destination outside its own box: it either fits the
destinations or scrolls them.

### 🗂️ m3e-nav-item

This section details the attributes, slots, events and CSS custom properties available for the `m3e-nav-item` component.

#### ⚙️ Attributes

| Attribute              | Type                           | Default      | Description                                  |
| ---------------------- | ------------------------------ | ------------ | -------------------------------------------- |
| `disabled`             | `boolean`                      | `false`      | Whether the item is disabled.                |
| `disabled-interactive` | `boolean`                      | `false`      | Whether the item is disabled and interactive |
| `download`             | `string`                       |              | Download target for link button.             |
| `href`                 | `string`                       |              | URL for the link button.                     |
| `orientation`          | `"vertical"` \| `"horizontal"` | `"vertical"` | The layout orientation of the item.          |
| `rel`                  | `string`                       |              | Relationship for the link button.            |
| `selected`             | `boolean`                      | `false`      | Whether the item is selected.                |
| `target`               | `string`                       |              | Target for the link button.                  |

#### 🔔 Events

| Event         | Description                                   |
| ------------- | --------------------------------------------- |
| `beforeinput` | Dispatched before the selected state changes. |
| `input`       | Dispatched when the selected state changes.   |
| `change`      | Dispatched when the selected state changes.   |

#### 🧩 Slots

| Slot            | Description                                 |
| --------------- | ------------------------------------------- |
| _(default)_     | Renders the label of the item.              |
| `icon`          | Renders the icon of the item.               |
| `selected-icon` | Renders the icon when the item is selected. |

#### 🎛️ CSS Custom Properties

| Property                                            | Description                                  |
| --------------------------------------------------- | -------------------------------------------- |
| `--m3e-nav-item-label-text-font-size`               | Font size for the label text.                |
| `--m3e-nav-item-label-text-font-weight`             | Font weight for the label text.              |
| `--m3e-nav-item-label-text-line-height`             | Line height for the label text.              |
| `--m3e-nav-item-label-text-tracking`                | Letter spacing for the label text.           |
| `--m3e-nav-item-shape`                              | Border radius of the nav item.               |
| `--m3e-nav-item-icon-size`                          | Size of the icon.                            |
| `--m3e-nav-item-spacing`                            | Spacing between icon and label.              |
| `--m3e-nav-item-inactive-label-text-color`          | Color of the label text when inactive.       |
| `--m3e-nav-item-inactive-icon-color`                | Color of the icon when inactive.             |
| `--m3e-nav-item-inactive-hover-state-layer-color`   | State layer color on hover when inactive.    |
| `--m3e-nav-item-inactive-focus-state-layer-color`   | State layer color on focus when inactive.    |
| `--m3e-nav-item-inactive-pressed-state-layer-color` | State layer color on press when inactive.    |
| `--m3e-nav-item-active-label-text-color`            | Color of the label text when active.         |
| `--m3e-nav-item-active-icon-color`                  | Color of the icon when active.               |
| `--m3e-nav-item-active-container-color`             | Container color when active.                 |
| `--m3e-nav-item-active-hover-state-layer-color`     | State layer color on hover when active.      |
| `--m3e-nav-item-active-focus-state-layer-color`     | State layer color on focus when active.      |
| `--m3e-nav-item-active-pressed-state-layer-color`   | State layer color on press when active.      |
| `--m3e-nav-item-focus-ring-shape`                   | Border radius for the focus ring.            |
| `--m3e-nav-item-disabled-label-text-color`          | Color of the label text when disabled.       |
| `--m3e-nav-item-disabled-label-text-opacity`        | Opacity of the label text when disabled.     |
| `--m3e-nav-item-disabled-icon-color`                | Color of the icon when disabled.             |
| `--m3e-nav-item-disabled-icon-opacity`              | Opacity of the icon when disabled.           |
| `--m3e-horizontal-nav-item-padding`                 | Padding for horizontal orientation.          |
| `--m3e-horizontal-nav-item-active-indicator-height` | Height of the active indicator (horizontal). |
| `--m3e-vertical-nav-item-active-indicator-width`    | Width of the active indicator (vertical).    |
| `--m3e-vertical-nav-item-active-indicator-height`   | Height of the active indicator (vertical).   |
| `--m3e-vertical-nav-item-active-indicator-margin`   | Margin for the active indicator (vertical).  |
