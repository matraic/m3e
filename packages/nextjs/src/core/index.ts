'use client';

import {
  M3eCollapsible as M3eCollapsibleType,
  M3eElevation as M3eElevationType,
  M3eFocusRing as M3eFocusRingType,
  M3ePseudoCheckbox as M3ePseudoCheckboxType,
  M3ePseudoRadio as M3ePseudoRadioType,
  M3eRipple as M3eRippleType,
  M3eScrollContainer as M3eScrollContainerType,
  M3eSlide as M3eSlideType,
  M3eStateLayer as M3eStateLayerType,
  M3eTextHighlight as M3eTextHighlightType,
  M3eTextOverflow as M3eTextOverflowType
} from '@m3e/react/core';
import dynamic from 'next/dynamic';

export const M3eCollapsible = dynamic(() =>
  import("@m3e/react/core").then((mod) => mod.M3eCollapsible)
) as typeof M3eCollapsibleType;

export const M3eElevation = dynamic(() =>
  import("@m3e/react/core").then((mod) => mod.M3eElevation)
) as typeof M3eElevationType;

export const M3eFocusRing = dynamic(() =>
  import("@m3e/react/core").then((mod) => mod.M3eFocusRing)
) as typeof M3eFocusRingType;

export const M3ePseudoCheckbox = dynamic(() =>
  import("@m3e/react/core").then((mod) => mod.M3ePseudoCheckbox)
) as typeof M3ePseudoCheckboxType;

export const M3ePseudoRadio = dynamic(() =>
  import("@m3e/react/core").then((mod) => mod.M3ePseudoRadio)
) as typeof M3ePseudoRadioType;

export const M3eRipple = dynamic(() =>
  import("@m3e/react/core").then((mod) => mod.M3eRipple)
) as typeof M3eRippleType;

export const M3eScrollContainer = dynamic(() =>
  import("@m3e/react/core").then((mod) => mod.M3eScrollContainer)
) as typeof M3eScrollContainerType;

export const M3eSlide = dynamic(() =>
  import("@m3e/react/core").then((mod) => mod.M3eSlide)
) as typeof M3eSlideType;

export const M3eStateLayer = dynamic(() =>
  import("@m3e/react/core").then((mod) => mod.M3eStateLayer)
) as typeof M3eStateLayerType;

export const M3eTextHighlight = dynamic(() =>
  import("@m3e/react/core").then((mod) => mod.M3eTextHighlight)
) as typeof M3eTextHighlightType;

export const M3eTextOverflow = dynamic(() =>
  import("@m3e/react/core").then((mod) => mod.M3eTextOverflow)
) as typeof M3eTextOverflowType;

