'use client';

import {
  M3eIcon as M3eIconType
} from '@m3e/react/icon';
import dynamic from 'next/dynamic';

export const M3eIcon = dynamic(() =>
  import("@m3e/react/icon").then((mod) => mod.M3eIcon)
) as typeof M3eIconType;

