import getConfig from './config'
import { mergeConfig } from '../form/utils'
import { traverse } from '@sgfe/dynamic-form-vue/src/components/dynamic-form/util'
import { SPU_FIELD } from '../field'
import WithAttribute from '../hoc/with-attribute'
import WithAnchor from '../hoc/with-anchor'
import { get, isFunction } from 'lodash'

const findMounted = (rules) => {
  rules = [].concat(rules || [])
  let mounted = () => { return false }
  rules.some(({ result }) => {
    if (isFunction(result.mounted)) {
      mounted = result.mounted
      return true
    }
  })
  return mounted
}

const processFormCard = (config) => {
  const children = config.children || []
  return mergeConfig(config, {
    rules: {
      result: {
        'options.closedContent' () {
          const content = []
          children.forEach(child => {
            const field = (this.getContext('field') || {})[child.key] || {}
            if (!field.visible) {
              return
            }
            content.push(field.label || child.label)
          })
          return content.join('，')
        },
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
  return mergeConfig(config, {
    mounted: false,
    disabled: false,
    required: false,
    container: WithAttribute,
    rules: [{
      result: {
        'options.attribute' () {
          const field = (this.getContext('field') || {})[key] || {}
          return field.options || {}
        },
        description () {
          const field = (this.getContext('field') || {})[key] || {}
          return field.description
        },
        label () {
          const field = (this.getContext('field') || {})[key] || {}
          return field.label || config.label
        },
        mounted () {
          const field = (this.getContext('field') || {})[key] || {}
          return field.visible || false
        },
        disabled () {
          const excludes = this.getContext('features')['excludeDisableFields'] || []
          if (excludes.includes(key)) return false

          const disabled = this.getContext('disabled')
          const field = (this.getContext('field') || {})[key] || {}
          return disabled || field.disabled || false
        },
        required () {
          const field = (this.getContext('field') || {})[key] || {}
          return field.required || false
        }
      }
    }]
  })
}

const process = (layouts, components, containers) => {
  const config = getConfig()
  traverse(config, (c) => {
    if (c.layout) {
      c.layout = layouts[c.layout] || c.layout
    }
    if (c.container) {
      c.container = containers[c.container] || c.container
    }
    if (c.type) {
      c.type = components[c.type] || c.type
    }
    if (c.layout && get(c, 'options.anchor')) {
      c.layout = WithAnchor(c.layout)
    }
    if (c.key && Object.values(SPU_FIELD).includes(c.key)) {
      processFormItem(c)
    }
  })
  traverse(config, (c) => {
    if (c.mode === 'card') {
      processFormCard(c)
    }
  })
  return config
}

export default process
