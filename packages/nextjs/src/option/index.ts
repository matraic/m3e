'use client';

import {
  M3eOption as M3eOptionType
} from '@m3e/react/option';
import dynamic from 'next/dynamic';

export const M3eOption = dynamic(() =>
  import("@m3e/react/option").then((mod) => mod.M3eOption)
) as typeof M3eOptionType;

