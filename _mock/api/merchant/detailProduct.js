/**
 * @url /reuse/sc/product/hqcc/r/detailProduct
 */
module.exports = function () {
  return {
    code: 0,
    data: {
      name: '商品11',
      spuId: 10294879,
      wmPoiIds: [1,2,3],
      limitSale: JSON.stringify({
        limitSale: true,
        begin: '20200301',
        end: '20200401',
        type: 1,
        poiCenterSpuId: 111,
        multiPoi: true,
        count: 100
      }),
      tags: [
        {
          name: '403二级分类',
          id: 1000001,
          valid: 1,
          isLeaf: 1,
          setId: true,
          setName: true,
          setSequence: true,
          setCtime: true,
          setUtime: true,
          setValid: true,
          setDescription: true,
          tagType: 0,
          parentId: 7340747,
          setWmPoiId: true,
          setPoiId: true,
          setIsLeaf: true,
          setParentName: true,
          setBuzType: true,
          appTagCode: '',
          setAppTagCode: true,
          setTopFlag: true,
          setTagType: true,
          setTimeZone: true,
          setActPolicyId: true,
          setCategoryCode: true,
          setNodePath: true,
          outerFtagId: -1,
          setOuterFtagId: true,
          setExtend: true,
          topFlag: 0,
          description: '',
          parentName: '403一级分类',
          wmPoiId: 5108726,
          setLevel: true,
          actPolicyId: 0,
          nodePath: '',
          buzType: 0,
          setParentId: true,
          categoryCode: '',
          extend: '{"sortType":2,"topCount":0}',
          utime: 1554259012,
          ctime: 1509005478,
          poiId: 0,
          timeZone: '',
          level: 2,
          sequence: 6
        }
      ],
      categoryAttrMap: {
        '300000028': {
          id: 0,
          isLeaf: 0,
          spuId: 0,
          attrName: '大乳品',
          attrId: 300000028,
          attrType: 3,
          valueList: [
            {
              value: '可口',
              valueId: 400002677,
              valueIdPath: null,
              valuePath: null,
              selected: 1,
              text: '',
              sequence: 0
            },
            {
              value: '酸',
              valueId: 400002676,
              valueIdPath: null,
              valuePath: null,
              selected: 0,
              text: '',
              sequence: 0
            },
            {
              value: '可可否',
              valueId: 400000037,
              valueIdPath: null,
              valuePath: null,
              selected: 0,
              text: '',
              sequence: 0
            }
          ],
          categoryId: 200000062,
          templateId: 0,
          isRequired: 2,
          inputType: 1,
          wmPoiId: 0,
          level: 0,
          sequence: 2
        },
        '1200000094': {
          id: 1200000088,
          attrName: '产地',
          attrId: 1200000094,
          categoryId: 200000062,
          inputType: 1,
          attrType: 1,
          valueList: [{
            value: null,
            valueId: '',
            valueIdPath: '1,2,3',
            valuePath: 'test,test2,test3',
            selected: 1,
            text: '',
            sequence: 0
          }]
        },
        '1200000088': {
          id: 1200000088,
          isLeaf: 0,
          spuId: 0,
          attrName: '品牌',
          attrId: 1200000088,
          attrType: 1,
          categoryId: 200000062,
          templateId: 0,
          isRequired: 0,
          inputType: 3,
          wmPoiId: 0,
          level: 0,
          sequence: 1,
          valueList: [{
            value: undefined,
            valueId: 123,
            valueIdPath: '1,2,3',
            valuePath: '大苹果,333,safdsfds',
            selected: 1,
            text: '',
            sequence: 0
          }]
        },
        '300005192': {
          id: 0,
          isLeaf: 0,
          spuId: 0,
          attrName: 'adfa',
          attrId: 300005192,
          attrType: 3,
          optionMaxSize: 1,
          valueList: [
            {
              value: '6789',
              valueId: 400003137,
              valueIdPath: null,
              valuePath: null,
              selected: 1,
              text: '',
              sequence: 0
            },
            {
              value: '12345',
              valueId: 400003136,
              valueIdPath: null,
              valuePath: null,
              selected: 1,
              text: '',
              sequence: 0
            },
            {
              value: 'dddddd',
              valueId: 400003135,
              valueIdPath: null,
              valuePath: null,
              selected: 1,
              text: '',
              sequence: 0
            }
          ],
          categoryId: 200000062,
          templateId: 0,
          isRequired: 1,
          inputType: 2,
          wmPoiId: 0,
          level: 0,
          sequence: 4
        },
        '300005193': {
          id: 0,
          isLeaf: 0,
          spuId: 0,
          attrName: '文本',
          attrId: 300005193,
          attrType: 3,
          valueList: [
            {
              value: '   hhh   发发发   😀  ',
              selected: 1
            }
          ],
          categoryId: 200000062,
          templateId: 0,
          isRequired: 0,
          textMaxLength: 20,
          characterType: '2,4',
          inputType: 3,
          wmPoiId: '123',
          level: 0,
          sequence: 3
        }
      },
      attrList: [],
      pic: 'http://p0.meituan.net/xianfu/6069f13017f8dfb057f805b1325dd7b5763904.jpg,http://p0.meituan.net/xianfu/6069f13017f8dfb057f805b1325dd7b5763904.jpg',
      picContent: 'http://p0.meituan.net/xianfu/6069f13017f8dfb057f805b1325dd7b5763904.jpg,http://p0.meituan.net/xianfu/6069f13017f8dfb057f805b1325dd7b5763904.jpg',
      poorImages: [1, 2],
      suggestedPrice: 0,
      riseMax: 0,
      dropMax: 0,
      offShelfType: 0,
      releaseType: 0,
      upcValidFlag: 0,
      riskMano: null,
      labels: [{subAttr: "0", id: 1, groupId: 1, groupName: "招牌"}],
      spuSaleAttrMap: {
        '300000029': {
          id: 0,
          isLeaf: 0,
          spuId: 0,
          attrName: '颜色1',
          attrId: 300000029,
          valueList: [
            {
              value: '红色',
              valueId: 0,
              valueIdPath: null,
              valuePath: null,
              selected: 1,
              text: null,
              sequence: 0,
              isCustomized: true,
            },
            {
              value: '白色',
              valueId: 1,
              valueIdPath: null,
              valuePath: null,
              selected: 1,
              text: '',
              sequence: 0
            },
            {
              value: '黄色',
              valueId: 2,
              valueIdPath: null,
              valuePath: null,
              selected: 0,
              text: '',
              sequence: 0
            },
            {
              value: '绿色',
              valueId: 3,
              valueIdPath: null,
              valuePath: null,
              selected: 0,
              text: '',
              sequence: 0
            }
          ],
          categoryId: 0,
          templateId: 0,
          isRequired: 1,
          inputType: 2,
          attrType: 2,
          supportExtend: false,
          wmPoiId: 0,
          level: 0,
          sequence: 0
        },
        '300000030': {
          id: 1,
          isLeaf: 0,
          spuId: 1,
          attrName: '颜色2',
          attrId: 300000030,
          valueList: [
            {
              value: '红色',
              valueId: 0,
              valueIdPath: null,
              valuePath: null,
              selected: 1,
              text: null,
              sequence: 0,
              isCustomized: true,
            },
            {
              value: '白色',
              valueId: 1,
              valueIdPath: null,
              valuePath: null,
              selected: 1,
              text: '',
              sequence: 0
            },
            {
              value: '黄色',
              valueId: 2,
              valueIdPath: null,
              valuePath: null,
              selected: 0,
              text: '',
              sequence: 0
            },
            {
              value: '绿色',
              valueId: 3,
              valueIdPath: null,
              valuePath: null,
              selected: 0,
              text: '',
              sequence: 0
            }
          ],
          categoryId: 1,
          templateId: 1,
          isRequired: 1,
          inputType: 2,
          attrType: 2,
          supportExtend: true,
          wmPoiId: 0,
          level: 0,
          sequence: 1
        }
      },
      forceRelFlag: 0,
      sellStatus: 0,
      minOrderCount: 1,
      saleTime: '[["15:17-15:18","17:17-17:20","18:17-18:20"],["15:17-15:18","17:17-17:20","18:17-18:20"],["15:17-15:18","17:17-17:20","18:17-18:20"],["15:17-15:18","17:17-17:20","18:17-18:20"],["15:17-15:18","17:17-17:20","18:17-18:20"],[],["15:17-15:18","17:17-17:20","18:17-18:20"]]',
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
          id: 130332024,
          stock: 10,
          price: 0,
          upc: '312',
          spec: '106ml ',
          spuId: null,
          bizValue: null,
          weightUnit: '',
          boxPrice: 0,
          boxNum: 1,
          limitStock: 1,
          itemNum: '',
          shelfNum: '',
          skuCode: 'aaaaaaa',
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
          id: 130332025,
          stock: 20,
          price: 0,
          upc: '',
          spec: '106ml ',
          spuId: null,
          bizValue: null,
          weightUnit: '',
          boxPrice: 0,
          boxNum: 1,
          limitStock: 1,
          itemNum: '',
          shelfNum: '',
          skuCode: 'ddddd',
          weight: 106,
          productName: null,
          unit: '份',
          sequence: 0
        }
      ],
      title: 'Title(title:商品11, manualTitle:0, rule:[TitleRule(field:originName, sort:1, weight:1), TitleRule(field:brandName, sort:2, weight:2), TitleRule(field:spName, sort:3, weight:5), TitleRule(field:flavour, sort:4, weight:4), TitleRule(field:spec, sort:5, weight:3)], h5Url:http://actreusefe.sankuai.com/h5/product/nameStitchingRule)',
      description: '',
      items: null,
      category: {
        idPath: ',200000062,200000087,200000088,',
        categoryNamePath: '制品,冰品,袋装冰激凌',
        isLeaf: 1,
        categoryId: 200000088,
        parentId: 200000087,
        categoryName: '袋装冰激凌',
        level: 3
      },
      wmPoiId: 5108726,
      isSp: 1,
      spId: 123
    },
    msg: '成功'
  };
};
