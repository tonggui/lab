import {
  RELEASE_TYPE,
  SELLING_TIME_TYPE,
  WEIGHT_UNIT,
  PRODUCT_SELL_STATUS,
  OTC_TYPE,
  PRODUCT_AUDIT_STATUS,
  API_ANOMALY_TYPE,
  QUALIFICATION_STATUS,
  AuditTriggerMode,
  PRODUCT_TYPE
} from '../enums/product'
import {
  BATCH_MATCH_TYPE
} from '../enums/batch'
import { CategoryAttr, CategoryAttrValue, BaseCategory, BaseTag, Tag } from './category'
import { Brand, Origin, TimeZone } from './common'

declare interface LimitSale {
  status: number; // 是否限制，0不限制，1限制
  multiPoi: number; // 是否允许跨店购买，1允许，0不允许
  range: string[]; // 限购周期，格式YYYY-MM-DD
  rule: number; // 限购规则
  max: number; // 限购数量
}

declare interface ProductVideo {
  src: string;
  poster: string;
  title: string;
  size: number,
  duration: number,
  [propName: string]: any
}

// sku
declare interface Sku {
  id: number | string;
  __id__: number | string;
  specName?: string;
  editable: Boolean;
  price: {
    value?: number;
    unit: string;
    defaultValue?: number;
  },
  weight: {
    value?: number;
    unit: WEIGHT_UNIT;
    ignoreMax: boolean; // 忽略值过大的提示
  };
  upcCode?: number|string;
  box: {
    price?: number;
    count?: number;
  };
  stock: number;
  sourceFoodCode?: string;
  shelfNum?: string;
  minOrderCount?: number;
  categoryAttrList?: CategoryAttrValue[];
  suggestedPrice?: number|string;
}

declare interface CellularProductSku extends Sku {
  stock?: number;
}

// TODO
declare interface BaseProductLabel {
  value: number;
  label: string;
}

declare interface ProductLabel extends BaseProductLabel {
  upperLimit: number;
  spuCount: number;
}

declare interface ProductAttribute {
  name: string;
  value: string[];
}

declare interface PlatformLimitSaleRule {
  name: string; // 规则名
  type: number; // 1代表按天，2代表整个周期
  startTime: string; // 限购周期开始日期
  endTime: string; // 限购周期结束日期
  frequency: number; // 频次
  count: number; // 限购数量
  multiPoi: boolean; // 是否限制跨店购买
}

// 列表页展示的商品信息
declare interface ProductInfo {
  id: number;
  name: string;
  type: PRODUCT_TYPE; // 商品类型
  pictureList: string[];
  upcCode: string;
  isSmartSort: boolean;
  description?: string; // 商品描述
  sellStatus: PRODUCT_SELL_STATUS;
  isPlatformStopSell: Boolean; // 平台下架
  isStopSell: Boolean; // 风控下架
  isNeedFill: Boolean; // 信息需要补充
  isNeedCheck: Boolean; // 信息需要确认
  isMissingInfo?: boolean; // 商品信息缺失
  tagCount: number;
  skuList: Sku[];
  displayInfo: (string|string[])[];
  isOTC: boolean;
  isPrescription: boolean;
  video: ProductVideo;
  qualification: {
    exist: boolean;
    tip: string; // 列表中展示的提示信息
    message: string; // 点击提示后modal中的展示文案
  },
  platformLimitSaleRuleList?: PlatformLimitSaleRule[],
  tagList: number[]; // 商品属于的分类id
  errorTip: string;
  locked?: boolean; // 字段是否锁定
  stockoutAutoClearStock: boolean; // 是否设置缺货库存自动清零
  auditStatus: PRODUCT_AUDIT_STATUS; // 审核状态
  category: BaseCategory; // 商品分类
}

// 商品基本信息
declare interface BaseProduct {
  id: number; // 商品id
  name: string; // 商品标题
  brand?: Brand; // 品牌
  origin?: Origin; // 产地
  category: BaseCategory; // 后台分类
  pictureList: string[]; // 商品图片地址
  upcCode: number | string; // upc code
  description?: string; // 商品描述
  spId?: number; // 标品id
  isSp: boolean; // 是否是标品
  skuList: Sku[]; // sku信息
  categoryAttrValueMap?: { [propName: string]: number[] | number | string };// 类目属性属性值
  categoryAttrList?: CategoryAttr[]; // 类目属性
}

