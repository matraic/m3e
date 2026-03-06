'use client';

import {
  M3eTheme as M3eThemeType
} from '@m3e/react/theme';
import dynamic from 'next/dynamic';

export const M3eTheme = dynamic(() =>
  import("@m3e/react/theme").then((mod) => mod.M3eTheme)
) as typeof M3eThemeType;

