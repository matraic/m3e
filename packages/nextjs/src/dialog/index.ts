'use client';

import {
  M3eDialog as M3eDialogType,
  M3eDialogAction as M3eDialogActionType,
  M3eDialogTrigger as M3eDialogTriggerType
} from '@m3e/react/dialog';
import dynamic from 'next/dynamic';

export const M3eDialog = dynamic(() =>
  import("@m3e/react/dialog").then((mod) => mod.M3eDialog)
) as typeof M3eDialogType;

export const M3eDialogAction = dynamic(() =>
  import("@m3e/react/dialog").then((mod) => mod.M3eDialogAction)
) as typeof M3eDialogActionType;

export const M3eDialogTrigger = dynamic(() =>
  import("@m3e/react/dialog").then((mod) => mod.M3eDialogTrigger)
) as typeof M3eDialogTriggerType;

