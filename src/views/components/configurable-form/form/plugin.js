import { isFunction, noop, cloneDeep, get } from 'lodash'
import { weave } from '@sgfe/dynamic-form-vue/src/components/dynamic-form/weaver'
import { traverse, assignPath } from '@sgfe/dynamic-form-vue/src/components/dynamic-form/util'
import Vue from 'vue'
import {
  mergeConfig,
  combineContainer
} from './utils'

const createPluginContainer = (FormItem) => (type, config) => Vue.extend({
  name: 'plugin-container',
  created () {
    this.renderType = null
    this.container = []
  },
  methods: {
    validate () {
      const $formItem = this.$refs.formItem
      const componentInstance = get($formItem, '$_item.componentInstance')
      if (componentInstance && isFunction(componentInstance.validate)) {
        return componentInstance.validate()
      }
    }
  },
  render (h) {
    const { options, events, container, ...rest } = config
    const { disabled, error, ...restAttrs } = this.$attrs
    const renderConfig = {
      options: { ...restAttrs, ...options },
      events: { ...this.$listeners, ...events },
      layout: null,
      ...rest,
      disabled,
      error
    }
    if (container !== this.container) {
      this.container = container
      this.renderType = combineContainer(container, type)
      // this.renderType = (container ? [].concat(container) : []).reduce((prev, hoc) => hoc(prev), type)
    }
    renderConfig.type = this.renderType
    return h(FormItem, { props: { config: renderConfig }, ref: 'formItem' })
  }
})

export default class Plugin {
  constructor ({ name, context, config, hooks, actions, mutations } = {}) {
    this.name = name
    this.context = context
    this.config = config
    this.hooks = hooks || {}
    this.actions = actions || {}
    this.mutations = mutations || {}
    this.form = null
    this.weaver = null
  }

  process (rootConfig) {
    this.config.forEach(config => {
      const FormItem = this.form.FormItem
      const findConfig = traverse(rootConfig, c => c.key === config.key)
      if (!findConfig) {
        rootConfig.push({
          layout: null,
          type: createPluginContainer(FormItem)(config.type, config)
        })
        return
      }
      const type = config.type || findConfig.type
      mergeConfig(findConfig, {
        key: config.key,
        type: createPluginContainer(FormItem)(type, config)
      })
    })
    return rootConfig
  }

  handlerActions = (eventName, ...args) => {
    const handler = this.actions[eventName] || noop
    return handler(this.actionExecContext, ...args)
  }

  handlerMutations = (name, ...args) => {
    const handler = this.mutations[name] || noop
    return handler(this.mutationsExecContext, ...args)
  }

  addListener (type, handler) {
    this.weaver.addListener(type, handler)
  }

  install (form, rootConfig) {
    this.form = form
    this.weaver = weave({
      context: cloneDeep(this.context),
      data: cloneDeep(this.form.data),
      config: this.config,
      hooks: {}
    })
    const baseExecContext = {
      getData: (key) => this.form.data[key],
      getContext: (key) => this.context[key],
      getRootContext: (key) => this.form.context[key]
    }
    this.actionExecContext = {
      ...baseExecContext,
      commit: this.handlerMutations,
      dispatch: this.handlerActions
    }
    this.mutationsExecContext = {
      ...baseExecContext,
      setData: (data) => this.form.setData(data),
      setContext: (context) => this.setContext(context),
      setRootContext: (context) => this.form.setContext(context)
    }
    this.weaver.addListener('event', this.handlerActions)
    this.weaver.addListener('config', (config, resultKey, value) => {
      if (!resultKey) return
      config = traverse(this.config, c => c.key === config.key)
      if (!config) return
      const keyPath = resultKey.split('.')
      // 修改config
      assignPath(config, keyPath, value)
    })
    return this.process(rootConfig)
  }

  setContext (context) {
    console.log('setContext', context)
    this.context = { ...this.context, ...context }
    this.weaver.updateContext(this.context)
  }

  start () {
    if (!this.form) {
      throw Error(`plugin ${this.name} 还为关联form`)
    }
    if (isFunction(this.hooks.start)) {
      return this.hooks.start(this.actionExecContext)
    }
  }

  updateData = (newData, oldData) => {
    this.weaver.updateData({ ...newData })
    if (isFunction(this.hooks.updateData)) {
      return this.hooks.updateData(this.actionExecContext, newData, oldData)
    }
  }

  updateContext = (newContext, oldContext) => {
    if (isFunction(this.hooks.updateContext)) {
      return this.hooks.updateContext(this.actionExecContext, newContext, oldContext)
    }
  }

  submit () {
    if (isFunction(this.hooks.submit)) {
      return this.hooks.submit(this.actionExecContext)
    }
  }
}
