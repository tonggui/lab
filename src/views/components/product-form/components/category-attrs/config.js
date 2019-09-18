/*
 * @description
 *   Please write the config.js script's description
 * @author
 *   rdshoep (zhangliang15@meituan.com)
 * @version
 *   1.0.0(2019-07-15)
 */
import { RENDER_TYPE, VALUE_TYPE, REG_TYPE } from '@/data/enums/category'
import { isEmpty, strlen } from '@/common/utils'

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
    const supportRegs = ['\\s'] // 默认支持空格
    let reverse = false
    regTypes.forEach(type => {
      if (regMap[type]) {
        supportLabels.push(regMap[type].label)
        supportRegs.push(regMap[type].reg)
      }
      if (type === REG_TYPE.SYM) {
        reverse = true
      }
    })
    let reg = null
    if (reverse) {
      const unsupportRegs = Object.keys(regMap).filter(type => regTypes.indexOf(+type) < 0).map(k => regMap[k].reg)
      reg = new RegExp(`^([^${unsupportRegs.join('')}])*$`)
    } else {
      reg = new RegExp(`^([${supportRegs.join('')}])*$`)
    }
    if (!reg.test(text)) {
      return `仅支持输入${supportLabels.join('、')}${reverse ? '、标点符号(含表情)' : ''}`
    }
    // 兜底校验，不能没有一个支持的类别（标点除外）
    const finalReg = new RegExp(`[${supportRegs.join('')}]`)
    if (!finalReg.test(text)) {
      return `必须包含${supportLabels.join('、')}中的一种`
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
  const { render, name, regTypes, maxLength, maxCount } = attr
  switch (render.type) {
    case RENDER_TYPE.INPUT:
      const error = validateText(value.trim(), regTypes) || validateTextLength(value.trim(), maxLength)
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
            this.formData[attr.id] = $event.target.value
          }
        },
        options: {
          type: 'textarea',
          maxLength: attr.maxLength,
          rows: Math.min(1 + Math.ceil(attr.maxLength / 20), 3)
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
      if (attr.required && isEmpty(typeof item.value === 'string' ? item.value.trim() : item.value)) {
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
