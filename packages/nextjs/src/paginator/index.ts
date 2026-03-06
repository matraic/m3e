'use client';

import {
  M3ePaginator as M3ePaginatorType
} from '@m3e/react/paginator';
import dynamic from 'next/dynamic';

export const M3ePaginator = dynamic(() =>
  import("@m3e/react/paginator").then((mod) => mod.M3ePaginator)
) as typeof M3ePaginatorType;

