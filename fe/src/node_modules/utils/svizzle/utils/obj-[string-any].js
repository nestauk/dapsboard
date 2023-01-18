/**
* @module @svizzle/utils/obj-[string-any]
*/

/**
 * Curried function that retrieves the value of `key` in `obj``,
 * but only if the latter is truthy.
 * @param {*} obj The object to retrieve from.
 * @param {string} key The key to look for.
 */
export const safeGetKeyOf = obj => key => obj && obj[key];
