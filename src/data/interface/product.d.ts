import {
  RELEASE_TYPE,
  SELLING_TIME_TYPE,
  WEIGHT_UNIT,
  PRODUCT_SELL_STATUS,
} from '../enums/product'
import {
  BATCH_MATCH_TYPE
} from '../enums/batch'
import { CategoryAttr, CategoryAttrValue, BaseCategory, BaseTag } from './category'
import { Brand, Origin, TimeZone } from './common'

// sku
declare interface Sku {
  id: number;
  specName?: string;
  unit: string; // TODO 商品单位
  price: number;
  weight: {
    value: number;
    unit: WEIGHT_UNIT;
  };
  stock: number;
  box: {
    price?: number;
    count?: number;
  }
  upcCode?: number;
  sourceFoodCode?: string;
  shelfNum?: string;
  categoryAttrList?: CategoryAttrValue[], // TODO 不对等
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
  description?: string; // 商品描述
  sellStatus: PRODUCT_SELL_STATUS;
  tagCount: number;
  sku: Sku[];
  mark: object;
  stock: number;
  priceStr: string;
  displayInfo: (string|string[])[];
  isOTC: boolean;
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
}
// 商超商品
declare interface Product extends BaseProduct {
  tagList: BaseTag[]; // TODO 店内分类
  poorPictureList: boolean[]; // 差图标志
  labelList?: BaseProductLabel[]; // 商品标签
  attributeList?: ProductAttribute[]; // 商品属性
  shippingTime: {
    type: SELLING_TIME_TYPE; // 时间不限制还是自定义时间
    timeList: TimeZone[],
  }; // 商品可售时间
  pictureContentList?: string[]; // 图文详情
  minOrderCount: number; // 最小售卖数目
  sourceFoodCode?: number; // 货架
  releaseType: RELEASE_TYPE; // TODO
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