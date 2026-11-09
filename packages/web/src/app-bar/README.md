# @m3e/web/app-bar

The `m3e-app-bar` component is a prominent user interface component that provides consistent access to key actions, navigation, and contextual information at the top of an application screen. Designed according to Material 3 principles, it organizes content with clear hierarchy, supports dynamic color, elevation, alignment, and adapts to scrolling behavior.

```ts
import "@m3e/web/app-bar";
```

## 🗂️ Elements

- `m3e-app-bar` — A bar, placed a the top of a screen, used to help users navigate through an application.

## 🧪 Examples

Use the `leading`, `title`, `subtitle`, and `trailing` slots to arrange navigation and actions.

```html
<m3e-app-bar>
  <m3e-icon-button slot="leading" aria-label="Back">
    <m3e-icon name="arrow_back"></m3e-icon>
  </m3e-icon-button>
  <span slot="title">Top 10 hiking trails</span>
  <span slot="subtitle">Discover popular trails</span>
  <m3e-icon-button slot="trailing" aria-label="Bookmark" variant="tonal">
    <m3e-icon name="bookmark" filled></m3e-icon>
  </m3e-icon-button>
</m3e-app-bar>
```

Use `size` to choose a medium or large app bar. The default size is `small`.

```html
<m3e-app-bar size="medium">
  <!-- Content omitted for brevity -->
</m3e-app-bar>
<m3e-app-bar size="large">
  <!-- Content omitted for brevity -->
</m3e-app-bar>
```

Use `centered` to keep the title and subtitle centered even when the leading and trailing content
differ in width.

```html
<m3e-app-bar centered>
  <!-- Content omitted for brevity -->
</m3e-app-bar>
```

Attach a sticky app bar to a scroll container with `for`. The default `elevate` behavior changes
its appearance when the container is scrolled. Supply the app bar content shown in the first
example where the placeholder appears.

```html
<div id="scrollContainer">
  <m3e-app-bar for="scrollContainer">
    <!-- Content omitted for brevity -->
  </m3e-app-bar>
  <div class="scroll-item">Scroll down to see the elevation behavior</div>
</div>
<style>
  #scrollContainer {
    overflow-y: auto;
    height: 300px;
  }
  m3e-app-bar[for="scrollContainer"] {
    position: sticky;
    top: 0;
  }
  .scroll-item {
    height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
```

Use `scroll-behavior="transparent"` to fade the container color, title, and subtitle as the
container scrolls, while the leading and trailing content remains visible. Supply the app bar
content shown in the first example and use the CSS below.

```html
<div id="scrollContainer">
  <m3e-app-bar for="scrollContainer" scroll-behavior="transparent">
    <!-- Content omitted for brevity -->
  </m3e-app-bar>
  <div class="scroll-item">Scroll down to see the transparent behavior</div>
</div>
```

```css
#scrollContainer {
  overflow-y: auto;
  height: 300px;
}
m3e-app-bar[for="scrollContainer"] {
  position: sticky;
  top: 0;
}
.scroll-item {
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

Use `scroll-behavior="hide"` to slide the app bar out of view as the container scrolls down;
it returns as the scroll position nears the top. Supply the app bar content shown in the first
example and use the CSS below.

```html
<div id="scrollContainer">
  <m3e-app-bar for="scrollContainer" scroll-behavior="hide">
    <!-- Content omitted for brevity -->
  </m3e-app-bar>
  <div class="scroll-item">Scroll down to hide, up to reveal</div>
</div>
```

```css
#scrollContainer {
  overflow-y: auto;
  height: 300px;
}
m3e-app-bar[for="scrollContainer"] {
  position: sticky;
  top: 0;
}
.scroll-item {
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

Use `scroll-behavior="compress"` with a medium or large app bar to collapse it to a small bar
as its attached container scrolls. Supply the app bar content shown in the first example and use
the CSS below.

```html
<div id="scrollContainer">
  <m3e-app-bar for="scrollContainer" size="large" scroll-behavior="compress">
    <!-- Content omitted for brevity -->
  </m3e-app-bar>
  <div class="scroll-item">Scroll down to compress the app bar</div>
</div>
```

```css
#scrollContainer {
  overflow-y: auto;
  height: 300px;
}
m3e-app-bar[for="scrollContainer"] {
  position: sticky;
  top: 0;
}
.scroll-item {
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

## 📖 API Reference

This section details the attributes, slots and CSS custom properties available for the `m3e-app-bar` component.

### ⚙️ Attributes

| Attribute         | Type                                                 | Default     | Description                                                                  |
| ----------------- | ---------------------------------------------------- | ----------- | ---------------------------------------------------------------------------- |
| `centered`        | `boolean`                                            | `false`     | Whether the title and subtitle are centered.                                 |
| `size`            | `"small" \| "medium" \| "large"`                     | `"small"`   | The size of the bar.                                                         |
| `for`             | `string`                                             |             | The identifier of the interactive control to which this element is attached. |
| `scroll-behavior` | `"elevate" \| "compress" \| "hide" \| "transparent"` | `"elevate"` | The behavior applied when the attached scroll container is scrolled.         |

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
