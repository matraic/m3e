'use client';

import {
  M3eCheckbox as M3eCheckboxType
} from '@m3e/react/checkbox';
import dynamic from 'next/dynamic';

export const M3eCheckbox = dynamic(() =>
  import("@m3e/react/checkbox").then((mod) => mod.M3eCheckbox)
) as typeof M3eCheckboxType;

