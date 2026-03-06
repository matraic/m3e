'use client';

import {
  M3eHeading as M3eHeadingType
} from '@m3e/react/heading';
import dynamic from 'next/dynamic';

export const M3eHeading = dynamic(() =>
  import("@m3e/react/heading").then((mod) => mod.M3eHeading)
) as typeof M3eHeadingType;

