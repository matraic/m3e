# @m3e/web/gestures/swipe

Recognizes fast directional pointer movement.

```ts
import { swipe } from "@m3e/web/gestures/swipe";

const recognizer = swipe({ minVelocity: 0.3 });
recognizer.addListener((detail) => console.log(detail.direction));
```

## Declarative usage

```ts
import "@m3e/web/gestures/swipe";
```

```html
<div id="surface"></div>
<m3e-swipe-gesture for="surface"></m3e-swipe-gesture>
```

The element dispatches a `gesture` event with `SwipeGestureDetail` as its detail.

## Options

| Attribute                | Type                                               | Default                           | Description                                                                                      |
| ------------------------ | -------------------------------------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------ |
| `disabled`               | `boolean`                                          | `false`                           | Whether gesture recognition is disabled.                                                         |
| `priority`               | `number`                                           | `1`                               | The priority in which to recognize gestures.                                                     |
| `buttons`                | `readonly GestureInputButton[]`                    | `["primary"]`                     | Which buttons can be pressed.                                                                    |
| `pointer-types`          | `readonly PointerType[]`                           | `["mouse", "pen", "touch"]`       | Which pointer types can be used.                                                                 |
| `input-filter`           | `GestureInputFilter`                               | —                                 | Predicate used to determine whether input can be recognized.                                     |
| `pointers`               | `number`                                           | `1`                               | Number of pointers required for the gesture to be recognized.                                    |
| `start-threshold`        | `number`                                           | `4`                               | Minimum distance (px) a pointer must move before the gesture starts.                             |
| `min-velocity`           | `number`                                           | `0.3`                             | Minimum velocity (px/ms) required to recognize a swipe.                                          |
| `directions`             | `readonly ("left" \| "right" \| "up" \| "down")[]` | `["left", "right", "up", "down"]` | The allowed directions of the swipe.                                                             |
| `direction-threshold`    | `number`                                           | `12`                              | Minimum displacement (px) required before a direction is considered valid.                       |
| `direction-grace-period` | `number`                                           | `0`                               | Maximum time (ms) a pointer can move in an uncommitted or disallowed direction before rejection. |
| `min-displacement`       | `number`                                           | `24`                              | Minimum distance (px) a pointer must move before recognition.                                    |
| `max-press-interval`     | `number`                                           | `120`                             | Maximum allowed time (ms) between the earliest and latest press.                                 |

## Detail

| Property       | Type                                       | Description                                                     |
| -------------- | ------------------------------------------ | --------------------------------------------------------------- |
| `gestureName`  | `string`                                   | The name of the gesture.                                        |
| `phase`        | `"start" \| "update" \| "end" \| "cancel"` | The current phase of the gesture.                               |
| `inputId`      | `number \| readonly number[]`              | The identifier of the input stream(s) that produced the detail. |
| `timestamp`    | `number`                                   | The timestamp at which the gesture detail was produced.         |
| `direction`    | `"left" \| "right" \| "up" \| "down"`      | Resolved swipe direction.                                       |
| `axis`         | `"x" \| "y"`                               | Dominant axis of movement.                                      |
| `translationX` | `number`                                   | Total horizontal movement (px).                                 |
| `translationY` | `number`                                   | Total vertical movement (px).                                   |
| `velocityX`    | `number`                                   | Instantaneous horizontal velocity (px/ms).                      |
| `velocityY`    | `number`                                   | Instantaneous vertical velocity (px/ms).                        |
| `speed`        | `number`                                   | Velocity magnitude (px/ms).                                     |
| `displacement` | `number`                                   | Total displacement (px).                                        |
| `duration`     | `number`                                   | Total duration (ms).                                            |
