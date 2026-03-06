'use client';

import {
  M3eBottomSheet as M3eBottomSheetType,
  M3eBottomSheetAction as M3eBottomSheetActionType,
  M3eBottomSheetTrigger as M3eBottomSheetTriggerType
} from '@m3e/react/bottom-sheet';
import dynamic from 'next/dynamic';

export const M3eBottomSheet = dynamic(() =>
  import("@m3e/react/bottom-sheet").then((mod) => mod.M3eBottomSheet)
) as typeof M3eBottomSheetType;

export const M3eBottomSheetAction = dynamic(() =>
  import("@m3e/react/bottom-sheet").then((mod) => mod.M3eBottomSheetAction)
) as typeof M3eBottomSheetActionType;

export const M3eBottomSheetTrigger = dynamic(() =>
  import("@m3e/react/bottom-sheet").then((mod) => mod.M3eBottomSheetTrigger)
) as typeof M3eBottomSheetTriggerType;

