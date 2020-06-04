import BaseLxReport from './baseLxReport'
import ProductCubeLxReport from './productCubeLxReport'

const map = {
  default: new BaseLxReport(),
  productCube: new ProductCubeLxReport()
}

const handler = ['pv', 'mv', 'mc']
export default handler.reduce((prev, event) => {
  prev[event] = (params, type = 'default') => {
    const instance = map[type] || map.default
    return instance[event](params)
  }
  return prev
}, {})
