'use client';

import {
  M3eFabMenu as M3eFabMenuType,
  M3eFabMenuItem as M3eFabMenuItemType,
  M3eFabMenuTrigger as M3eFabMenuTriggerType
} from '@m3e/react/fab-menu';
import dynamic from 'next/dynamic';

export const M3eFabMenu = dynamic(() =>
  import("@m3e/react/fab-menu").then((mod) => mod.M3eFabMenu)
) as typeof M3eFabMenuType;

export const M3eFabMenuItem = dynamic(() =>
  import("@m3e/react/fab-menu").then((mod) => mod.M3eFabMenuItem)
) as typeof M3eFabMenuItemType;

export const M3eFabMenuTrigger = dynamic(() =>
  import("@m3e/react/fab-menu").then((mod) => mod.M3eFabMenuTrigger)
) as typeof M3eFabMenuTriggerType;

