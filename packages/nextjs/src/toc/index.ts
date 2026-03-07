'use client';

import {
  M3eToc as M3eTocType
} from '@m3e/react/toc';
import dynamic from 'next/dynamic';

export const M3eToc = dynamic(() =>
  import("@m3e/react/toc").then((mod) => mod.M3eToc)
) as typeof M3eTocType;

