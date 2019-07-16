/*
 * @description
 *   Please write the config.js script's description
 * @author
 *   rdshoep (zhangliang15@meituan.com)
 * @version
 *   1.0.0(2019-07-15)
 */
import { RENDER_TYPE, VALUE_TYPE } from '@/data/enums/category'

const createItemOptions = attr => {
  switch (attr.render.type) {
    case RENDER_TYPE.INPUT:
      return {
        type: 'Input'
      }
    case RENDER_TYPE.SELECT:
      return {
        type: 'Input',
        options: {
          options: attr.options,
          multiple: attr.type === VALUE_TYPE.MULTI_SELECT
        }
      }
    case RENDER_TYPE.CASCADE:
      return {
        type: 'Cascader',
        options: {
          maxCount: 1,
          showSearch: true,
          source: attr.options,
          attrData: attr,
          width: 300,
          multiple: attr.type === VALUE_TYPE.MULTI_SELECT
        }
      }
    case RENDER_TYPE.BRAND:
      return {
        type: 'BRAND',
        options: {
          maxCount: 1,
          showSearch: true,
          source: attr.options,
          attrData: attr,
          width: 300,
          multiple: attr.type === VALUE_TYPE.MULTI_SELECT
        }
      }
  }
}

export default (attrs = [], value = {}) => {
  return attrs.map(attr => ({
    key: attr.id,
    label: attr.name,
    required: attr.required,
    value: value[attr.id],
    ...createItemOptions(attr)
  }))
}
