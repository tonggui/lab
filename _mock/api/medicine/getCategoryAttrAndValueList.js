/**
 * @url /reuse/sc/product/retail/r/getCategoryAttrAndValueList
 */
module.exports = function(req) {
  // return {
  //   code: 0,
  //   msg: '',
  //   data: {
  //     attrAndValueList: [
  //       {
  //         application: "1,2",
  //         attrId: 1200000015,
  //         attrName: "药品通用名称",
  //         attrType: 3,
  //         attrValueType: 3,
  //         categoryId: 200000763,
  //         characterType: "1,2,3,4",
  //         need: 1,
  //         optionMaxSize: 0,
  //         sequence: 1,
  //         status: 1,
  //         supportExtend: "1",
  //         supportFilter: 2,
  //         templateId: 92,
  //         textMaxLength: 1024,
  //         valueList: null,
  //       },
  //       {
  //         application: "1,2",
  //         attrId: 1200000016,
  //         attrName: "处方类型",
  //         attrType: 3,
  //         attrValueType: 2,
  //         categoryId: 200000763,
  //         characterType: "1,2,3,4",
  //         need: 1,
  //         optionMaxSize: 0,
  //         sequence: 1,
  //         status: 1,
  //         supportExtend: "1",
  //         supportFilter: 2,
  //         templateId: 92,
  //         textMaxLength: 1024,
  //         valueList: [
  //           { valueId: 100000245, value: '0', text: '非药品' },
  //           { valueId: 100000244, value: '1', text: 'OTC' },
  //           { valueId: 100001442, value: '2', text: '处方药' },
  //           { valueId: 100001411, value: '3', text: '通用品' },
  //         ],
  //       },
  //       {
  //         application: "1,2",
  //         attrId: 1200000088,
  //         attrName: "品牌",
  //         attrType: 1,
  //         categoryId: 200001518,
  //         characterType: "1,2,3,4",
  //         id: 14403904529,
  //         inputType: 1,
  //         isLeaf: 0,
  //         isRequired: 1,
  //         level: 0,
  //         optionMaxSize: 0,
  //         sequence: 1,
  //         spuId: 2309992580,
  //         supportExtend: "",
  //         supportFilter: 2,
  //         templateId: 0,
  //         textMaxLength: 30,
  //         valueList: []
  //       }
  //     ]
  //   }
  // }
  return {
    data: {
      attrAndValueList: [
        {
          need: 1,
          optionMaxSize: 0,
          textMaxLength: 1024,
          characterType: '1,2,3,4',
          supportFilter: 2,
          supportExtend: '1',
          application: '1,2',
          attrName: '药品通用名称',
          sequence: 2,
          status: 1,
          categoryId: 200000763,
          attrId: 1200000082,
          valueList: null,
          templateId: 101,
          attrValueType: 3,
          attrType: 3
        },
        {
          need: 1,
          optionMaxSize: 0,
          textMaxLength: 30,
          characterType: '1,2,3,4',
          supportFilter: 2,
          supportExtend: '',
          application: '1,2',
          attrName: '处方类型',
          sequence: 3,
          status: 1,
          categoryId: 200000763,
          attrId: 1200000081,
          valueList: [
            {
              value: '1',
              text: 'OTC',
              valueId: 1300000152
            },
            {
              value: '0',
              text: '非药品',
              valueId: 1300000155
            },
            {
              value: '2',
              text: '处方药',
              valueId: 1300000153
            },
            {
              value: '3',
              text: '通用品',
              valueId: 1300000154
            }
          ],
          templateId: 101,
          attrValueType: 1,
          attrType: 1
        },
        {
          need: 2,
          optionMaxSize: 0,
          textMaxLength: 50,
          characterType: '1,2,3,4',
          supportFilter: 2,
          supportExtend: '',
          application: '1,2',
          attrName: '商品名',
          sequence: 4,
          status: 0,
          categoryId: 200000763,
          attrId: 1200000016,
          valueList: null,
          templateId: 101,
          attrValueType: 3,
          attrType: 3
        },
        {
          need: 2,
          optionMaxSize: 0,
          textMaxLength: 1024,
          characterType: '1,2,3,4',
          supportFilter: 2,
          supportExtend: '1',
          application: '1,2',
          attrName: '品牌',
          sequence: 5,
          status: 1,
          categoryId: 200000763,
          attrId: 1200000088,
          valueList: null,
          templateId: 101,
          attrValueType: 3,
          attrType: 1
        },
        {
          need: 1,
          optionMaxSize: 0,
          textMaxLength: 1024,
          characterType: '1,2,3,4',
          supportFilter: 2,
          supportExtend: '1',
          application: '1,2',
          attrName: '批准文号',
          sequence: 6,
          status: 1,
          categoryId: 200000763,
          attrId: 1200000086,
          valueList: null,
          templateId: 101,
          attrValueType: 3,
          attrType: 1
        },
        {
          need: 1,
          optionMaxSize: 0,
          textMaxLength: 1024,
          characterType: '1,2,3,4',
          supportFilter: 2,
          supportExtend: '',
          application: '1,2',
          attrName: '产地类型',
          sequence: 8,
          status: 1,
          categoryId: 200000763,
          attrId: 1200000085,
          valueList: [
            {
              value: '1',
              text: '国产',
              valueId: 1300000003
            },
            {
              value: '2',
              text: '进口',
              valueId: 1300000004
            }
          ],
          templateId: 101,
          attrValueType: 1,
          attrType: 3
        },
        {
          need: 2,
          optionMaxSize: 0,
          textMaxLength: 30,
          characterType: '1,2,3,4',
          supportFilter: 2,
          supportExtend: '',
          application: '1,2',
          attrName: '是否为抗生素',
          sequence: 9,
          status: 0,
          categoryId: 200000763,
          attrId: 1200000243,
          valueList: [
            {
              value: '是',
              text: '',
              valueId: 1300000096
            },
            {
              value: '否',
              text: '',
              valueId: 1300000095
            }
          ],
          templateId: 101,
          attrValueType: 1,
          attrType: 1
        },
        {
          need: 2,
          optionMaxSize: 0,
          textMaxLength: 1024,
          characterType: '1,2,3,4',
          supportFilter: 2,
          supportExtend: '',
          application: '1,2',
          attrName: '是否外用',
          sequence: 10,
          status: 1,
          categoryId: 200000763,
          attrId: 1200000117,
          valueList: [
            {
              value: '是',
              text: '',
              valueId: 1300000096
            },
            {
              value: '否',
              text: '',
              valueId: 1300000095
            }
          ],
          templateId: 101,
          attrValueType: 1,
          attrType: 3
        },
        {
          need: 1,
          optionMaxSize: 0,
          textMaxLength: 1024,
          characterType: '1,2,3,4',
          supportFilter: 2,
          supportExtend: '1',
          application: '1,2',
          attrName: '生产单位',
          sequence: 11,
          status: 1,
          categoryId: 200000763,
          attrId: 1200000025,
          valueList: null,
          templateId: 101,
          attrValueType: 3,
          attrType: 3
        },
        {
          need: 2,
          optionMaxSize: 0,
          textMaxLength: 1024,
          characterType: '1,2,3,4',
          supportFilter: 2,
          supportExtend: '1',
          application: '1,2',
          attrName: '成份',
          sequence: 12,
          status: 1,
          categoryId: 200000763,
          attrId: 1200000311,
          valueList: null,
          templateId: 101,
          attrValueType: 3,
          attrType: 3
        },
        {
          need: 2,
          optionMaxSize: 0,
          textMaxLength: 1024,
          characterType: '1,2,3,4',
          supportFilter: 2,
          supportExtend: '1',
          application: '1,2',
          attrName: '性状',
          sequence: 13,
          status: 1,
          categoryId: 200000763,
          attrId: 1200000006,
          valueList: null,
          templateId: 101,
          attrValueType: 3,
          attrType: 3
        },
        {
          need: 2,
          optionMaxSize: 0,
          textMaxLength: 1024,
          characterType: '1,2,3,4',
          supportFilter: 2,
          supportExtend: '1',
          application: '1,2',
          attrName: '剂型',
          sequence: 14,
          status: 1,
          categoryId: 200000763,
          attrId: 1200000003,
          valueList: null,
          templateId: 101,
          attrValueType: 3,
          attrType: 3
        },
        {
          need: 1,
          optionMaxSize: 0,
          textMaxLength: 1024,
          characterType: '1,2,3,4',
          supportFilter: 2,
          supportExtend: '1',
          application: '1,2',
          attrName: '功能主治',
          sequence: 15,
          status: 1,
          categoryId: 200000763,
          attrId: 1200000004,
          valueList: null,
          templateId: 101,
          attrValueType: 3,
          attrType: 3
        },
        {
          need: 1,
          optionMaxSize: 0,
          textMaxLength: 1024,
          characterType: '1,2,3,4',
          supportFilter: 2,
          supportExtend: '1',
          application: '1,2',
          attrName: '用法用量',
          sequence: 16,
          status: 1,
          categoryId: 200000763,
          attrId: 1200000017,
          valueList: null,
          templateId: 101,
          attrValueType: 3,
          attrType: 3
        },
        {
          need: 2,
          optionMaxSize: 0,
          textMaxLength: 1024,
          characterType: '1,2,3,4',
          supportFilter: 2,
          supportExtend: '1',
          application: '1,2',
          attrName: '不良反应',
          sequence: 17,
          status: 1,
          categoryId: 200000763,
          attrId: 1200000013,
          valueList: null,
          templateId: 101,
          attrValueType: 3,
          attrType: 3
        },
        {
          need: 2,
          optionMaxSize: 0,
          textMaxLength: 1024,
          characterType: '1,2,3,4',
          supportFilter: 2,
          supportExtend: '1',
          application: '1,2',
          attrName: '禁忌',
          sequence: 18,
          status: 1,
          categoryId: 200000763,
          attrId: 1200000010,
          valueList: null,
          templateId: 101,
          attrValueType: 3,
          attrType: 3
        },
        {
          need: 2,
          optionMaxSize: 0,
          textMaxLength: 1024,
          characterType: '1,2,3,4',
          supportFilter: 2,
          supportExtend: '1',
          application: '1,2',
          attrName: '注意事项',
          sequence: 19,
          status: 1,
          categoryId: 200000763,
          attrId: 1200000005,
          valueList: null,
          templateId: 101,
          attrValueType: 3,
          attrType: 3
        },
        {
          need: 2,
          optionMaxSize: 0,
          textMaxLength: 1024,
          characterType: '1,2,3,4',
          supportFilter: 2,
          supportExtend: '1',
          application: '1,2',
          attrName: '孕妇及哺乳期妇女',
          sequence: 20,
          status: 1,
          categoryId: 200000763,
          attrId: 1200000153,
          valueList: null,
          templateId: 101,
          attrValueType: 3,
          attrType: 3
        },
        {
          need: 2,
          optionMaxSize: 0,
          textMaxLength: 1024,
          characterType: '1,2,3,4',
          supportFilter: 2,
          supportExtend: '1',
          application: '1,2',
          attrName: '儿童用药',
          sequence: 21,
          status: 1,
          categoryId: 200000763,
          attrId: 1200000059,
          valueList: null,
          templateId: 101,
          attrValueType: 3,
          attrType: 3
        },
        {
          need: 2,
          optionMaxSize: 0,
          textMaxLength: 1024,
          characterType: '1,2,3,4',
          supportFilter: 2,
          supportExtend: '1',
          application: '1,2',
          attrName: '老年人用药',
          sequence: 22,
          status: 1,
          categoryId: 200000763,
          attrId: 1200000052,
          valueList: null,
          templateId: 101,
          attrValueType: 3,
          attrType: 3
        },
        {
          need: 2,
          optionMaxSize: 0,
          textMaxLength: 1024,
          characterType: '1,2,3,4',
          supportFilter: 2,
          supportExtend: '1',
          application: '1,2',
          attrName: '药物相互作用',
          sequence: 24,
          status: 1,
          categoryId: 200000763,
          attrId: 1200000020,
          valueList: null,
          templateId: 101,
          attrValueType: 3,
          attrType: 3
        },
        {
          need: 2,
          optionMaxSize: 0,
          textMaxLength: 1024,
          characterType: '1,2,3,4',
          supportFilter: 2,
          supportExtend: '',
          application: '1,2',
          attrName: '药物过量',
          sequence: 25,
          status: 0,
          categoryId: 200000763,
          attrId: 1200000061,
          valueList: null,
          templateId: 101,
          attrValueType: 3,
          attrType: 3
        },
        {
          need: 2,
          optionMaxSize: 0,
          textMaxLength: 1024,
          characterType: '1,2,3,4',
          supportFilter: 2,
          supportExtend: '',
          application: '1,2',
          attrName: '临床试验',
          sequence: 26,
          status: 0,
          categoryId: 200000763,
          attrId: 1200000150,
          valueList: null,
          templateId: 101,
          attrValueType: 3,
          attrType: 3
        },
        {
          need: 2,
          optionMaxSize: 0,
          textMaxLength: 1024,
          characterType: '1,2,3,4',
          supportFilter: 2,
          supportExtend: '1',
          application: '1,2',
          attrName: '药理毒理',
          sequence: 27,
          status: 1,
          categoryId: 200000763,
          attrId: 1200000154,
          valueList: null,
          templateId: 101,
          attrValueType: 3,
          attrType: 3
        },
        {
          need: 2,
          optionMaxSize: 0,
          textMaxLength: 1024,
          characterType: '1,2,3,4',
          supportFilter: 2,
          supportExtend: '1',
          application: '1,2',
          attrName: '药代动力学',
          sequence: 28,
          status: 1,
          categoryId: 200000763,
          attrId: 1200000040,
          valueList: null,
          templateId: 101,
          attrValueType: 3,
          attrType: 3
        },
        {
          need: 1,
          optionMaxSize: 0,
          textMaxLength: 1024,
          characterType: '1,2,3,4',
          supportFilter: 2,
          supportExtend: '1',
          application: '1,2',
          attrName: '贮藏',
          sequence: 29,
          status: 1,
          categoryId: 200000763,
          attrId: 1200000014,
          valueList: null,
          templateId: 101,
          attrValueType: 3,
          attrType: 3
        },
        {
          need: 1,
          optionMaxSize: 0,
          textMaxLength: 1024,
          characterType: '1,2,3,4',
          supportFilter: 2,
          supportExtend: '1',
          application: '1,2',
          attrName: '包装',
          sequence: 30,
          status: 1,
          categoryId: 200000763,
          attrId: 1200000155,
          valueList: null,
          templateId: 101,
          attrValueType: 3,
          attrType: 3
        },
        {
          need: 1,
          optionMaxSize: 0,
          textMaxLength: 1024,
          characterType: '1,2,3,4',
          supportFilter: 2,
          supportExtend: '1',
          application: '1,2',
          attrName: '有效期',
          sequence: 31,
          status: 1,
          categoryId: 200000763,
          attrId: 1200000080,
          valueList: null,
          templateId: 101,
          attrValueType: 3,
          attrType: 3
        },
        {
          need: 2,
          optionMaxSize: 0,
          textMaxLength: 1024,
          characterType: '1,2,3,4',
          supportFilter: 2,
          supportExtend: '1',
          application: '1,2',
          attrName: '执行标准',
          sequence: 32,
          status: 1,
          categoryId: 200000763,
          attrId: 1200000030,
          valueList: null,
          templateId: 101,
          attrValueType: 3,
          attrType: 3
        },
        {
          need: 2,
          optionMaxSize: 0,
          textMaxLength: 1024,
          characterType: '1,2,3,4',
          supportFilter: 2,
          supportExtend: '',
          application: '1,2',
          attrName: '警告/警示语',
          sequence: 33,
          status: 0,
          categoryId: 200000763,
          attrId: 1200000151,
          valueList: null,
          templateId: 101,
          attrValueType: 3,
          attrType: 3
        },
        {
          need: 2,
          optionMaxSize: 0,
          textMaxLength: 1024,
          characterType: '1,2,3,4',
          supportFilter: 2,
          supportExtend: '1',
          application: '1,2',
          attrName: '温馨提示',
          sequence: 34,
          status: 1,
          categoryId: 200000763,
          attrId: 1200000015,
          valueList: null,
          templateId: 101,
          attrValueType: 3,
          attrType: 3
        }
      ],
      message: ''
    },
    code: 0,
    msg: ''
  }
}