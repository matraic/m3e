'use client';

import {
  M3eLoadingIndicator as M3eLoadingIndicatorType
} from '@m3e/react/loading-indicator';
import dynamic from 'next/dynamic';

export const M3eLoadingIndicator = dynamic(() =>
  import("@m3e/react/loading-indicator").then((mod) => mod.M3eLoadingIndicator)
) as typeof M3eLoadingIndicatorType;

