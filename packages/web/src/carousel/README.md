# @m3e/web/carousel

The `@m3e/web/carousel` module presents collections of related content in responsive Material 3 layouts. Carousels support previews of neighboring content, fixed-width items, and a vertically scrolling fullscreen layout. A responsive grid can also present the same collection as a Show all view.

```ts
import "@m3e/web/carousel";
```

## 🗂️ Elements

- `m3e-carousel` — Presents items in a scrollable carousel.
- `m3e-carousel-grid` — Presents items in responsive, vertically scrolling rows and columns.
- `m3e-carousel-item` — Provides a button or link action containing media or custom content.

## 🧪 Examples

Place items in a carousel and use the `title` and `subtitle` slots for text overlays. Replace the image placeholder and add more items. The CSS enables a text scrim behind the overlays.

```html
<m3e-carousel class="carousel" aria-label="Featured destinations">
  <m3e-carousel-item>
    <img src="[YOUR IMAGE URL HERE]" alt="" loading="lazy" />
    <span slot="title">Coast</span>
    <span slot="subtitle">Follow the ocean breeze</span>
  </m3e-carousel-item>
  <!-- Additional items omitted for brevity -->
</m3e-carousel>
```

```css
.carousel {
  --m3e-carousel-item-scrim-opacity: 0.65;
}
```

The default `multi-browse` layout shows multiple items and a preview.

```html
<m3e-carousel variant="multi-browse" aria-label="Destinations">
  <m3e-carousel-item>
    <img src="[YOUR IMAGE URL HERE]" alt="" loading="lazy" />
    <span slot="title">Coast</span>
    <span slot="subtitle">Follow the ocean breeze</span>
  </m3e-carousel-item>
  <!-- Additional items omitted for brevity -->
</m3e-carousel>
```

Use `uncontained` for fixed-width items.

```html
<m3e-carousel variant="uncontained" aria-label="Destinations">
  <!-- Items omitted for brevity -->
</m3e-carousel>
```

Use `hero` to emphasize a large item with a neighboring preview.

```html
<m3e-carousel variant="hero" aria-label="Destinations">
  <!-- Items omitted for brevity -->
</m3e-carousel>
```

Set a preferred width to adjust the hero layout.

```html
<m3e-carousel class="custom-width" variant="hero" aria-label="Destinations">
  <!-- Items omitted for brevity -->
</m3e-carousel>
```

```css
.custom-width {
  --m3e-carousel-item-width: 256px;
}
```

Use `hero-centered` to center the large item between previews.

```html
<m3e-carousel variant="hero-centered" aria-label="Destinations">
  <!-- Items omitted for brevity -->
</m3e-carousel>
```

The centered hero layout also supports a preferred width.

```html
<m3e-carousel class="custom-width" variant="hero-centered" aria-label="Destinations">
  <!-- Items omitted for brevity -->
</m3e-carousel>
```

```css
.custom-width {
  --m3e-carousel-item-width: 256px;
}
```

Use `fullscreen` for edge-to-edge items in a vertical carousel. Set its height to define the viewing area.

```html
<m3e-carousel class="carousel" variant="fullscreen" aria-label="Destinations">
  <!-- Items omitted for brevity -->
</m3e-carousel>
```

```css
.carousel {
  height: 256px;
}
```

Use a grid as a standalone collection or a Show all view for a carousel. Render the same collection in both views and transfer `selectedIndex` when switching if the navigation position should be preserved.

```html
<m3e-carousel-grid class="carousel-grid-demo" aria-label="Featured destinations">
  <m3e-carousel-item>
    <img src="[YOUR IMAGE URL HERE]" alt="" loading="lazy" />
    <span slot="title">Coast</span>
    <span slot="subtitle">Follow the ocean breeze</span>
  </m3e-carousel-item>
  <!-- Additional items omitted for brevity -->
</m3e-carousel-grid>
```

```css
.carousel-grid-demo {
  --m3e-carousel-grid-item-min-width: 186px;
  --m3e-carousel-item-scrim-opacity: 0.65;
}
```

Set the preferred width for large items in `multi-browse`, `hero`, and `hero-centered`, or the fixed width in `uncontained`. The `fullscreen` layout ignores this property. CSS lengths and percentages are supported.

```css
.carousel {
  --m3e-carousel-item-width: 320px;
}
```

Set the carousel height directly, or use `--m3e-carousel-height` to change its inheritable default.

```css
.carousel {
  height: 256px;
}
```

Adjust the horizontal item gap and the space reserved around items for feedback.

```css
.carousel {
  --m3e-carousel-item-gap: 16px;
  --m3e-carousel-inline-gutter: 24px;
  --m3e-carousel-block-gutter: 12px;
}
```

Use `--m3e-carousel-fullscreen-item-gap` for the vertical gap in `fullscreen`; that variant ignores the gutters.

Customize the title and subtitle sizes for a collection.

