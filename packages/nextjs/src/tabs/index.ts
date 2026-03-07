'use client';

import {
  M3eTabs as M3eTabsType,
  M3eTab as M3eTabType,
  M3eTabPanel as M3eTabPanelType
} from '@m3e/react/tabs';
import dynamic from 'next/dynamic';

export const M3eTabs = dynamic(() =>
  import("@m3e/react/tabs").then((mod) => mod.M3eTabs)
) as typeof M3eTabsType;

export const M3eTab = dynamic(() =>
  import("@m3e/react/tabs").then((mod) => mod.M3eTab)
) as typeof M3eTabType;

export const M3eTabPanel = dynamic(() =>
  import("@m3e/react/tabs").then((mod) => mod.M3eTabPanel)
) as typeof M3eTabPanelType;

