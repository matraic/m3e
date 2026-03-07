'use client';

import {
  M3eMenu as M3eMenuType,
  M3eMenuItem as M3eMenuItemType,
  M3eMenuItemCheckbox as M3eMenuItemCheckboxType,
  M3eMenuItemGroup as M3eMenuItemGroupType,
  M3eMenuItemRadio as M3eMenuItemRadioType,
  M3eMenuTrigger as M3eMenuTriggerType
} from '@m3e/react/menu';
import dynamic from 'next/dynamic';

export const M3eMenu = dynamic(() =>
  import("@m3e/react/menu").then((mod) => mod.M3eMenu)
) as typeof M3eMenuType;

export const M3eMenuItem = dynamic(() =>
  import("@m3e/react/menu").then((mod) => mod.M3eMenuItem)
) as typeof M3eMenuItemType;

export const M3eMenuItemCheckbox = dynamic(() =>
  import("@m3e/react/menu").then((mod) => mod.M3eMenuItemCheckbox)
) as typeof M3eMenuItemCheckboxType;

export const M3eMenuItemGroup = dynamic(() =>
  import("@m3e/react/menu").then((mod) => mod.M3eMenuItemGroup)
) as typeof M3eMenuItemGroupType;

export const M3eMenuItemRadio = dynamic(() =>
  import("@m3e/react/menu").then((mod) => mod.M3eMenuItemRadio)
) as typeof M3eMenuItemRadioType;

export const M3eMenuTrigger = dynamic(() =>
  import("@m3e/react/menu").then((mod) => mod.M3eMenuTrigger)
) as typeof M3eMenuTriggerType;

