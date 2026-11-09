# @m3e/web/swipe-reveal

The `m3e-swipe-reveal` component uncovers leading and trailing actions as its content is dragged, following the Material 3 swipe to reveal pattern. Content and staggered siblings stay in the scrolling container, so they may be clipped by an ancestor's overflow. Add padding to the scrolling container if more room is needed for displaced content or shadows. Actions fade, clip and squish as they are uncovered, and a swipe can continue past the actions to dismiss the item. Direction is mirrored for right-to-left layouts.

Vertical touch gestures scroll normally. Once a horizontal drag begins, the component prevents touch scrolling until that touch ends, including when the drag reverses direction.

```ts
import "@m3e/web/swipe-reveal";
```

## 🗂️ Elements

- `m3e-swipe-reveal` — Reveals contextual actions behind content when swiped, and optionally dismisses the item.
- `m3e-swipe-reveal-group` — Coordinates a set of `m3e-swipe-reveal` elements.

## 🧪 Examples

Showcase: Basic usage. Import `@m3e/web/swipe-reveal`. Also import `@m3e/web/list`, `@m3e/web/icon-button`, `@m3e/web/icon`. Load a matching Material Symbols font or register the icons. Give icon-only buttons accessible names.

```html
<m3e-list variant="segmented">
  <m3e-swipe-reveal>
    <m3e-icon-button slot="leading" aria-label="Pin" variant="tonal">
      <m3e-icon name="keep" filled></m3e-icon>
    </m3e-icon-button>
    <m3e-list-item>Item 1</m3e-list-item>
    <m3e-icon-button slot="trailing" aria-label="Bookmark" variant="tonal">
      <m3e-icon name="bookmark" filled></m3e-icon>
    </m3e-icon-button>
  </m3e-swipe-reveal>
  <!-- Additional items omitted for brevity -->
</m3e-list>
```

```css
m3e-list {
  overflow: visible;
}
```

Showcase: Triggers. Import `@m3e/web/swipe-reveal`. Also import `@m3e/web/list`, `@m3e/web/icon-button`, `@m3e/web/icon`. Load a matching Material Symbols font or register the icons. Give icon-only buttons accessible names.

```html
<m3e-swipe-reveal-group triggers="swipe long-press">
  <m3e-list variant="segmented">
    <m3e-swipe-reveal>
      <m3e-list-item>Item 1</m3e-list-item>
      <m3e-icon-button slot="trailing" aria-label="Share" variant="tonal">
        <m3e-icon name="share" filled></m3e-icon>
      </m3e-icon-button>
    </m3e-swipe-reveal>
    <!-- Additional items omitted for brevity -->
  </m3e-list>
</m3e-swipe-reveal-group>
```

Showcase: Stagger. Import `@m3e/web/swipe-reveal`. Also import `@m3e/web/list`, `@m3e/web/icon-button`, `@m3e/web/icon`. Load a matching Material Symbols font or register the icons. Give icon-only buttons accessible names.

```html
<m3e-swipe-reveal-group stagger="0.05">
  <m3e-list variant="segmented">
    <m3e-swipe-reveal>
      <m3e-list-item>Item 1</m3e-list-item>
      <m3e-icon-button slot="trailing" aria-label="Archive" variant="tonal">
        <m3e-icon name="archive" filled></m3e-icon>
      </m3e-icon-button>
    </m3e-swipe-reveal>
    <!-- Additional items omitted for brevity -->
  </m3e-list>
</m3e-swipe-reveal-group>
```

Showcase: Dismissible. Import `@m3e/web/swipe-reveal`. Also import `@m3e/web/list`, `@m3e/web/icon-button`, `@m3e/web/icon`. Load a matching Material Symbols font or register the icons. Give icon-only buttons accessible names.

```html
<m3e-swipe-reveal-group dismissible="trailing">
  <m3e-list variant="segmented">
    <m3e-swipe-reveal>
      <m3e-list-item>Item 1</m3e-list-item>
      <m3e-icon-button slot="trailing" aria-label="Delete" variant="tonal">
        <m3e-icon name="delete" filled></m3e-icon>
      </m3e-icon-button>
    </m3e-swipe-reveal>
    <!-- Additional items omitted for brevity -->
  </m3e-list>
</m3e-swipe-reveal-group>
```

