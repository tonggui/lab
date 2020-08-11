import createFormItem from '@sgfe/dynamic-form-vue/src/components/dynamic-form/form-item'
import * as componentCollection from './component-collection'
import * as containerCollection from './container-collection'
import * as layoutCollection from './layout-collection'
import BaseForm from './base-form'
import Vue from 'vue'
import createFormContainer from './create-form-container'
import createFormNavigation from './create-form-navigation'
import './index.less'

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
    this.instance = null
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
    return h('div', {
      class: {
        'form-container': true,
        navigation
      }
    }, [this.navigation, this.instance])
  }

  onValidateError (...args) {
    super.onValidateError.call(this, ...args)
    this.updateDom()
  }

  init (...args) {
    super.init(...args)
    this.store.data = Object.freeze({ ...this.data })
    this.store.context = Object.freeze({ ...this.context })
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
