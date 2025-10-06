# @m3e/slider

The `m3e-slider` component enables users to select a numeric value from a continuous or discrete range. Designed according to Material 3 principles, it supports labeled value indicators, tick marks, and snapping behavior.

> **Part of the [Material 3 Expressive (M3E)](../../README.md) monorepo**  
> This package is maintained within the unified M3E repository, which provides a suite of Material 3 web components.

## 📦 Installation

```bash
npm install @m3e/slider
```

## 🚀 Browser Usage

This package uses [JavaScript Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#module_specifiers). To use it directly in a browser without a bundler, use a module script similar to the following.

```html
<script type="module" src="/node_modules/@m3e/slider/dist/index.js"></script>
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

- `m3e-slider` — Allows for the selection of numeric values from a range.
- `m3e-slider-thumb` — A thumb used to select a value in a slider.

## 🧪 Examples

The following example illustrates a labelled slider with thumb used to select a single numeric value.

```html
<m3e-slider labelled>
  <m3e-slider-thumb value="50"></m3e-slider-thumb>
</m3e-slider>
```

The next example illustrates a labelled range slider with two thumbs used to select a minimum and maximum numeric value.

```html
<m3e-slider labelled>
  <m3e-slider-thumb value="25"></m3e-slider-thumb>
  <m3e-slider-thumb value="75"></m3e-slider-thumb>
</m3e-slider>
```

## 📖 API Reference

### 🗂️ Slider

This section details the attributes, events and CSS custom properties available for the `m3e-slider` component.

#### ⚙️ Attributes

| Attribute  | Type                                                               | Default         | Description                                  |
| ---------- | ------------------------------------------------------------------ | --------------- | -------------------------------------------- |
| `disabled` | `boolean`                                                          | `false`         | Whether the element is disabled.             |
| `discrete` | `boolean`                                                          | `false`         | Whether to show tick marks.                  |
| `labelled` | `boolean`                                                          | `false`         | Whether to show value labels when activated. |
| `min`      | `number`                                                           | `0`             | The minimum allowable value.                 |
| `max`      | `number`                                                           | `100`           | The maximum allowable value.                 |
| `step`     | `number`                                                           | `1`             | The value at which the thumb will snap.      |
| `size`     | `"extra-small"`, `"small"`, `"medium"`, `"large"`, `"extra-large"` | `"extra-small"` | The size of the slider.                      |

#### 🔔 Events

| Event    | Description                     |
| -------- | ------------------------------- |
| `input`  | Emitted when the value changes. |
| `change` | Emitted when the value changes. |

#### 🎛️ CSS Custom Properties

| Property                                                     | Description                                                       |
| ------------------------------------------------------------ | ----------------------------------------------------------------- |
| `--m3e-slider-min-width`                                     | Minimum inline size of the slider host.                           |
| `--m3e-slider-small-height`                                  | Height of the slider when size is small or extra-small.           |
| `--m3e-slider-medium-height`                                 | Height of the slider when size is medium.                         |
| `--m3e-slider-large-height`                                  | Height of the slider when size is large.                          |
| `--m3e-slider-extra-large-height`                            | Height of the slider when size is extra-large.                    |
| `--m3e-slider-small-active-track-shape`                      | Corner shape of the active track for small sliders.               |
| `--m3e-slider-small-inactive-active-track-start-shape`       | Corner shape of the inactive track start for small sliders.       |
| `--m3e-slider-small-inactive-track-end-shape`                | Corner shape of the inactive track end for small sliders.         |
| `--m3e-slider-medium-active-track-shape`                     | Corner shape of the active track for medium sliders.              |
| `--m3e-slider-medium-inactive-active-track-start-shape`      | Corner shape of the inactive track start for medium sliders.      |
| `--m3e-slider-medium-inactive-track-end-shape`               | Corner shape of the inactive track end for medium sliders.        |
| `--m3e-slider-large-active-track-shape`                      | Corner shape of the active track for large sliders.               |
| `--m3e-slider-large-inactive-active-track-start-shape`       | Corner shape of the inactive track start for large sliders.       |
| `--m3e-slider-large-inactive-track-end-shape`                | Corner shape of the inactive track end for large sliders.         |
| `--m3e-slider-extra-large-active-track-shape`                | Corner shape of the active track for extra-large sliders.         |
| `--m3e-slider-extra-large-inactive-active-track-start-shape` | Corner shape of the inactive track start for extra-large sliders. |
| `--m3e-slider-extra-large-inactive-track-end-shape`          | Corner shape of the inactive track end for extra-large sliders.   |
| `--m3e-slider-extra-small-track-height`                      | Height of the track for extra-small sliders.                      |
| `--m3e-slider-small-track-height`                            | Height of the track for small sliders.                            |
| `--m3e-slider-medium-track-height`                           | Height of the track for medium sliders.                           |
| `--m3e-slider-large-track-height`                            | Height of the track for large sliders.                            |
| `--m3e-slider-extra-large-track-height`                      | Height of the track for extra-large sliders.                      |
| `--m3e-slider-tick-size`                                     | Size of each tick mark.                                           |
| `--m3e-slider-tick-shape`                                    | Corner shape of each tick mark.                                   |
| `--m3e-slider-inactive-track-color`                          | Background color of the inactive track when enabled.              |
| `--m3e-slider-disabled-inactive-track-color`                 | Base color of the inactive track when disabled.                   |
| `--m3e-slider-disabled-inactive-track-opacity`               | Opacity of the inactive track when disabled.                      |
| `--m3e-slider-active-track-color`                            | Background color of the active track when enabled.                |
| `--m3e-slider-disabled-active-track-color`                   | Base color of the active track when disabled.                     |
| `--m3e-slider-disabled-active-track-opacity`                 | Opacity of the active track when disabled.                        |
| `--m3e-slider-tick-active-color`                             | Color of active ticks when enabled.                               |
| `--m3e-slider-disabled-tick-active-color`                    | Color of active ticks when disabled.                              |
| `--m3e-slider-tick-inactive-color`                           | Color of inactive ticks when enabled.                             |
| `--m3e-slider-disabled-tick-inactive-color`                  | Color of inactive ticks when disabled.                            |

### 🗂️ Slider Thumb

This section details the attributes, events and CSS custom properties available for the `m3e-slider-thumb` component.

#### ⚙️ Attributes

| Attribute  | Type               | Default | Description                                                               |
| ---------- | ------------------ | ------- | ------------------------------------------------------------------------- |
| `disabled` | `boolean`          | `false` | Whether the element is disabled.                                          |
| `name`     | `string`           |         | The name that identifies the element when submitting the associated form. |
| `value`    | `number` \| `null` | `null`  | The value of the thumb.                                                   |

#### 🔔 Events

| Event    | Description                     |
| -------- | ------------------------------- |
| `input`  | Emitted when the value changes. |
| `change` | Emitted when the value changes. |

#### 🎛️ CSS Custom Properties

| Property                              | Description                                    |
| ------------------------------------- | ---------------------------------------------- |
| `--m3e-slider-thumb-width`            | Width of the slider thumb.                     |
| `--m3e-slider-thumb-padding`          | Horizontal padding around the thumb.           |
| `--m3e-slider-thumb-color`            | Active color of the slider thumb when enabled. |
| `--m3e-slider-thumb-pressed-width`    | Width of the thumb when pressed.               |
| `--m3e-slider-thumb-disabled-color`   | Color of the thumb when disabled.              |
| `--m3e-slider-thumb-disabled-opacity` | Opacity of the thumb when disabled.            |
| `--m3e-slider-label-width`            | Width of the floating label above the thumb.   |
| `--m3e-slider-label-container-color`  | Background color of the label container.       |
| `--m3e-slider-label-color`            | Text color of the label.                       |
| `--m3e-slider-label-font-size`        | Font size of the label text.                   |
| `--m3e-slider-label-font-weight`      | Font weight of the label text.                 |
| `--m3e-slider-label-line-height`      | Line height of the label text.                 |
| `--m3e-slider-label-tracking`         | Letter spacing of the label text.              |

## 🤝 Contributing

See the root monorepo `CONTRIBUTING.md` for guidelines on contributing to this package.

## 📄 License

This package is licensed under the MIT License.
