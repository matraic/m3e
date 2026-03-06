'use client';

import {
  M3eAppBar as M3eAppBarType
} from '@m3e/react/app-bar';
import dynamic from 'next/dynamic';

export const M3eAppBar = dynamic(() =>
  import("@m3e/react/app-bar").then((mod) => mod.M3eAppBar)
) as typeof M3eAppBarType;

