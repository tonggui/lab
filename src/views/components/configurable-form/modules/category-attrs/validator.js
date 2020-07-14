import { REG_TYPE } from '@/data/enums/category'
import { strlen } from '@/common/utils'

export const regMap = {
  [REG_TYPE.CHN]: {
    label: '中文',
    reg: '\\u4e00-\\u9fa5'
  },
  [REG_TYPE.CHAR]: {
    label: '字母',
    reg: 'a-zA-Z'
  },
  [REG_TYPE.NUM]: {
    label: '数字',
    reg: '0-9'
  }
}

const validateText = (text, { regTypes } = {}) => {
  if (!regTypes || regTypes.length <= 0) {
    return
  }
  /**
   * 仅选择中文时：则对应的属性值仅允许填写中文
   * 仅选择字母时：则对应的属性值仅允许填写字母
   * 仅选择数字时：则对应的属性值仅允许填写数字
   * 任意一种字符类型，当不选择标点符号时，均允许录入“空格”
   * 允许输入标点符号的时候，则判断 没有包涵的类型的是否输入即可
   */
  const supportLabelList = []
  const supportRegexList = ['\\s'] // 默认支持空格
  let reverse = false

  regTypes.forEach(type => {
    const regInfo = regMap[type]
    if (regInfo) {
      supportLabelList.push(regInfo.label)
      supportRegexList.push(regInfo.reg)
    }
    if (type === REG_TYPE.SYM) {
      reverse = true
    }
  })
  let reg = null
  if (reverse) {
    const unSupportRegexList = Object.keys(regMap).filter(type => regTypes.indexOf(+type) < 0).map(k => regMap[k].reg)
    reg = new RegExp(`^([^${unSupportRegexList.join('')}])*$`)
  } else {
    reg = new RegExp(`^([${supportRegexList.join('')}])*$`)
  }
  if (!reg.test(text)) {
    return `仅支持输入${supportLabelList.join('、')}${reverse ? '、标点符号(含表情)' : ''}`
  }

  // 兜底校验，不能没有一个支持的类别（标点除外）
  const finalReg = new RegExp(`[${supportRegexList.join('')}]`)
  if (!finalReg.test(text)) {
    return `必须包含${supportLabelList.join('、')}中的一种`
  }
}

const validateTextLength = (text, { maxLength } = {}) => {
  if (maxLength && strlen(text) > maxLength) {
    return `长度不能超过${maxLength}`
  }
}

const validateTextEmpty = (text) => {
  if (!text || !text.trim()) {
    return '不能为空'
  }
}

const validateSelectEmpty = (value) => {
  if (!value || value.length <= 0) {
    return '不能为空'
  }
}

const validateSelectLength = (value = [], { maxCount }) => {
  if (Array.isArray(value) && !!maxCount && value.length > maxCount) {
    return `最多选择${maxCount}项`
  }
}

const validateMap = {
  text: validateText,
  textLength: validateTextLength,
  textEmpty: validateTextEmpty,
  selectLength: validateSelectLength,
  selectEmpty: validateSelectEmpty
}

const run = (validateList, value) => {
  let error = ''
  validateList.some(({ handler, options }) => {
    error = handler(value, options)
    return !!error
  })
  return error
}

const add = (validateList, type, options) => {
  const handler = validateMap[type]
  if (handler) {
    validateList.push({
      handler,
      options
    })
  }
}

export default () => {
  const validateList = []
  return {
    add: (...args) => add(validateList, ...args),
    run: (value) => run(validateList, value)
  }
}
