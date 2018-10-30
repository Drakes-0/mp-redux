import { isObject } from './utils/index'

export default function shallowEqual(prev, next) {
    if (prev === next) {
        return true
    }

    if (!isObject(prev) || !isObject(next)) {
        return false
    }

    const keys_prev = Object.keys(prev)
    const keys_next = Object.keys(next)

    if (keys_prev.length !== keys_next.length) {
        return false
    }

    return !(keys_prev.some(key => prev[key] !== next[key]))
}