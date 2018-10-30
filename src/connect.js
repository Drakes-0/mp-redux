import mergeState from './mergeState'
import mergeAction from './mergeAction'

export function connect(mapStateToProps, mapDispatchToProps, option = {}) {
    const shouldHandleStateChanges = Boolean(mapStateToProps)
    const shouldMapDispatcher = Boolean(mapDispatchToProps)
    const store = getApp().store

    return function connectHOC(config) {
        function handleStateChange() {
            if (!this.unsubscribe) {
                return
            }

            const mergedData = mergeState(store.getState(), mapStateToProps, this.data)
            mergedData && this.setData(mergedData)
        }

        const LIFECYCLE = {
            ONLOAD: option.isComponent ? 'attached' : 'onLoad',
            ONUNLOAD: option.isComponent ? 'detached' : 'onUnload'
        }

        const { data = {}, [LIFECYCLE.ONLOAD]: originalOnLoad, [LIFECYCLE.ONUNLOAD]: originalOnUnload } = config

        shouldHandleStateChanges && mergeState(store.getState(), mapStateToProps, data, true)
        shouldMapDispatcher && mergeAction(store.dispatch, mapDispatchToProps, config, option)

        const lifecycleHook = {
            [LIFECYCLE.ONLOAD](query) {
                if (shouldHandleStateChanges) {
                    this.unsubscribe = store.subscribe(handleStateChange.bind(this))
                }

                typeof originalOnLoad === 'function' && originalOnLoad.call(this, query)
            },
            [LIFECYCLE.ONUNLOAD]() {
                this.unsubscribe && this.unsubscribe()
                typeof originalOnUnload === 'function' && originalOnUnload.call(this)
            }
        }

        return Object.assign({}, config, { data, ...lifecycleHook })
    }
}

export function connnectComponent(mapStateToProps, mapDispatchToProps) {
    return connect(mapStateToProps, mapDispatchToProps, { isComponent: true })
}