/*
 * @description
 *   Please write the render-from-item script's description
 * @author
 *   rdshoep (zhangliang15@meituan.com)
 * @version
 *   1.0.0(2019-07-04)
 */
import { isPlainObject, omit, pick } from 'lodash'

const renderFormItem = (h, config, slot) => {
  if (config.mounted === false) return null
  if (!config.type) return null
  return h('form-item', {
    key: config.key,
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
  if (config.mounted === false) return null
  const children = []
  if (Array.isArray(config.children)) {
    children.push(...config.children.map(childConfig => render(h, childConfig)))
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
  const renderProps = pick(config.options, ['class', 'style'])
  return h(config.layout, {
    key: config.key,
    class: renderProps.class,
    style: renderProps.style,
    props: {
      ...omit(config, ['layout', 'children', 'rules'])
    },
    attrs: {
      slot
    },
    slot,
    directives: [
      {
        name: 'show',
        value: config.visible === undefined ? true : config.visible,
        expression: 'visible === undefined ? true : visible'
      }
    ]
  }, children)
}

const render = (h, config, slot) => {
  const { layout = 'FormItemContainer', type } = config
  // layout只有在无type场景下才属于展示型组件
  if (layout && !type) {
    return renderLayoutContainer(h, config, slot)
  } else {
    return renderFormItem(h, config, slot)
  }
}

export default render
