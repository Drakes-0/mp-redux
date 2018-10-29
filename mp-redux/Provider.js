import { warn, hasOwn } from './utils'

export const Provider = appConfig => store => {
    if (hasOwn(appConfig, 'store')) {
        warn(`Global app object:store already exists will be covered`)
    }

    return Object.assign({}, appConfig, { store })
}