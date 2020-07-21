import { isArray } from 'lodash'

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
     */
    let { rules = [], options = {}, events = {}, ...rest } = target
    let { options: sourceOptions = {}, events: sourceEvents = {}, rules: sourceRules = [], ...sourceRest } = source
    const newTarget = Object.assign(rest, sourceRest)
    newTarget.options = Object.assign({}, options, sourceOptions)
    newTarget.events = Object.assign({}, events, sourceEvents)
    rules = isArray(rules) ? [...rules] : [rules]
    sourceRules = isArray(sourceRules) ? sourceRules : [sourceRules]

    sourceRules.forEach(({ result }) => {
      Object.keys(result).forEach((rule) => {
        const index = rules.findIndex(r => r[rule])
        if (index >= 0) {
          const newRule = { ...rules[index] }
          delete newRule[rule]
          rules.splice(index, 1, newRule)
        }
      })
    })
    newTarget.rules = [...rules, ...sourceRules]
    target = Object.assign(target, newTarget)
    return target
  })
  return target
}
