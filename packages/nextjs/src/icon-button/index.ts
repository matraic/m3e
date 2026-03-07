'use client';

import {
  M3eIconButton as M3eIconButtonType
} from '@m3e/react/icon-button';
import dynamic from 'next/dynamic';

export const M3eIconButton = dynamic(() =>
  import("@m3e/react/icon-button").then((mod) => mod.M3eIconButton)
) as typeof M3eIconButtonType;

