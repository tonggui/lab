import Vue from 'vue'
import { isArray } from 'lodash'
import SourceManage from '../source'
import BaseModule from '../module'

export class Module extends BaseModule {
  constructor ({ context = {}, source = {}, module = {} }) {
    const sourceManage = new SourceManage(source, context)
    const felids = Object.entries(module).reduce((prev, [key, options]) => {
      let { source } = options
      if (isArray(source)) {
        source = source.map(s => sourceManage.getSource(s))
      } else {
        source = sourceManage.getSource(source)
      }
      prev[key] = { ...options, source }
      return prev
    }, {})

    super(felids, context)

    this.sourceManage = sourceManage
    this.states = Vue.observable(this.states)
  }

  setContext (context) {
    this.sourceManage.setContext(context)
  }
}

export const mapModule = (map) => {
  return Object.entries(map).reduce((prev, [key, value]) => {
    prev[key] = function () {
      this.$module.getFelid(value)
      return this.$module.states[value]
    }
    return prev
  }, {})
}

export default {
  install: function (Vue) {
    Vue.mixin({ beforeCreate: function () {
      const options = this.$options
      if (options.module) {
        this.$module = typeof options.store === 'function' ? options.module() : options.module
      } else if (options.parent && options.parent.$module) {
        this.$module = options.parent.$module
      }
    } })
  }
}
