/**
 * Adapted from Angular Material CDK Platform
 * Source: https://github.com/angular/components/blob/main/src/cdk/platform/platform.ts
 *
 * @license MIT
 * Copyright (c) 2025 Google LLC
 * See LICENSE file in the project root for full license text.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { isServer } from "lit";

let hasV8BreakIterator: boolean;

try {
  hasV8BreakIterator = typeof Intl !== "undefined" && (Intl as any).v8BreakIterator;
} catch {
  hasV8BreakIterator = false;
}

/** Utility used to detect the current platform. */
export class M3ePlatform {
  /** A value indicating whether the platform is a browser. */
  static readonly isBrowser = !isServer && typeof document === "object" && !!document;

  /** A value indicating whether the current browser is Microsoft Edge. */
  static readonly Edge = M3ePlatform.isBrowser && /(edge)/i.test(navigator.userAgent);

  /** A value indicating whether the current rendering engine is Microsoft Trident. */
  static readonly Trident = M3ePlatform.isBrowser && /(msie|trident)/i.test(navigator.userAgent);

  /** A value indicating whether the current rendering engine is Blink. */
  static readonly Blink =
    M3ePlatform.isBrowser &&
    !!((window as any).chrome || hasV8BreakIterator) &&
    typeof CSS !== "undefined" &&
    !M3ePlatform.Edge &&
    !M3ePlatform.Trident;

  /** A value indicating whether the current rendering engine is WebKit. */
  static readonly WebKit =
    M3ePlatform.isBrowser &&
    /AppleWebKit/i.test(navigator.userAgent) &&
    !M3ePlatform.Blink &&
    !M3ePlatform.Edge &&
    !M3ePlatform.Trident;

  /** A value indicating whether the current platform is Apply iOS. */
  static readonly iOS =
    M3ePlatform.isBrowser && /iPad|iPhone|iPod/.test(navigator.userAgent) && !("MSStream" in window);

  /** A value indicating whether the current browser is Firefox. */
  static readonly Firefox = M3ePlatform.isBrowser && /(firefox|minefield)/i.test(navigator.userAgent);

  /** A value indicating whether the current platform is Android. */
  static readonly Android = M3ePlatform.isBrowser && /android/i.test(navigator.userAgent) && !M3ePlatform.Trident;

  /** A value indicating whether the current browser is Safari. */
  static readonly Safari = M3ePlatform.isBrowser && /safari/i.test(navigator.userAgent) && M3ePlatform.WebKit;
}

// This is the class type, as opposed to an instance of the class.
type M3ePlatformClass = typeof M3ePlatform;

declare global {
  /** Utility used to detect the current platform. */
  var M3ePlatform: M3ePlatformClass;
}

globalThis.M3ePlatform = M3ePlatform;
