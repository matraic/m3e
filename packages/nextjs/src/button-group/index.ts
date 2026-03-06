'use client';

import {
  M3eButtonGroup as M3eButtonGroupType
} from '@m3e/react/button-group';
import dynamic from 'next/dynamic';

export const M3eButtonGroup = dynamic(() =>
  import("@m3e/react/button-group").then((mod) => mod.M3eButtonGroup)
) as typeof M3eButtonGroupType;

