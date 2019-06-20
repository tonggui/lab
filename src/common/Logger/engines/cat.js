/*
 * @description
 *   Please write the cat script's description
 * @author
 *   rdshoep (zhangliang15@meituan.com)
 * @version
 *   1.0.0(2017/6/28)
 */
import isFunction from 'lodash/isFunction'
import isObject from 'lodash/isObject'
import { LEVELS } from '../level'
/**
 * 尝试从message中找出tag信息
 * @param meta
 * @returns {{}}
 */
const pickUpTags = (meta) => {
  if (isObject(meta)) {
    return Object.keys(meta).reduce((tags, key) => {
      const value = meta[key]
      // 如果value不为空，且不是对象属性，即可作为tag信息来统计
      if (value !== undefined && !isObject(value)) {
        tags[key] = value
      }
      return tags
    }, {})
  }
  return {}
}

const CategoryMap = {
  api: 'ajaxError'
}
/**
 * 将日志类型转换为Cat支持的日志类型
 * @param type 日志传入的类型
 */
const mapTypeToCatCategory = type => CategoryMap[type] || 'unKnown'

export default (level, type, msg, meta) => {
  // cat模块暂不收集WARN级别以下的问题
  if (level.value < LEVELS.WARN) return

  if (window && window.Owl && isFunction(window.Owl.addError)) {
    const { category, url, ...others } = pickUpTags(meta)
    window.Owl.addError({
      // name节点为二级分类（secCategory），用于cat进行统计分类。
      // meta字段预留分类字段入口，如果存在则使用，不存在使用type字段
      name: category || type,
      msg
    }, {
      tags: others,
      resourceUrl: url,
      level: level.name,
      category: mapTypeToCatCategory(type)
    })
  }
}
