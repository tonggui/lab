/**
 * @url reuse/sc/product/retail/r/getCategoryAttrAndValues
 */
module.exports = function () {
  return {
    data: {
      attrAndValueList: [{
        attrName: '单选择属性',
        attrType: 3,
        need: 1,
        sequence: 1,
        attrId: 1200000081,
        valueList: [{
          value: '选项1',
          valueId: 400001800
        }, {
          value: '选项2',
          valueId: 400001799
        }],
        attrValueType: 1
      }, {
        attrName: '多选择属性',
        attrType: 3,
        need: 1,
        sequence: 1,
        attrId: 2200000081,
        optionMaxSize: 2,
        valueList: [{
          value: '选项3',
          valueId: 500001800
        }, {
          value: '选项4',
          valueId: 500001799
        }, {
          value: '选项5',
          valueId: 500001798
        }],
        attrValueType: 2
      }, {
        attrName: '文本属性',
        attrType: 1,
        need: 1,
        sequence: 1,
        attrId: 1200000086,
        valueList: null,
        characterType: '1,3',
        textMaxLength: 10,
        attrValueType: 3
      }, {
        attrName: '产地',
        attrType: 3,
        need: 1,
        sequence: 1,
        attrId: 1200000094,
        valueList: [{
          value: '进口',
          valueId: 400001774
        }, {
          value: '国产',
          valueId: 400001773
        }],
        attrValueType: 1
      }, {
        attrName: '品牌',
        attrType: 1,
        need: 0,
        sequence: 1,
        attrId: 1200000088,
        valueList: null,
        attrValueType: 3
      }, {
        attrName: '颜色',
        attrType: 2,
        need: 1,
        sequence: 1,
        attrId: 2200800081,
        valueList: [{
          value: '白色',
          valueId: 500081800
        }, {
          value: '红色',
          valueId: 500081799
        }, {
          value: '蓝色',
          valueId: 500081798
        }],
        supportExtend: false,
        attrValueType: 2
      }, {
        attrName: '大小',
        attrType: 2,
        need: 0,
        sequence: 1,
        attrId: 2200900081,
        valueList: [{
          value: 'L',
          valueId: 500091800
        }, {
          value: 'XL',
          valueId: 500091799
        }, {
          value: 'M',
          valueId: 500091798
        }],
        supportExtend: true,
        attrValueType: 2
      }],
      message: ''
    },
    code: 0,
    msg: ''
  };
};
