import { Pagination, TimeZone } from '../interface/common'

export const defaultPagination: Pagination = {
  current: 1,
  pageSize: 20,
  total: 0,
  pageSizeOpts: [20, 50, 100],
  showElevator: true,
  showSizer: true
}

export const initTimeZone: TimeZone = {
  days: [0, 1, 2, 3, 4, 5, 6],
  timeList: []
}

export const defaultWhiteListModuleMap = {
  propertyEditLock: false, // 根据“字段锁定”控制标品是否可编辑商品信息 配了 锁定 默认false
  weightNotEmpty: false, // 新建/编辑商品时，如果对应类目在“字段选填”中，则商品对应字段为选填，否则为必填
  upcNotEmpty: false, // 新建/编辑商品时，如果对应类目在“字段选填”中，则商品对应字段为选填，否则为必填
  allowGraphicDescription: false, // 商家选择对应类目后，则直接展示“图片详情、商品视频”入口
  allowProductVideo: false, // 商家选择对应类目后，则直接展示“图片详情、商品视频”入口
  allowMultiProductTag: false,
  infomationLossWithPicture: false, // 当商品类目在对应配置结果中时，则对应商品不再信息不全中进行展示
  relateProductLibRequired: false, // 当商品类目在对应配置结果中时，则标品库关联逻辑不生效
  allowCustomProduct: true, // 黑名单 配了就不允许 默认true
  forcePullOffShelves: false, // 当类目被配置了强制下架规则后，所有商家对应类目下的商品均会根据规则下架，必须符合规则后，商品方可上架
  // hasInfomationLoss: false, // 信息不全入口 没用
  allowModifySellProperty: false
}