Showcase: Card Header. Import `@m3e/web/swipe-reveal`. Also import `@m3e/web/icon-button`, `@m3e/web/icon`, `@m3e/web/card`. Load a matching Material Symbols font or register the icons. Give icon-only buttons accessible names. Apply the required styling for the illustrated classes in your application.

```html
<m3e-swipe-reveal class="card-reveal" elastic="none">
  <m3e-icon-button slot="leading" aria-label="Favorite" toggle variant="filled">
    <m3e-icon name="favorite"></m3e-icon>
  </m3e-icon-button>
  <m3e-card>…</m3e-card>
</m3e-swipe-reveal>
```

```css
.card-reveal {
  --m3e-swipe-reveal-actions-padding: 0px;
  --m3e-swipe-reveal-actions-underlap: var(--md-sys-shape-corner-value-medium);
  --m3e-icon-button-container-height: 100%;
  --m3e-icon-button-start-start-shape: var(--md-sys-shape-corner-value-medium);
  --m3e-icon-button-end-start-shape: var(--md-sys-shape-corner-value-medium);
  --m3e-icon-button-start-end-shape: 0px;
  --m3e-icon-button-end-end-shape: 0px;
}
.card-reveal m3e-icon-button[slot="leading"] {
  width: 64px;
}
.card-reveal m3e-icon-button[slot="leading"] m3e-icon {
  position: absolute;
  top: 16px;
  margin-inline-start: -8px;
}
```

## 📖 API Reference

This section details the attributes, slots, events, methods and properties available for the `m3e-swipe-reveal` and `m3e-swipe-reveal-group` components.

### m3e-swipe-reveal

#### ⚙️ Attributes

| Attribute           | Type                                              | Default   | Description                                                                                             |
| ------------------- | ------------------------------------------------- | --------- | ------------------------------------------------------------------------------------------------------- |
| `dismissible`       | `leading \| trailing \| both \| none`             | `none`    | Which side, if any, can be swiped past its actions to dismiss the item.                                 |
| `elastic`           | `leading \| trailing \| both \| none`             | `both`    | Which sides' actions squish and grow as the content is dragged.                                         |
| `dismiss-threshold` | `number`                                          | `0.5`     | The baseline fraction of content width for dismissal; the snap zone starts after full reveal.           |
| `overshoot`         | `number`                                          | `8`       | The distance, in pixels, content can be dragged past the actions.                                       |
| `stagger`           | `number`                                          | `0`       | How far (0 to 1) the nearest sibling follows a dragged item; each further sibling follows half as much. |
| `stagger-count`     | `number`                                          | `3`       | The number of siblings on each side that are staggered.                                                 |
| `threshold`         | `number`                                          | `0.5`     | The fraction of the actions' width at which a release reveals or covers.                                |
| `triggers`          | `swipe \| tap \| double-tap \| long-press` (list) | `"swipe"` | Space separated interactions that reveal actions.                                                       |

Values set on an `m3e-swipe-reveal-group` are inherited by its items unless an item sets its own.

#### 🧩 Slots

| Slot        | Description                                             |
| ----------- | ------------------------------------------------------- |
| _(default)_ | Renders the content which is dragged to reveal actions. |
| `leading`   | Renders the actions revealed at the leading edge.       |
| `trailing`  | Renders the actions revealed at the trailing edge.      |

When a side is `dismissible`, it must have slotted actions. The outermost action (first in `leading`, last in `trailing`) is the dismiss action, and grows to fill the space as the item is dragged toward dismissal.

**Avoid overcrowding actions.** Swipe dismiss is designed for a small number of actions. When actions consume most of the item's width, the actions must be fully revealed before dismissal becomes available. If the actions exceed the available item or viewport width, they are not automatically wrapped or made scrollable.

#### 🛠️ Methods

| Method           | Description                                                   |
| ---------------- | ------------------------------------------------------------- |
| `reveal(side?)`  | Reveals the actions on the given side.                        |
| `close()`        | Covers the content, hiding any revealed actions.              |
| `dismiss(side?)` | Dismisses the item, sliding it away and collapsing its space. |
| `restore()`      | Brings back a dismissed item, for example to undo.            |

#### 📡 Events

All events are `CustomEvent<SwipeRevealEventDetail>`, where `detail.side` is `"leading"` or `"trailing"`. For `covered` it is the side that was covered.

