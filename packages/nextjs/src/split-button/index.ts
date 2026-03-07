'use client';

import {
  M3eSplitButton as M3eSplitButtonType
} from '@m3e/react/split-button';
import dynamic from 'next/dynamic';

export const M3eSplitButton = dynamic(() =>
  import("@m3e/react/split-button").then((mod) => mod.M3eSplitButton)
) as typeof M3eSplitButtonType;

