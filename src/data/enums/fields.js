/*
 * @description
 *   Please write the fields.js script's description
 * @author rdshoep(rdshoep@126.com)
 *   http://www.rdshoep.com/
 * @version
 *   1.0.0(2018/5/20)
 */

/** 纠错审核FILEDS
 * 1-category 商品类目
 * 2-brandName 商品品牌
 * 3-originName 产地
 * 4-title 标题
 * 5-spec 规格名称
 * 6-unit 商品单位
 * 7-weight 重量
 * 8-pic 商品图片
 */
export const ERROR_CORRECTION_FIELDS_MAP = {
  1: 'category',
  2: 'brand',
  3: 'origin',
  4: 'title',
  5: 'spec',
  6: 'unit',
  7: 'weight',
  8: 'picture',
  9: 'weightUnit'
}

/** 白名单（可编辑白名单、选填白名单）
 * 1-name 商品标题
 * 2-spec 规格名称
 * 3-weight 重量
 * 4-unit 商品单位
 * 5-brand 商品品牌
 * 6-category 商品类目
 * 7-spname 商品名
 * */
export const WHITELIST_FIELDS_MAP = {
  1: 'title',
  2: 'spec',
  3: 'weight',
  4: 'unit',
  5: 'brand',
  6: 'category',
  7: 'name',
  8: 'weightUnit',
  9: 'upc'
}

/**
 * 模块儿白名单配置信息
 * @type {{'7': string, '8': string}}
 */
export const WHITELIST_MODULES_MAP = {
  6: 'tagSmartSort', // 分类智能排序
  7: 'picContent', // 图文详情
  8: 'productVideo', // 视频
  9: 'multiTag' // 店内多分类
}
