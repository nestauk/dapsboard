import { Machine } from 'xstate';
import { builderTesterConfig } from './tester.config';
import { builderTesterOptions } from './tester.options';

export const BuilderTestMachine = Machine(builderTesterConfig, builderTesterOptions);