declare interface CellularProduct {
  __id__: number;
  id?: number;
  name: string; // 商品标题
  pictureList: string[]; // 商品图片地址
  upcCode: number | string; // upc code
  skuList: CellularProductSku[]; // sku信息
  spId?: number; // 标品id
  isSp: boolean; // 是否是标品
  monthSale?: number; // 月售
  tagList: BaseTag[]; // 药品分类
  video: ProductVideo;
  suggesredPriceMax?: number;
  suggesredPriceMin?: number;
  sellStatus: PRODUCT_SELL_STATUS;
}

declare interface RecommendProduct {
  __id__?: number;
  id?: number;
  name: string; // 商品标题
  pictureList: string[]; // 商品图片地址
  upcCode: number | string; // upc code
  skuList: CellularProductSku[]; // sku信息
  spId?: number; // 标品id
  isSp: boolean; // 是否是标品
  tagList: Tag[]; // 药品分类
  qualificationStatus: QUALIFICATION_STATUS;
  qualificationTip: string;
  productLabelIdList: number[];
  isDelete?: boolean;
}

// 商家商品库 商品
declare interface MerchantProduct {
  id: number; // 商品id
  name: string; // 商品标题
  pictureList: string[]; // 商品图片地址
  ctime: string;
  priceRange: string;
  poiCount: number;
  sequence: number;
  sellStatus: PRODUCT_SELL_STATUS;
  isMerchantDelete: boolean; // 是不是商家商品库删除 商品 主要是待收录列表展示
  isMissingInfo?: boolean; // 商品信息缺失
  skuList: Sku[];
}

// 药品
declare interface MedicineDetailProduct {
  type: number; // 药品类型，为3时需要请求标品更新
  spId: number; // 药品标品id
  id: number; // 药品id
  skuId: number; // 药品skuId
  name: string; // 药品名称
  upcCode: string; // 药品UPC
  tagList: BaseTag[]; // 药品分类
  category: BaseCategory; // 后台分类
  spec: string; // 规格
  sourceFoodCode: string; // SKU码/货号
  sellStatus: PRODUCT_SELL_STATUS; // 售卖状态
  suggestedPrice: number; // 指导价
  price: number; // 价格
  stock: number; // 库存
  pictureList: string[]; // 商品图片地址
  categoryAttrValueMap?: { [propName: string]: number[] | number | string };// 类目属性属性值
  categoryAttrList?: CategoryAttr[]; // 类目属性
  spPictureContentList?: string[]; // 品牌商图片详情
  limitSale: LimitSale; // 限购
  shippingTime: {
    type: SELLING_TIME_TYPE; // 时间不限制还是自定义时间
    timeZone: TimeZone,
  }; // 商品可售时间
}

declare interface MedicineStandardProduct {
  id: number;
  name: string;
  brand: string;
  upcCode: string;
  spec: string;
  isSale: boolean; // 是否在售
  price: number;
  stock: number;
  otcType: OTC_TYPE;
  permissionNumber: number|string;
  pictureList: string[]; // 商品图片地址
  tagNameList: string[]; // 药品分类
  suggestedPrice: number; // 指导价
  manufaturer: string; // 生产厂家
  valid: boolean; // 信息是否完整
  qualificationStatus: QUALIFICATION_STATUS;
  qualificationTip: string;
}

declare interface MerchantDetailProduct extends Product {
  poiIds: number[]; // 关联门店ID列表
}

