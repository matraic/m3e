'use client';

import {
  M3eSelect as M3eSelectType
} from '@m3e/react/select';
import dynamic from 'next/dynamic';

export const M3eSelect = dynamic(() =>
  import("@m3e/react/select").then((mod) => mod.M3eSelect)
) as typeof M3eSelectType;

