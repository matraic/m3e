'use client';

import {
  M3eButton as M3eButtonType
} from '@m3e/react/button';
import dynamic from 'next/dynamic';

export const M3eButton = dynamic(() =>
  import("@m3e/react/button").then((mod) => mod.M3eButton)
) as typeof M3eButtonType;

