import { warn, isObject, hasOwn } from './utils/index'

export default function mergeAction(dispatch, mapDispatchToProps, config, option, watch) {
    const target = option.isComponent ? (config.methods || (config.methods = {})) : config

    for (let watch_key in watch) {
        target[`__watch_${watch_key}`] = watch[watch_key]
    }

    let methods

    if (typeof mapDispatchToProps === 'function') {
        methods = mapDispatchToProps(dispatch)
    } else if (isObject(mapDispatchToProps)) {
        methods = Object.create(null)
        for (let actionCreator in mapDispatchToProps) {
            methods[actionCreator] = (...args) => dispatch(mapDispatchToProps[actionCreator](...args))
        }
    } else {
        return
    }

    Object.keys(methods).forEach(key => {
        if (hasOwn(target, key)) {
            warn(`Merge action to methods:${key} already exists will be covered`)
        }
        target[key] = methods[key]
    })
}