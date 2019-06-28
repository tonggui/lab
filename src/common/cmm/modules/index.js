import memoize from '@/common/memoize'
import {
  createModule,
  combineWithIntersectionMode,
  combineWithUnionMode
} from '../Module'
import { isNormalMedicine } from '../category'
import { WHITELIST_MODULES_MAP } from '@/data/enums/fields'
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
  createModule(
    PAGE_PRODUCTLIST_CREATE,
    ({ category }) => !isNormalMedicine(category),
    true,
    combineWithUnionMode
  ),
  // 快捷新建/修改
  createModule(
    PRODUCT_SHORTCUT,
    ({ category }) => [20, 21, 22, 5007, 5012].includes(category.pid),
    true,
    combineWithUnionMode
  ),
  createModule(
    PRODUCT_DESCRIPTION,
    ({ category }) => !isNormalMedicine(category),
    true,
    combineWithUnionMode
  ),
  // https://km.sankuai.com/page/152267436
  createModule(
    PRODUCT_SELLTIME,
    ({ category }) => category.pid === 20 || [178, 4012, 4022, 4023, 4024].includes(category.id),
    true,
    combineWithUnionMode
  ),
  // https://km.sankuai.com/page/152267436
  createModule(
    PRODUCT_PACKINGBAG,
    ({ category }) => [176, 177, 178, 2005, 4024].includes(category.id),
    true,
    combineWithUnionMode
  ),
  createModule(
    PRODUCT_LABEL,
    ({ category }) => !isNormalMedicine(category),
    true,
    combineWithUnionMode
  ),
  createModule(
    SWITCH_SUGGEST_NOUPC,
    ({ category }) => category.pid === 21,
    true,
    combineWithIntersectionMode
  ),
  createModule(
    SWITCH_ADVANCE_SEARCH,
    ({ category }) => !isNormalMedicine(category),
    true,
    combineWithUnionMode
  ),
  // 图片编辑严格限制，同时存在时不支持编辑。需要产品逻辑变更！！
  createModule(
    PRODUCT_PICTURE_EDITABLE,
    ({ category }) => !isNormalMedicine(category),
    true,
    combineWithIntersectionMode
  ),
  // 商品标题是否可编辑默认通过品类控制，后期并行使用异步任务进行控制
  createModule(
    PRODUCT_TITLE_EDITABLE,
    ({ category }) => !isNormalMedicine(category),
    true,
    combineWithIntersectionMode
  ),
  createModule(
    POI_IS_MEDICINE,
    ({ category }) => isNormalMedicine(category),
    true,
    combineWithIntersectionMode
  )
]

// TODO 异步处理需要添加Memorize缓存相同方法
// 白名单控制功能、灰度控制功能
export const AsyncModule = [
  createModule(PRODUCT_MULTITAG, () => memoize(fetchGetWhiteListModuleMap)().then(m => m[WHITELIST_MODULES_MAP.MULTI_TAG])),
  createModule(PRODUCT_PICCONTENT, () => memoize(fetchGetWhiteListModuleMap)().then(m => m[WHITELIST_MODULES_MAP.PICTURE_CONTENT])),
  createModule(POI_HOT_RECOMMEND, () => memoize(fetchGetPoiHotRecommend)()),
  createModule(POI_RISK_CONTROL, () => memoize(fetchGetPoiRiskControl)()),
  createModule(POI_VIOLATION, () => memoize(fetchGetPoiViolationInfo)()),
  createModule(POI_PACKAGE_BAG, () => memoize(fetchGetListPageData)().then(data => data.hasPackageBag)),
  createModule(POI_TRANSITION_PRODUCT, () => memoize(fetchGetListPageData)().then(data => data.hasTransitionProduct)),
  createModule(POI_ERROR_PRODUCT_COUNT, () => memoize(fetchGetListPageData)().then(data => data.errorProductCount)),
  createModule(POI_UN_RELATION_PRODUCT_COUNT, () => memoize(fetchGetListPageData)().then(data => data.unRelationProductCount)),
  createModule(PRODUCT_VIDEO, () => memoize(fetchGetWhiteListModuleMap)().then(m => m.productVideo))
]

export * from './names'
