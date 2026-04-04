# @m3e/web/search

The `m3e-search-bar` and `m3e-search-view` components provide a Material 3 expressive search experience. The search bar offers a prominent entry point for text input, while the search view presents suggestions, history, and results in contained, docked, or full screen configurations. Both components support ARIA accessibility, keyboard interaction, and theming via CSS custom properties.

```ts
import "@m3e/web/search";
```

## 🗂️ Elements

- m3e-search-bar — A bar that provides a prominent entry point for search.
- m3e-search-view — A surface that presents suggestions and results for a search.

## 🧪 Examples

The following example illustrates typical usage of a `m3e-search-bar` with a leading icon and the
ability to clear the current search text.

```html
<m3e-search-bar clearable>
  <m3e-icon name="search" slot="leading"></m3e-icon>
  <input slot="input" placeholder="Search..." />
</m3e-search-bar>
```

The next example shows a contained `m3e-search-view` in docked mode with a simple set of search results.

```html
<m3e-search-view mode="docked" contained>
  <input slot="input" placeholder="Search..." />
  <m3e-list>
    <m3e-list-item>Result One</m3e-list-item>
    <m3e-list-item>Result Two</m3e-list-item>
    <m3e-list-item>Result Three</m3e-list-item>
  </m3e-list>
</m3e-search-view>
```

## 📖 API Reference

### 🗂️ m3e-search-bar

This section details the attributes, slots, events and CSS custom properties available for the `m3e-search-bar` component.

#### ⚙️ Attributes

| Attribute     | Type      | Default   | Description                                                      |
| ------------- | --------- | --------- | ---------------------------------------------------------------- |
| `clearable`   | `boolean` | `false`   | Whether the bar presents a button used to clear the search term. |
| `clear-label` | `string`  | `"Clear"` | The accessible label for the clear button.                       |

#### 🔔 Events

| Event   | Description                                 |
| ------- | ------------------------------------------- |
| `clear` | Dispatched when the search term is cleared. |

#### 🧩 Slots

| Slot       | Description                                  |
| ---------- | -------------------------------------------- |
| `leading`  | Renders content before the input of the bar. |
| `input`    | Renders the input of the bar.                |
| `trailing` | Renders content after the input of the bar.  |

#### 🎛️ CSS Custom Properties

| Property                                          | Description                                        |
| ------------------------------------------------- | -------------------------------------------------- |
| `--m3e-search-bar-container-color`                | Background color of the search bar container.      |
| `--m3e-search-bar-leading-icon-color`             | Color of the leading icon.                         |
| `--m3e-search-bar-trailing-icon-color`            | Color of the trailing icon.                        |
| `--m3e-search-bar-container-height`               | Height of the search bar container.                |
| `--m3e-search-bar-container-shape`                | Shape (border radius) of the search bar container. |
| `--m3e-search-bar-icon-size`                      | Size of icons inside the search bar.               |
| `--m3e-search-bar-supporting-text-color`          | Color of the supporting text.                      |
| `--m3e-search-bar-supporting-text-font-size`      | Font size of the supporting text.                  |
| `--m3e-search-bar-supporting-text-font-weight`    | Font weight of the supporting text.                |
| `--m3e-search-bar-supporting-text-line-height`    | Line height of the supporting text.                |
| `--m3e-search-bar-supporting-text-tracking`       | Letter spacing of the supporting text.             |
| `--m3e-search-bar-input-color`                    | Color of the input text.                           |
| `--m3e-search-bar-input-text-font-size`           | Font size of the input text.                       |
| `--m3e-search-bar-input-text-font-weight`         | Font weight of the input text.                     |
| `--m3e-search-bar-input-text-line-height`         | Line height of the input text.                     |
| `--m3e-search-bar-input-text-tracking`            | Letter spacing of the input text.                  |
| `--m3e-search-bar-leading-space`                  | Space before the leading icon.                     |
| `--m3e-search-bar-trailing-space`                 | Space after the trailing icon.                     |
| `--m3e-search-bar-no-actions-leading-space`       | Leading padding when no actions are present.       |
| `--m3e-search-bar-no-actions-trailing-space`      | Trailing padding when no actions are present.      |
| `--m3e-search-bar-leading-actions-trailing-space` | Space between leading actions and the input.       |
| `--m3e-search-bar-trailing-actions-leading-space` | Space between the input and trailing actions.      |
| `--m3e-search-bar-actions-gap`                    | Gap between action icons.                          |

