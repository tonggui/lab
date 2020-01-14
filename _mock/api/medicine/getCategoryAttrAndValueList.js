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
            { value: '0', text: '非药品' },
            { value: '1', text: 'OTC' },
            { value: '2', text: '处方药' },
            { value: '3', text: '通用品' },
          ],
        }
      ]
    }
  }
}