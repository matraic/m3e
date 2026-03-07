'use client';

import {
  M3eSegmentedButton as M3eSegmentedButtonType,
  M3eButtonSegment as M3eButtonSegmentType
} from '@m3e/react/segmented-button';
import dynamic from 'next/dynamic';

export const M3eSegmentedButton = dynamic(() =>
  import("@m3e/react/segmented-button").then((mod) => mod.M3eSegmentedButton)
) as typeof M3eSegmentedButtonType;

export const M3eButtonSegment = dynamic(() =>
  import("@m3e/react/segmented-button").then((mod) => mod.M3eButtonSegment)
) as typeof M3eButtonSegmentType;

