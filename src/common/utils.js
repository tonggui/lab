import moment from 'moment'
import { isNumber, isObject, camelCase, upperFirst, get } from 'lodash'
import { findParamAndContext } from '@sgfe/reco-fe-tim-lx/src/dom-util'
import { convertProductDetail } from '@/data/helper/product/withCategoryAttr/convertToServer'
import { convertProductToServer } from '@/data/helper/product/merchant/convertToServer'
import { combineCategoryMap } from '@/data/helper/category/operation'
import { getIsSingle } from './constants'

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

const DEFAULT_SPU_ATTR_TEXT = {
  name: '名称',
  categoryId: '商品类目',
  upcImage: '条码图',
  video: '封面视频',
  skus: '规格变动',
  categoryAttrMap: '类目属性',
  description: '文字详情',
  picContent: '图片详情',
  labels: '推荐标签',
  limitSale: '限购规则',
  attrList: '商品属性',
  sellStatus: '上/下架状态',
  saleType: '售卖方式'
}

const DEFAULT_SPU_ATTR_VALUE = {
  name: '',
  upcImage: '',
  video: '{}',
  skus: '[]',
  categoryAttrMap: '{}',
  description: '',
  picContent: '',
  labels: '[]',
  attrList: '[]',
  sellStatus: 0
}

const MERCHANT_SPU_ATTR_TEXT = Object.assign({}, DEFAULT_SPU_ATTR_TEXT, {
  tagIds: '店内分类',
  saleTime: '售卖时间',
  wmPoiIds: '关联门店',
  pic: '商品图片'
})

const MERCHANT_SPU_DEFAULT_VALUE = Object.assign({}, DEFAULT_SPU_ATTR_VALUE, {
  tagIds: '[]',
  saleTime: JSON.stringify('-'),
  wmPoiIds: '[]',
  pic: '',
  saleType: '1'
})

const SPU_ATTR_TEXT = Object.assign({}, DEFAULT_SPU_ATTR_TEXT, {
  tagList: '店内分类',
  shippingTimeX: '售卖时间',
  picture: '商品图片'
})

const SPU_DEFAULT_VALUE = Object.assign({}, DEFAULT_SPU_ATTR_VALUE, {
  tagList: '[]',
  shippingTimeX: JSON.stringify('-'),
  picture: '',
  saleType: 1
})

const SELL_ATTRS = {
  spec: '售卖规格',
  upc: '条形码',
  price: '价格',
  stock: '库存',
  weight: '重量',
  shelfNum: '店内码/货号',
  minOrderCount: '起购数',
  ladderPrice: '包装费',
  sourceFoodCode: '货架码/位置'
}

const SELL_ATTRS_DEFAULT_VALUE = {
  spec: '',
  upc: '',
  price: '',
  stock: 0,
  weight: -1,
  shelfNum: '',
  minOrderCount: 1,
  ladderPrice: '',
  sourceFoodCode: ''
}

/**
 * 数据转化（通过接口层格式清洗）
 * @param product
 * @returns {*}
 */
const productAttrTransfer = (product) => {
  if (!product) return product
  const { normalAttributes, normalAttributesValueMap, sellAttributes, sellAttributesValueMap, ...rest } = product
  const { categoryAttrList, categoryAttrValueMap } = combineCategoryMap(normalAttributes, sellAttributes, normalAttributesValueMap, sellAttributesValueMap)
  const newProduct = { ...rest, categoryAttrList, categoryAttrValueMap }
  const fn = getIsSingle() ? convertProductDetail : convertProductToServer
  return fn(newProduct, { showLimitSale: !!get(newProduct, 'limitSale.status', 0) })
}

/**
 * 新旧数据对比（编辑）
 * @param product
 * @param originProduct
 * @returns {*[]}
 */
