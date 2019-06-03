/*
 * @description
 *   Please write the ModuleManager script's description
 * @author rdshoep(rdshoep@126.com)
 *   http://www.rdshoep.com/
 * @version
 *   1.0.0(2019-04-15)
 */
import { isObject, isFunction } from 'lodash'

export default class ModuleManager {
  constructor (ctx, modules = []) {
    this.context = ctx
    this.modules = modules
    this.states = undefined
    this.listeners = []

    this.stateValueMap = {}
  }

  getStates () {
    this.states = this.modules
      .reduce((map, module) => {
        const moduleName = module.name
        const value = this.getModuleValue(module)
        if (isObject(value) && isFunction(value.then)) {
          map[moduleName] = module.defaultValue
        } else {
          map[moduleName] = !!value
        }
        return map
      }, {})
    return this.states
  }

  getState (names = []) {
    const promises = this.modules.filter(m => names.includes(m.name))
      .map(m => Promise.resolve(this.getModuleValue(m)))
    return Promise.all(promises)
      .then((values = []) => {
        const res = {}
        for (let i = 0, length = values.length; i < length; i++) {
          res[names[i]] = values[i]
        }
        return res
      })
  }

  getModuleValue (module) {
    const name = module.name
    const cachedValue = this.stateValueMap[name]
    if (cachedValue) return cachedValue

    const result = module.getState(this.context)
    this.stateValueMap[name] = result

    if (isObject(result) && isFunction(result.then)) {
      this.triggerChanged(name, module.defaultValue)
      return result.then((val) => {
        const value = val === undefined ? module.defaultValue : !!val
        this.stateValueMap[name] = value
        this.triggerChanged(name, value)
        return val
      }).catch(() => {
        delete this.stateValueMap[name]
        return module.defaultValue
      })
    }
    return result
  }

  removeListener (listener) {
    this.listeners = this.listeners.filter(l => l !== listener)
  }

  addListener (listener) {
    this.listeners.push(listener)
  }

  triggerChanged (name, value) {
    if (!this.state) this.state = {}
    this.state[name] = value
    this.listeners.forEach(l => l(this.state, name, value))
  }
}
