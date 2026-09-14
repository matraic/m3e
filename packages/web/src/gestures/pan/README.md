# @m3e/web/gestures/pan

Recognizes continuous pointer movement and reports translation and velocity.

```ts
import { pan } from "@m3e/web/gestures/pan";

const recognizer = pan({ activationMode: "move", lockAxis: "x" });
recognizer.addListener((detail) => {
  if (detail.phase === "update") console.log(detail.translationX);
});
```

## Declarative usage

```ts
import "@m3e/web/gestures/pan";
```

```html
<div id="surface"></div>
<m3e-pan-gesture for="surface"></m3e-pan-gesture>
```

The element dispatches a `gesture` event with `PanGestureDetail` as its detail.

## Options

| Attribute            | Type                             | Default                     | Description                                                                                                |
| -------------------- | -------------------------------- | --------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `disabled`           | `boolean`                        | `false`                     | Whether gesture recognition is disabled.                                                                   |
| `priority`           | `number`                         | `1`                         | The priority in which to recognize gestures.                                                               |
| `buttons`            | `readonly GestureInputButton[]`  | `["primary"]`               | Which buttons can be pressed.                                                                              |
| `pointer-types`      | `readonly PointerType[]`         | `["mouse", "pen", "touch"]` | Which pointer types can be used.                                                                           |
| `input-filter`       | `GestureInputFilter`             | —                           | Predicate used to determine whether input can be recognized.                                               |
| `pointers`           | `number`                         | `1`                         | Number of pointers required for the gesture to be recognized.                                              |
| `activation-mode`    | `"press" \| "move"`              | `"press"`                   | Mode in which to activate the gesture.                                                                     |
| `min-displacement`   | `number`                         | `4`                         | Minimum distance (px) a pointer must move before the gesture starts.                                       |
| `lock-axis`          | `"x" \| "y" \| "auto" \| "none"` | `"none"`                    | The axis to which movement is locked.                                                                      |
| `axis-threshold`     | `number`                         | `8`                         | Minimum total displacement (px) required before axis locking resolves.                                     |
| `delta-threshold`    | `number`                         | `0`                         | Minimum incremental movement (px) on the secondary axis required before emitting detail for a locked axis. |
| `max-press-interval` | `number`                         | `120`                       | Maximum allowed time (ms) between the earliest and latest press.                                           |

## Detail

| Property       | Type                                       | Description                                                     |
| -------------- | ------------------------------------------ | --------------------------------------------------------------- |
| `gestureName`  | `string`                                   | The name of the gesture.                                        |
| `phase`        | `"start" \| "update" \| "end" \| "cancel"` | The current phase of the gesture.                               |
| `inputId`      | `number \| readonly number[]`              | The identifier of the input stream(s) that produced the detail. |
| `timestamp`    | `number`                                   | The timestamp at which the gesture detail was produced.         |
| `translationX` | `number`                                   | Horizontal translation (px) from the initial position.          |
| `translationY` | `number`                                   | Vertical translation (px) from the initial position.            |
| `velocityX`    | `number`                                   | Instantaneous horizontal velocity (px/ms).                      |
| `velocityY`    | `number`                                   | Instantaneous vertical velocity (px/ms).                        |
| `directionX`   | `number`                                   | Horizontal movement direction (-1, 0, or 1).                    |
| `directionY`   | `number`                                   | Vertical movement direction (-1, 0, or 1).                      |
| `axis`         | `"x" \| "y"`                               | Dominant axis of movement.                                      |
