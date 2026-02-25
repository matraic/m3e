/**
 * Adapted from Angular Material CDK Live Announcer
 * Source: https://github.com/angular/components/blob/main/src/cdk/a11y/live-announcer/live-announcer.ts
 *
 * @license MIT
 * Copyright (c) 2025 Google LLC
 * See LICENSE file in the project root for full license text.
 */

import { isServer } from "lit";

import { addAriaReferencedId } from "./aria-reference";
import { visuallyHide } from "./visuallyHide";

/** Specifies the possible politeness levels in which to announce messages. */
export type ARIALivePoliteness = "off" | "polite" | "assertive";

/** Utility for announcing messages to screen readers. */
export class M3eLiveAnnouncer {
  /** @private */ static #nextId = 0;
  /** @private */ static #liveElement?: HTMLElement;
  /** @private */ static #previousTimeout: number;
  /** @private */ static #currentPromise?: Promise<void>;
  /** @private */ static #currentResolve?: () => void;

  /**
   * Announces the specified message to screen readers.
   * @param {string} message The message to announce.
   * @returns {Promise<void>} A `Promise` that resolves when `message` is added to the DOM.
   */
  static announce(message: string): Promise<void>;

  /**
   * Announces the specified message to screen readers.
   * @param {string} message The message to announce.
   * @param {ARIALivePoliteness | undefined} politeness The politeness in which to announce `message`.
   * @returns {Promise<void>} A `Promise` that resolves when `message` is added to the DOM.
   */
  static announce(message: string, politeness?: ARIALivePoliteness): Promise<void>;

  /**
   * Announces the specified message to screen readers.
   * @param {string} message The message to announce.
   * @param {number | undefined} duration The duration, in milliseconds, after which to clear the announcement. Note
   * that this takes effect after the message has been added to the DOM, which can be up to
   * 100ms after `announce` has been called.
   * @returns {Promise<void>} A `Promise` that resolves when `message` is added to the DOM.
   */
  static announce(message: string, duration?: number): Promise<void>;

  /**
   * Announces the specified message to screen readers.
   * @param {string} message The message to announce.
   * @param {ARIALivePoliteness | undefined} politeness The politeness in which to announce `message`.
   * @param {number | undefined} duration The duration, in milliseconds, after which to clear the announcement. Note
   * that this takes effect after the message has been added to the DOM, which can be up to 100ms after `announce` has been called.
   * @returns {Promise<void>} A `Promise` that resolves when `message` is added to the DOM.
   */
  static announce(message: string, politeness?: ARIALivePoliteness, duration?: number): Promise<void>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static announce(message: string, ...args: any[]): Promise<void> {
    if (isServer) {
      return Promise.resolve();
    }

    this.#liveElement = this.#liveElement ?? this.#createLiveElement();

    let politeness: ARIALivePoliteness | undefined;
    let duration: number | undefined;

    if (args.length === 1 && typeof args[0] === "number") {
      duration = args[0];
    } else {
      [politeness, duration] = args;
    }

    this.clear();
    clearTimeout(this.#previousTimeout);

    this.#liveElement.setAttribute("aria-live", politeness ?? "polite");

    for (const modal of document.querySelectorAll("m3e-dialog")) {
      addAriaReferencedId(modal, "aria-owns", this.#liveElement.id);
    }

    this.#currentPromise = this.#currentPromise ?? new Promise((resolve) => (this.#currentResolve = resolve));
    clearTimeout(this.#previousTimeout);

    this.#previousTimeout = setTimeout(() => {
      if (!this.#liveElement) {
        return;
      }

      this.#liveElement.textContent = message;
      if (duration !== undefined) {
        this.#previousTimeout = setTimeout(() => this.clear(), duration);
      }

      this.#currentResolve?.();
      this.#currentPromise = this.#currentResolve = undefined;
    }, 100);

    return this.#currentPromise;
  }

  /**
   * Clears the current text from the announcer element. Can be used to prevent
   * screen readers from reading the text out again while the user is going
   * through page landmarks.
   */
  static clear() {
    if (this.#liveElement) {
      this.#liveElement.textContent = "";
    }
  }

  /** @private */
  static #createLiveElement(): HTMLElement {
    const prev = document.getElementsByClassName("m3e-live-announcer");
    for (let i = 0; i < prev.length; i++) {
      prev[i].remove();
    }

    const liveAnnouncer = document.createElement("div");
    liveAnnouncer.classList.add("m3e-live-announcer");
    liveAnnouncer.setAttribute("aria-atomic", "true");
    liveAnnouncer.setAttribute("aria-live", "polite");
    liveAnnouncer.id = `m3e-live-announcer-${this.#nextId++}`;

    visuallyHide(liveAnnouncer.style);

    document.body.append(liveAnnouncer);

    return liveAnnouncer;
  }
}

// This is the class type, as opposed to an instance of the class.
type M3eLiveAnnouncerClass = typeof M3eLiveAnnouncer;

declare global {
  /** Utility for announcing messages to screen readers. */
  var M3eLiveAnnouncer: M3eLiveAnnouncerClass;
}

globalThis.M3eLiveAnnouncer = M3eLiveAnnouncer;
