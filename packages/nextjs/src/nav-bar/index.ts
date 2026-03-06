'use client';

import {
  M3eNavBar as M3eNavBarType,
  M3eNavItem as M3eNavItemType
} from '@m3e/react/nav-bar';
import dynamic from 'next/dynamic';

export const M3eNavBar = dynamic(() =>
  import("@m3e/react/nav-bar").then((mod) => mod.M3eNavBar)
) as typeof M3eNavBarType;

export const M3eNavItem = dynamic(() =>
  import("@m3e/react/nav-bar").then((mod) => mod.M3eNavItem)
) as typeof M3eNavItemType;

