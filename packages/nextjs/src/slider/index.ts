'use client';

import {
  M3eSlider as M3eSliderType,
  M3eSliderThumb as M3eSliderThumbType
} from '@m3e/react/slider';
import dynamic from 'next/dynamic';

export const M3eSlider = dynamic(() =>
  import("@m3e/react/slider").then((mod) => mod.M3eSlider)
) as typeof M3eSliderType;

export const M3eSliderThumb = dynamic(() =>
  import("@m3e/react/slider").then((mod) => mod.M3eSliderThumb)
) as typeof M3eSliderThumbType;

