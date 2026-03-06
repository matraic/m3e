'use client';

import {
  M3eDivider as M3eDividerType
} from '@m3e/react/divider';
import dynamic from 'next/dynamic';

export const M3eDivider = dynamic(() =>
  import("@m3e/react/divider").then((mod) => mod.M3eDivider)
) as typeof M3eDividerType;

