'use client';

import {
  M3eStepper as M3eStepperType,
  M3eStep as M3eStepType,
  M3eStepPanel as M3eStepPanelType,
  M3eStepperNext as M3eStepperNextType,
  M3eStepperPrevious as M3eStepperPreviousType,
  M3eStepperReset as M3eStepperResetType
} from '@m3e/react/stepper';
import dynamic from 'next/dynamic';

export const M3eStepper = dynamic(() =>
  import("@m3e/react/stepper").then((mod) => mod.M3eStepper)
) as typeof M3eStepperType;

export const M3eStep = dynamic(() =>
  import("@m3e/react/stepper").then((mod) => mod.M3eStep)
) as typeof M3eStepType;

export const M3eStepPanel = dynamic(() =>
  import("@m3e/react/stepper").then((mod) => mod.M3eStepPanel)
) as typeof M3eStepPanelType;

export const M3eStepperNext = dynamic(() =>
  import("@m3e/react/stepper").then((mod) => mod.M3eStepperNext)
) as typeof M3eStepperNextType;

export const M3eStepperPrevious = dynamic(() =>
  import("@m3e/react/stepper").then((mod) => mod.M3eStepperPrevious)
) as typeof M3eStepperPreviousType;

export const M3eStepperReset = dynamic(() =>
  import("@m3e/react/stepper").then((mod) => mod.M3eStepperReset)
) as typeof M3eStepperResetType;

