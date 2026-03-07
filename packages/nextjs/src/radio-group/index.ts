'use client';

import {
  M3eRadioGroup as M3eRadioGroupType,
  M3eRadio as M3eRadioType
} from '@m3e/react/radio-group';
import dynamic from 'next/dynamic';

export const M3eRadioGroup = dynamic(() =>
  import("@m3e/react/radio-group").then((mod) => mod.M3eRadioGroup)
) as typeof M3eRadioGroupType;

export const M3eRadio = dynamic(() =>
  import("@m3e/react/radio-group").then((mod) => mod.M3eRadio)
) as typeof M3eRadioType;

