'use client';

import {
  M3eCircularProgressIndicator as M3eCircularProgressIndicatorType,
  M3eLinearProgressIndicator as M3eLinearProgressIndicatorType
} from '@m3e/react/progress-indicator';
import dynamic from 'next/dynamic';

export const M3eCircularProgressIndicator = dynamic(() =>
  import("@m3e/react/progress-indicator").then((mod) => mod.M3eCircularProgressIndicator)
) as typeof M3eCircularProgressIndicatorType;

export const M3eLinearProgressIndicator = dynamic(() =>
  import("@m3e/react/progress-indicator").then((mod) => mod.M3eLinearProgressIndicator)
) as typeof M3eLinearProgressIndicatorType;

