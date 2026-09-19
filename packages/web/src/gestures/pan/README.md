# @m3e/web/gestures/pan

Recognizes continuous pointer movement and reports translation and velocity.

```ts
import { pan } from "@m3e/web/gestures/pan";

const recognizer = pan({ pointers: 2 });
recognizer.addListener((detail) => {
  console.log(detail.totalDeltaX, detail.totalDeltaY);
});
```

## Declarative usage

```ts
import "@m3e/web/gestures/pan";
```

```html
<div id="canvas"></div>
<m3e-pan-gesture for="canvas"></m3e-pan-gesture>
```

The element dispatches a `gesture` event with `TransformGestureDetail` as its detail.

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

| Property            | Type                                       | Description                                                                                 |
| ------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------- |
| `gestureName`       | `string`                                   | The name of the gesture.                                                                    |
| `phase`             | `"start" \| "update" \| "end" \| "cancel"` | The current phase of the gesture.                                                           |
| `inputId`           | `number \| readonly number[]`              | The identifier of the input stream(s) that produced the detail.                             |
| `timestamp`         | `number`                                   | The timestamp at which the gesture detail was produced.                                     |
| `startClientX`      | `number`                                   | Horizontal viewport coordinate of the initial input sample.                                 |
| `startClientY`      | `number`                                   | Vertical viewport coordinate of the initial input sample.                                   |
| `startLocalX`       | `number`                                   | Element-relative horizontal coordinate of the initial input sample.                         |
| `startLocalY`       | `number`                                   | Element-relative vertical coordinate of the initial input sample.                           |
| `clientX`           | `number`                                   | Horizontal viewport coordinate of the most recent input sample.                             |
| `clientY`           | `number`                                   | Vertical viewport coordinate of the most recent input sample.                               |
| `localX`            | `number`                                   | Element-relative horizontal coordinate of the most recent input sample.                     |
| `localY`            | `number`                                   | Element-relative vertical coordinate of the most recent input sample.                       |
| `deltaX`            | `number`                                   | Incremental horizontal movement (px) between the last two samples.                          |
| `deltaY`            | `number`                                   | Incremental vertical movement (px) between the last two samples.                            |
| `displacement`      | `number`                                   | Incremental displacement (px), computed as the Euclidean magnitude of incremental movement. |
| `totalDeltaX`       | `number`                                   | Total horizontal movement (px) from the initial sample.                                     |
| `totalDeltaY`       | `number`                                   | Total vertical movement (px) from the initial sample.                                       |
| `totalDisplacement` | `number`                                   | Total displacement (px), computed as the Euclidean magnitude of total movement.             |
| `axis`              | `"x" \| "y"`                               | Dominant axis of movement.                                                                  |
| `velocityX`         | `number`                                   | Instantaneous horizontal velocity (px/ms).                                                  |
| `velocityY`         | `number`                                   | Instantaneous vertical velocity (px/ms).                                                    |
| `directionX`        | `number`                                   | Horizontal movement direction (-1, 0, or 1).                                                |
| `directionY`        | `number`                                   | Vertical movement direction (-1, 0, or 1).                                                  |
| `speed`             | `number`                                   | Magnitude of the velocity vector.                                                           |
| `angle`             | `number`                                   | Movement angle (radians), computed from total displacement.                                 |
| `duration`          | `number`                                   | Total duration (ms) from the initial sample.                                                |
| `deltaTime`         | `number`                                   | Duration (ms) between the last two samples.                                                 |
