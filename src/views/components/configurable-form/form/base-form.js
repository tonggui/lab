import { weave } from '@sgfe/dynamic-form-vue/src/components/dynamic-form/weaver'
import { traverse, assignPath } from '@sgfe/dynamic-form-vue/src/components/dynamic-form/util'
import { cloneDeep, merge, isPlainObject } from 'lodash'
import Plugin from './plugin'
import { mergeConfig } from './utils'

export default class BaseForm {
  constructor () {
    this.weaver = {}
    this.data = {}
    this.context = {}
    this.config = []
    this.plugins = []
    this.validateConfig = []
    this.initial = false
  }

  init ({ data, context, config }) {
    this.validateConfig.forEach(({ key, validate }) => {
      const findConfig = traverse(this.config, c => c.key === key)
      if (!findConfig) {
        return
      }
      mergeConfig(findConfig, { validate })
    })

    this.plugins.forEach(plugin => {
      plugin.install(this, config)
    })

    this.weaver = weave({
      config,
      data: cloneDeep(data),
      context: cloneDeep(context),
      hooks: {}
    })
    this.data = data
    this.context = context
    this.config = config

    this.weaver.addListener('data', (key, value) => {
      if (isPlainObject(key)) {
        this.data = { ...key }
      } else {
        this.data[key] = value
      }
    })

    this.weaver.addListener('context', (key, value) => {
      this.context[key] = value
    })

    this.weaver.addListener('config', (config, resultKey, value) => {
      if (!resultKey) return
      config = traverse(this.config, c => c.key === config.key)
      if (!config) return
      const keyPath = resultKey.split('.')
      // 修改config
      assignPath(config, keyPath, value)
    })
  }

  start () {
    this.plugins.forEach((plugin) => {
      plugin.start()
    })
  }

  extends (options) {
    if (!options) {
      throw Error('入参不能为空')
    }
    if (this.initial) {
      throw Error('已经初始化过了，不可再扩展')
    }
    if (!options.name) {
      throw Error('extends 必须包涵名字')
    }
    const plugin = new Plugin(options)
    this.plugins.push(plugin)
  }

  validator (validate = []) {
    if (this.initial) {
      throw Error('已经初始化过了，不可再替代校验validator')
    }
    this.validateConfig = validate
  }

  validate () {
    return this.weaver.validate()
  }

  async submit () {
    for (let i = 0, l = this.plugins.length; i < l; i++) {
      const plugin = this.plugins[i]
      const stop = await plugin.submit()
      if (stop) {
        return true
      }
    }
    return false
  }

  setData (data, { replace = false } = {}) {
    const oldData = { ...this.data }
    const newData = replace ? { ...data } : { ...this.data, ...data }
    this.data = newData
    this.weaver.updateData(newData)
    this.updateData(newData, oldData)
  }

  setContext (context) {
    const oldContext = { ...this.context }
    const newContext = merge({}, this.context, context)
    this.context = newContext
    this.weaver.updateContext(newContext)
    this.updateContext(newContext, oldContext)
  }

  updateContext (newContext, oldContext) {
    this.plugins.forEach(plugin => {
      plugin.updateContext(newContext, oldContext)
    })
  }

  updateData (newData, oldData) {
    this.plugins.forEach(plugin => {
      plugin.updateData(newData, oldData)
    })
  }
}
