import { warn, isObject } from './utils/index'

export default function mergeAction(dispatch, mapDispatchToProps, config, option) {

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

    const target = option.isComponent ? config.methods : config

    Object.keys(methods).forEach(key => {
        if (hasOwn(target, key)) {
            warn(`Merge action to methods:${key} already exists will be covered`)
        }
        target[key] = methods[key]
    })
}