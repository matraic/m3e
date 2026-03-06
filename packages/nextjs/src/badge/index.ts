'use client';

import {
  M3eBadge as M3eBadgeType
} from '@m3e/react/badge';
import dynamic from 'next/dynamic';

export const M3eBadge = dynamic(() =>
  import("@m3e/react/badge").then((mod) => mod.M3eBadge)
) as typeof M3eBadgeType;

