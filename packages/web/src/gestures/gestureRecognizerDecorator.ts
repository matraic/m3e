/* eslint-disable @typescript-eslint/no-explicit-any */
import { GestureRecognizerBase } from "./GestureRecognizerBase";
import { registerGestureRecognizer } from "./GestureRecognizerRegistry";

/**
 * Class decorator factory that defines the decorated class as a gesture recognizer.
 * @param {string} type The type of recognized gesture.
 */
export function gestureRecognizer(type: string) {
  return function (
    ctor: Omit<typeof GestureRecognizerBase, "new"> | (new (...args: any[]) => GestureRecognizerBase<any, any>),
    context?: ClassDecoratorContext<typeof GestureRecognizerBase>,
  ) {
    // Assign static gestureType metadata
    (ctor as typeof GestureRecognizerBase).gestureType = type;

    const register = () => {
      const concrete = ctor as new (...args: any[]) => GestureRecognizerBase<any, any>;
      registerGestureRecognizer(type, (options) => new concrete(options));
    };

    if (context) {
      context.addInitializer(register);
    } else {
      register();
    }
  };
}
