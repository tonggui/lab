import getConfig from './config'
import { mergeConfig } from '../form/utils'

const process = (components) => {
  const config = getConfig(components)
  return config.map(({ title, children }) => {
    return {
      layout: components.FormCard,
      options: {
        title
      },
      rules: {
        result: {
          mounted () {
            return children.some(child => {
              const felid = (this.getContext('felid') || {})[child.key] || {}
              return felid.visible || false
            })
          }
        }
      },
      children: children.map((child) => {
        return mergeConfig({}, child, {
          mounted: false,
          disabled: false,
          required: false,
          rules: [{
            result: {
              description () {
                const felid = (this.getContext('felid') || {})[child.key] || {}
                return felid.description
              },
              layout () {
                const felid = (this.getContext('felid') || {})[child.key] || {}
                return felid.layout || child.layout
              },
              label () {
                const felid = (this.getContext('felid') || {})[child.key] || {}
                return felid.label || child.label
              },
              mounted () {
                const felid = (this.getContext('felid') || {})[child.key] || {}
                return felid.visible || false
              },
              disabled () {
                const disabled = this.getContext('disabled')
                const felid = (this.getContext('felid') || {})[child.key] || {}
                return disabled || felid.disabled || false
              },
              required () {
                const felid = (this.getContext('felid') || {})[child.key] || {}
                return felid.required || false
              }
            }
          }]
        })
      })
    }
  })
}

export default process
