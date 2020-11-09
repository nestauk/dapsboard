import { createMachina } from '../utils';
import { Machine } from 'xstate';

import { formConfig } from './form.config';
import { formOptions } from './form.options';

export const createFormMachine = ctx => createMachina(
	formConfig,
	formOptions,
	ctx
);

export const formTemplate = Machine(formConfig, formOptions);
