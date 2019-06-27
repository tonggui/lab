import Module, { ModuleType } from '../Module'
import { isNormalMedicine } from '../category'
import {
  fetchGetWhiteListModuleMap,
  fetchGetListPageData,
  fetchGetPoiHotRecommend,
  fetchGetPoiViolationInfo,
  fetchGetPoiRiskControl
} from '@/data/repos/poi'
import {
  PAGE_PRODUCTLIST_CREATE,

  PRODUCT_SHORTCUT,
  PRODUCT_SELLTIME,
  PRODUCT_DESCRIPTION,
  PRODUCT_PACKINGBAG,
  PRODUCT_MULTITAG,
  PRODUCT_PICCONTENT,
  PRODUCT_LABEL,
  PRODUCT_PICTURE_EDITABLE,
  PRODUCT_TITLE_EDITABLE,

  SWITCH_SUGGEST_NOUPC,
  SWITCH_ADVANCE_SEARCH,

  POI_HOT_RECOMMEND,
  POI_RISK_CONTROL,
  POI_VIOLATION,
  POI_PACKAGE_BAG,
  POI_TRANSITION_PRODUCT,
  POI_ERROR_PRODUCT_COUNT,
  POI_UN_RELATION_PRODUCT_COUNT,
  POI_IS_MEDICINE,
  PRODUCT_VIDEO
} from './names'

export const CategoryModules = [
  new Module(PAGE_PRODUCTLIST_CREATE, ModuleType.UNION, ({ category }) => !isNormalMedicine(category)),
  // 快捷新建/修改
  new Module(
    PRODUCT_SHORTCUT,
    ModuleType.UNION,
    ({ category }) => [20, 21, 22, 5007, 5012].includes(category.pid)
  ),
  new Module(PRODUCT_DESCRIPTION, ModuleType.UNION, ({ category }) => !isNormalMedicine(category)),
  // https://km.sankuai.com/page/152267436
  new Module(
    PRODUCT_SELLTIME,
    ModuleType.UNION,
    ({ category }) => category.pid === 20 || [178, 4012, 4022, 4023, 4024].includes(category.id)
  ),
  // https://km.sankuai.com/page/152267436
  new Module(
    PRODUCT_PACKINGBAG,
    ModuleType.UNION,
    ({ category }) => [176, 177, 178, 2005, 4024].includes(category.id)
  ),
  new Module(
    PRODUCT_LABEL,
    ModuleType.UNION,
    ({ category }) => !isNormalMedicine(category)
  ),
  new Module(
    SWITCH_SUGGEST_NOUPC,
    ModuleType.INTERSECTION,
    ({ category }) => category.pid === 21
  ),
  new Module(
    SWITCH_ADVANCE_SEARCH,
    ModuleType.UNION,
    ({ category }) => !isNormalMedicine(category)
  ),
  // 图片编辑严格限制，同时存在时不支持编辑。需要产品逻辑变更！！
  new Module(
    PRODUCT_PICTURE_EDITABLE,
    ModuleType.INTERSECTION,
    ({ category }) => !isNormalMedicine(category)
  ),
  // 商品标题是否可编辑默认通过品类控制，后期并行使用异步任务进行控制
  new Module(
    PRODUCT_TITLE_EDITABLE,
    ModuleType.INTERSECTION,
    ({ category }) => !isNormalMedicine(category)
  ),
  new Module(
    POI_IS_MEDICINE,
    ModuleType.INTERSECTION,
    ({ category }) => isNormalMedicine(category)
  )
]

// 白名单控制功能、灰度控制功能
export const AsyncModule = [
  new Module(PRODUCT_MULTITAG, ModuleType.INTERSECTION, () => fetchGetWhiteListModuleMap().then(m => m.multiTag)),
  new Module(PRODUCT_PICCONTENT, ModuleType.INTERSECTION, () => fetchGetWhiteListModuleMap().then(m => m.picContent)),
  new Module(POI_HOT_RECOMMEND, ModuleType.INTERSECTION, () => fetchGetPoiHotRecommend()),
  new Module(POI_RISK_CONTROL, ModuleType.INTERSECTION, () => fetchGetPoiRiskControl()),
  new Module(POI_VIOLATION, ModuleType.INTERSECTION, () => fetchGetPoiViolationInfo()),
  new Module(POI_PACKAGE_BAG, ModuleType.INTERSECTION, () => fetchGetListPageData().then(data => data.hasPackageBag)),
  new Module(POI_TRANSITION_PRODUCT, ModuleType.INTERSECTION, () => fetchGetListPageData().then(data => data.hasTransitionProduct)),
  new Module(POI_ERROR_PRODUCT_COUNT, ModuleType.INTERSECTION, () => fetchGetListPageData().then(data => data.errorProductCount)),
  new Module(POI_UN_RELATION_PRODUCT_COUNT, ModuleType.INTERSECTION, () => fetchGetListPageData().then(data => data.unRelationProductCount)),
  new Module(PRODUCT_VIDEO, ModuleType.INTERSECTION, () => fetchGetWhiteListModuleMap().then(m => m.productVideo))
]

export * from './names'
