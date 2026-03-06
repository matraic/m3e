'use client';

import {
  M3eCard as M3eCardType
} from '@m3e/react/card';
import dynamic from 'next/dynamic';

export const M3eCard = dynamic(() =>
  import("@m3e/react/card").then((mod) => mod.M3eCard)
) as typeof M3eCardType;

