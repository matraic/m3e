'use client';

import {
  M3eAvatar as M3eAvatarType
} from '@m3e/react/avatar';
import dynamic from 'next/dynamic';

export const M3eAvatar = dynamic(() =>
  import("@m3e/react/avatar").then((mod) => mod.M3eAvatar)
) as typeof M3eAvatarType;

