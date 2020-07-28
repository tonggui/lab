import createFormItem from '@sgfe/dynamic-form-vue/src/components/dynamic-form/form-item'
import renderFormItem from '@sgfe/dynamic-form-vue/src/components/dynamic-form/render-item'
import * as componentCollection from './component-collection'
import * as containerCollection from './container-collection'
import * as layoutCollection from './layout-collection'
import BaseForm from './base-form'
import Vue from 'vue'
import { isFunction } from 'lodash'
import { traverse } from '@sgfe/dynamic-form-vue/src/components/dynamic-form/util'
import createFormContainer from './create-form-container'
import createFormNavigation from './create-form-navigation'

export default class Form extends BaseForm {
  constructor ({ components = {}, containers = {}, layouts = {} } = {}) {
    super()
    this.components = { ...componentCollection, ...components }
    this.containers = { ...containerCollection, ...containers }
    this.layouts = { ...layoutCollection, ...layouts }
    this.FormItem = createFormItem({ ...this.components, ...this.layouts })
    this.formContainerComponent = createFormContainer(this.FormItem, this)
    this.navigationComponent = createFormNavigation(this)
    this.store = Vue.observable({
      data: {},
      context: {}
    })
    this.connectExecContext = {
      data: this.store.data,
      context: this.store.context,
      setData: (data) => this.setData(data),
      setContext: (context) => this.setContext(context),
      reset: () => this.reset()
    }
    this.instance = null
  }

  renderFormItem (h, config) {
    return renderFormItem(h, config)
  }

  updateDom () {
    if (!this.instance || !this.instance.componentInstance) {
      return
    }
    this.instance.componentInstance.$nextTick(() => {
      this.instance.componentInstance.$forceUpdate()
    })
    if (!this.navigation || !this.navigation.componentInstance) {
      return
    }
    this.navigation.componentInstance.$nextTick(() => {
      this.navigation.componentInstance.$forceUpdate()
    })
  }

  render (h, { columnCount = 1, columnGap = 0, navigation = false } = {}) {
    this.instance = h(this.formContainerComponent, {
      props: {
        columnCount,
        columnGap
      }
    })
    this.navigation = navigation ? h(this.navigationComponent) : null
    return [this.navigation, this.instance]
  }

  init ({ data, context, config }) {
    super.init({ data, context, config })
    traverse(this.config, (c) => {
      if (isFunction(c.container)) {
        c.type = c.container(this.connectExecContext)(c.type)
      }
    })
    this.weaver.addListener('data', () => {
      this.store.data = Object.freeze({ ...this.data })
    })
    this.weaver.addListener('context', () => {
      this.store.context = Object.freeze({ ...this.context })
    })
    this.weaver.addListener('config', () => {
      this.updateDom()
    })
    this.plugins.forEach(plugin => {
      plugin.addListener('config', () => {
        this.updateDom()
      })
    })
  }
}
