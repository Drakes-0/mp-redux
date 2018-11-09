import { warn, hasOwn } from './utils/index'

export const Provider = store => appConfig => {
    if (hasOwn(appConfig, 'store')) {
        warn(`Global app object:store already exists will be covered`)
    }

    return Object.assign({}, appConfig, { store })
}