import { weave } from '@sgfe/dynamic-form-vue/src/components/dynamic-form/weaver'
import { traverse, assignPath } from '@sgfe/dynamic-form-vue/src/components/dynamic-form/util'
import { cloneDeep, merge, isPlainObject } from 'lodash'
import Plugin from './plugin'
import { mergeConfig, combineContainer } from './utils'
import { EVENTS_TYPE } from './events'

export default class BaseForm {
  constructor () {
    this.weaver = {}
    this.data = {}
    this.initialData = {} // reset的时候使用
    this.context = {}
    this.config = []
    this.plugins = []
    this.validateConfig = []
    this.validateShowError = false
    this.initial = false
  }

  init ({ data, context, config, initialData }) {
    this.config = cloneDeep(config)
    this.initialData = initialData || {}
    this.validateConfig.forEach(({ key, validate }) => {
      const findConfig = traverse(this.config, c => c.key === key)
      if (!findConfig) {
        return
      }
      mergeConfig(findConfig, { validate })
    })

    this.plugins.forEach(plugin => {
      plugin.install(this, this.config)
    })

    traverse(this.config, (c) => {
      c._bakType_ = c.type
      if (!c.container) {
        return
      }
      c.type = combineContainer(c.container, c._bakType_)
    })

    this.weaver = weave({
      config: this.config,
      data: cloneDeep(data),
      context: cloneDeep(context),
      hooks: {
        onValidateError: this.onValidateError.bind(this)
      }
    })

    this.data = data
    this.context = context

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
      if (resultKey === 'container') {
        value = [].concat(value || [])
        config.type = combineContainer(value, config._bakType_)
      }
      const keyPath = resultKey.split('.')
      // 修改config
      assignPath(config, keyPath, value)
    })

    this.weaver.addListener('event', (type, ...args) => {
      if (type === EVENTS_TYPE.RESET) {
        this.reset(...args)
      } else if (type === EVENTS_TYPE.SET_DATA) {
        this.setData(...args)
      }
    })
  }

  getPluginContext () {
    return this.plugins.reduce((prev, plugin) => {
      prev[plugin.name] = cloneDeep(plugin.context)
      return prev
    }, {})
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

  validate ({ showError = false, ...options } = {}) {
    this.validateShowError = !!showError
    return this.weaver.validate(options)
  }

  // validate的时候不会触发 config change，所以自己写一下。。。
  onValidateError (key, error, config) {
    config = traverse(this.config, c => c.key === key)
    if (!config) return
    assignPath(config, ['error'], error)
    assignPath(config, ['showError'], this.validateShowError)
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

  reset () {
    this.setData(this.initialData, { replace: true })
  }

  setData (data, { replace = false } = {}) {
    const oldData = { ...this.data }
    const newData = replace ? { ...data } : { ...this.data, ...data }
    this.data = newData
    this.weaver.updateData(newData)
    this.updateData(newData, oldData)
  }

  setContext (context, { replace = false } = {}) {
    const oldContext = { ...this.context }
    const newContext = replace ? { ...context } : merge({}, this.context, context)
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