```css
.carousel {
  --m3e-carousel-item-title-font-size: 20px;
  --m3e-carousel-item-subtitle-font-size: 12px;
}
```

Enable the optional text scrim to help separate text from media. Check the contrast against the actual content.

```css
.carousel {
  --m3e-carousel-item-scrim-opacity: 0.65;
}
```

Customize the resting and pressed item shapes.

```css
.carousel {
  --m3e-carousel-item-shape: 24px;
  --m3e-carousel-item-shape-pressed-morph: 12px;
}
```

Use `selected-index` or `selectedIndex` to read or set the current position. The index follows the item collection, excluding hidden items. Navigation methods reveal an item without activating it or moving keyboard focus. Listen for `change` when user navigation or a navigation method changes the current item; setting the index directly does not emit this event.

```js
const carousel = document.querySelector("m3e-carousel");

carousel.addEventListener("change", (event) => {
  console.log(event.detail.index, event.detail.item);
});

carousel.moveTo(2);
```

The example assumes at least three visible items. The grid supports the same navigation properties, methods, and event.

Disable an item's action or remove it from the layout with `hidden`.

```html
<m3e-carousel aria-label="Destinations">
  <m3e-carousel-item>Coast</m3e-carousel-item>
  <m3e-carousel-item disabled>Forest unavailable</m3e-carousel-item>
  <m3e-carousel-item hidden>Mountains</m3e-carousel-item>
</m3e-carousel>
```

## 📖 API Reference

### 🗂️ m3e-carousel

#### ⚙️ Attributes

| Attribute        | Type              | Default          | Description                                                                                |
| ---------------- | ----------------- | ---------------- | ------------------------------------------------------------------------------------------ |
| `selected-index` | `number`          | `0`              | Zero-based navigation position among non-hidden items.                                     |
| `variant`        | `CarouselVariant` | `"multi-browse"` | Layout: `"multi-browse"`, `"uncontained"`, `"hero"`, `"hero-centered"`, or `"fullscreen"`. |

#### 🔔 Events

| Event    | Detail            | Description                                                                      |
| -------- | ----------------- | -------------------------------------------------------------------------------- |
| `change` | `{ index, item }` | Dispatched when user navigation or a navigation method changes the current item. |

#### 🧩 Slots

| Slot        | Description                                 |
| ----------- | ------------------------------------------- |
| _(default)_ | A sequence of `m3e-carousel-item` elements. |

#### 🛠️ Properties

| Property        | Description                                                                           |
| --------------- | ------------------------------------------------------------------------------------- |
| `selectedIndex` | Gets or sets the zero-based navigation position. It does not indicate ARIA selection. |
| `items`         | Read-only collection of non-hidden items in slot order.                               |

#### 🛠️ Methods

| Method           | Description                                          |
| ---------------- | ---------------------------------------------------- |
| `movePrevious()` | Moves to the previous item.                          |
| `moveNext()`     | Moves to the next item.                              |
| `moveTo(index)`  | Moves to the item at the specified zero-based index. |

Navigation stops at the first and last items rather than wrapping. The grid and carousel maintain separate positions.

#### 🎛️ CSS Custom Properties

| Property                              | Description                                                                                                     |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `--m3e-carousel-height`               | Default carousel height.                                                                                        |
| `--m3e-carousel-min-height`           | Minimum carousel height.                                                                                        |
| `--m3e-carousel-item-width`           | Fixed item width for uncontained, or preferred large-item width for responsive layouts. Ignored for fullscreen. |
| `--m3e-carousel-item-gap`             | Spacing between horizontal items.                                                                               |
| `--m3e-carousel-fullscreen-item-gap`  | Spacing between fullscreen items.                                                                               |
| `--m3e-carousel-inline-gutter`        | Horizontal edge space for interaction feedback; ignored for fullscreen.                                         |
| `--m3e-carousel-block-gutter`         | Space above and below items for interaction feedback; ignored for fullscreen.                                   |
| `--m3e-carousel-small-item-min-width` | Minimum small preview width.                                                                                    |
| `--m3e-carousel-small-item-max-width` | Maximum small preview width.                                                                                    |
| `--m3e-carousel-large-item-max-width` | Maximum large item width.                                                                                       |

---

### 🗂️ m3e-carousel-grid

#### ⚙️ Attributes

| Attribute        | Type     | Default | Description                                            |
| ---------------- | -------- | ------- | ------------------------------------------------------ |
| `selected-index` | `number` | `0`     | Zero-based navigation position among non-hidden items. |

#### 🔔 Events

| Event    | Detail            | Description                                                                      |
| -------- | ----------------- | -------------------------------------------------------------------------------- |
| `change` | `{ index, item }` | Dispatched when user navigation or a navigation method changes the current item. |

#### 🧩 Slots

| Slot        | Description                                 |
| ----------- | ------------------------------------------- |
| _(default)_ | A sequence of `m3e-carousel-item` elements. |

#### 🛠️ Properties

