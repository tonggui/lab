import {
  RELEASE_TYPE,
  SELLING_TIME_TYPE,
  WEIGHT_UNIT,
  PRODUCT_SELL_STATUS
} from '../enums/product'
import {
  BATCH_MATCH_TYPE
} from '../enums/batch'
import { QUALIFICATION_STATUS } from '../enums/product'
import { CategoryAttr, CategoryAttrValue, BaseCategory, BaseTag } from './category'
import { Brand, Origin, TimeZone } from './common'

declare interface LimitSale {
  status: number; // 是否限制，0不限制，1限制
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
  },
  weight: {
    value?: number;
    unit: WEIGHT_UNIT;
  };
  stock: number;
  box: {
    price?: number;
    count?: number;
  };
  upcCode?: number|string;
  sourceFoodCode?: string;
  shelfNum?: string;
  minOrderCount?: number;
  categoryAttrList?: CategoryAttrValue[];
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

// 列表页展示的商品信息
declare interface ProductInfo {
  id: number;
  name: string;
  pictureList: string[];
  upcCode: string;
  isSmartSort: boolean;
  description?: string; // 商品描述
  sellStatus: PRODUCT_SELL_STATUS;
  isStopSell: Boolean; // 风控下架
  isNeedFill: Boolean; // 信息需要补充
  isNeedCheck: Boolean; // 信息需要确认
  tagCount: number;
  skuList: Sku[];
  displayInfo: (string|string[])[];
  isOTC: boolean;
  video: ProductVideo;
  qualification: {
    exist: boolean;
    tip: string; // 列表中展示的提示信息
    message: string; // 点击提示后modal中的展示文案
  },
  tagList: number[]; // 商品属于的分类id
  errorTip: string;
  locked?: boolean; // 字段是否锁定
  stockoutAutoClearStock: boolean; // 是否设置缺货库存自动清零
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
  labelList?: BaseProductLabel,
  description?: string,
  pictureList?: string[],
  categoryId?: number[] | number,
  tagList?: BaseTag[],
  pictureContentList?: string[]
}
// 标品更新信息
declare interface SpUpdateInfo {
  basicInfoList: DiffInfo[],
  categoryAttrInfoList: DiffInfo[],
}

//标品更新单项信息
declare interface DiffInfo {
  id?: number,
  field: string,
  oldValue: any,
  newValue: any,
}
