/**
 * 清洗时间区域
 * @param obj
 */
export const convertTimeZone = (obj) => Object.entries(obj).reduce((prev, [key, value]) => {
  prev[key] = {
    day: key,
    timezone: (value || []).map(v => v)
  }
  return prev
}, [])
/**
 * 清洗店内分类
 * @param tag 店内分类
 * @param parentId 父id
 */
export const convertTag = (tag, parentId = 0) => {
  const node = {
    id: tag.id,
    name: tag.name,
    level: tag.level,
    sequence: tag.sequence,
    parentId,
    children: convertTagList(tag.subTags || [], tag.id),
    isLeaf: (+tag.isLeaf) === 1,
    isSmartSort: !!tag.smartSort,
    productCount: tag.productCount || 0,
    isUnCategorized: tag.name === '未分类',
    defaultFlag: (+tag.defaultFlag) === 1,
    topFlag: (+tag.topFlag) === 1,
    timeZoneForHuman: tag.timeZoneForHuman,
    appTagCode: tag.appTagCode,
    timeZone: convertTimeZone(tag.timeZoneObj || {})
  }
  return node
}
/**
 * 清洗店内分类列表
 * @param list
 * @param parentId
 */
export const convertTagList = (list, parentId = 0) => list.map((tag) => convertTag(tag, parentId))
