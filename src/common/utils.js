import moment from 'moment'
import { isNumber, isObject, camelCase, upperFirst } from 'lodash'

export const findFirstLeaf = (list) => {
  if (!list || list.length <= 0) {
    return {}
  }
  const node = list[0]
  if (!node.children || node.children.length <= 0) {
    return node
  }
  return findFirstLeaf(node.children)
}
// 秒级别的时间戳转换成文字
export const formatTime = time => {
  moment.locale('zh-cn', {
    meridiem: function (hour) { // 三个参数(hour, minute, isLowercase)
      return hour < 12 ? '上午' : '下午'
    }
  })
  const timeStamp = time * 1000
  const date = moment(timeStamp)
  const today = moment().startOf('day')
  const yesterDay = today.clone().subtract(1, 'day')
  const timeString = date.format('a h:mm')
  let dateString = ''
  if (date.isSameOrAfter(today)) {
    dateString = '今天'
  } else if (date.isSameOrAfter(yesterDay)) {
    dateString = '昨天'
  } else {
    dateString = date.format('YYYY-MM-DD')
  }
  return [dateString, timeString].join(' ')
}

export const isEmptyArray = (arr) => {
  if (Array.isArray(arr)) {
    return arr.length <= 0
  }
  return !arr
}

export const isEmptyObject = (obj) => {
  if (!obj) {
    return true
  }
  if (isObject(obj)) {
    const normalKeys = Object.getOwnPropertyNames(obj)
    const symbolKeys = Object.getOwnPropertySymbols(obj)
    return !normalKeys.length && !symbolKeys.length
  }
  return false
}

export const isEmpty = (value) => {
  // 0数字不是空
  if (isNumber(value)) {
    return false
  }
  if (Array.isArray(value)) {
    return isEmptyArray(value)
  }
  if (isObject(value)) {
    return isEmptyObject(value)
  }
  return !value
}

export const pascalCase = (value = '') => upperFirst(camelCase(value))

export const trimSplit = (value = '', separator = ',') => {
  value = value || ''
  return value.split(separator).filter(v => !!v)
}

export const sleep = (time) => {
  return new Promise((resolve) => {
    setTimeout(resolve, time)
  })
}

export function strlen (str) {
  let len = 0
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i)
    // 单字节加1
    if ((c >= 0x0001 && c <= 0x007e) || (c >= 0xff60 && c <= 0xff9f)) {
      len++
    } else {
      len += 2
    }
  }
  return len
}

export function strcut (str, length) {
  let len = 0
  let result = ''
  for (let i = 0; i < str.length; i++) {
    const s = str.charAt(i)
    const c = str.charCodeAt(i)
    // 单字节加1
    if ((c >= 0x0001 && c <= 0x007e) || (c >= 0xff60 && c <= 0xff9f)) {
      len++
    } else {
      len += 2
    }
    if (len <= length) {
      result += s
    }
  }
  return result
}