const newAndOldDataCompare = (product, originProduct) => {
  const output = []
  const TEXT = getIsSingle() ? SPU_ATTR_TEXT : MERCHANT_SPU_ATTR_TEXT

  try {
    Object.keys(TEXT).forEach(spuName => {
      if (spuName === 'skus') { // 销售属性单独处理
        let newItem = getIsSingle() ? JSON.parse(product[spuName]) : product[spuName]
        let oldItem = getIsSingle() ? JSON.parse(originProduct[spuName]) : product[spuName]
        if (Array.isArray(newItem) && Array.isArray(oldItem)) {
          newItem.sort((a, b) => a.id - b.id)
          oldItem.sort((a, b) => a.id - b.id)
          if (newItem.length !== oldItem.length && !output.includes(TEXT[spuName])) output.push(TEXT[spuName])
          else {
            newItem.forEach((skuAttr, index) => {
              if (skuAttr.id !== (oldItem[index] && oldItem[index].id) && !output.includes(TEXT[spuName])) {
                output.push(TEXT[spuName])
                throw Error('change')
              } else {
                Object.keys(SELL_ATTRS).forEach(attr => {
                  const newAttrVal = skuAttr[attr]
                  const oldAttrVal = oldItem[index][attr]
                  if (newAttrVal !== oldAttrVal && !output.includes(SELL_ATTRS[attr])) output.push(SELL_ATTRS[attr])
                })
              }
            })
          }
        } else {
          output.push(TEXT[spuName])
        }
      } else if (product[spuName]) {
        const newItem = JSON.stringify(product[spuName])
        const oldItem = JSON.stringify(originProduct[spuName])
        if (newItem !== oldItem) output.push(TEXT[spuName])
      }
    })
  } catch (err) {
    console.log(err)
  }
  return output
}

/**
 * 数据对比 (新建)
 * @param product
 * @returns {*[]}
 */
const newDataChange = (product) => {
  const TEXT = getIsSingle() ? SPU_ATTR_TEXT : MERCHANT_SPU_ATTR_TEXT
  const output = []
  try {
    Object.keys(TEXT).forEach(spuName => {
      if (spuName === 'skus' && product[spuName]) {
        const skus = getIsSingle() ? JSON.parse(product[spuName]) : product[spuName]
        if (Array.isArray(skus)) {
          skus.forEach(saleAttrs => {
            Object.keys(SELL_ATTRS).forEach(attr => {
              if (saleAttrs[attr] && SELL_ATTRS_DEFAULT_VALUE[attr] !== saleAttrs[attr] && !output.includes(SELL_ATTRS[attr])) output.push(SELL_ATTRS[attr])
            })
          })
        }
      } else if (product[spuName]) {
        const VALUE = getIsSingle() ? SPU_DEFAULT_VALUE : MERCHANT_SPU_DEFAULT_VALUE
        if (spuName === 'categoryAttrMap' && product[spuName] && product[spuName] !== VALUE[spuName]) {
          Object.values(product[spuName]).forEach(category => {
            if (category['valueList'] && Array.isArray(category['valueList']) && category['valueList'].length) {
              output.push(`${TEXT[spuName]}-${category['attrName'] || ''}`)
            }
          })
        } else if (getIsSingle() && product[spuName] && product[spuName] !== VALUE[spuName]) output.push(TEXT[spuName])
        else if (!getIsSingle() && product[spuName] && JSON.stringify(product[spuName]) !== VALUE[spuName]) output.push(TEXT[spuName])
      }
    })
  } catch (err) {
    console.log(err)
  }

  return output
}

/**
 * 数据变化对比
 */
export const getProductChangInfo = (product, originProduct) => {
  let output = []

  product = productAttrTransfer(product)
  originProduct = productAttrTransfer(originProduct)
  console.log('product', JSON.stringify(product))
  if (!originProduct) {
    output = newDataChange(product)
  } else {
    output = newAndOldDataCompare(product, originProduct)
  }
  return output
}

const VISIT_SOURCE = {
  XF: '先富',
  B: '商家端'
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
  return utf8Tob64(JSON.stringify({
    product_source_client: client || 'PC',
    product_source_role: VISIT_SOURCE[getSourceRole()],
    product_source_biz: biz || '',
    product_source_ext: ext || '',
    product_process_id: id
  }))
}
