/*
 * @description
 *   Please write the config.js script's description
 * @author
 *   rdshoep (zhangliang15@meituan.com)
 * @version
 *   1.0.0(2019-07-15)
 */
import { RENDER_TYPE, VALUE_TYPE } from '@/data/enums/category'
import { isEmpty } from '@/common/utils'

const convertCategoryAttrsToOptions = attrs => attrs.map(attr => ({
  ...attr,
  label: attr.name,
  value: attr.id
}))

const createItemOptions = attr => {
  const render = attr.render
  switch (render.type) {
    case RENDER_TYPE.INPUT:
      return {
        type: 'Input',
        events: {
          'on-change' ($event) {
            this.formData[attr.id] = $event.target.value
          }
        }
      }
    case RENDER_TYPE.SELECT:
      return {
        type: 'Selector',
        events: {
          'on-change' (data) {
            this.formData[attr.id] = data
          }
        },
        options: {
          attr,
          options: convertCategoryAttrsToOptions(attr.options),
          multiple: attr.valueType === VALUE_TYPE.MULTI_SELECT
        }
      }
    case RENDER_TYPE.CASCADE:
      const { attribute = {} } = render
      return {
        type: 'Cascader',
        options: {
          maxCount: attribute.maxCount || 1,
          showSearch: !!render.attribute.search,
          cascader: !!render.attribute.cascade,
          source: attr.options,
          attr,
          width: 300,
          multiple: attr.valueType === VALUE_TYPE.MULTI_SELECT
        }
      }
    case RENDER_TYPE.BRAND:
      return {
        type: 'Brand',
        options: {
          maxCount: 1,
          showSearch: true,
          source: attr.options,
          attr,
          width: 300,
          multiple: attr.valueType === VALUE_TYPE.MULTI_SELECT
        }
      }
  }
}

export default (attrs = []) => {
  return attrs.map(attr => ({
    key: `${attr.id}`,
    label: attr.name,
    required: attr.required,
    events: {
      change (data) {
        this.formData[attr.id] = data
      }
    },
    validate (item) {
      if (isEmpty(item.value) && attr.required) {
        throw new Error(`${item.label}不能为空`)
      }
    },
    ...createItemOptions(attr)
  }))
}
