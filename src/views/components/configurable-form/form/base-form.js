import { weave } from '@sgfe/dynamic-form-vue/src/components/dynamic-form/weaver'
import { traverse, assignPath } from '@sgfe/dynamic-form-vue/src/components/dynamic-form/util'
import { cloneDeep, mergeWith, isPlainObject, isArray } from 'lodash'
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

  // 初始化
  init ({ data, context, config, initialData }) {
    this.config = cloneDeep(config) // clone config，后期config会变化
    this.data = cloneDeep(data) // clone data 同上
    this.context = cloneDeep(context) // clone context 同上
    this.initialData = cloneDeep(initialData || {}) // clone 默认数据，用于清空
    // 检验config拼装
    this.validateConfig.forEach(({ key, validate }) => {
      const findConfig = traverse(this.config, c => c.key === key)
      if (!findConfig) {
        return
      }
      mergeConfig(findConfig, { validate })
    })

    // plugin install
    this.plugins.forEach(plugin => {
      plugin.install(this, this.config)
    })

    // container 组合
    traverse(this.config, (c) => {
      c._bakType_ = c.type
      if (!c.container) {
        return
      }
      c.type = combineContainer(c.container, c._bakType_)
    })

    // 实例化动态表单 weave
    this.weaver = weave({
      config: this.config,
      data: cloneDeep(this.data), // clone data,动态表单内部会修改data
      context: cloneDeep(this.context), // clone context，同上
      hooks: {
        // 检验钩子
        onValidateError: this.onValidateError.bind(this)
      }
    })

    // 监听data变化，做数据同步
    this.weaver.addListener('data', (key, value) => {
      if (isPlainObject(key)) {
        this.data = { ...key }
      } else {
        this.data[key] = value
      }
    })

    // 监听context变化，做数据同步
    this.weaver.addListener('context', (key, value) => {
      this.context[key] = value
    })

    // config变化，更新到对应的config上
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

    // triggerEvent 的响应，简单的事件响应，主要就是set和reset
    this.weaver.addListener('event', (type, ...args) => {
      if (type === EVENTS_TYPE.RESET) {
        this.reset(...args)
      } else if (type === EVENTS_TYPE.SET_DATA) {
        this.setData(...args)
      }
    })
  }

  // 获取plugin内的context，数据读取
  getPluginContext () {
    return this.plugins.reduce((prev, plugin) => {
      prev[plugin.name] = cloneDeep(plugin.context)
      return prev
    }, {})
  }

  // start函数
  start () {
    this.plugins.forEach((plugin) => {
      plugin.start()
    })
  }

  // plugin的注入
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

  // 校验的注入
  validator (validate = []) {
    if (this.initial) {
      throw Error('已经初始化过了，不可再替代校验validator')
    }
    this.validateConfig = validate
  }

  // 触发校验
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

  // form的提交逻辑
  async submit () {
    for (let i = 0, l = this.plugins.length; i < l; i++) {
      const plugin = this.plugins[i]
      // 触发一下 plugin 的 submit拦截
      const stop = await plugin.submit()
      if (stop) {
        return true
      }
    }
    return false
  }

  // form重置
  reset () {
    this.setData(this.initialData, { replace: true })
  }

  // TODO replace 并没有起作用
  // TODO 动态表单中的 updateData 是会保留住 不在data中的值，并不是完全的替换
  // TODO 需优化
  setData (data, { replace = false } = {}) {
    const oldData = { ...this.data }
    const newData = replace ? { ...data } : { ...this.data, ...data }
    this.data = newData
    this.weaver.updateData(newData, replace)
    // TODO weaver 更新data的时候，应该也需要通知
    this.updateData(newData, oldData)
  }

  // 更新 context，replace同上
  setContext (context, { replace = false } = {}) {
    const oldContext = { ...this.context }
    const newContext = replace ? { ...context } : mergeWith({}, this.context, context, (target, source) => {
      if (isArray(target)) {
        return source
      }
    })
    this.context = newContext
    this.weaver.updateContext(newContext)
    // TODO context 应该只会从外部修改，不建议 form 内部去修改全局context
    // TODO 应该是 weaver内部监听到context变化的时候去通知plugin，不应该在这个地方
    this.updateContext(newContext, oldContext)
  }

  // context变化的 callback，主要是通知plugin
  updateContext (newContext, oldContext) {
    this.plugins.forEach(plugin => {
      plugin.updateContext(newContext, oldContext)
    })
  }

  // data变化的 callback，主要是通知plugin
  updateData (newData, oldData) {
    this.plugins.forEach(plugin => {
      plugin.updateData(newData, oldData)
    })
  }
}
