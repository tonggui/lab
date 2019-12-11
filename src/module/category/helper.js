/**
 * 药品品类判断
 * 一级经营品类 22，二级经营品类 [179， 180， 181] 中的一个
 * 只有179(OTC),180(中药),181(保健品)走药品逻辑，受到药品控制
 * @param {*} category
 */
export const isNormalMedicine = category => category.pid === 22 && [179, 180, 181].includes(category.id)
