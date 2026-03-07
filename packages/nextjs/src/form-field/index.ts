'use client';

import {
  M3eFormField as M3eFormFieldType
} from '@m3e/react/form-field';
import dynamic from 'next/dynamic';

export const M3eFormField = dynamic(() =>
  import("@m3e/react/form-field").then((mod) => mod.M3eFormField)
) as typeof M3eFormFieldType;

