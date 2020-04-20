/**
 * @url /reuse/sc/product/retail/r/getCategoryAttrAndValueList
 */
module.exports = function(req) {
  return {
    code: 0,
    msg: '',
    data: {
      attrAndValueList: [
        {
          application: "1,2",
          attrId: 1200000015,
          attrName: "药品通用名称",
          attrType: 3,
          attrValueType: 3,
          categoryId: 200000763,
          characterType: "1,2,3,4",
          need: 1,
          optionMaxSize: 0,
          sequence: 1,
          status: 1,
          supportExtend: "1",
          supportFilter: 2,
          templateId: 92,
          textMaxLength: 1024,
          valueList: null,
        },
        {
          application: "1,2",
          attrId: 1200000016,
          attrName: "处方类型",
          attrType: 3,
          attrValueType: 2,
          categoryId: 200000763,
          characterType: "1,2,3,4",
          need: 1,
          optionMaxSize: 0,
          sequence: 1,
          status: 1,
          supportExtend: "1",
          supportFilter: 2,
          templateId: 92,
          textMaxLength: 1024,
          valueList: [
            { valueId: 100000245, value: '0', text: '非药品' },
            { valueId: 100000244, value: '1', text: 'OTC' },
            { valueId: 100001442, value: '2', text: '处方药' },
            { valueId: 100001411, value: '3', text: '通用品' },
          ],
        },
        {
          application: "1,2",
          attrId: 1200000088,
          attrName: "品牌",
          attrType: 1,
          categoryId: 200001518,
          characterType: "1,2,3,4",
          id: 14403904529,
          inputType: 1,
          isLeaf: 0,
          isRequired: 1,
          level: 0,
          optionMaxSize: 0,
          sequence: 1,
          spuId: 2309992580,
          supportExtend: "",
          supportFilter: 2,
          templateId: 0,
          textMaxLength: 30,
          valueList: []
        }
      ]
    }
  }
}
