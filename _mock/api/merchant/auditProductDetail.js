/**
 * @url reuse/sc/product/hqcc/audit/r/detail
 */
const product = require('../product/productWithCategoryAttrs')();

module.exports = {
  data: {
    auditorUpdateBeforeData: {
      category: {
        lockStatus: 0,
        lockTips: null,
        level: 3,
        parentId: 900000154,
        categoryId: 900000158,
        categoryType: 1,
        categoryName: '矿泉水',
        isLeaf: 1,
        idPath: ',900000094,900000154,900000158,',
        allowCustomProduct: true,
        categoryNamePath: '酒饮冲调,饮用水,矿泉水'
      },
      merchantId: 20,
      categoryAttrMap: {
        '1200000088': {
          optionMaxSize: 0,
          textMaxLength: 30,
          characterType: '1,2,3,4',
          supportFilter: 2,
          supportExtend: '',
          application: '1,2,3',
          sequence: 3,
          attrName: '品牌',
          level: 0,
          inputType: 1,
          wmPoiId: 0,
          categoryId: 900000158,
          isLeaf: 0,
          spuId: 0,
          templateId: 2064,
          valueList: [
            {
              sequence: 0,
              text: '',
              isLeaf: 0,
              valueId: 1300006138,
              selected: 0,
              valuePath: null,
              valueIdPath: null,
              value: '康师傅'
            },
            {
              sequence: 0,
              text: '',
              isLeaf: 0,
              valueId: 1300006139,
              selected: 0,
              valuePath: null,
              valueIdPath: null,
              value: '娃哈哈'
            }
          ],
          attrId: 1200000088,
          attrType: 1,
          isRequired: 2,
          id: 0
        },
        '1200000094': {
          optionMaxSize: 0,
          textMaxLength: 30,
          characterType: '1,2,3,4',
          supportFilter: 2,
          supportExtend: '',
          application: '2,1',
          sequence: 1,
          attrName: '产地',
          level: 0,
          inputType: 3,
          wmPoiId: 0,
          categoryId: 900000158,
          isLeaf: 0,
          spuId: 0,
          templateId: 2064,
          valueList: [
            {
              sequence: 0,
              text: null,
              isLeaf: 0,
              valueId: 100000001,
              selected: 1,
              valuePath: '奥兰群岛',
              valueIdPath: '100000001',
              value: '奥兰群岛'
            }
          ],
          attrId: 1200000094,
          attrType: 1,
          isRequired: 1,
          id: 0
        },
        '1200000261': {
          optionMaxSize: 0,
          textMaxLength: 30,
          characterType: '1,2,3,4',
          supportFilter: 2,
          supportExtend: '1',
          application: '1,2,3',
          sequence: 20,
          attrName: '关键属性多选',
          level: 0,
          inputType: 2,
          wmPoiId: 0,
          categoryId: 900000158,
          isLeaf: 0,
          spuId: 0,
          templateId: 2064,
          valueList: [
            {
              sequence: 0,
              text: '',
              isLeaf: 0,
              valueId: 1300010731,
              selected: 0,
              valuePath: null,
              valueIdPath: null,
              value: '交互接口和'
            },
            {
              sequence: 0,
              text: '',
              isLeaf: 0,
              valueId: 1300010732,
              selected: 0,
              valuePath: null,
              valueIdPath: null,
              value: '接口；接口'
            }
          ],
          attrId: 1200000261,
          attrType: 1,
          isRequired: 2,
          id: 0
        },
        '1200001256': {
          optionMaxSize: 0,
          textMaxLength: 30,
          characterType: '1,2,3,4',
          supportFilter: 2,
          supportExtend: '',
          application: '1,2',
          sequence: 2,
          attrName: '审核关键属性',
          level: 0,
          inputType: 3,
          wmPoiId: 0,
          categoryId: 900000158,
          isLeaf: 0,
          spuId: 0,
          templateId: 2064,
          valueList: [
            {
              sequence: 0,
              text: null,
              isLeaf: 0,
              valueId: 0,
              selected: 1,
              valuePath: '',
              valueIdPath: '',
              value: null
            }
          ],
          attrId: 1200001256,
          attrType: 1,
          isRequired: 2,
          id: 0
        },
        '1200001257': {
          optionMaxSize: 2,
          textMaxLength: 30,
          characterType: '1,2,3,4',
          supportFilter: 2,
          supportExtend: '',
          application: '1,2',
          sequence: 4,
          attrName: '审核关键属性单选',
          level: 0,
          inputType: 2,
          wmPoiId: 0,
          categoryId: 900000158,
          isLeaf: 0,
          spuId: 0,
          templateId: 2064,
          valueList: [
            {
              sequence: 0,
              text: '',
              isLeaf: 0,
              valueId: 1300006140,
              selected: 0,
              valuePath: null,
              valueIdPath: null,
              value: '大师'
            },
            {
              sequence: 0,
              text: '',
              isLeaf: 0,
              valueId: 1300000205,
              selected: 0,
              valuePath: null,
              valueIdPath: null,
              value: '21'
            },
            {
              sequence: 0,
              text: '',
              isLeaf: 0,
              valueId: 1300010641,
              selected: 0,
              valuePath: null,
              valueIdPath: null,
              value: '地方撒'
            }
          ],
          attrId: 1200001257,
          attrType: 1,
          isRequired: 2,
          id: 0
        },
        '1200001907': {
          optionMaxSize: 0,
          textMaxLength: 30,
          characterType: '1,2,3,4',
          supportFilter: 2,
          supportExtend: '1',
          application: '1,2',
          sequence: 5,
          attrName: '多选',
          level: 0,
          inputType: 2,
          wmPoiId: 0,
          categoryId: 900000158,
          isLeaf: 0,
          spuId: 0,
          templateId: 2064,
          valueList: [
            {
              sequence: 0,
              text: '',
              isLeaf: 0,
              valueId: 1300009582,
              selected: 0,
              valuePath: null,
              valueIdPath: null,
              value: '大大 sad'
            },
            {
              sequence: 0,
              text: '',
              isLeaf: 0,
              valueId: 1300009583,
              selected: 0,
              valuePath: null,
              valueIdPath: null,
              value: '放大舒服'
            },
            {
              sequence: 0,
              text: '',
              isLeaf: 0,
              valueId: 1300009584,
              selected: 1,
              valuePath: null,
              valueIdPath: null,
              value: '官方代购'
            },
            {
              sequence: 0,
              text: '',
              isLeaf: 0,
              valueId: 1300009585,
              selected: 0,
              valuePath: null,
              valueIdPath: null,
              value: '放大放大放大的'
            }
          ],
          attrId: 1200001907,
          attrType: 3,
          isRequired: 1,
          id: 0
        },
        '1200002092': {
          optionMaxSize: 0,
          textMaxLength: 30,
          characterType: '1,2,3,4',
          supportFilter: 2,
          supportExtend: '1',
          application: '1,2',
          sequence: 6,
          attrName: '普通属性12审核测试',
          level: 0,
          inputType: 1,
          wmPoiId: 0,
          categoryId: 900000158,
          isLeaf: 0,
          spuId: 0,
          templateId: 2064,
          valueList: [
            {
              sequence: 0,
              text: '',
              isLeaf: 0,
              valueId: 1300010639,
              selected: 1,
              valuePath: null,
              valueIdPath: null,
              value: '阖家欢乐就'
            },
            {
              sequence: 0,
              text: '',
              isLeaf: 0,
              valueId: 1300010640,
              selected: 0,
              valuePath: null,
              valueIdPath: null,
              value: '计划计划'
            }
          ],
          attrId: 1200002092,
          attrType: 3,
          isRequired: 1,
          id: 0
        },
        '1200002093': {
          optionMaxSize: 0,
          textMaxLength: 30,
          characterType: '1,2,3,4',
          supportFilter: 2,
          supportExtend: '',
          application: '1,2',
          sequence: 8,
          attrName: '审核普通属性',
          level: 0,
          inputType: 3,
          wmPoiId: 0,
          categoryId: 900000158,
          isLeaf: 0,
          spuId: 0,
          templateId: 2064,
          valueList: [
            {
              sequence: 0,
              text: null,
              isLeaf: 0,
              valueId: 0,
              selected: 1,
              valuePath: '',
              valueIdPath: '',
              value: '111'
            }
          ],
          attrId: 1200002093,
          attrType: 3,
          isRequired: 1,
          id: 0
        },
        '1200003187': {
          optionMaxSize: 0,
          textMaxLength: 30,
          characterType: '1,3,4',
          supportFilter: 2,
          supportExtend: '',
          application: '1,2,3',
          sequence: 11,
          attrName: '饮料颜色',
          level: 0,
          inputType: 3,
          wmPoiId: 0,
          categoryId: 900000158,
          isLeaf: 0,
          spuId: 0,
          templateId: 2064,
          valueList: [
            {
              sequence: 0,
              text: null,
              isLeaf: 0,
              valueId: 0,
              selected: 1,
              valuePath: '',
              valueIdPath: '',
              value: '12'
            }
          ],
          attrId: 1200003187,
          attrType: 1,
          isRequired: 1,
          id: 0
        }
      },
      name: '送审验证04',
      id: 155970
    },
    processId: 42612,
    snapshot: null,
    productSpu: {
      upcImage: null,
      saleTime: '-',
      description: '',
      origin: null,
      labels: null,
      category: {
        lockStatus: 0,
        lockTips: null,
        level: 3,
        parentId: 900000154,
        categoryId: 900000158,
        categoryType: 1,
        categoryName: '矿泉水',
        isLeaf: 1,
        idPath: ',900000094,900000154,900000158,',
        allowCustomProduct: true,
        categoryNamePath: '酒饮冲调,饮用水,矿泉水'
      },
      tags: [
        {
          childTagIds: null,
          subTagCount: null,
          description: '',
          sequence: 3,
          parentId: 0,
          topFlag: 0,
          valid: null,
          merchantId: 20,
          wmPoiId: null,
          isLeaf: 1,
          subTags: null,
          products: null,
          appTagCode: '',
          productCount: 0,
          includeStatus: 1,
          topTimeZone: null,
          nodePath: '123',
          name: '123',
          id: 13600
        }
      ],
      merchantId: 20,
      wmPoiIds: null,
      brand: null,
      spId: 0,
      skus: [
        {
          shelfNum: '',
          itemNum: null,
          sequence: 1,
          weight: 12,
          ladderPrice: 0,
          ladderNum: 1,
          price: 112,
          weightUnit: '克(g)',
          upc: '0020916115506',
          skuCode: '',
          skuAttrs: null,
          spec: '',
          stock: 12,
          unit: '份',
          minOrderCount: 1,
          boxPrice: 0,
          boxNum: 0,
          id: 140450
        }
      ],
      categoryAttrMap: {
        '1200000088': {
          optionMaxSize: 0,
          textMaxLength: 30,
          characterType: '1,2,3,4',
          supportFilter: 2,
          supportExtend: '',
          application: '1,2,3',
          sequence: 3,
          attrName: '品牌',
          level: 0,
          inputType: 1,
          wmPoiId: 0,
          categoryId: 900000158,
          isLeaf: 0,
          spuId: 0,
          templateId: 2064,
          valueList: [
            {
              sequence: 0,
              text: '',
              isLeaf: 0,
              valueId: 1300006138,
              selected: 0,
              valuePath: null,
              valueIdPath: null,
              value: '康师傅'
            },
            {
              sequence: 0,
              text: '',
              isLeaf: 0,
              valueId: 1300006139,
              selected: 0,
              valuePath: null,
              valueIdPath: null,
              value: '娃哈哈'
            }
          ],
          attrId: 1200000088,
          attrType: 1,
          isRequired: 2,
          id: 0
        },
        '1200000094': {
          optionMaxSize: 0,
          textMaxLength: 30,
          characterType: '1,2,3,4',
          supportFilter: 2,
          supportExtend: '',
          application: '2,1',
          sequence: 1,
          attrName: '产地',
          level: 0,
          inputType: 3,
          wmPoiId: 0,
          categoryId: 900000158,
          isLeaf: 0,
          spuId: 0,
          templateId: 2064,
          valueList: [
            {
              sequence: 0,
              text: null,
              isLeaf: 0,
              valueId: 100000001,
              selected: 1,
              valuePath: '奥兰群岛',
              valueIdPath: '100000001',
              value: '奥兰群岛'
            }
          ],
          attrId: 1200000094,
          attrType: 1,
          isRequired: 1,
          id: 0
        },
        '1200000261': {
          optionMaxSize: 0,
          textMaxLength: 30,
          characterType: '1,2,3,4',
          supportFilter: 2,
          supportExtend: '1',
          application: '1,2,3',
          sequence: 20,
          attrName: '关键属性多选',
          level: 0,
          inputType: 2,
          wmPoiId: 0,
          categoryId: 900000158,
          isLeaf: 0,
          spuId: 0,
          templateId: 2064,
          valueList: [
            {
              sequence: 0,
              text: '',
              isLeaf: 0,
              valueId: 1300010731,
              selected: 0,
              valuePath: null,
              valueIdPath: null,
              value: '交互接口和'
            },
            {
              sequence: 0,
              text: '',
              isLeaf: 0,
              valueId: 1300010732,
              selected: 0,
              valuePath: null,
              valueIdPath: null,
              value: '接口；接口'
            }
          ],
          attrId: 1200000261,
          attrType: 1,
          isRequired: 2,
          id: 0
        },
        '1200001256': {
          optionMaxSize: 0,
          textMaxLength: 30,
          characterType: '1,2,3,4',
          supportFilter: 2,
          supportExtend: '',
          application: '1,2',
          sequence: 2,
          attrName: '审核关键属性',
          level: 0,
          inputType: 3,
          wmPoiId: 0,
          categoryId: 900000158,
          isLeaf: 0,
          spuId: 0,
          templateId: 2064,
          valueList: [
            {
              sequence: 0,
              text: null,
              isLeaf: 0,
              valueId: 0,
              selected: 1,
              valuePath: '',
              valueIdPath: '',
              value: null
            }
          ],
          attrId: 1200001256,
          attrType: 1,
          isRequired: 2,
          id: 0
        },
        '1200001257': {
          optionMaxSize: 2,
          textMaxLength: 30,
          characterType: '1,2,3,4',
          supportFilter: 2,
          supportExtend: '',
          application: '1,2',
          sequence: 4,
          attrName: '审核关键属性单选',
          level: 0,
          inputType: 2,
          wmPoiId: 0,
          categoryId: 900000158,
          isLeaf: 0,
          spuId: 0,
          templateId: 2064,
          valueList: [
            {
              sequence: 0,
              text: '',
              isLeaf: 0,
              valueId: 1300006140,
              selected: 0,
              valuePath: null,
              valueIdPath: null,
              value: '大师'
            },
            {
              sequence: 0,
              text: '',
              isLeaf: 0,
              valueId: 1300000205,
              selected: 0,
              valuePath: null,
              valueIdPath: null,
              value: '21'
            },
            {
              sequence: 0,
              text: '',
              isLeaf: 0,
              valueId: 1300010641,
              selected: 0,
              valuePath: null,
              valueIdPath: null,
              value: '地方撒'
            }
          ],
          attrId: 1200001257,
          attrType: 1,
          isRequired: 2,
          id: 0
        },
        '1200001907': {
          optionMaxSize: 0,
          textMaxLength: 30,
          characterType: '1,2,3,4',
          supportFilter: 2,
          supportExtend: '1',
          application: '1,2',
          sequence: 5,
          attrName: '多选',
          level: 0,
          inputType: 2,
          wmPoiId: 0,
          categoryId: 900000158,
          isLeaf: 0,
          spuId: 0,
          templateId: 2064,
          valueList: [
            {
              sequence: 0,
              text: '',
              isLeaf: 0,
              valueId: 1300009582,
              selected: 0,
              valuePath: null,
              valueIdPath: null,
              value: '大大 sad'
            },
            {
              sequence: 0,
              text: '',
              isLeaf: 0,
              valueId: 1300009583,
              selected: 0,
              valuePath: null,
              valueIdPath: null,
              value: '放大舒服'
            },
            {
              sequence: 0,
              text: '',
              isLeaf: 0,
              valueId: 1300009584,
              selected: 1,
              valuePath: null,
              valueIdPath: null,
              value: '官方代购'
            },
            {
              sequence: 0,
              text: '',
              isLeaf: 0,
              valueId: 1300009585,
              selected: 0,
              valuePath: null,
              valueIdPath: null,
              value: '放大放大放大的'
            }
          ],
          attrId: 1200001907,
          attrType: 3,
          isRequired: 1,
          id: 0
        },
        '1200002092': {
          optionMaxSize: 0,
          textMaxLength: 30,
          characterType: '1,2,3,4',
          supportFilter: 2,
          supportExtend: '1',
          application: '1,2',
          sequence: 6,
          attrName: '普通属性12审核测试',
          level: 0,
          inputType: 1,
          wmPoiId: 0,
          categoryId: 900000158,
          isLeaf: 0,
          spuId: 0,
          templateId: 2064,
          valueList: [
            {
              sequence: 0,
              text: '',
              isLeaf: 0,
              valueId: 1300010639,
              selected: 1,
              valuePath: null,
              valueIdPath: null,
              value: '阖家欢乐就'
            },
            {
              sequence: 0,
              text: '',
              isLeaf: 0,
              valueId: 1300010640,
              selected: 0,
              valuePath: null,
              valueIdPath: null,
              value: '计划计划'
            }
          ],
          attrId: 1200002092,
          attrType: 3,
          isRequired: 1,
          id: 0
        },
        '1200002093': {
          optionMaxSize: 0,
          textMaxLength: 30,
          characterType: '1,2,3,4',
          supportFilter: 2,
          supportExtend: '',
          application: '1,2',
          sequence: 8,
          attrName: '审核普通属性',
          level: 0,
          inputType: 3,
          wmPoiId: 0,
          categoryId: 900000158,
          isLeaf: 0,
          spuId: 0,
          templateId: 2064,
          valueList: [
            {
              sequence: 0,
              text: null,
              isLeaf: 0,
              valueId: 0,
              selected: 1,
              valuePath: '',
              valueIdPath: '',
              value: '111'
            }
          ],
          attrId: 1200002093,
          attrType: 3,
          isRequired: 1,
          id: 0
        },
        '1200003187': {
          optionMaxSize: 0,
          textMaxLength: 30,
          characterType: '1,3,4',
          supportFilter: 2,
          supportExtend: '',
          application: '1,2,3',
          sequence: 11,
          attrName: '饮料颜色',
          level: 0,
          inputType: 3,
          wmPoiId: 0,
          categoryId: 900000158,
          isLeaf: 0,
          spuId: 0,
          templateId: 2064,
          valueList: [
            {
              sequence: 0,
              text: null,
              isLeaf: 0,
              valueId: 0,
              selected: 1,
              valuePath: '',
              valueIdPath: '',
              value: '12'
            }
          ],
          attrId: 1200003187,
          attrType: 1,
          isRequired: 1,
          id: 0
        }
      },
      spuSaleAttrMap: {},
      pic: 'http://p0.meituan.net/xianfu/f35367cdf29511ff9b417200a54ee41d332579.jpg',
      spuId: 155970,
      limitSale: '',
      attrList: null,
      isSp: 0,
      sellStatus: 0,
      unit: '份',
      poorImages: [
        1
      ],
      picContent: '',
      minOrderCount: 1,
      name: '送审验证04',
      poiCount: null,
      priceRange: null,
      skuVoList: null,
      tagCount: 0,
      upc: null,
      skuCode: null,
      ctime: null,
      pictures: null,
      merchantDelStatus: 0,
      poiIds: null
    },
    tasks: [
      {
        nodeKey: 'shangou_product_audit_node_01',
        parentNodeKey: '',
        auditMid: 'huyang23',
        isEdit: 1,
        isNotHandle: 1,
        isReject: 1,
        nodeName: '一级审核人',
        taskId: 62019,
        auditState: 1,
        isAdmin: 2,
        opTime: 1596539618353,
        comment: null
      },
      {
        nodeKey: 'shangou_product_audit_node_02',
        parentNodeKey: 'shangou_product_audit_node_01',
        auditMid: 'xiaolong04',
        isEdit: 1,
        isNotHandle: 1,
        isReject: 1,
        nodeName: '二级审核人',
        taskId: 62020,
        auditState: 0,
        isAdmin: 2,
        opTime: 1596539618353,
        comment: null
      }
    ],
    dataSource: 2,
    state: 1
  },
  code: 0,
  message: 'SUCCESS'
};

