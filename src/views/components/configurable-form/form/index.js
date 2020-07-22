import createFormItem from '@sgfe/dynamic-form-vue/src/components/dynamic-form/form-item'
import renderFormItem from '@sgfe/dynamic-form-vue/src/components/dynamic-form/render-item'
import componentCollection from './component-collection'
import BaseForm from './base-form'
import Vue from 'vue'

export default class Form extends BaseForm {
  constructor (components = {}) {
    super()
    const combineComponents = { ...componentCollection, ...components }
    this.components = {
      ...combineComponents,
      FormItem: createFormItem({ ...combineComponents })
    }
    const _self = this
    this.formComponent = Vue.extend({
      name: 'form-container',
      components: {
        ...this.components
      },
      render (h) {
        return h('div', { class: 'form' }, _self.config.map(c => renderFormItem(h, c)))
      }
    })
    this.store = Vue.observable({
      data: {},
      context: {}
    })
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
  }
  render (h) {
    this.instance = h(this.formComponent)
    return this.instance
  }

  init ({ data, context, config }) {
    super.init({ data, context, config })
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
