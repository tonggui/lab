import baseLxReport from './baseLxReport'
import productCubeLxReport from './productCubeLxReport'
import { mergeCustomParamsFromElement } from '@/common/utils'
import { merge } from 'lodash'

const map = {
  default: baseLxReport,
  productCube: productCubeLxReport
}

const handler = ['pv', 'mv', 'mc']
export default handler.reduce((prev, event) => {
  prev[event] = (params, type = 'default', vm = null) => {
    // 合并自定义参数
    if (vm && vm.$el) params = merge({}, { val: mergeCustomParamsFromElement(vm.$el, params.val) }, params)
    const instance = map[type] || map.default
    return instance[event](params)
  }
  return prev
}, {})

const handlerDealer = (instance) => {
  return handler.reduce((prev, event) => {
    prev[event] = (params, vm = null) => {
      // 合并自定义参数
      if (vm && vm.$el) params = merge({}, { val: mergeCustomParamsFromElement(vm.$el, params.val) }, params)
      return instance[event](params)
    }
    return prev
  }, {})
}

const LxSwitcher = (type = 'default') => {
  const instance = map[type] || map.default
  return handlerDealer(instance)
}

export const productCubeLX = LxSwitcher('productCube')

export const LX = LxSwitcher('default')