// module.exports = {
//   code: 0,
//   msg: '',
//   data: {
//     processId:123,
//     productSpu: product.data,
//     state: 1, // 5
//     dataSource: 1, // 3
//     'tasks|3': [
//       {
//         taskId:123,
//         nodeKey:"节点唯一标识",
//         parentNodeKey:"父节点",
//         'nodeName|+1': ['第一审核人', '第二审核人', '第三审核人'],
//         auditMid:"审核人mis号",
//         'auditState|1':[1,2,3,4,6,7], // 节点任务状态 1-审核中，2-审核通过，3-驳回上一节点(被驳回)，4-驳回至任务分配(审核驳回)，5-暂不处理, 6-撤销，7-被驳回待审核
//         comment:"哈哈哈错速发耦否大方奥迪舒服哦啊嗦粉大大送积分流口水的肌肤立刻就撒的李姐法", // 如果节点状态为3或4,此处存储的是驳回原因
//         isEdit:1, // 1-是，2-否,
//         isNotHandle:1, // 是否可暂不处理1-是，2-否,
//         isReject:1, // 是否可驳回 1-是，2-否,
//         isAdmin:1, // 是否管理员 1-是，2-否,
//         opTime:1 // 操作时间
//       }
//     ],
//     snapshot: {
//       name: '商品2',
//       upcCode:"69000000000001",
//       category: {
//         lockTips: null,
//         level: 3,
//         parentId: 200002031,
//         categoryName: "口罩用品",
//         categoryId: 200002033,
//         isLeaf: 1,
//         categoryType: 1,
//         idPath: ",200000001,200002031,200002033,",
//         categoryNamePath: "美容个护,卫生用品/急救用品,口罩用品",
//         allowCustomProduct: true,
//         lockStatus: 0
//       },
//       categoryAttrMap: {
//         ...product.data.categoryAttrMap,
//         '300005193': {
//           id: 0,
//           isLeaf: 0,
//           spuId: 0,
//           attrName: '文本',
//           attrId: 300005193,
//           attrType: 3,
//           valueList: [
//             {
//               value: 'hh2h',
//               selected: 1
//             }
//           ],
//           categoryId: 200000062,
//           templateId: 0,
//           isRequired: 1,
//           textMaxLength: 4096,
//           characterType: '2',
//           inputType: 3,
//           wmPoiId: '123',
//           level: 0,
//           sequence: 5
//         }
//       }
//     },
//     auditorUpdateBeforeData: {
//       name: '商品23',
//       category: {
//         lockTips: null,
//         level: 3,
//         parentId: 200002031,
//         categoryName: "口罩用品",
//         categoryId: 200002033,
//         isLeaf: 1,
//         categoryType: 1,
//         idPath: ",200000001,200002031,200002033,",
//         categoryNamePath: "美容个护,卫生用品/急救用品,口罩用品",
//         allowCustomProduct: true,
//         lockStatus: 0
//       },
//       categoryAttrMap: {
//         ...product.data.categoryAttrMap,
//         '300005193': {
//           id: 0,
//           isLeaf: 0,
//           spuId: 0,
//           attrName: '文本',
//           attrId: 300005193,
//           attrType: 3,
//           valueList: [
//             {
//               value: 'hh2h',
//               selected: 1
//             }
//           ],
//           categoryId: 200000062,
//           templateId: 0,
//           isRequired: 1,
//           textMaxLength: 4096,
//           characterType: '2',
//           inputType: 3,
//           wmPoiId: '123',
//           level: 0,
//           sequence: 5
//         }
//       }
//     }
//   }
// };
