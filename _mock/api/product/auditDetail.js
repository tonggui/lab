/**
 * @url /reuse/sc/product/shangou/audit/r/detail
 */

const product = require('./productWithCategoryAttrs')();

module.exports = {
  code: 0,
  msg: '',
  data: {
    'auditType|1': [1, 2],
    processId:123,
    productSpu: product.data,
    state: 5, // 5
    dataSource: 3, // 3
    'tasks|3': [
      {
        taskId:123,
        nodeKey:"节点唯一标识",
        parentNodeKey:"父节点",
        'nodeName|+1': ['第一审核人', '第二审核人', '第三审核人'],
        auditMid:"审核人mis号",
        'auditState|1':[1,2,3,4,6,7], // 节点任务状态 1-审核中，2-审核通过，3-驳回上一节点(被驳回)，4-驳回至任务分配(审核驳回)，5-暂不处理, 6-撤销，7-被驳回待审核
        comment:"哈哈哈错速发耦否大方奥迪舒服哦啊嗦粉大大送积分流口水的肌肤立刻就撒的李姐法", // 如果节点状态为3或4,此处存储的是驳回原因
        isEdit:1, // 1-是，2-否,
        isNotHandle:1, // 是否可暂不处理1-是，2-否,
        isReject:1, // 是否可驳回 1-是，2-否,
        isAdmin:1, // 是否管理员 1-是，2-否,
        opTime:1 // 操作时间
      }
    ],
    snapshot: {
      name: '商品2',
      upcCode:"69000000000001",
      category: {
        lockTips: null,
        level: 3,
        parentId: 200002031,
        categoryName: "口罩用品",
        categoryId: 200002033,
        isLeaf: 1,
        categoryType: 1,
        idPath: ",200000001,200002031,200002033,",
        categoryNamePath: "美容个护,卫生用品/急救用品,口罩用品",
        allowCustomProduct: true,
        lockStatus: 0
      },
      categoryAttrMap: {
        ...product.data.categoryAttrMap,
        '300005193': {
          id: 0,
          isLeaf: 0,
          spuId: 0,
          attrName: '文本',
          attrId: 300005193,
          attrType: 3,
          valueList: [
            {
              value: 'hh2h',
              selected: 1
            }
          ],
          categoryId: 200000062,
          templateId: 0,
          isRequired: 1,
          textMaxLength: 4096,
          characterType: '2',
          inputType: 3,
          wmPoiId: '123',
          level: 0,
          sequence: 5
        }
      },
      skus: [
        {
          skuAttrs: [{
            value: '红色',
            valueId: 0,
            valueIdPath: null,
            valuePath: null,
            sequence: 0,
            isCustomized: true,
            attrId: 300000029,
          }, {
            value: '白色',
            valueId: 1,
            valueIdPath: null,
            valuePath: null,
            sequence: 0,
            isCustomized: true,
            attrId: 300000030,
          }],
          minOrderCount: 1,
          id: 130332025,
          stock: '',
          price: 0,
          upcCode: '33334444112',
          spec: '106ml ',
          spuId: null,
          bizValue: null,
          weightUnit: '',
          ladderPrice: 0,
          ladderNum: 0,
          limitStock: 1,
          itemNum: '',
          shelfNum: '',
          sourceFoodCode: '',
          weight: 106,
          productName: null,
          unit: '份',
          sequence: 0
        },
        {
          skuAttrs: [{
            value: '红色',
            valueId: 0,
            valueIdPath: null,
            valuePath: null,
            sequence: 0,
            isCustomized: true,
            attrId: 300000030,
          }, {
            value: '白色',
            valueId: 1,
            valueIdPath: null,
            valuePath: null,
            sequence: 0,
            isCustomized: true,
            attrId: 300000029,
          }],
          minOrderCount: 1,
          id: 130332026,
          stock: 20,
          price: 0,
          upcCode: '',
          spec: '106ml ',
          spuId: null,
          bizValue: null,
          weightUnit: '',
          ladderPrice: 1,
          ladderNum: 1,
          limitStock: 1,
          itemNum: '',
          shelfNum: '',
          sourceFoodCode: '',
          weight: 106,
          productName: null,
          unit: '份',
          sequence: 0
        },
        {
          skuAttrs: [{
            value: '红色',
            valueId: 0,
            valueIdPath: null,
            valuePath: null,
            sequence: 0,
            isCustomized: true,
            attrId: 300000030,
          }, {
            value: '红色',
            valueId: 1,
            valueIdPath: null,
            valuePath: null,
            sequence: 0,
            isCustomized: true,
            attrId: 300000029,
          }],
          minOrderCount: 1,
          id: 130332027,
          stock: 20,
          price: 0,
          upcCode: '3213',
          spec: '106ml ',
          spuId: null,
          bizValue: null,
          weightUnit: '',
          ladderPrice: 1,
          ladderNum: 1,
          limitStock: 1,
          itemNum: '',
          shelfNum: '',
          sourceFoodCode: '',
          weight: 106,
          productName: null,
          unit: '份',
          sequence: 0
        },
        {
          skuAttrs: [{
            value: '白色',
            valueId: 0,
            valueIdPath: null,
            valuePath: null,
            sequence: 0,
            isCustomized: true,
            attrId: 300000030,
          }, {
            value: '白色',
            valueId: 1,
            valueIdPath: null,
            valuePath: null,
            sequence: 0,
            isCustomized: true,
            attrId: 300000029,
          }],
          minOrderCount: 1,
          id: 130332028,
          stock: 20,
          price: 0,
          upcCode: '',
          spec: '106ml ',
          spuId: null,
          bizValue: null,
          weightUnit: '',
          ladderPrice: 1,
          ladderNum: 1,
          limitStock: 1,
          itemNum: '',
          shelfNum: '',
          sourceFoodCode: '',
          weight: 106,
          productName: null,
          unit: '份',
          sequence: 0
        }
      ],
    },
    auditorUpdateBeforeData: {
      name: '商品23',
      category: {
        lockTips: null,
        level: 3,
        parentId: 200002031,
        categoryName: "口罩用品",
        categoryId: 200002033,
        isLeaf: 1,
        categoryType: 1,
        idPath: ",200000001,200002031,200002033,",
        categoryNamePath: "美容个护,卫生用品/急救用品,口罩用品",
        allowCustomProduct: true,
        lockStatus: 0
      },
      categoryAttrMap: {
        ...product.data.categoryAttrMap,
        '300005193': {
          id: 0,
          isLeaf: 0,
          spuId: 0,
          attrName: '文本',
          attrId: 300005193,
          attrType: 3,
          valueList: [
            {
              value: 'hh2h',
              selected: 1
            }
          ],
          categoryId: 200000062,
          templateId: 0,
          isRequired: 1,
          textMaxLength: 4096,
          characterType: '2',
          inputType: 3,
          wmPoiId: '123',
          level: 0,
          sequence: 5
        }
      }
    }
  }
};