### 🗂️ m3e-search-view

This section details the attributes, slots, events and CSS custom properties available for the `m3e-search-view` component.

#### ⚙️ Attributes

| Attribute     | Type      | Default    | Description                                                             |
| ------------- | --------- | ---------- | ----------------------------------------------------------------------- |
| `contained`   | `boolean` | `false`    | Whether the view features a persistent, filled search container.        |
| `mode`        | `string`  | `"docked"` | The behavior mode of the view (`docked` or `fullscreen`).               |
| `open`        | `boolean` | `false`    | Whether the view is expanded to show results.                           |
| `clear-label` | `string`  | `"Clear"`  | The accessible label given to the button used to clear the search term. |
| `close-label` | `string`  | `"Close"`  | The accessible label given to the button used to collapse the view.     |

#### 🔔 Events

| Event          | Description                                                            |
| -------------- | ---------------------------------------------------------------------- |
| `clear`        | Dispatched when the search term is cleared.                            |
| `query`        | Dispatched when the view is opened or when the user modifies the term. |
| `beforetoggle` | Dispatched before the toggle state changes.                            |
| `toggle`       | Dispatched after the toggle state has changed.                         |

#### 🧩 Slots

| Slot        | Description                              |
| ----------- | ---------------------------------------- |
| `leading`   | Renders content before the input.        |
| `input`     | Renders the input element.               |
| `trailing`  | Renders content after the input.         |
| _(default)_ | Renders the results content of the view. |

#### 🎛️ CSS Custom Properties

| Property                                                       | Description                                               |
| -------------------------------------------------------------- | --------------------------------------------------------- |
| `--m3e-search-view-container-color`                            | Background color of the view container.                   |
| `--m3e-search-view-contained-container-color`                  | Background color of the contained view container.         |
| `--m3e-search-view-divider-color`                              | Color of the divider separating header and results.       |
| `--m3e-search-view-divider-thickness`                          | Thickness of the divider separating header and results.   |
| `--m3e-search-view-full-screen-container-shape`                | Shape of the fullscreen view container.                   |
| `--m3e-search-view-full-screen-header-container-height`        | Height of the header container in fullscreen mode.        |
| `--m3e-search-view-docked-container-shape`                     | Shape of the docked view container.                       |
| `--m3e-search-view-docked-header-container-height`             | Height of the header container in docked mode.            |
| `--m3e-search-view-contained-leading-margin`                   | Leading margin for the contained view.                    |
| `--m3e-search-view-contained-trailing-margin`                  | Trailing margin for the contained view.                   |
| `--m3e-search-view-contained-focused-leading-margin`           | Leading margin when the contained view is focused.        |
| `--m3e-search-view-contained-focused-trailing-margin`          | Trailing margin when the contained view is focused.       |
| `--m3e-search-view-contained-docked-bar-results-gap`           | Gap between the contained docked bar and results.         |
| `--m3e-search-view-contained-docked-results-shape`             | Shape of the results container in contained docked mode.  |
| `--m3e-search-view-contained-docked-bar-shape`                 | Shape of the bar in contained docked mode.                |
| `--m3e-search-view-contained-full-screen-bar-container-height` | Height of the bar container in contained fullscreen mode. |
| `--m3e-search-view-docked-container-min-height`                | Minimum height of the docked view container.              |
| `--m3e-search-view-docked-container-max-height`                | Maximum height of the docked view container.              |
| `--m3e-search-view-contained-docked-results-space`             | Space above the results in contained docked mode.         |
| `--m3e-search-view-docked-results-bottom-space`                | Space below the results in docked mode.                   |
| `--m3e-search-view-docked-scrim-color`                         | Color of the scrim behind the docked view.                |
| `--m3e-search-view-docked-scrim-opacity`                       | Opacity of the scrim behind the docked view.              |
