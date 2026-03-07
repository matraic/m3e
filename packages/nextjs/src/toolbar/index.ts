'use client';

import {
  M3eToolbar as M3eToolbarType
} from '@m3e/react/toolbar';
import dynamic from 'next/dynamic';

export const M3eToolbar = dynamic(() =>
  import("@m3e/react/toolbar").then((mod) => mod.M3eToolbar)
) as typeof M3eToolbarType;