| Event       | Description                                                             |
| ----------- | ----------------------------------------------------------------------- |
| `revealing` | Emitted when the item begins to reveal actions.                         |
| `revealed`  | Emitted when actions are revealed.                                      |
| `covered`   | Emitted when actions are covered.                                       |
| `dismiss`   | Emitted, cancelable, before the item is dismissed. Bubbles.             |
| `dismissed` | Emitted after the item has been dismissed. Bubbles. The app removes it. |

#### 🎛️ CSS Custom Properties

| Property                                              | Description                                                                                                                             |
| ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `--m3e-swipe-reveal-actions-padding`                  | The inline padding around the leading and trailing actions.                                                                             |
| `--m3e-swipe-reveal-actions-gap`                      | The gap between adjacent actions.                                                                                                       |
| `--m3e-swipe-reveal-actions-container-color`          | The background color of the leading and trailing actions.                                                                               |
| `--m3e-swipe-reveal-actions-container-shape`          | The corner shape of the leading and trailing actions.                                                                                   |
| `--m3e-swipe-reveal-leading-actions-padding`          | The inline padding around the leading actions.                                                                                          |
| `--m3e-swipe-reveal-leading-actions-gap`              | The gap between adjacent leading actions.                                                                                               |
| `--m3e-swipe-reveal-leading-actions-container-color`  | The background color of the leading actions.                                                                                            |
| `--m3e-swipe-reveal-leading-actions-container-shape`  | The corner shape of the leading actions.                                                                                                |
| `--m3e-swipe-reveal-trailing-actions-padding`         | The inline padding around the trailing actions.                                                                                         |
| `--m3e-swipe-reveal-trailing-actions-gap`             | The gap between adjacent trailing actions.                                                                                              |
| `--m3e-swipe-reveal-trailing-actions-container-color` | The background color of the trailing actions.                                                                                           |
| `--m3e-swipe-reveal-trailing-actions-container-shape` | The corner shape of the trailing actions.                                                                                               |
| `--m3e-swipe-reveal-actions-underlap`                 | How far the actions' container extends beneath the content.                                                                             |
| `--m3e-swipe-reveal-leading-actions-underlap`         | How far the leading actions' container extends beneath the content.                                                                     |
| `--m3e-swipe-reveal-trailing-actions-underlap`        | How far the trailing actions' container extends beneath the content.                                                                    |
| `--m3e-swipe-reveal-shape-growth`                     | Set while dragging on the active item and any staggered siblings, indicates the amount by which content may increase its border radius. |

### m3e-swipe-reveal-group

#### ⚙️ Attributes

| Attribute           | Type                                              | Default   | Description                                                                      |
| ------------------- | ------------------------------------------------- | --------- | -------------------------------------------------------------------------------- |
| `dismissible`       | `leading \| trailing \| both \| none`             | `none`    | The default side, if any, on which items can be dismissed.                       |
| `elastic`           | `leading \| trailing \| both \| none`             | `both`    | The default sides whose actions squish and grow as content is dragged.           |
| `dismiss-threshold` | `number`                                          | `0.5`     | The default baseline fraction of item width for dismissal.                       |
| `overshoot`         | `number`                                          | `8`       | The default distance, in pixels, content can be dragged past the actions.        |
| `stagger`           | `number`                                          | `0`       | The default fraction (0 to 1) the nearest sibling follows a dragged item.        |
| `stagger-count`     | `number`                                          | `3`       | The default number of siblings on each side that are staggered.                  |
| `threshold`         | `number`                                          | `0.5`     | The default fraction of the actions' width at which a release reveals or covers. |
| `triggers`          | `swipe \| tap \| double-tap \| long-press` (list) | `"swipe"` | The default space separated interactions that reveal actions.                    |

#### 🧩 Slots

| Slot        | Description                                      |
| ----------- | ------------------------------------------------ |
| _(default)_ | Renders the swipe-reveal elements to coordinate. |

#### 🛠️ Properties

| Property   | Description                                                             |
| ---------- | ----------------------------------------------------------------------- |
| `reveals`  | The swipe-reveal elements contained in the group.                       |
| `revealed` | The revealed swipe-reveal in the group, or `null` if none are revealed. |
