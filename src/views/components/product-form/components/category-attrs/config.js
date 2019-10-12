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
import { Message } from '@roo-design/roo-vue'

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

function isExceeded (value = [], maxCount) {
  return Array.isArray(value) && !!maxCount && value.length > maxCount
}

function validateAttr (attr, value) {
  const { render, name, regTypes, maxLength, maxCount } = attr
  switch (render.type) {
    case RENDER_TYPE.INPUT:
      const trimedValue = value.trim()
      // 只校验存在的值
      if (!trimedValue) {
        return ''
      }
      const error = validateText(trimedValue, regTypes) || validateTextLength(trimedValue, maxLength)
      if (error) {
        return `${name}${error}`
      }
      return ''
    case RENDER_TYPE.SELECT:
      if (isExceeded(value, maxCount)) {
        return `${name}最多选择${maxCount}项`
      }
      return ''
  }
  return ''
}

const createItemOptions = (key, attr, { allowApply }) => {
  const render = attr.render
  const { name, maxCount = 0, maxLength = 0, regTypes } = attr
  switch (render.type) {
    case RENDER_TYPE.INPUT:
      const regTip = getRegTip(regTypes)
      return {
        type: 'Input',
        events: {
          'on-change' ($event) {
            this.setData(key, $event.target.value)
          },
          'on-blur' ($event) {
            const val = $event.target.value.trim()
            if (val) {
              const error = validateText(val, regTypes) || validateTextLength(val, maxLength)
              if (error) {
                Message.warning(`${name}${error}`)
              }
            }
          }
        },
        options: {
          type: 'textarea',
          maxLength,
          placeholder: regTip ? `${name}${regTip}` : '',
          rows: Math.min(1 + Math.ceil(attr.maxLength / 20), 3)
        }
      }
    case RENDER_TYPE.SELECT:
      return {
        type: 'CategoryAttrSelect',
        events: {
          'on-change' (data) {
            const oldValue = this.getData(key)
            this.setData(key, data)
            if (isExceeded(data, maxCount) && data.length > oldValue.length) {
              Message.warning(`${name}最多选择${maxCount}项`)
              setTimeout(() => {
                this.setData(key, oldValue)
              }, 1)
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
      validate (item) {
        if (attr.required && isEmpty(typeof item.value === 'string' ? item.value.trim() : item.value)) {
          throw new Error(`${item.label}不能为空`)
        }
        const error = validateAttr(attr, item.value)
        if (error) {
          throw new Error(error)
        }
      },
      value: undefined,
      ...createItemOptions(key, attr, context)
    }
  })
}
