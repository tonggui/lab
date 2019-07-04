/*
 * @description
 *   Please write the render-from-item script's description
 * @author
 *   rdshoep (zhangliang15@meituan.com)
 * @version
 *   1.0.0(2019-07-04)
 */
import isPlainObject from 'lodash/isPlainObject'
import { createConfigKey } from './util'

const renderFormItemContainer = (h, layout, config, slot) => {
  const children = []
  if (Array.isArray(config.children)) {
    children.push(config.children.map(childConfig => render(h, childConfig)))
  } else if (isPlainObject(config.children)) {
    const slots = {}
    Object.entries(config.children).forEach(([key, childConfig]) => {
      if (Array.isArray(childConfig)) {
        slots[key] = h('template', { slot: key }, childConfig.map(item => render(h, item)))
      } else {
        slots[key] = render(h, childConfig, key)
      }
    })
    if (Object.keys(slots).length) {
      if (slots.default) {
        children.push(slots.default)
        delete slots.default
      }
      children.push(...Object.values(slots))
    }
  } else {
    children.push(renderFormItem(h, config))
  }
  return h(layout, {
    key: createConfigKey(config, layout),
    props: {
      config
    },
    attrs: {
      slot
    },
    slot,
    directives: [
      {
        name: 'show',
        value: config.visible === undefined ? true : config.visible,
        expression: 'config.visible === undefined ? true : config.visible'
      }
    ]
  }, children)
}

const renderFormItem = (h, config, slot) => {
  if (!config.type) return null
  const { value, options, events } = config
  return h(config.type, {
    key: createConfigKey(config, config.type),
    props: {
      value,
      ...options
    },
    attrs: {
      slot
    },
    slot,
    directives: [
      {
        name: 'show',
        value: config.visible === undefined ? true : config.visible,
        expression: 'config.visible === undefined ? true : config.visible'
      }
    ],
    on: events || {}
  })
}

const render = (h, config, slot) => {
  const { layout = 'FormItemContainer' } = config
  if (layout) {
    return renderFormItemContainer(h, layout, config, slot)
  } else {
    return renderFormItem(h, config, slot)
  }
}

export default render
