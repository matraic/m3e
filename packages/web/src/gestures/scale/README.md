# @m3e/web/gestures/scale

Recognizes pinch and spread movement made by multiple pointers.

```ts
import { scale } from "@m3e/web/gestures/scale";

const recognizer = scale({ pointers: 2 });
recognizer.addListener((detail) => console.log(detail.scale));
```

## Declarative usage

```ts
import "@m3e/web/gestures/scale";
```

```html
<div id="canvas"></div>
<m3e-scale-gesture for="canvas"></m3e-scale-gesture>
```

The element dispatches a `gesture` event with `ScaleGestureDetail` as its detail.

## Showcase examples

Detect scale declaratively by importing `@m3e/web/gestures/scale` and binding the gesture element to the target with `for`. Listen for its `gesture` event. Give the target a visible size and an appropriate `touch-action` (the showcase uses `touch-action: none`); provide an accessible alternative for gesture-only interactions.

```html
<div id="item"></div>
<m3e-scale-gesture for="item"></m3e-scale-gesture>
```

Alternatively, use the same target with `detectGesture` and `phase`. Replace the handler placeholders and retain the returned controller to call `destroy()` when no longer needed. The showcase's rotate comments are placeholders for scale handling.

```js
import { detectGesture, phase } from "@m3e/web/gestures";
import { scale } from "@m3e/web/gestures/scale";

const item = document.getElementById("item");
detectGesture(item, scale(phase({
  onStart: (detail) => {
    // Begin tracking
  },
  onUpdate: (detail) => {
    // Continuous movement
  },
  onEnd: (detail) => {
    // Finalize rotate
  },
  onCancel: (detail) => {
    // Abort rotate
  }
})));
```

## Options

| Attribute            | Type                            | Default                     | Description                                                          |
| -------------------- | ------------------------------- | --------------------------- | -------------------------------------------------------------------- |
| `disabled`           | `boolean`                       | `false`                     | Whether gesture recognition is disabled.                             |
| `priority`           | `number`                        | `1`                         | The priority in which to recognize gestures.                         |
| `buttons`            | `readonly GestureInputButton[]` | `["primary"]`               | Which buttons can be pressed.                                        |
| `pointer-types`      | `readonly PointerType[]`        | `["mouse", "pen", "touch"]` | Which pointer types can be used.                                     |
| `input-filter`       | `GestureInputFilter`            | —                           | Predicate used to determine whether input can be recognized.         |
| `pointers`           | `number`                        | `2`                         | Number of pointers required for the gesture to be recognized.        |
| `min-displacement`   | `number`                        | `4`                         | Minimum distance (px) a pointer must move before the gesture starts. |
| `max-press-interval` | `number`                        | `120`                       | Maximum allowed time (ms) between the earliest and latest press.     |

## Detail

| Property          | Type                                       | Description                                                                           |
| ----------------- | ------------------------------------------ | ------------------------------------------------------------------------------------- |
| `gestureName`     | `string`                                   | The name of the gesture.                                                              |
| `phase`           | `"start" \| "update" \| "end" \| "cancel"` | The current phase of the gesture.                                                     |
| `inputId`         | `number \| readonly number[]`              | The identifier of the input stream(s) that produced the detail.                       |
| `timestamp`       | `number`                                   | The timestamp at which the gesture detail was produced.                               |
| `translationX`    | `number`                                   | Horizontal translation (px) from the initial position.                                |
| `translationY`    | `number`                                   | Vertical translation (px) from the initial position.                                  |
| `velocityX`       | `number`                                   | Instantaneous horizontal velocity (px/ms).                                            |
| `velocityY`       | `number`                                   | Instantaneous vertical velocity (px/ms).                                              |
| `directionX`      | `number`                                   | Horizontal movement direction (-1, 0, or 1).                                          |
| `directionY`      | `number`                                   | Vertical movement direction (-1, 0, or 1).                                            |
| `axis`            | `"x" \| "y"`                               | Dominant axis of movement.                                                            |
| `initialDistance` | `number`                                   | Average distance (px) from each active pointer to the centroid at activation.         |
| `currentDistance` | `number`                                   | Average distance (px) from each active pointer to the centroid for the latest sample. |
| `scale`           | `number`                                   | Scale factor representing total zoom since activation.                                |
| `scaleDelta`      | `number`                                   | Incremental scale change between the last two samples.                                |
| `scaleVelocity`   | `number`                                   | Instantaneous scale velocity (units/ms).                                              |
