/* eslint-disable no-new */
import Vue from 'vue'
import { isEqual, isFunction } from 'lodash'
import ProxyPolyfillFunc from '@/common/polyfill/proxy'
import Dep from './dep'
import RuleController from './rule-controller'
import { traverse } from './util'

const ProxyPolyfill = ProxyPolyfillFunc()

export function weave ({
  config,
  data,
  context
}) {
  // 初始化表单项事件监听处理
  const dep = new Dep()
  // 监听config的变化
  const configListeners = []
  const configChange = function (configKey, resultKey, value) {
    configListeners.forEach(l => l(configKey, resultKey, value))
  }
  // 用formData初始化formConfig中的value，同时将formData中不存在的节点从fromCofnig中反向输入
  traverse(config, item => {
    // 自动补全可能会依赖的数据节点
    ['visible', 'disabled', 'required', 'mounted', 'error', 'value'].forEach(k => {
      if (!(k in item)) { item[k] = undefined }
    })
    const key = item.key
    if (key) {
      if (key in data) {
        item.value = data[key]
      } else {
        data[key] = item.value
      }
    }
  })
  const proxyFormData = new ProxyPolyfill(data, {
    get (target, key) {
      dep.depend(key)
      return target[key]
    },
    set (target, key, value) {
      // 如果值没有变化则不进行后续操作
      if (isEqual(target[key], value)) return true
      target[key] = value
      configChange(key, 'value', value)
      dep.notify(key)
      return true
    }
  })
  // refs
  const refs = {}
  const execContext = {
    formData: proxyFormData,
    context,
    refs
  }
  const observeFormConfig = Vue.observable(config)
  traverse(observeFormConfig, item => {
    new RuleController({
      config: item,
      execContext,
      configChangeHandler: (...params) => {
        configChange(item, ...params)
      }
    })
    // 绑定校验函数的上线文信息
    if (item.validate) {
      item.validate = item.validate.bind(execContext)
    }
  })
  return {
    formConfig: observeFormConfig,
    formData: proxyFormData,
    addConfigListener (l) {
      if (isFunction(l)) {
        configListeners.push(l)
      }
    },
    removeConfigListener (l) {
      const index = configListeners.findIndex(listener => listener === l)
      if (index > -1) {
        configListeners.splice(index, 1)
      }
    }
  }
}
