/**
 * Applies a function only if the argument is truthy.
 * @param {function} func The function.
 * @param {*} arg The argument.
 */
export const safeApply = func => arg => arg && func(arg);
