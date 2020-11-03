import getConfig from './config'
import { mergeConfig } from '../form/utils'
import { traverse } from '@sgfe/dynamic-form-vue/src/components/dynamic-form/util'
import { SPU_FIELD } from '../field'
import WithAttribute from '../hoc/with-attribute'
import WithAnchor from '../hoc/with-anchor'
import { get, isFunction } from 'lodash'

const findOptionFromRules = (rules, optionKey, defaultResult) => {
  rules = [].concat(rules || [])
  let option = defaultResult
  rules.some(({ result }) => {
    if (isFunction(result[optionKey])) {
      option = result[optionKey]
      return true
    }
  })
  return option
}

const findMounted = (rules) => findOptionFromRules(rules, 'mounted', () => { return false })
const findLabel = (config, rules) => findOptionFromRules(rules, 'label', () => config.label || '')

// 处理 formCard
const processFormCard = (config) => {
  const children = config.children || []
  return mergeConfig(config, {
    rules: {
      result: {
        // 收起时展示的文案，根据 展示的children的label聚合
        'options.closedContent' () {
          const content = []
          children.forEach(child => {
            if (Object.values(SPU_FIELD).includes(child.key)) {
              const mounted = findMounted(child.rules).apply(this)
              if (mounted) {
                const label = findLabel(child, child.rules).apply(this)
                content.push(label)
              }
            }
          })
          return content.join('，')
        },
        // formCard 是否渲染 主要看 children 是否展示
        mounted () {
          return children.some(child => {
            if (Object.values(SPU_FIELD).includes(child.key)) {
              const mounted = findMounted(child.rules).apply(this)
              return mounted
            }
            return false
          })
        }
      }
    }
  })
}

const processFormItem = (config) => {
  const key = config.key
  // 处理 mounted，disabled，required ==> context中获取
  return mergeConfig(config, {
    mounted: false,
    disabled: false,
    required: false,
    container: WithAttribute,
    rules: [{
      result: {
        // context中配置 options的问题
        'options.attribute' () {
          const field = (this.getContext('field') || {})[key] || {}
          return field.options || {}
        },
        // context中配置description
        description () {
          const field = (this.getContext('field') || {})[key] || {}
          const description = field.description
          if (isFunction(description)) {
            return description(field)
          }
          return description
        },
        // context中配置label
        label () {
          const field = (this.getContext('field') || {})[key] || {}
          return field.label || config.label
        },
        // context中配置的visible
        mounted () {
          const excludes = this.getContext('features')['excludeInvisibleFields']
          if (excludes && excludes.includes(key)) {
            return true
          }

          const field = (this.getContext('field') || {})[key] || {}
          return field.visible || false
        },
        // context中配置的disabled，disabled的优先级如下
        disabled () {
          const excludes = this.getContext('features')['excludeDisableFields'] || []
          if (excludes.includes(key)) return false

          const disabled = this.getContext('disabled')
          const field = (this.getContext('field') || {})[key] || {}
          return disabled || field.disabled || false
        },
        // context中配置的 required
        required () {
          const field = (this.getContext('field') || {})[key] || {}
          return field.required || false
        }
      }
    }]
  })
}

// 把 config 和 context 进行加工
const process = (layouts, components, containers) => {
  const config = getConfig()
  traverse(config, (c) => {
    if (c.layout) {
      // layout字符串变 组件
      c.layout = layouts[c.layout] || c.layout
    }
    if (c.container) {
      // container字符串变 组件
      c.container = containers[c.container] || c.container
    }
    if (c.type) {
      // type 字符串变 组件
      c.type = components[c.type] || c.type
    }
    // 锚点处理
    if (c.layout && get(c, 'options.anchor')) {
      c.layout = WithAnchor(c.layout)
    }
    // formItem 处理
    if (c.key && Object.values(SPU_FIELD).includes(c.key)) {
      processFormItem(c)
    }
  })
  // formItem全部处理完了，处理 formCard，因为formCard的显示跟 formItem有关系，所以等formItem处理完成之后再处理
  traverse(config, (c) => {
    // 防止多层嵌套问题，给包裹 formIem 的 formCard 加上 标识
    if (c.mode === 'card') {
      processFormCard(c)
    }
  })
  return config
}

export default process
