import {
  POI_HOT_RECOMMEND,
  POI_RISK_CONTROL,
  POI_IS_MEDICINE
  // PRODUCT_SELLTIME,
  // PRODUCT_LABEL,
  // POI_PACKAGE_BAG,
  // POI_VIOLATION,
  // POI_ERROR_PRODUCT_COUNT,
  // PRODUCT_VIDEO,
  // POI_TRANSITION_PRODUCT,
  // POI_UN_RELATION_PRODUCT_COUNT,
} from '@/common/cmm'

/**
 * 统计 列表页 有的 开关
 * 1. 药品不允许展示 智能排序 -- 非药品
 * 2. 门店是否 热卖推荐 控制热卖推荐 + 列表空状态 -- 接口
 * 3. 门店是否 命中风控 风控提示 -- 接口
 * 4. 门店 中间态商品 -- 接口
 * 5. 门店 未关联商品数量 -- 接口
 * 6. 是否展示 违规商品入口 -- 接口
 * 7. 是否支持 包装袋配置 -- 接口
 * 8. 商品异常数目 -- 接口
 * 9. 是否展示 商品视频入口 -- 接口
 * 10. 是否展示 回收站入口 -- 非药品
 * 11. 是否展示 新建单商品 入口 -- 非药品
 * 12. 是否展示 修改可售时间 -- 接口
 * 13. 是否展示 修改商品标签 -- 非药品
 * 14. 是否展示 信息不全tab -- 非药品
 * 15. 是否 支持 修改商品标题 -- 非药品
 * 16. 是否 支持 修改商品图片 -- 非药品
 */

export default {
  hotRecommend: POI_HOT_RECOMMEND,
  riskControl: POI_RISK_CONTROL,
  isMedicine: POI_IS_MEDICINE
}
