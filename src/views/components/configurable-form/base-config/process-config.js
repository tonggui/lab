import getConfig from './config'
import { mergeConfig } from '../form/utils'
import { traverse } from '@sgfe/dynamic-form-vue/src/components/dynamic-form/util'
import { SPU_FELID } from '../felid'
import WithAttribute from '../hoc/with-attribute'
import WithAnchor from '../hoc/with-anchor'
import { get } from 'lodash'

const processFormCard = (config) => {
  const children = config.children || []
  return mergeConfig(config, {
    rules: {
      result: {
        'options.closedContent' () {
          const content = []
          children.forEach(child => {
            const felid = (this.getContext('felid') || {})[child.key] || {}
            if (!felid.visible) {
              return
            }
            content.push(felid.label || child.label)
          })
          return content.join('，')
        },
        mounted () {
          return children.some(child => {
            if (Object.values(SPU_FELID).includes(child.key)) {
              const felid = (this.getContext('felid') || {})[child.key] || {}
              return felid.visible || child.mounted || false
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
  const type = WithAttribute(config.type)
  return mergeConfig(config, {
    mounted: false,
    disabled: false,
    required: false,
    type,
    rules: [{
      result: {
        'options.attribute' () {
          const felid = (this.getContext('felid') || {})[key] || {}
          return felid.options || {}
        },
        description () {
          const felid = (this.getContext('felid') || {})[key] || {}
          return felid.description
        },
        label () {
          const felid = (this.getContext('felid') || {})[key] || {}
          return felid.label || config.label
        },
        mounted () {
          const felid = (this.getContext('felid') || {})[key] || {}
          return felid.visible || false
        },
        disabled () {
          const disabled = this.getContext('disabled')
          const felid = (this.getContext('felid') || {})[key] || {}
          return disabled || felid.disabled || false
        },
        required () {
          const felid = (this.getContext('felid') || {})[key] || {}
          return felid.required || false
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
    if (c.mode === 'card') {
      processFormCard(c)
    } else if (c.key && Object.values(SPU_FELID).includes(c.key)) {
      processFormItem(c)
    }
  })
  return config
}

export default process
