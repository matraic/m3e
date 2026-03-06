'use client';

import {
  M3eSwitch as M3eSwitchType
} from '@m3e/react/switch';
import dynamic from 'next/dynamic';

export const M3eSwitch = dynamic(() =>
  import("@m3e/react/switch").then((mod) => mod.M3eSwitch)
) as typeof M3eSwitchType;

