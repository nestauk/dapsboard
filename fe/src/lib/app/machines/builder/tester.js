import { Machine } from 'xstate';
import { builderTesterConfig } from './tester.config.js';
import { builderTesterOptions } from './tester.options.js';

export const BuilderTestMachine = Machine(builderTesterConfig, builderTesterOptions);
