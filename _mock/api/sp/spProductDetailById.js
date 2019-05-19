/**
 * @url /reuse/sc/product/retail/r/getSpDetailBySpId
 */
module.exports = function () {
  return {
    data: {
      product: {
        name: "美素佳儿 较大婴儿2段配方奶粉 900g/罐",
        id: null,
        source: null,
        origin: 96,
        category: {
          name: "配方奶粉",
          id: 200001689,
          level: 3,
          parentId: 200001688,
          isLeaf: 1,
          namePath: "母婴用品,奶粉,配方奶粉",
          idPath: "配方奶粉"
        },
        weight: 900,
        isSp: 1,
        spId: 10407186,
        spec: "900g",
        unit: "罐",
        shipping_time_x: null,
        ean: "8716200710374",
        pic: "http://p0.meituan.net/shangchao/fb5efbcde5214f1a996e5378abffa570.JPEG",
        originName: "荷兰",
        suggestedPrice: -1,
        riseMax: -1,
        dropMax: -1,
        brand: {
          brandSourceType: 1,
          name: "美素佳儿",
          brandId: -1,
          idPath: ",1012643,",
          brandNamePath: null,
          spBrandId: 1012643
        },
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
          '300005190': {
            id: 0,
            isLeaf: 0,
            spuId: 0,
            attrName: '品牌',
            attrId: 300005190,
            attrType: 1,
            valueList: null,
            categoryId: 200000062,
            templateId: 0,
            isRequired: 1,
            inputType: 3,
            wmPoiId: 0,
            level: 0,
            sequence: 1,
            valueList: [{
              value: '大苹果',
              valueId: 123,
              valueIdPath: null,
              valuePath: null,
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
              }
            ],
            categoryId: 200000062,
            templateId: 0,
            isRequired: 1,
            inputType: 2,
            wmPoiId: 0,
            level: 0,
            sequence: 4
          }
        },
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
            wmPoiId: 0,
            level: 0,
            sequence: 1
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
            stock: 10,
            price: 0,
            upcCode: '',
            spec: '106ml ',
            spuId: null,
            bizValue: null,
            weightUnit: '',
            boxPrice: 0,
            boxNum: 1,
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
            id: 130332025,
            stock: 20,
            price: 0,
            upcCode: '',
            spec: '106ml ',
            spuId: null,
            bizValue: null,
            weightUnit: '',
            boxPrice: 0,
            boxNum: 1,
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
      message: "get SpDetail by ean success"
    },
    code: 0,
    msg: ""
  };
};
