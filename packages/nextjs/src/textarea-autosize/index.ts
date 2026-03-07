'use client';

import {
  M3eTextareaAutosize as M3eTextareaAutosizeType
} from '@m3e/react/textarea-autosize';
import dynamic from 'next/dynamic';

export const M3eTextareaAutosize = dynamic(() =>
  import("@m3e/react/textarea-autosize").then((mod) => mod.M3eTextareaAutosize)
) as typeof M3eTextareaAutosizeType;

