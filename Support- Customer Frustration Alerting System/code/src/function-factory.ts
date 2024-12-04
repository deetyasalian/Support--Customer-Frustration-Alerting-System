/*
 * Copyright (c) 2023 DevRev, Inc. All rights reserved.
 */

import frustration_detection from './functions/frustration_detection/index';
import function_2 from './functions/function_2/index'

export const functionFactory = {
  frustration_detection,
  function_2,
} as const;

export type FunctionFactoryType = keyof typeof functionFactory;
