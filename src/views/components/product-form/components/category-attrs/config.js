/*
 * @description
 *   Please write the config.js script's description
 * @author
 *   rdshoep (zhangliang15@meituan.com)
 * @version
 *   1.0.0(2019-07-15)
 */
import { RENDER_TYPE, VALUE_TYPE } from '@/data/enums/category'

const convertCategoryAttrsToOptions = attrs => attrs.map(attr => ({
  ...attr,
  label: attr.name,
  value: attr.id
}))

const createItemOptions = (key, attr, { allowApply }) => {
  const render = attr.render
  switch (render.type) {
    case RENDER_TYPE.INPUT:
      return {
        type: 'Input',
        events: {
          'on-change' ($event) {
            this.setData(key, $event.target.value)
          }
        }
      }
    case RENDER_TYPE.SELECT:
      return {
        type: 'CategoryAttrSelect',
        events: {
          'on-change' (data) {
            this.setData(key, data)
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
        type: 'CategoryAttrCascader',
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
        type: 'CategoryAttrBrand',
        options: {
          maxCount: 1,
          showSearch: true,
          source: attr.options,
          attr,
          width: 300,
          multiple: attr.valueType === VALUE_TYPE.MULTI_SELECT,
          allowApply
        }
      }
  }
}

export default (parentKey = '', attrs = [], context) => {
  return attrs.map(attr => {
    const key = `${parentKey ? parentKey + '.' : ''}${attr.id}`
    return {
      key,
      label: attr.name,
      required: attr.required,
      events: {
        change (data) {
          this.setData(key, data)
        }
      },
      value: undefined,
      ...createItemOptions(key, attr, context)
    }
  })
}
