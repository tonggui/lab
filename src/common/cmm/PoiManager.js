/*
 * @description
 *   Please write the CategoryManager script's description
 * @author rdshoep(rdshoep@126.com)
 *   http://www.rdshoep.com/
 * @version
 *   1.0.0(2019-04-15)
 */
import ModuleManager from './ModuleManager'
import { CategoryMap } from './category'
import {
  CategoryModules,
  AsyncModule
} from './modules'

export default class PoiManager {
  stateListener = (state, name, value) => {
    this.handleChanged(name, value)
  }

  constructor (poiId, categoryIds = []) {
    this.categoryModuleManagers = categoryIds
      .map(id => CategoryMap[id])
      .filter(category => category && category.level !== 1) // 过滤一级品类，只需要叶子节点进行判断即可
      .map(category => new ModuleManager({ category }, CategoryModules))

    this.asyncModuleManager = new ModuleManager({ poiId }, AsyncModule)
    this.asyncModuleManager.addListener(this.stateListener)

    this.initState()
    this.listeners = []
  }

  initState () {
    const states = this.categoryModuleManagers.map(m => m.getStates())
    if (states.length > 1) {
      const ctxs = this.categoryModuleManagers.map(m => m.context)
      this.state = CategoryModules.reduce((map, module) => {
        const { name, combine } = module
        const values = states.map(s => s[name])
        map[name] = combine(values, module, ctxs)
        return map
      }, {})
    } else if (states.length === 1) {
      this.state = states[0]
    } else {
      this.state = [].concat(CategoryModules, AsyncModule).reduce((map, module) => {
        map[module.name] = module.defaultValue
        return map
      }, {})
    }
  }

  getStates () {
    const asyncState = this.asyncModuleManager.getStates()
    this.state = Object.assign({}, this.state, asyncState)
    return this.state
  }

  getState (names = []) {
    return this.asyncModuleManager.getState(names).then(states => Object.assign(names.reduce((map, name) => {
      map[name] = this.state[name]
      return map
    }, {}), states))
  }

  addListener (listener) {
    this.listeners.push(listener)
  }

  removeListener (listener) {
    this.listeners = this.listeners.filter(l => l !== listener)
  }

  handleChanged (name, state) {
    this.state[name] = state
    this.listeners.forEach(l => l(this.state, name, state))
  }
}
