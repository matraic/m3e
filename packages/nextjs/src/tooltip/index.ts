'use client';

import {
  M3eTooltip as M3eTooltipType,
  M3eRichTooltip as M3eRichTooltipType,
  M3eRichTooltipAction as M3eRichTooltipActionType
} from '@m3e/react/tooltip';
import dynamic from 'next/dynamic';

export const M3eTooltip = dynamic(() =>
  import("@m3e/react/tooltip").then((mod) => mod.M3eTooltip)
) as typeof M3eTooltipType;

export const M3eRichTooltip = dynamic(() =>
  import("@m3e/react/tooltip").then((mod) => mod.M3eRichTooltip)
) as typeof M3eRichTooltipType;

export const M3eRichTooltipAction = dynamic(() =>
  import("@m3e/react/tooltip").then((mod) => mod.M3eRichTooltipAction)
) as typeof M3eRichTooltipActionType;

