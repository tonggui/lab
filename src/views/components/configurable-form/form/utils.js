import { isArray, isFunction, get } from 'lodash'
import Vue from 'vue'

export const mergeConfig = (target, ...sourceList) => {
  sourceList.forEach(source => {
    source = source || {}
    /**
     * config的字段
     * key: 不可合并
     * label: 覆盖合并
     * type: 覆盖合并
     * layout: 覆盖合并
     * disabled: 覆盖合并
     * required: 覆盖合并
     * options: assign合并
     * events: assign合并,
     * rules: result按照key遍历覆盖
     * mounted 合并
     * container
     */
    let { rules = [], options = {}, events = {}, container = [], ...rest } = target
    let { options: sourceOptions = {}, events: sourceEvents = {}, rules: sourceRules = [], container: sourceContainer, ...sourceRest } = source
    const newTarget = Object.assign(rest, sourceRest)
    newTarget.options = Object.assign({}, options, sourceOptions)
    newTarget.events = Object.assign({}, events, sourceEvents)
    rules = isArray(rules) ? [...rules] : [rules]
    sourceRules = isArray(sourceRules) ? sourceRules : [sourceRules]

    sourceRules.forEach(({ result }) => {
      Object.keys(result).forEach((ruleKey) => {
        const index = rules.findIndex(r => r.result[ruleKey])
        if (index >= 0) {
          const { [ruleKey]: repeatRule, ...newRule } = rules[index].result
          if (ruleKey === 'mounted') {
            const _bak = result.mounted
            result[ruleKey] = function () {
              return _bak.apply(this) && repeatRule.apply(this)
            }
          }
          rules.splice(index, 1, { result: newRule })
        }
      })
    })
    newTarget.rules = [...rules, ...sourceRules]

    container = container ? [].concat(container) : []
    sourceContainer = sourceContainer ? [].concat(sourceContainer) : []

    newTarget.container = [...sourceContainer, ...container]
    target = Object.assign(target, newTarget)
    return target
  })
  return target
}

export const combineContainer = (container, type) => {
  if (!container) {
    return type
  }
  return [].concat(container).reduce((prev, hoc) => {
    const next = hoc(prev)
    let componentOptions = next
    if (typeof next === 'function') {
      componentOptions = next.options
    }
    if (componentOptions) {
      componentOptions.methods = componentOptions.methods || {}
      if (!get(componentOptions, 'methods.validate')) {
        componentOptions.methods.validate = function () {
          let validate = () => {}
          (this.$children || []).some(c => {
            if (isFunction(c.validate)) {
              validate = c.validate
              return true
            }
            return false
          })
          return validate()
        }
      }
      return Vue.extend(componentOptions)
    }
    return next
  }, type)
}
