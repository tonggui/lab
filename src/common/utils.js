import moment from 'moment'
import { isNumber, isObject, camelCase, upperFirst } from 'lodash'
import { findParamAndContext } from '@sgfe/reco-fe-tim-lx/src/dom-util'
import { base64Encode } from '@/common/base64'
/**
 * JSON字符串反序列化
 * @param str jsonString
 * @param defaultValue 转化失败的默认值
 * @return {*}
 */
export const parseJsonString = (str, defaultValue) => {
  try {
    return JSON.parse(str)
  } catch (err) {
    return defaultValue
  }
}

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

export function trimSplitId (str, separator = ',') {
  return trimSplit(str, separator).map(id => +id)
}

export const sleep = (time) => {
  return new Promise((resolve) => {
    setTimeout(resolve, time)
  })
}

/**
 * 图片转换成base64
 */
export function Img2Base64 (img, callback) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => resolve(reader.result))
    reader.addEventListener('error', reject)
    reader.readAsDataURL(img)
  })
}

export function strlen (str) {
  // let len = 0
  // for (let i = 0; i < str.length; i++) {
  //   const c = str.charCodeAt(i)
  //   // 单字节加1
  //   if ((c >= 0x0001 && c <= 0x007e) || (c >= 0xff60 && c <= 0xff9f)) {
  //     len++
  //   } else {
  //     len += 2
  //   }
  // }
  // return len
  // 暂时不使用字节长度，还是用字符长度
  return str ? str.length : 0
}

export function strcut (str, length) {
  if (!length) {
    return str
  }
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

export const convertRegexpPattern = (str) => {
  const special = ['/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\']
  const regex = new RegExp(`(\\${special.join('|\\')})`, 'gim')
  return (str || '').replace(regex, '\\$1')
}

/**
 * 包裹函数-检查上下文环境是否还存在
 * @param cb
 * @param vm
 * @returns {function(...[*]=): (undefined)}
 */
export const contextSafetyWrapper = (cb, vm) => {
  return function (...arg) {
    const _isMounted = vm._isMounted
    const _isDestroyed = vm._isDestroyed

    if (!_isMounted || _isDestroyed) {
      return
    }
    cb.apply(vm, arg)
  }
}

/**
 * 从元素上取自定义参数并合并已有参数
 * 借鉴tim-lx从自定义数据取参数
 * @returns {{}}
 */
export const mergeCustomParamsFromElement = (el = null, params = {}) => {
  if (!el) return {}
  const { param = {} } = findParamAndContext(el)
  return Object.assign({}, param, params)
}

/**
 * 获取日期区间时间戳
 * @start 开始日期，默认取当天
 * @returns {
 * * startTime
 * * endTime
 * }
 */
export const getDateRange = ({ start, n = 0 }) => {
  const date = start ? new Date(start) : new Date()
  const timeStamp = new Date(date.toLocaleDateString()).getTime()
  return {
    startTime: timeStamp - n * 24 * 60 * 60 * 1000, // n天前的0点，默认返回当天0点时间戳
    endTime: timeStamp + 24 * 60 * 60 * 1000 - 1 // 当天24点
  }
}

/**
 * 获取访问来源（ XF(先富)、B（商家端））
 */
export function getSourceRole () {
  const hosts = [
    'qb.waimai',
    'queenbee'
  ]
  const host = window.location.host
  for (let i = 0; i < hosts.length; i++) {
    if (host.indexOf(hosts[i]) !== -1) return 'XF'
  }
  return 'B'
}

export function utf8Tob64 (str) {
  return window.btoa(unescape(encodeURIComponent(str)))
}

export function b64Toutf8 (str) {
  return decodeURIComponent(escape(window.atob(str)))
}

/**
 * JSON字符串反序列化
 * @param options Object, client 请求来源端、 id 用于耗时埋点统计中，前后端链路关联、 biz 功能入口、 ext 扩展
 * 可参考 https://km.sankuai.com/page/76533149
 * @return {*}
 */

export function setHeaderMContext (options) {
  const { biz, ext, client, id } = options
  if (!id) {
    console.error('traceId 不存在')
  }
  return base64Encode(JSON.stringify({
    product_source_client: client || 'PC',
    product_source_role: getSourceRole(),
    product_source_biz: biz || '',
    product_source_ext: ext || '',
    product_process_id: id
  }))
}
