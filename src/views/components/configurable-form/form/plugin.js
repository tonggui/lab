import { isFunction, noop, cloneDeep } from 'lodash'
import { weave } from '@sgfe/dynamic-form-vue/src/components/dynamic-form/weaver'
import { traverse, assignPath } from '@sgfe/dynamic-form-vue/src/components/dynamic-form/util'
import Vue from 'vue'
import { mergeConfig } from './utils'

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
      const findConfig = traverse(rootConfig, c => c.key === config.key)
      if (!findConfig) {
        return
      }
      const type = config.type || findConfig.type
      const _self = this
      mergeConfig(findConfig, {
        key: config.key,
        // TODO
        type: Vue.extend({
          render (h) {
            const { options, events, ...rest } = config
            const renderConfig = {
              options: { ...this.$attrs, ...options },
              events: { ...this.$listeners, ...events },
              layout: null,
              type,
              ...rest
            }
            return h(_self.form.components.FormItem, { props: { config: renderConfig } })
          }
        })
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
      data: this.form.data,
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

  update (newData, oldData) {
    this.weaver.updateData(newData)
    if (isFunction(this.hooks.update)) {
      return this.hooks.update(this.actionExecContext, newData, oldData)
    }
  }

  submit () {
    if (isFunction(this.hooks.submit)) {
      return this.hooks.submit(this.actionExecContext)
    }
  }
}