// 标品信息
declare interface StandardProduct extends BaseProduct {
  brand: Brand; // 品牌
  origin: Origin; // 产地
  monthSale?: number; // 月销量信息
  existInPoi?: boolean; // 门店是否已有此标品
  source?: number; // TODO
  suggestedPrice: number;
  maxPrice: number;
  minPrice: number;
  qualificationStatus: QUALIFICATION_STATUS;
  qualificationTip: string;
  spPictureContentList?: string[]; // 品牌商图片详情
}
// 商超商品
declare interface Product extends BaseProduct {
  tagList: BaseTag[]; // TODO 店内分类
  poorPictureList: boolean[]; // 差图标志
  labelList?: BaseProductLabel[]; // 商品标签
  attributeList?: ProductAttribute[]; // 商品属性
  shippingTime: {
    type: SELLING_TIME_TYPE; // 时间不限制还是自定义时间
    timeZone: TimeZone,
  }; // 商品可售时间
  pictureContentList?: string[]; // 图文详情
  spPictureContentList?: string[]; // 品牌商图片详情
  spPictureContentSwitch?: boolean; // 品牌商图片详情是否展示给买家
  video?: ProductVideo; // 商品视频
  minOrderCount: number; // 最小售卖数目
  sourceFoodCode?: number; // 货架
  releaseType: RELEASE_TYPE; // TODO
  limitSale: LimitSale; // 限购
  auditStatus: PRODUCT_AUDIT_STATUS; // 审核状态
  isMissingInfo?: boolean;
  upcImage?: string; // 商品条码图，在审核时用
  sellStatus: PRODUCT_SELL_STATUS;
}

declare interface MatchRule {
  type: BATCH_MATCH_TYPE;
  value: {
    tagName?: BaseTag[];
    productName: string;
    upc: string;
    sku: string;
  }
}

declare interface ProductModify {
  name?: string,
  price?: number,
  stock?: number,
  sellStatus?: PRODUCT_SELL_STATUS,
  labelList?: BaseProductLabel[],
  description?: string,
  pictureList?: string[],
  category?: BaseCategory,
  tagList?: BaseTag[],
  pictureContentList?: string[]
}

declare interface ApiAnomalyType {
  type: API_ANOMALY_TYPE;
}
// 标品更新信息
declare interface SpUpdateInfo {
  basicInfoList: DiffInfo[],
  categoryAttrInfoList: DiffInfo[],
}

// 标品更新单项信息
declare interface DiffInfo {
  id?: number,
  field: string,
  oldValue: any,
  newValue: any,
}

declare interface MedicineAuditStandardProduct {
  spId?: number;
  name: string;
  upcList: string[];
  category: BaseCategory;
  spec: string;
  suggestedPrice: number;
  tagList: BaseTag[];
  pictureList: string[];
  pictureDetailList: string[];
  categoryAttrList?: CategoryAttr[]; // 类目属性
  categoryAttrValueMap?: { [propName: string]: number[] | number | string }; // 类目属性属性值
}

declare interface AuditProductInfo {
  id: number;
  name: string;
  pictureList: string[];
  upcCode: string;
  auditStatus: PRODUCT_AUDIT_STATUS; // 审核状态
  category: BaseCategory; // 商品分类
  ctime: number; // 创建时间
  auditUpdateTime: number; // 最后修改时间
  triggerMode: AuditTriggerMode; // 审核触发模式
  hasModifiedByAuditor: boolean; // 是否被审核人修改
}

declare interface PackageProductUnit {
  id: number; // 单品skuId
  spuId: number; // 单品spuId
  name: string; // 组包单品商品名称
  spec: string; // 规格
  upc: string; // upc
  sourceFoodCode: string; // SKU/货号
  stock: number; // 库存
  price: number; // 价格
  discount: number; // 折扣
  count: number; // 组包内商品数量
  sellStatus: number; // 上下架状态
  category: BaseCategory; // 规格信息
  pictureList: string[]; // 商品图片
  isPrescription: boolean; // 是否为处方药
}

declare interface PackageProductInfo extends Omit<Product,
  'brand' | 'origin' | 'category' | 'upcCode' | 'minOrderCount' |
  'spId' | 'isSp' | 'skuList' | 'attributeList' |
  'spPictureContentList' | 'spPictureContentSwitch' |
  'categoryAttrValueMap' | 'categoryAttrList' |
  'releaseType' | 'upcImage' | 'auditStatus' | 'sellStatus'
> {
  skuId?: number; // 药品场景下的skuId
  suitableScene: string; // 场景标题
  categoryId: number; // 后台分类ID
  price: number; // 组包商品价钱
  stock: number; // 组包商品库存
  productList: PackageProductUnit[]; // 组包商品的商品列表
}
