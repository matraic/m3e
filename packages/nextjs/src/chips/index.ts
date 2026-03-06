'use client';

import {
  M3eChip as M3eChipType,
  M3eAssistChip as M3eAssistChipType,
  M3eFilterChip as M3eFilterChipType,
  M3eInputChip as M3eInputChipType,
  M3eSuggestionChip as M3eSuggestionChipType,
  M3eChipSet as M3eChipSetType,
  M3eFilterChipSet as M3eFilterChipSetType,
  M3eInputChipSet as M3eInputChipSetType
} from '@m3e/react/chips';
import dynamic from 'next/dynamic';

export const M3eChip = dynamic(() =>
  import("@m3e/react/chips").then((mod) => mod.M3eChip)
) as typeof M3eChipType;

export const M3eAssistChip = dynamic(() =>
  import("@m3e/react/chips").then((mod) => mod.M3eAssistChip)
) as typeof M3eAssistChipType;

export const M3eFilterChip = dynamic(() =>
  import("@m3e/react/chips").then((mod) => mod.M3eFilterChip)
) as typeof M3eFilterChipType;

export const M3eInputChip = dynamic(() =>
  import("@m3e/react/chips").then((mod) => mod.M3eInputChip)
) as typeof M3eInputChipType;

export const M3eSuggestionChip = dynamic(() =>
  import("@m3e/react/chips").then((mod) => mod.M3eSuggestionChip)
) as typeof M3eSuggestionChipType;

export const M3eChipSet = dynamic(() =>
  import("@m3e/react/chips").then((mod) => mod.M3eChipSet)
) as typeof M3eChipSetType;

export const M3eFilterChipSet = dynamic(() =>
  import("@m3e/react/chips").then((mod) => mod.M3eFilterChipSet)
) as typeof M3eFilterChipSetType;

export const M3eInputChipSet = dynamic(() =>
  import("@m3e/react/chips").then((mod) => mod.M3eInputChipSet)
) as typeof M3eInputChipSetType;

