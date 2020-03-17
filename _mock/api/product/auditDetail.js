/**
 * @url /reuse/sc/product/shangou/audit/r/detail
 */

const product = require('./productWithCategoryAttrs')();

module.exports = {
  code: 0,
  msg: '',
  data: {
    processId:123,
    productSpu: product.data,
    state: product.data.auditStatus,
    'tasks|3': [
      {
        taskId:123,
        nodeKey:"节点唯一标识",
        parentNodeKey:"父节点",
        'nodeName|+1': ['第一审核人', '第二审核人', '第三审核人'],
        auditMid:"审核人mis号",
        'auditState|1':[1,2,3,4,6], // 节点任务状态 1-审核中，2-审核通过，3-驳回上一节点(被驳回)，4-驳回至任务分配(审核驳回)，5-暂不处理, 6-撤销，7-被驳回待审核
        comment:"哈哈哈", // 如果节点状态为3或4,此处存储的是驳回原因
        isEdit:1, // 1-是，2-否,
        isNotHandle:1, // 是否可暂不处理1-是，2-否,
        isReject:1, // 是否可驳回 1-是，2-否,
        isAdmin:1, // 是否管理员 1-是，2-否,
        opTime:1 // 操作时间
      }
    ],
    snapshot: {
      upc:"69000000000001",
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
      categoryAttrMap: product.data.categoryAttrMap
    }
  }
};


