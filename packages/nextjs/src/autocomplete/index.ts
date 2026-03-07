'use client';

import {
  M3eAutocomplete as M3eAutocompleteType
} from '@m3e/react/autocomplete';
import dynamic from 'next/dynamic';

export const M3eAutocomplete = dynamic(() =>
  import("@m3e/react/autocomplete").then((mod) => mod.M3eAutocomplete)
) as typeof M3eAutocompleteType;

