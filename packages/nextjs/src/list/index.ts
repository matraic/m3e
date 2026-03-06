'use client';

import {
  M3eList as M3eListType,
  M3eActionList as M3eActionListType,
  M3eListItem as M3eListItemType,
  M3eExpandableListItem as M3eExpandableListItemType,
  M3eListAction as M3eListActionType,
  M3eListOption as M3eListOptionType,
  M3eSelectionList as M3eSelectionListType
} from '@m3e/react/list';
import dynamic from 'next/dynamic';

export const M3eList = dynamic(() =>
  import("@m3e/react/list").then((mod) => mod.M3eList)
) as typeof M3eListType;

export const M3eActionList = dynamic(() =>
  import("@m3e/react/list").then((mod) => mod.M3eActionList)
) as typeof M3eActionListType;

export const M3eListItem = dynamic(() =>
  import("@m3e/react/list").then((mod) => mod.M3eListItem)
) as typeof M3eListItemType;

export const M3eExpandableListItem = dynamic(() =>
  import("@m3e/react/list").then((mod) => mod.M3eExpandableListItem)
) as typeof M3eExpandableListItemType;

export const M3eListAction = dynamic(() =>
  import("@m3e/react/list").then((mod) => mod.M3eListAction)
) as typeof M3eListActionType;

export const M3eListOption = dynamic(() =>
  import("@m3e/react/list").then((mod) => mod.M3eListOption)
) as typeof M3eListOptionType;

export const M3eSelectionList = dynamic(() =>
  import("@m3e/react/list").then((mod) => mod.M3eSelectionList)
) as typeof M3eSelectionListType;

