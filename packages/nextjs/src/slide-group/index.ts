'use client';

import {
  M3eSlideGroup as M3eSlideGroupType
} from '@m3e/react/slide-group';
import dynamic from 'next/dynamic';

export const M3eSlideGroup = dynamic(() =>
  import("@m3e/react/slide-group").then((mod) => mod.M3eSlideGroup)
) as typeof M3eSlideGroupType;

