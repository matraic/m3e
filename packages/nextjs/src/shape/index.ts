'use client';

import {
  M3eShape as M3eShapeType
} from '@m3e/react/shape';
import dynamic from 'next/dynamic';

export const M3eShape = dynamic(() =>
  import("@m3e/react/shape").then((mod) => mod.M3eShape)
) as typeof M3eShapeType;

