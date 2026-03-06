'use client';

import {
  M3eNavRail as M3eNavRailType,
  M3eNavRailToggle as M3eNavRailToggleType
} from '@m3e/react/nav-rail';
import dynamic from 'next/dynamic';

export const M3eNavRail = dynamic(() =>
  import("@m3e/react/nav-rail").then((mod) => mod.M3eNavRail)
) as typeof M3eNavRailType;

export const M3eNavRailToggle = dynamic(() =>
  import("@m3e/react/nav-rail").then((mod) => mod.M3eNavRailToggle)
) as typeof M3eNavRailToggleType;

