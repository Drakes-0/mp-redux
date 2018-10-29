const noop = () => { }

export const warn = typeof console === void 0 ? noop : console.warn

export const isObject = o => typeof o === 'object' && o !== null

export const hasOwn = (target, property) => Object.prototype.hasOwnProperty.call(target, property)

