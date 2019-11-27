import { isArray, isString, isPlainObject } from 'lodash'
import SourceManage from './source'
import BaseModule from './module'

export default class ModuleManage extends BaseModule {
  constructor ({ context = {}, source = {}, module = {}, subModule = {} }, root) {
    const sourceManage = new SourceManage(source, context)
    const felids = Object.entries(module).reduce((prev, [key, options]) => {
      let { source } = options
      if (isArray(source)) {
        source = source.map(s => {
          if (isString(s)) {
            return sourceManage.getSource(s)
          }
          if (isPlainObject(s)) {
            const { global, name } = s
            if (global && root) {
              return root.sourceManage.getSource(name)
            }
            return sourceManage.getSource(name)
          }
        })
      } else {
        source = sourceManage.getSource(source)
      }
      prev[key] = { ...options, source }
      return prev
    }, {})

    super(felids, context)

    this.sourceManage = sourceManage

    this.context = context

    this.subModuleMap = {}

    this.root = root

    Object.entries(subModule).forEach(([name, options]) => this.registerModule(name, options))
  }

  registerModule (name, module) {
    let newModule = module
    if (!isPlainObject(module)) {
      throw Error(`cmm 注册模块 ${name} 失败`)
    }
    if (!(newModule instanceof ModuleManage)) {
      const { context = {}, ...rest } = module || {}
      newModule = new ModuleManage({ ...rest, context: { ...this.context, ...context } }, this.root ? this.root : this)
    }
    this.subModuleMap[name] = newModule
    return newModule
  }

  removeModule (name) {
    delete this.subModuleMap[name]
  }

  getModule (name) {
    return this.subModuleMap[name]
  }

  setContext (name, context) {
    console.log('setCOntext:', name, context)
    let module = this
    let sourceContext = name
    if (isString(name)) {
      module = this.getModule(name)
      sourceContext = context
    }
    if (!module) {
      throw Error(`cmm 获取 module ${name} 失败`)
    }
    const newContext = { ...sourceContext, ...this.context }
    const sub = Object.entries(module.subModuleMap)
    if (sub.length > 0) {
      sub.forEach(([k, m]) => m.setContext(newContext))
    }
    return module.sourceManage.setContext(newContext)
  }
}
