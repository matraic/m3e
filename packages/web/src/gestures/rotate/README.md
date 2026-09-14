# @m3e/web/gestures/rotate

Recognizes rotation made by multiple pointers.

```ts
import { rotate } from "@m3e/web/gestures/rotate";

const recognizer = rotate({ pointers: 2 });
recognizer.addListener((detail) => console.log(detail.rotation));
```

## Declarative usage

```ts
import "@m3e/web/gestures/rotate";
```

```html
<div id="canvas"></div>
<m3e-rotate-gesture for="canvas"></m3e-rotate-gesture>
```

The element dispatches a `gesture` event with `RotateGestureDetail` as its detail.

## Options

| Attribute            | Type                            | Default                     | Description                                                      |
| -------------------- | ------------------------------- | --------------------------- | ---------------------------------------------------------------- |
| `disabled`           | `boolean`                       | `false`                     | Whether gesture recognition is disabled.                         |
| `priority`           | `number`                        | `1`                         | The priority in which to recognize gestures.                     |
| `buttons`            | `readonly GestureInputButton[]` | `["primary"]`               | Which buttons can be pressed.                                    |
| `pointer-types`      | `readonly PointerType[]`        | `["mouse", "pen", "touch"]` | Which pointer types can be used.                                 |
| `input-filter`       | `GestureInputFilter`            | —                           | Predicate used to determine whether input can be recognized.     |
| `pointers`           | `number`                        | `2`                         | Number of pointers required for the gesture to be recognized.    |
| `activation-mode`    | `"press" \| "move"`             | `"press"`                   | Mode in which to activate the gesture.                           |
| `min-displacement`   | `number`                        | `4`                         | Minimum centroid displacement (px) before rotation starts.       |
| `max-press-interval` | `number`                        | `120`                       | Maximum allowed time (ms) between the earliest and latest press. |

## Detail

| Property           | Type                                       | Description                                                     |
| ------------------ | ------------------------------------------ | --------------------------------------------------------------- |
| `gestureName`      | `string`                                   | The name of the gesture.                                        |
| `phase`            | `"start" \| "update" \| "end" \| "cancel"` | The current phase of the gesture.                               |
| `inputId`          | `number \| readonly number[]`              | The identifier of the input stream(s) that produced the detail. |
| `timestamp`        | `number`                                   | The timestamp at which the gesture detail was produced.         |
| `rotation`         | `number`                                   | Total rotation (radians) since activation.                      |
| `rotationDelta`    | `number`                                   | Incremental rotation (radians) between the last two samples.    |
| `rotationVelocity` | `number`                                   | Instantaneous angular velocity (radians/ms).                    |
| `currentAngle`     | `number`                                   | Average angle (radians) of all pointers relative to centroid.   |
| `initialAngle`     | `number`                                   | Angle (radians) at activation.                                  |
