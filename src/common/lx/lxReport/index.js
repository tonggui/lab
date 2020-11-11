import baseLxReport from './baseLxReport'
import productCubeLxReport from './productCubeLxReport'

const map = {
  default: baseLxReport,
  productCube: productCubeLxReport
}

const handler = ['pv', 'mv', 'mc']
export default handler.reduce((prev, event) => {
  prev[event] = (params, type = 'default') => {
    const instance = map[type] || map.default
    return instance[event](params)
  }
  return prev
}, {})
