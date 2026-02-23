import { ReactiveController, ReactiveControllerHost } from "lit";

/** A `ReactiveController` used to execute a function in an animation loop. */
export class AnimationLoopController implements ReactiveController {
  /** @private */ #frameId: number | null = null;
  /** @private */ #lastTime = 0;
  /** @private */ #running = false;

  /** @private */ readonly #callback: (deltaTime: number, elapsedTime: number) => void;
  /** @private */ readonly #loop = () => {
    if (!this.#running) return;

    const now = performance.now();
    this.#callback((now - this.#lastTime) / 1000, now / 1000);
    this.#lastTime = now;
    this.#frameId = requestAnimationFrame(this.#loop);
  };

  constructor(host: ReactiveControllerHost, callback: (deltaTime: number, elapsedTime: number) => void) {
    this.#callback = callback;
    host.addController(this);
  }

  /** @inheritdoc */
  hostDisconnected() {
    this.stop();
  }

  /** Starts the animation loop. */
  start() {
    if (this.#running) return;

    this.#running = true;
    this.#lastTime = performance.now();
    this.#loop();
  }

  /** Stops the animation loop. */
  stop() {
    if (!this.#running) return;

    this.#running = false;
    if (this.#frameId !== null) {
      cancelAnimationFrame(this.#frameId);
      this.#frameId = null;
    }
  }
}
