'use client';

import {
  M3eDrawerContainer as M3eDrawerContainerType,
  M3eDrawerToggle as M3eDrawerToggleType
} from '@m3e/react/drawer-container';
import dynamic from 'next/dynamic';

export const M3eDrawerContainer = dynamic(() =>
  import("@m3e/react/drawer-container").then((mod) => mod.M3eDrawerContainer)
) as typeof M3eDrawerContainerType;

export const M3eDrawerToggle = dynamic(() =>
  import("@m3e/react/drawer-container").then((mod) => mod.M3eDrawerToggle)
) as typeof M3eDrawerToggleType;

