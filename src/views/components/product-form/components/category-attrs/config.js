/*
 * @description
 *   Please write the config.js script's description
 * @author
 *   rdshoep (zhangliang15@meituan.com)
 * @version
 *   1.0.0(2019-07-15)
 */
import { RENDER_TYPE, VALUE_TYPE, REG_TYPE } from '@/data/enums/category'
import { isEmpty, strlen, strcut } from '@/common/utils'
import { Message } from '@sfe/bootes'

const convertCategoryAttrsToOptions = attrs => attrs.map(attr => ({
  ...attr,
  label: attr.name,
  value: attr.id
}))

const regMap = {
  1: {
    label: '中文',
    reg: '\\u4e00-\\u9fa5'
  },
  2: {
    label: '字母',
    reg: 'a-zA-Z'
  },
  3: {
    label: '数字',
    reg: '0-9'
  }
}

function validateText (text, regTypes = []) {
  if (regTypes && regTypes.length) {
    const supportLabels = []
    const supportRegs = []
    let reverse = false
    regTypes.forEach(type => {
      if (regMap[type]) {
        supportLabels.push(regMap[type].label)
        supportRegs.push(regMap[type].reg)
      }
      if (type === REG_TYPE.SYM) {
        reverse = true
        supportLabels.push('标点符号(含表情)')
      }
    })
    let finalReg = null
    if (reverse) {
      const unsupportRegs = Object.keys(regMap).filter(type => regTypes.indexOf(type) < 0)
      finalReg = new RegExp(`^([^${unsupportRegs.join('')}])*$`)
    } else {
      finalReg = new RegExp(`^([${supportRegs.join('')}])*$`)
    }
    if (!finalReg.test(text)) {
      return `仅支持输入${supportLabels.join('、')}`
    }
  }
  return ''
}

function validateTextLength (text, maxLength) {
  if (maxLength && strlen(text) > maxLength) {
    return `长度不能超过${maxLength}`
  }
}

function validateAttr (attr, value) {
  console.log(attr)
  const { render, name, regTypes, maxLength, maxCount } = attr
  switch (render.type) {
    case RENDER_TYPE.INPUT:
      const error = validateText(value, regTypes) || validateTextLength(value, maxLength)
      if (error) {
        return `${name}${error}`
      }
      return ''
    case RENDER_TYPE.SELECT:
      if (Array.isArray(value) && !!maxCount && value.length > maxCount) {
        return `${name}最多选择${maxCount}项`
      }
      return ''
  }
  return ''
}

const createItemOptions = attr => {
  const render = attr.render
  switch (render.type) {
    case RENDER_TYPE.INPUT:
      return {
        type: 'Input',
        events: {
          'on-change' ($event) {
            const newValue = $event.target.value
            this.formData[attr.id] = newValue
            if (validateTextLength(newValue, attr.maxLength)) {
              setTimeout(() => {
                this.formData[attr.id] = strcut(newValue, attr.maxLength)
              })
            }
          }
        },
        options: {
          type: 'textarea',
          maxLength: attr.maxLength
        }
      }
    case RENDER_TYPE.SELECT:
      return {
        type: 'Selector',
        events: {
          'on-change' (data) {
            const preValue = (this.formData[attr.id] || []).slice()
            this.formData[attr.id] = data
            if (Array.isArray(data) && !!attr.maxCount && data.length > attr.maxCount && data.length > preValue.length) {
              Message.warning(`${attr.name}最多选择${attr.maxCount}项`)
              setTimeout(() => {
                this.formData[attr.id] = preValue
              })
            }
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
      const error = validateAttr(attr, item.value)
      if (error) {
        throw new Error(error)
      }
    },
    ...createItemOptions(attr)
  }))
}
