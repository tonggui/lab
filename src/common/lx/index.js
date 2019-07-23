import { TIM_LX } from '@sgfe/reco-fe-tim-lx'

const productListCommonModules = {
  'editInlineTitleBtn/inlineEditBtn': 'b_shangou_online_e_s40fd186_mc', // 修改标题
  'editInlinePriceBtn/inlineEditBtn': 'b_puojmmh2', // 修改价格
  'editInlineStockBtn/inlineEditBtn': 'b_tikw7tcq', // 修改库存
  'modelEditMultiSkusPriceBtn/inlineEditBtn': 'b_puojmmh2', // 弹窗中修改多sku的价格
  'modelEditMultiSkusStockBtn/inlineEditBtn': 'b_tikw7tcq' // 弹窗中修改多sku的库存
}

/**
 * 将通用功能埋点map到各个页面中
 * 后期tim-lx建议增加通配支持，避免顶级context对其他子模块的强力干扰
 * eg: 绝对路径/相对路径；正则匹配
 */
const mapModulesToPages = (pageNames = [], modules = {}) => Object.entries(modules).reduce((map, [key, value]) => {
  pageNames.forEach((name) => {
    map[`${name}/${key}`] = value
  })
  return map
}, {})

TIM_LX.config({
  ...mapModulesToPages(['list', 'searchList'], productListCommonModules)
})

export {
  TIM_LX
} from '@sgfe/reco-fe-tim-lx'
