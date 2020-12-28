/**
 * @url /reuse/mpc/product/r/listProductChangeInfo
 */
module.exports = function(req) {
  // return {
  //   code: 0,
  //   msg: '',
  //   data: {
  //     basicInfoList: [
  //       {
  //         field: 'wmProductPics',
  //         oldValue: 'http://p1.meituan.net/xianfu/6722411acf8c32b97d8ad304033258ea194201.jpg,http://p1.meituan.net/xianfu/c6a6e9ea810eb0bc01be75451032f785188079.jpg,http://p1.meituan.net/xianfu/63afa5f0b2688079641d7e2cb635c2b6109815.jpg',
  //         newValue: 'http://p0.meituan.net/xianfu/4a06ab15f39ce476bbda42d62b3a9b0c611469.jpg,http://p0.meituan.net/xianfu/da31956966e5de4b100cdf6d3cd48144346922.jpg,http://p0.meituan.net/xianfu/4bd337810af62a1a8abdc51f0f654389112141.jpg,http://p0.meituan.net/xianfu/83535dc3a234bbc6efdf1724c69cacc6160709.jpg,http://p0.meituan.net/xianfu/897075f699ee972ed8e8eaffcef44143316319.jpg',
  //       }
  //     ],
  //     categoryInfoList: [
  //       {
  //         field: '1200000015',
  //         oldValue: 'fdsfdsf',
  //         newValue: 'fdfdsfd'
  //       },
  //       {
  //         field: '1200000016',
  //         oldValue: '1,2',
  //         newValue: '0,2,3'
  //       }
  //     ]
  //   }
  // }
  // return {
  //   data: {
  //     change: true,
  //     basicInfoList: [
  //       {
  //         newValue: 'http://p0.meituan.net/xianfu/cedbd0cbad0ea482c5307f61fdf547eb146003.jpg,http://p0.meituan.net/xianfu/026b1ae6201a50bf5a4b523dcb6bab98155350.jpg,http://p0.meituan.net/xianfu/83b58b2c01e2c7b1564187dde31cd05879888.jpg',
  //         oldValue: '',
  //         field: 'wmProductPics'
  //       }
  //     ],
  //     categoryInfoList: [
  //       {
  //         newValue: '温馨提示：1.OTC药品请按药品说明书或在药师指导下购买和使用。2.医疗器械请仔细阅读产品说明书或者在医务人员的指导下购买和使用，禁忌内容或者注意事项详见说明书。3.保健食品不能代替药物。4.由于厂家不定期的更换产品包装，如遇新包装上市可能存在更新滞后，请以收到的实货包装为准！5.药品属于特殊商品，除药品质量原因外，药品一经售出，不得退换。',
  //         oldValue: '1.OTC药品请按药品说明书或在药师指导下购买和使用。\r\n2.医疗器械请仔细阅读产品说明书或者在医务人员的指导下购买和使用，禁忌内容或者注意事项详见说明书。\r\n3.保健品不能代替药物。\r\n4.由于厂家不定期的更换产品包装，如遇新包装上市可能存在更新滞后，请以收到的实货包装为准！\r\n5.药品属于特殊商品，除药品质量原因外，药品一经售出，不得退换。',
  //         field: '1200000015'
  //       },
  //       {
  //         newValue: '',
  //         oldValue: '玻璃瓶。',
  //         field: '1200000009'
  //       },
  //       {
  //         newValue: '',
  //         oldValue: '鲜竹沥、鱼腥草、生半夏、生姜、枇杷叶、桔梗、薄荷素油。辅料为蔗糖和防腐剂（苯甲酸钠）。',
  //         field: '1200000012'
  //       },
  //       {
  //         newValue: '鲜竹沥、鱼腥草、生半夏、生姜、枇杷叶、桔梗、薄荷素油。辅料为蔗糖和防腐剂（苯甲酸钠）。',
  //         oldValue: '',
  //         field: '1200000311'
  //       }
  //     ]
  //   },
  //   code: 0,
  //   msg: '查询更新的商品详情成功'
  // }
  // return {
  //   data: {
  //     change: true,
  //     basicInfoList: [
  //       {
  //         newValue: '18.0',
  //         oldValue: '0.0',
  //         field: 'ori_price'
  //       }
  //     ],
  //     categoryInfoList: [
  //       {
  //         newValue: '2',
  //         oldValue: '国产',
  //         field: '1200000085'
  //       },
  //       {
  //         newValue: '2',
  //         oldValue: 'OTC',
  //         field: '1200000081'
  //       },
  //       {
  //         newValue: '',
  //         oldValue: '0',
  //         field: '020109'
  //       },
  //       {
  //         newValue: '',
  //         oldValue: '0',
  //         field: '020105'
  //       }
  //     ]
  //   },
  //   code: 0,
  //   msg: '查询更新的商品详情成功'
  // }
  // return {
  //   data: {
  //     basicInfoListSize: 1,
  //     basicInfoListIterator: [
  //       {
  //         setOldValue: true,
  //         setNewValue: true,
  //         newValue: '18.0',
  //         oldValue: '0.0',
  //         field: '12',
  //         setField: true
  //       }
  //     ],
  //     setBasicInfoList: true,
  //     categoryInfoListSize: 3,
  //     categoryInfoListIterator: [
  //       {
  //         setOldValue: true,
  //         setNewValue: true,
  //         newValue: '100003537',
  //         oldValue: '0',
  //         field: '1200000088',
  //         setField: true
  //       },
  //       {
  //         setOldValue: true,
  //         setNewValue: true,
  //         newValue: '',
  //         oldValue: '0',
  //         field: '020109',
  //         setField: true
  //       },
  //       {
  //         setOldValue: true,
  //         setNewValue: true,
  //         newValue: '',
  //         oldValue: '0',
  //         field: '020105',
  //         setField: true
  //       }
  //     ],
  //     setCategoryInfoList: true,
  //     basicInfoList: [
  //       {
  //         setOldValue: true,
  //         setNewValue: true,
  //         newValue: '18.0',
  //         oldValue: '0.0',
  //         field: '12',
  //         setField: true
  //       }
  //     ],
  //     categoryInfoList: [
  //       {
  //         setOldValue: true,
  //         setNewValue: true,
  //         newValue: '泰康',
  //         oldValue: '0',
  //         field: '1200000088',
  //         setField: true
  //       },
  //       {
  //         setOldValue: true,
  //         setNewValue: true,
  //         newValue: '',
  //         oldValue: '0',
  //         field: '020109',
  //         setField: true
  //       },
  //       {
  //         setOldValue: true,
  //         setNewValue: true,
  //         newValue: '',
  //         oldValue: '0',
  //         field: '020105',
  //         setField: true
  //       }
  //     ]
  //   },
  //   code: 0,
  //   msg: '成功'
  // };
  return {
    data: {
      products: [
        {
          changeProductDetailVo: {
            basicInfoListSize: 1,
            basicInfoListIterator: [
              {
                setOldValue: true,
                setNewValue: true,
                newValue: '18.0',
                oldValue: '0.0',
                field: '12',
                setField: true
              }
            ],
            setBasicInfoList: true,
            categoryInfoListSize: 3,
            categoryInfoListIterator: [
              {
                setOldValue: true,
                setNewValue: true,
                newValue: '100003537',
                oldValue: '0',
                field: '1200000088',
                setField: true
              },
              {
                setOldValue: true,
                setNewValue: true,
                newValue: '',
                oldValue: '0',
                field: '020109',
                setField: true
              },
              {
                setOldValue: true,
                setNewValue: true,
                newValue: '',
                oldValue: '0',
                field: '020105',
                setField: true
              }
            ],
            setCategoryInfoList: true,
            basicInfoList: [
              {
                setOldValue: true,
                setNewValue: true,
                newValue: '18.0',
                oldValue: '0.0',
                field: '12',
                setField: true
              }
            ],
            categoryInfoList: [
              {
                setOldValue: true,
                setNewValue: true,
                newValue: '100003537',
                oldValue: '0',
                field: '1200000088',
                setField: true
              },
              {
                setOldValue: true,
                setNewValue: true,
                newValue: '',
                oldValue: '0',
                field: '020109',
                setField: true
              },
              {
                setOldValue: true,
                setNewValue: true,
                newValue: '',
                oldValue: '0',
                field: '020105',
                setField: true
              }
            ]
          },
          changDetailVo: {
            name: '测试的商品哈哈哈哈哈哈',
            upc: '12398789263476238746'
          },
          categoryAttrAndValueList: []
        }
      ],
      pageNum: 1,
      pageSize: 20,
      totalCount: 5
    },
    code: 0,
    msg: '成功'
  };
}
