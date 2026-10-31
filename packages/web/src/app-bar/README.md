# @m3e/web/app-bar

The `m3e-app-bar` component is a prominent user interface component that provides consistent access to key actions, navigation, and contextual information at the top of an application screen. Designed according to Material 3 principles, it organizes content with clear hierarchy, supports dynamic color, elevation, alignment, and adapts to scrolling behavior.

```ts
import "@m3e/web/app-bar";
```

## 🗂️ Elements

- `m3e-app-bar` — A bar, placed a the top of a screen, used to help users navigate through an application.

## 🧪 Examples

The following example illustrates a medium size `m3e-app-bar` consisting of a leading button, title, subtitle, and trailing button.

> This example uses the `@m3e/icon` package to present Material Design symbols, but any icon package can be substituted depending on your design system or preferences

```html
<m3e-app-bar size="medium">
  <m3e-icon-button slot="leading-icon" aria-label="Back">
    <m3e-icon name="arrow_back"></m3e-icon>
  </m3e-icon-button>
  <span slot="title">Top 10 hiking trails</span>
  <span slot="subtitle">Discover popular trails</span>
  <m3e-icon-button slot="trailing-icon" aria-label="Bookmark" variant="tonal">
    <m3e-icon name="bookmark" filled></m3e-icon>
  </m3e-icon-button>
</m3e-app-bar>
```

The next example illustrates how to attach an app bar to a parent scroll container to produce a color change on scroll. In this example, the `for` attribute is used to attach a sticky-positioned `m3e-app-bar` to a parenting container styled to overflow vertically. When scrolled, the app bar will automatically transition to its on-scroll state.

```html
<div style="overflow-y: auto; height: 300px" id="scrollContainer">
  <m3e-app-bar for="scrollContainer" style="position: sticky; top: 0">
    <span slot="title">Title</span>
  </m3e-app-bar>
  <div style="height: 400px; display: flex; align-items: center; justify-content: center">I am scrolling content</div>
</div>
```

The `scroll-behavior` attribute selects the behavior applied on scroll. The default, `elevate`, is shown above. When set to `compress`, medium and large app bars collapse to a small app bar in step with the scroll position, instead of elevating. The title and subtitle slide and fade out as the bar collapses, and back in as it expands. The container color and elevation blend toward their on-scroll values (`--m3e-app-bar-container-color-on-scroll` and `--m3e-app-bar-container-elevation-on-scroll`) as the bar collapses. By default the on-scroll elevation is flat, so only the color changes; set the elevation token to add a shadow. Once scrolling goes idle mid-collapse, the bar finishes the collapse in the direction of the last scroll, moving the scroll position by the same amount so the content stays in step. The host keeps its expanded height so the layout does not shift. Small app bars have nothing to collapse, so `compress` has no effect on them.

```html
<div style="overflow-y: auto; height: 300px" id="scrollContainer">
  <m3e-app-bar for="scrollContainer" size="large" scroll-behavior="compress" style="position: sticky; top: 0">
    <span slot="title">Title</span>
    <span slot="subtitle">Subtitle</span>
  </m3e-app-bar>
  <div style="height: 400px; display: flex; align-items: center; justify-content: center">I am scrolling content</div>
</div>
```

## 📖 API Reference

This section details the attributes, slots and CSS custom properties available for the `m3e-app-bar` component.

### ⚙️ Attributes

| Attribute         | Type                             | Default     | Description                                                                  |
| ----------------- | -------------------------------- | ----------- | ---------------------------------------------------------------------------- |
| `centered`        | `boolean`                        | `false`     | Whether the title and subtitle are centered.                                 |
| `size`            | `"small" \| "medium" \| "large"` | `"small"`   | The size of the bar.                                                         |
| `for`             | `string`                         |             | The identifier of the interactive control to which this element is attached. |
| `scroll-behavior` | `"elevate" \| "compress"`        | `"elevate"` | The behavior applied when the attached scroll container is scrolled.         |

### 🧩 Slots

| Slot            | Description                                                       |
| --------------- | ----------------------------------------------------------------- |
| `leading`       | Renders content positioned at the start of the bar.               |
| `subtitle`      | Renders the subtitle of the bar.                                  |
| `title`         | Renders the title of the bar.                                     |
| `trailing`      | Renders one or more action buttons aligned to the end of the bar. |
| `leading-icon`  | **Deprecated:** use the `leading` slot.                           |
| `trailing-icon` | **Deprecated:** use the `trailing` slot.                          |

### 🎛️ CSS Custom Properties

The `m3e-app-bar` component supports theming via scoped CSS custom properties for layout, color, elevation, and interaction states.

#### Container & Color Properties

