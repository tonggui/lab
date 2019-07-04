/* eslint-disable no-new */
import ProxyPolyfillFunc from '@/common/polyfill/proxy'
import { isEqual, isFunction } from 'lodash'
import Dep from './dep'
import RuleController from './rule-controller'
import { traverse } from './util'

const ProxyPolyfill = ProxyPolyfillFunc()

export function weave ({
  formConfig,
  formData,
  context
}) {
  // 初始化表单项事件监听处理
  const dep = new Dep()
  // 监听config的变化
  const configListeners = []
  const configChange = function (configKey, resultKey, value) {
    configListeners.forEach(l => l(configKey, resultKey, value))
  }
  // 用formData初始化formConfig中的value
  Object.keys(formData).forEach((k) => {
    const val = formData[k]
    const config = formConfig.find(v => v.key === k)
    if (config) {
      config.value = val
    }
  })
  const proxyFormData = new ProxyPolyfill(formData, {
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
  traverse(formConfig, config => {
    new RuleController({
      config,
      execContext,
      configChangeHandler: (...params) => {
        configChange(config, ...params)
      }
    })
    // 绑定校验函数的上线文信息
    if (config.validate) {
      config.validate = config.validate.bind(execContext)
    }
  })
  return {
    formData: proxyFormData,
    addConfigListener (l) {
      if (isFunction(l)) {
        configListeners.push(l)
      }
    }
  }
}
