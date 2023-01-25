import { createMachina } from '../utils.js';
import { Machine } from 'xstate';

import { formConfig } from './form.config.js';
import { formOptions } from './form.options.js';

export const createFormMachine = ctx => createMachina(
	formConfig,
	formOptions,
	ctx
);

export const formTemplate = Machine(formConfig, formOptions);