| Property        | Description                                                                           |
| --------------- | ------------------------------------------------------------------------------------- |
| `selectedIndex` | Gets or sets the zero-based navigation position. It does not indicate ARIA selection. |
| `items`         | Read-only collection of non-hidden items in slot order.                               |

#### 🛠️ Methods

| Method           | Description                                          |
| ---------------- | ---------------------------------------------------- |
| `movePrevious()` | Moves to the previous item.                          |
| `moveNext()`     | Moves to the next item.                              |
| `moveTo(index)`  | Moves to the item at the specified zero-based index. |

#### 🎛️ CSS Custom Properties

| Property                                | Description                                        |
| --------------------------------------- | -------------------------------------------------- |
| `--m3e-carousel-grid-item-min-width`    | Minimum item width before another column is added. |
| `--m3e-carousel-grid-item-gap`          | Spacing between grid items.                        |
| `--m3e-carousel-grid-item-aspect-ratio` | Aspect ratio of each grid item.                    |

---

### 🗂️ m3e-carousel-item

An item acts as a button by default, or a link when `href` is set. Its image or video fills the item with a centered cover crop; title and subtitle overlays are optional.

#### ⚙️ Attributes

| Attribute  | Type      | Default | Description                                                        |
| ---------- | --------- | ------- | ------------------------------------------------------------------ |
| `href`     | `string`  | `""`    | Destination URL; makes the item a link.                            |
| `target`   | `string`  | `""`    | Browsing context for the link.                                     |
| `rel`      | `string`  | `""`    | Relationship between the linked resource and the current document. |
| `download` | `string`  | `null`  | Requests a download, optionally specifying a filename.             |
| `disabled` | `boolean` | `false` | Disables the action and excludes it from keyboard navigation.      |
| `label`    | `string`  | `null`  | Accessible action name, overriding slotted content.                |
| `hidden`   | `boolean` | `false` | Removes the item from the layout.                                  |

#### 🔔 Events

| Event   | Description                                             |
| ------- | ------------------------------------------------------- |
| `click` | Dispatched when the item's primary action is activated. |

#### 🧩 Slots

| Slot        | Description                              |
| ----------- | ---------------------------------------- |
| _(default)_ | Media or custom non-interactive content. |
| `title`     | Primary overlay text.                    |
| `subtitle`  | Secondary overlay text.                  |

#### 🎛️ CSS Custom Properties

These properties can be set on an individual item or inherited from a carousel or grid.

| Property                                          | Description                                               |
| ------------------------------------------------- | --------------------------------------------------------- |
| `--m3e-carousel-item-shape`                       | Resting corner radius.                                    |
| `--m3e-carousel-item-shape-pressed-morph`         | Pressed corner radius, capped at the resting radius.      |
| `--m3e-carousel-item-text-color`                  | Overlay text color.                                       |
| `--m3e-carousel-item-title-font-size`             | Title font size.                                          |
| `--m3e-carousel-item-title-text-color`            | Title text color.                                         |
| `--m3e-carousel-item-subtitle-font-size`          | Subtitle font size.                                       |
| `--m3e-carousel-item-subtitle-text-color`         | Subtitle text color.                                      |
| `--m3e-carousel-item-scrim-color`                 | Bottom text scrim color.                                  |
| `--m3e-carousel-item-scrim-opacity`               | Bottom text scrim opacity, from 0 to 1.                   |
| `--m3e-carousel-item-hover-elevation`             | Hover shadow.                                             |
| `--m3e-carousel-item-outline-width`               | Outline width; set to 0 to disable.                       |
| `--m3e-carousel-item-outline-color`               | Resting outline color.                                    |
| `--m3e-carousel-item-hover-outline-color`         | Hover outline color.                                      |
| `--m3e-carousel-item-focus-outline-color`         | Focus outline color.                                      |
| `--m3e-carousel-item-pressed-outline-color`       | Pressed outline color.                                    |
| `--m3e-carousel-item-disabled-outline-color`      | Disabled outline color.                                   |
| `--m3e-carousel-item-disabled-outline-opacity`    | Disabled outline opacity.                                 |
| `--m3e-carousel-item-hover-state-layer-color`     | Hover state-layer color.                                  |
| `--m3e-carousel-item-hover-state-layer-opacity`   | Hover state-layer opacity.                                |
| `--m3e-carousel-item-focus-state-layer-color`     | Focus state-layer color.                                  |
| `--m3e-carousel-item-focus-state-layer-opacity`   | Focus state-layer opacity.                                |
| `--m3e-carousel-item-pressed-state-layer-color`   | Pressed state-layer color.                                |
| `--m3e-carousel-item-pressed-state-layer-opacity` | Pressed state-layer opacity.                              |
| `--m3e-carousel-item-ripple-color`                | Overrides the pressed state-layer color for the ripple.   |
| `--m3e-carousel-item-ripple-opacity`              | Overrides the pressed state-layer opacity for the ripple. |
