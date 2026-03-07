'use client';

import {
  M3eFab as M3eFabType
} from '@m3e/react/fab';
import dynamic from 'next/dynamic';

export const M3eFab = dynamic(() =>
  import("@m3e/react/fab").then((mod) => mod.M3eFab)
) as typeof M3eFabType;

