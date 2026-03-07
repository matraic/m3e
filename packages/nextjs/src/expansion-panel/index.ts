'use client';

import {
  M3eExpansionPanel as M3eExpansionPanelType
} from '@m3e/react/expansion-panel';
import dynamic from 'next/dynamic';

export const M3eExpansionPanel = dynamic(() =>
  import("@m3e/react/expansion-panel").then((mod) => mod.M3eExpansionPanel)
) as typeof M3eExpansionPanelType;

