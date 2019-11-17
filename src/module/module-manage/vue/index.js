import Vue from 'vue'
import BaseModuleManage from '../index'
import { isString, isPlainObject } from 'lodash'

export class ModuleManage extends BaseModuleManage {
  constructor (options, root) {
    super(options, root)
    this.states = Vue.observable(this.states)
  }

  registerModule (name, module) {
    let newModule = module
    if (!isPlainObject(module)) {
      throw Error(`cmm 注册模块 ${name} 失败`)
    }
    if (!(newModule instanceof ModuleManage)) {
      const { context = {}, ...rest } = module || {}
      newModule = new ModuleManage({ ...rest, context: { ...this.context, ...context } }, this.root || this)
    }
    Vue.set(this.subModuleMap, name, newModule)
    return newModule
  }
}

export const mapModule = (name, map) => {
  let moduleName
  let moduleMap
  if (isString(name)) {
    moduleName = name
    moduleMap = map
  } else if (isPlainObject(name)) {
    moduleMap = name
  }
  return Object.entries(moduleMap).reduce((prev, [key, value]) => {
    prev[key] = function () {
      let module = this.$moduleControl
      if (moduleName) {
        module = this.$moduleControl.getModule(moduleName)
      }
      if (!module) {
        throw Error(`cmm 获取模块 ${moduleName} 出错`)
      }
      module.getFelid(value)
      return module.states[value]
    }
    return prev
  }, {})
}

export default {
  install: function (Vue) {
    Vue.mixin({ beforeCreate: function () {
      const options = this.$options
      if (options.moduleControl) {
        this.$moduleControl = typeof options.moduleControl === 'function' ? options.moduleControl() : options.moduleControl
      } else if (options.parent && options.parent.$moduleControl) {
        this.$moduleControl = options.parent.$moduleControl
      }
    } })
  }
}
