import { Message } from '@roo-design/roo-vue'
import CategoryAttrText from '@/views/components/product-form/components/category-attrs/components/text'
import validator, { regMap } from './validator'
import { REG_TYPE, VALUE_TYPE, RENDER_TYPE } from '@/data/enums/category'
import { newCustomValuePrefix } from '@/data/helper/category/operation'
import CategoryAttrSelect from '@/views/components/product-form/components/category-attrs/components/selector'
import CategoryAttrCascader from '@/views/components/product-form/components/category-attrs/components/cascader'
import CategoryAttrBrand from '@/views/components/product-form/components/category-attrs/components/brand'

function getRegTip (regTypes) {
  if (regTypes && regTypes.length) {
    const supportLabels = []
    let reverse = false
    regTypes.forEach(type => {
      if (regMap[type]) {
        supportLabels.push(regMap[type].label)
      }
      if (type === REG_TYPE.SYM) {
        reverse = true
      }
    })
    return `仅支持输入${supportLabels.join('、')}${reverse ? '、标点符号(含表情)' : ''}`
  }
  return ''
}

const createInput = (attr) => {
  const { name, maxLength = 0, regTypes } = attr
  const regTip = getRegTip(regTypes)
  const validate = validator()
  const formatter = { template: `${name}%error` }
  if (attr.required) {
    validate.add({ type: 'textEmpty', formatter })
  }
  validate.add({ type: 'text', options: { regTypes }, formatter })
  validate.add({ type: 'textLength', options: { maxLength }, formatter })
  return {
    type: CategoryAttrText,
    binding: {
      event: 'on-change'
    },
    options: {
      type: 'textarea',
      maxLength,
      attr,
      placeholder: regTip ? `${name}${regTip}` : '',
      rows: Math.min(1 + Math.ceil(attr.maxLength / 20), 3)
    },
    validate ({ disabled, value }) {
      if (disabled) {
        return
      }
      const error = validate.run(value)
      if (error) {
        throw new Error(error)
      }
    },
    events: {
      'on-blur' ($event) {
        const val = $event.target.value.trim()
        if (!val) {
          return
        }
        const error = validate.run(val)
        if (error) {
          Message.warning(`${name}${error}`)
        }
      }
    }
  }
}

const createSelect = (attr) => {
  const { extensible, maxCount } = attr
  const validate = validator()
  const formatter = { template: `${attr.name}%error` }
  if (attr.required) {
    validate.add({ type: 'selectEmpty', formatter })
  }
  validate.add({ type: 'selectLength', options: { maxCount }, formatter })
  return {
    type: CategoryAttrSelect,
    binding: {
      event: 'change'
    },
    validate ({ disabled, value }) {
      if (disabled) {
        return
      }
      const error = validate.run(value)
      if (error) {
        throw new Error(error)
      }
    },
    options: {
      valueKey: 'id',
      labelKey: 'name',
      group: ['自定义'],
      extensible,
      maxCount,
      customValueKeyPrefix: newCustomValuePrefix,
      attr,
      source: attr.options,
      multiple: attr.valueType === VALUE_TYPE.MULTI_SELECT
    }
  }
}

const createCascade = (attr) => {
  const { attribute = {} } = attr.render
  const validate = validator()
  const formatter = { template: `${attr.name}%error` }
  if (attr.required) {
    validate.add({ type: 'selectEmpty', formatter })
  }
  return {
    type: CategoryAttrCascader, // 药品的没有级联选择，使用文本
    binding: {
      event: 'change'
    },
    validate ({ disabled, value }) {
      if (disabled) {
        return
      }
      const error = validate.run(value)
      if (error) {
        throw new Error(error)
      }
    },
    options: {
      maxCount: attribute.maxCount || 1,
      showSearch: !!attribute.search,
      cascader: !!attribute.cascade,
      source: attr.options,
      attr,
      multiple: attr.valueType === VALUE_TYPE.MULTI_SELECT
    }
  }
}

const createBrand = (attr) => {
  const validate = validator()
  const formatter = { template: `${attr.name}%error` }
  if (attr.required) {
    validate.add({ type: 'selectEmpty', formatter })
  }
  return {
    type: CategoryAttrBrand, // 药品品牌使用文本展示
    binding: {
      event: 'change'
    },
    options: {
      maxCount: 1,
      showSearch: true,
      source: attr.options,
      attr,
      multiple: attr.valueType === VALUE_TYPE.MULTI_SELECT
    },
    validate ({ disabled, value }) {
      if (disabled) {
        return
      }
      const error = validate.run(value)
      if (error) {
        throw new Error(error)
      }
    },
    rules: [{
      result: {
        allowApply () {
          return !!this.getContext('allowBrandApply')
        }
      }
    }]
  }
}

const map = {
  [RENDER_TYPE.INPUT]: createInput,
  [RENDER_TYPE.SELECT]: createSelect,
  [RENDER_TYPE.CASCADE]: createCascade,
  [RENDER_TYPE.BRAND]: createBrand
}

export default (attr) => {
  const render = map[attr.render.type]
  if (render) {
    return render(attr)
  }
}