| Property                                      | Description                                  |
| --------------------------------------------- | -------------------------------------------- |
| `--m3e-app-bar-container-color`               | Background color of the app bar container.   |
| `--m3e-app-bar-container-color-on-scroll`     | Background color when scrolled.              |
| `--m3e-app-bar-container-elevation`           | Elevation (shadow) of the app bar container. |
| `--m3e-app-bar-container-elevation-on-scroll` | Elevation (shadow) when scrolled.            |
| `--m3e-app-bar-title-text-color`              | Color of the app bar title text.             |
| `--m3e-app-bar-subtitle-text-color`           | Color of the app bar subtitle text.          |
| `--m3e-app-bar-padding-left`                  | Left padding for the app bar container.      |
| `--m3e-app-bar-padding-right`                 | Right padding for the app bar container.     |

#### Small Size Properties

| Property                                        | Description                                      |
| ----------------------------------------------- | ------------------------------------------------ |
| `--m3e-app-bar-small-container-height`          | Height of the small app bar container.           |
| `--m3e-app-bar-small-title-text-font-size`      | Font size for the small app bar title text.      |
| `--m3e-app-bar-small-title-text-font-weight`    | Font weight for the small app bar title text.    |
| `--m3e-app-bar-small-title-text-line-height`    | Line height for the small app bar title text.    |
| `--m3e-app-bar-small-subtitle-text-tracking`    | Letter spacing for the small app bar title text. |
| `--m3e-app-bar-small-subtitle-text-font-size`   | Font size for the small app bar subtitle text.   |
| `--m3e-app-bar-small-subtitle-text-font-weight` | Font weight for the small app bar subtitle text. |
| `--m3e-app-bar-small-subtitle-text-line-height` | Line height for the small app bar subtitle text. |
| `--m3e-app-bar-small-heading-padding-left`      | Left padding for the small app bar heading.      |
| `--m3e-app-bar-small-heading-padding-right`     | Right padding for the small app bar heading.     |

#### Medium Size Properties

| Property                                              | Description                                       |
| ----------------------------------------------------- | ------------------------------------------------- |
| `--m3e-app-bar-medium-container-height`               | Height of the medium app bar container.           |
| `--m3e-app-bar-medium-container-height-with-subtitle` | Height of the medium app bar with subtitle.       |
| `--m3e-app-bar-medium-title-text-font-size`           | Font size for the medium app bar title text.      |
| `--m3e-app-bar-medium-title-text-font-weight`         | Font weight for the medium app bar title text.    |
| `--m3e-app-bar-medium-title-text-line-height`         | Line height for the medium app bar title text.    |
| `--m3e-app-bar-medium-subtitle-text-tracking`         | Letter spacing for the medium app bar title text. |
| `--m3e-app-bar-medium-subtitle-text-font-size`        | Font size for the medium app bar subtitle text.   |
| `--m3e-app-bar-medium-subtitle-text-font-weight`      | Font weight for the medium app bar subtitle text. |
| `--m3e-app-bar-medium-subtitle-text-line-height`      | Line height for the medium app bar subtitle text. |
| `--m3e-app-bar-medium-heading-padding-left`           | Left padding for the medium app bar heading.      |
| `--m3e-app-bar-medium-heading-padding-right`          | Right padding for the medium app bar heading.     |
| `--m3e-app-bar-medium-padding-top`                    | Top padding for the medium app bar.               |
| `--m3e-app-bar-medium-padding-bottom`                 | Bottom padding for the medium app bar.            |
| `--m3e-app-bar-medium-title-max-lines`                | Max lines for the medium app bar title.           |
| `--m3e-app-bar-medium-subtitle-max-lines`             | Max lines for the medium app bar subtitle.        |

#### Large Size Properties

| Property                                             | Description                                      |
| ---------------------------------------------------- | ------------------------------------------------ |
| `--m3e-app-bar-large-container-height`               | Height of the large app bar container.           |
| `--m3e-app-bar-large-container-height-with-subtitle` | Height of the large app bar with subtitle.       |
| `--m3e-app-bar-large-title-text-font-size`           | Font size for the large app bar title text.      |
| `--m3e-app-bar-large-title-text-font-weight`         | Font weight for the large app bar title text.    |
| `--m3e-app-bar-large-title-text-line-height`         | Line height for the large app bar title text.    |
| `--m3e-app-bar-large-subtitle-text-tracking`         | Letter spacing for the large app bar title text. |
| `--m3e-app-bar-large-subtitle-text-font-size`        | Font size for the large app bar subtitle text.   |
| `--m3e-app-bar-large-subtitle-text-font-weight`      | Font weight for the large app bar subtitle text. |
| `--m3e-app-bar-large-subtitle-text-line-height`      | Line height for the large app bar subtitle text. |
| `--m3e-app-bar-large-heading-padding-left`           | Left padding for the large app bar heading.      |
| `--m3e-app-bar-large-heading-padding-right`          | Right padding for the large app bar heading.     |
| `--m3e-app-bar-large-padding-top`                    | Top padding for the large app bar.               |
| `--m3e-app-bar-large-padding-bottom`                 | Bottom padding for the large app bar.            |
| `--m3e-app-bar-large-title-max-lines`                | Max lines for the large app bar title.           |
| `--m3e-app-bar-large-subtitle-max-lines`             | Max lines for the large app bar subtitle.        |
