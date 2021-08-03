import { ATTR_TYPE, VALUE_TYPE, REG_TYPE, RENDER_TYPE, TEMPLATE_TYPE } from '../enums/category'
import { TimeZone } from './common'

// 后台类目 基本信息
declare interface BaseCategory {
  id: number; // 分类id
  idPath: number[];
  name: string; // 分类名称
  namePath: string[];
}
// 后台类目
declare interface Category extends BaseCategory {
  level: number;
  isLeaf: boolean; // 是否是叶子节点
  searchable: boolean; // 是否允许查询该分类下的标品
  locked: boolean; // 是否锁定
  lockTips: string; // 无资质的错误提示
  lockStatus?: number; // 锁状态码
  // allowCustomProduct?: boolean; // 是否允许自建
}
// 店内分类 基本信息
declare interface BaseTag {
  id: number | string; // 分类id
  name: string; // 分类名称
  subTagName?: string; // 二级分类名称 应对批量场景下的用户输入分类名称
}

// 店内分类
declare interface Tag extends BaseTag {
  level: number;
  isLeaf: boolean; // 是否是叶子节点
  children: Tag[]; // 子分类
  sequence?: number; // 顺序
  parentId: number | string; // 父节点id
  parentName?: string; // 父节点名称
  isUnCategorized?: boolean; // 是否是未分类
  productCount?: number; // 分类下商品数目
  categoryIdList?: number[]; // 对应的后台分类id
  topFlag?: boolean; // 分时置顶
  appTagCode?: string;
  timeZone?: TimeZone; // 分类置顶信息
  parentIdList?: any[]
}
// 带分类置顶和排序的分类信息
declare interface TagWithSort extends Tag {
  children: TagWithSort[]; // 子分类
  isSmartSort: boolean; // 智能分类
  defaultFlag?: boolean; // 药品的特殊分类不让修改或增加二级分类
}
// 类目属性
declare interface CategoryAttr {
  id: number;
  name: string;
  categoryId?: number;
  attrType: ATTR_TYPE;
  valueType: VALUE_TYPE;
  required: boolean;
  sequence: number;
  options: CategoryAttrValue[];
  render: {
    type: RENDER_TYPE; // 渲染类型
    attribute?: {
      [propName: string]: boolean // 有search是否支持搜索 cascade是否支持及联
    };
  },
  maxCount: number,
  maxLength: number,
  regTypes: REG_TYPE[],
  extensible: boolean,
}
// 类目属性值
declare interface CategoryAttrValue {
  id?: number | string;
  name: string;
  isCustomized: boolean; // 是否是自定义属性值
  namePath?: string[];
  idPath?: number[];
  isLeaf?: boolean;
  sequence?: number;
  parentId?: number; // 属于的属性id
  parentName?: string; // 属于的属性名称
  selected: boolean;
  text?: string;
  textEffected?: boolean;
}
// 分类模版 基本信息
declare interface BaseCategoryTemplate {
  id: number;
  name: string;
  selected: boolean; // 是否选中
  used: boolean; // 是否门店正在使用
  editable: boolean; // 是否允许用户编辑，c端模版不允许取消勾选，b端模版可以
  updated: boolean; // 是否模版已更新
  type: TEMPLATE_TYPE; // 模版类型 B端：1，C端：2
}
// 分类模版
declare interface CategoryTemplate extends BaseCategoryTemplate {
  description: string; // 模版使用场景
  version: number | string; // 模版版本
  times: number; // 模版使用次数
  conversionRate: number; // 分类平均转化转化率
  tagInfoList: Tag[]; // 分类信息
  value?: number[]; // TODO 选中的分类
  extra?: boolean;
}
// 标品类目属性值
declare interface StandardProductCategoryAttrValue {
  attrId: number;
  attrName: string;
  isExt: number;
  valueId: number;
  extension: string;
}
