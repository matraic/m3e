'use client';

import {
  M3eNavMenu as M3eNavMenuType,
  M3eNavMenuItem as M3eNavMenuItemType,
  M3eNavMenuItemGroup as M3eNavMenuItemGroupType
} from '@m3e/react/nav-menu';
import dynamic from 'next/dynamic';

export const M3eNavMenu = dynamic(() =>
  import("@m3e/react/nav-menu").then((mod) => mod.M3eNavMenu)
) as typeof M3eNavMenuType;

export const M3eNavMenuItem = dynamic(() =>
  import("@m3e/react/nav-menu").then((mod) => mod.M3eNavMenuItem)
) as typeof M3eNavMenuItemType;

export const M3eNavMenuItemGroup = dynamic(() =>
  import("@m3e/react/nav-menu").then((mod) => mod.M3eNavMenuItemGroup)
) as typeof M3eNavMenuItemGroupType;

