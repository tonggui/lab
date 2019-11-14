import Vue from 'vue'
import { isArray } from 'lodash'
import SourceManage from '@/module/module-manage/source'
import BaseModule from '@/module/module-manage/module'

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
      this.$module12.getFelid(value)
      return this.$module12.states[value]
    }
    return prev
  }, {})
}

export default {
  install: function (Vue) {
    Vue.mixin({ beforeCreate: function () {
      const options = this.$options
      if (options.module12) {
        this.$module12 = typeof options.store === 'function' ? options.module12() : options.module12
      } else if (options.parent && options.parent.$module12) {
        this.$module12 = options.parent.$module12
      }
    } })
  }
}
