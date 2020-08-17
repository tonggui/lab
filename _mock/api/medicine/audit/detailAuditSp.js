/**
 * @url /reuse/sc/product/shangou/medicine/audit/r/detailAuditSp
 */
module.exports = function(req) {
  return {
    code: 0,
    data: {
      standardProductVo: {
        spSkuId: 123,
        wmPoiId: 321,
        category: {
          id: 1,
          categoryName: '测试',
          idPath: '0,1',
          namePath: '根节点,测试'
        },
        name: '标品详情标题',
        upcList: [
          '09876543',
          '12345678'
        ],
        spec: '规格',
        suggestedPrice: 12.3,
        medicineTagList: [
          {
            id: 123,
            code: '123',
            name: '药品分类1'
          }
        ],
        picList: [
          'http://p1.meituan.net/xianfu/993ff9b9c46dc0e82c36d237590b9120138045.jpg',
          'http://p1.meituan.net/xianfu/993ff9b9c46dc0e82c36d237590b9120138045.jpg'
        ],
        picDetailList: [
          'http://p1.meituan.net/xianfu/993ff9b9c46dc0e82c36d237590b9120138045.jpg',
          'http://p1.meituan.net/xianfu/993ff9b9c46dc0e82c36d237590b9120138045.jpg'
        ],
        attrValueList: [
          {
            attrId: 1200000088,
            attrName: "品牌",
            extension: "111",
            isExt: 1,
            spSkuId: 201334,
            valueId: 321
          }, {
            attrId: 1200000016,
            attrName: "处方类型",
            extension: "",
            isExt: 2,
            spSkuId: 201334,
            valueId: 100001442
          }
        ],
        auditStatus: 1
      },
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
      ]
    }
  }
}
