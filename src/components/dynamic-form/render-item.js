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

const renderFormItem = (h, config, slot) => {
  if (!config.type) return null
  return h('form-item', {
    key: createConfigKey(config.key, 'form-item'),
    props: {
      config
    },
    attrs: {
      slot
    },
    slot
  })
}

const renderLayoutContainer = (h, config, slot) => {
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
  }
  return h(config.layout, {
    key: createConfigKey(config, config.layout),
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

const render = (h, config, slot) => {
  const { layout = 'FormItemContainer', children } = config
  if (layout && children && (children.length || Object.keys(children).length)) {
    return renderLayoutContainer(h, config, slot)
  } else {
    return renderFormItem(h, config, slot)
  }
}

export default render
