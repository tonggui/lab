/**
 * @url /reuse/sc/product/retail/r/getSpDetailByEan
 */
module.exports = function (req) {
  const ean = req.body.ean
  if (!ean || ean.length < 8) {
    return {
      code: 6001,
      msg: '条码格式有误'
    }
  }
  if (ean === '12345678') {
    return {
      code: 6000
    }
  }
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
        spPicContent: "http://p0.meituan.net/scproduct/dd7d85ad2d2ae798704b46159b2bae10530343.jpg?w=4480&h=2986",
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
          1200000094: {
            sequence: 5,
            level: 0,
            inputType: 1,
            isLeaf: 0,
            templateId: 615,
            categoryId: 200001483,
            wmPoiId: 0,
            spuId: 0,
            attrId: 1200000094,
            valueList: null,
            attrType: 3,
            attrName: "产地",
            isRequired: 2,
            id: 0
          },
          1200000099: {
            sequence: 1,
            level: 0,
            inputType: 2,
            isLeaf: 0,
            templateId: 615,
            categoryId: 200001482,
            wmPoiId: 0,
            spuId: 0,
            attrId: 1200000099,
            valueList: [
              {
                sequence: 0,
                text: "",
                isLeaf: 0,
                valueId: 100000309,
                valueIdPath: null,
                valuePath: null,
                selected: 1,
                value: "万圣节"
              },
              {
                sequence: 0,
                text: "",
                isLeaf: 0,
                valueId: 100000308,
                valueIdPath: null,
                valuePath: null,
                selected: 0,
                value: "光棍节"
              },
              {
                sequence: 0,
                text: "",
                isLeaf: 0,
                valueId: 100000307,
                valueIdPath: null,
                valuePath: null,
                selected: 1,
                value: "清明节"
              },
              {
                sequence: 0,
                text: "",
                isLeaf: 0,
                valueId: 100000306,
                valueIdPath: null,
                valuePath: null,
                selected: 0,
                value: "春节"
              },
              {
                sequence: 0,
                text: "",
                isLeaf: 0,
                valueId: 100000305,
                valueIdPath: null,
                valuePath: null,
                selected: 0,
                value: "中秋节"
              },
              {
                sequence: 0,
                text: "",
                isLeaf: 0,
                valueId: 100000304,
                valueIdPath: null,
                valuePath: null,
                selected: 0,
                value: "父亲节"
              },
              {
                sequence: 0,
                text: "",
                isLeaf: 0,
                valueId: 100000303,
                valueIdPath: null,
                valuePath: null,
                selected: 0,
                value: "母亲节"
              },
              {
                sequence: 0,
                text: "",
                isLeaf: 0,
                valueId: 100000302,
                valueIdPath: null,
                valuePath: null,
                selected: 0,
                value: "感恩节"
              },
              {
                sequence: 0,
                text: "",
                isLeaf: 0,
                valueId: 100000301,
                valueIdPath: null,
                valuePath: null,
                selected: 0,
                value: "白色情人节"
              },
              {
                sequence: 0,
                text: "",
                isLeaf: 0,
                valueId: 100000300,
                valueIdPath: null,
                valuePath: null,
                selected: 0,
                value: "3.8妇女节"
              },
              {
                sequence: 0,
                text: "",
                isLeaf: 0,
                valueId: 100000299,
                valueIdPath: null,
                valuePath: null,
                selected: 1,
                value: "教师节"
              },
              {
                sequence: 0,
                text: "",
                isLeaf: 0,
                valueId: 100000298,
                valueIdPath: null,
                valuePath: null,
                selected: 0,
                value: "圣诞节"
              },
              {
                sequence: 0,
                text: "",
                isLeaf: 0,
                valueId: 100000297,
                valueIdPath: null,
                valuePath: null,
                selected: 0,
                value: "520情人节"
              },
              {
                sequence: 0,
                text: "",
                isLeaf: 0,
                valueId: 100000296,
                valueIdPath: null,
                valuePath: null,
                selected: 0,
                value: "七夕"
              },
              {
                sequence: 0,
                text: "",
                isLeaf: 0,
                valueId: 100000295,
                valueIdPath: null,
                valuePath: null,
                selected: 0,
                value: "情人节"
              }
            ],
            attrType: 3,
            attrName: "适用节日",
            isRequired: 2,
            id: 0
          },
          1200000100: {
            sequence: 2,
            level: 0,
            inputType: 2,
            isLeaf: 0,
            templateId: 615,
            categoryId: 200001482,
            wmPoiId: 0,
            spuId: 0,
            attrId: 1200000100,
            valueList: [
              {
                sequence: 0,
                text: "",
                isLeaf: 0,
                valueId: 100000324,
                valueIdPath: null,
                valuePath: null,
                selected: 0,
                value: "乔迁"
              },
              {
                sequence: 0,
                text: "",
                isLeaf: 0,
                valueId: 100000323,
                valueIdPath: null,
                valuePath: null,
                selected: 0,
                value: "居家"
              },
              {
                sequence: 0,
                text: "",
                isLeaf: 0,
                valueId: 100000322,
                valueIdPath: null,
                valuePath: null,
                selected: 0,
                value: "新生儿礼"
              },
              {
                sequence: 0,
                text: "",
                isLeaf: 0,
                valueId: 100000321,
                valueIdPath: null,
                valuePath: null,
                selected: 0,
                value: "会议"
              },
              {
                sequence: 0,
                text: "",
                isLeaf: 0,
                valueId: 100000320,
                valueIdPath: null,
                valuePath: null,
                selected: 0,
                value: "探望"
              },
              {
                sequence: 0,
                text: "",
                isLeaf: 0,
                valueId: 100000319,
                valueIdPath: null,
                valuePath: null,
                selected: 0,
                value: "婚庆"
              },
              {
                sequence: 0,
                text: "",
                isLeaf: 0,
                valueId: 100000318,
                valueIdPath: null,
                valuePath: null,
                selected: 0,
                value: "道歉"
              },
              {
                sequence: 0,
                text: "",
                isLeaf: 0,
                valueId: 100000317,
                valueIdPath: null,
                valuePath: null,
                selected: 0,
                value: "祭祀/殡葬"
              },
              {
                sequence: 0,
                text: "",
                isLeaf: 0,
                valueId: 100000316,
                valueIdPath: null,
                valuePath: null,
                selected: 0,
                value: "友情"
              },
              {
                sequence: 0,
                text: "",
                isLeaf: 0,
                valueId: 100000315,
                valueIdPath: null,
                valuePath: null,
                selected: 1,
                value: "商务"
              },
              {
                sequence: 0,
                text: "",
                isLeaf: 0,
                valueId: 100000314,
                valueIdPath: null,
                valuePath: null,
                selected: 1,
                value: "周年纪念"
              },
              {
                sequence: 0,
                text: "",
                isLeaf: 0,
                valueId: 100000313,
                valueIdPath: null,
                valuePath: null,
                selected: 0,
                value: "求婚"
              },
              {
                sequence: 0,
                text: "",
                isLeaf: 0,
                valueId: 100000312,
                valueIdPath: null,
                valuePath: null,
                selected: 0,
                value: "祝福"
              },
              {
                sequence: 0,
                text: "",
                isLeaf: 0,
                valueId: 100000311,
                valueIdPath: null,
                valuePath: null,
                selected: 0,
                value: "生日"
              },
              {
                sequence: 0,
                text: "",
                isLeaf: 0,
                valueId: 100000310,
                valueIdPath: null,
                valuePath: null,
                selected: 0,
                value: "爱意表达"
              }
            ],
            attrType: 3,
            attrName: "适用场景",
            isRequired: 2,
            id: 0
          },
          1200000101: {
            sequence: 1,
            level: 0,
            inputType: 2,
            isLeaf: 0,
            templateId: 615,
            categoryId: 200001481,
            wmPoiId: 0,
            spuId: 0,
            attrId: 1200000101,
            valueList: [
              {
                sequence: 0,
                text: "",
                isLeaf: 0,
                valueId: 100000331,
                valueIdPath: null,
                valuePath: null,
                selected: 1,
                value: "儿童"
              },
              {
                sequence: 0,
                text: "",
                isLeaf: 0,
                valueId: 100000330,
                valueIdPath: null,
                valuePath: null,
                selected: 1,
                value: "老师"
              },
              {
                sequence: 0,
                text: "",
                isLeaf: 0,
                valueId: 100000329,
                valueIdPath: null,
                valuePath: null,
                selected: 1,
                value: "病人"
              },
              {
                sequence: 0,
                text: "",
                isLeaf: 0,
                valueId: 100000328,
                valueIdPath: null,
                valuePath: null,
                selected: 0,
                value: "领导/长辈"
              },
              {
                sequence: 0,
                text: "",
                isLeaf: 0,
                valueId: 100000327,
                valueIdPath: null,
                valuePath: null,
                selected: 0,
                value: "客户"
              },
              {
                sequence: 0,
                text: "",
                isLeaf: 0,
                valueId: 100000326,
                valueIdPath: null,
                valuePath: null,
                selected: 0,
                value: "朋友/同事"
              },
              {
                sequence: 0,
                text: "",
                isLeaf: 0,
                valueId: 100000325,
                valueIdPath: null,
                valuePath: null,
                selected: 0,
                value: "爱人"
              }
            ],
            attrType: 3,
            attrName: "适用对象",
            isRequired: 2,
            id: 0
          },
          1200000103: {
            sequence: 4,
            level: 0,
            inputType: 3,
            isLeaf: 0,
            templateId: 615,
            categoryId: 200001483,
            wmPoiId: 0,
            spuId: 0,
            attrId: 1200000103,
            valueList: null,
            attrType: 3,
            attrName: "朵数",
            isRequired: 1,
            id: 0
          },
          1200000104: {
            sequence: 3,
            level: 0,
            inputType: 1,
            isLeaf: 0,
            templateId: 615,
            categoryId: 200001483,
            wmPoiId: 0,
            spuId: 0,
            attrId: 1200000104,
            valueList: [
              {
                sequence: 0,
                text: "",
                isLeaf: 0,
                valueId: 100000444,
                valueIdPath: null,
                valuePath: null,
                selected: 1,
                value: "七彩玫瑰"
              },
              {
                sequence: 0,
                text: "",
                isLeaf: 0,
                valueId: 100000346,
                valueIdPath: null,
                valuePath: null,
                selected: 0,
                value: "非洲菊"
              },
              {
                sequence: 0,
                text: "",
                isLeaf: 0,
                valueId: 100000345,
                valueIdPath: null,
                valuePath: null,
                selected: 0,
                value: "绣球"
              },
              {
                sequence: 0,
                text: "",
                isLeaf: 0,
                valueId: 100000344,
                valueIdPath: null,
                valuePath: null,
                selected: 0,
                value: "郁金香"
              },
              {
                sequence: 0,
                text: "",
                isLeaf: 0,
                valueId: 100000343,
                valueIdPath: null,
                valuePath: null,
                selected: 0,
                value: "雏菊"
              },
              {
                sequence: 0,
                text: "",
                isLeaf: 0,
                valueId: 100000342,
                valueIdPath: null,
                valuePath: null,
                selected: 0,
                value: "蓝色妖姬(蓝玫瑰)"
              },
              {
                sequence: 0,
                text: "",
                isLeaf: 0,
                valueId: 100000341,
                valueIdPath: null,
                valuePath: null,
                selected: 0,
                value: "白玫瑰"
              },
              {
                sequence: 0,
                text: "",
                isLeaf: 0,
                valueId: 100000340,
                valueIdPath: null,
                valuePath: null,
                selected: 0,
                value: "满天星"
              },
              {
                sequence: 0,
                text: "",
                isLeaf: 0,
                valueId: 100000339,
                valueIdPath: null,
                valuePath: null,
                selected: 0,
                value: "进口花"
              },
              {
                sequence: 0,
                text: "",
                isLeaf: 0,
                valueId: 100000338,
                valueIdPath: null,
                valuePath: null,
                selected: 0,
                value: "向日葵"
              },
              {
                sequence: 0,
                text: "",
                isLeaf: 0,
                valueId: 100000337,
                valueIdPath: null,
                valuePath: null,
                selected: 0,
                value: "香槟玫瑰"
              },
              {
                sequence: 0,
                text: "",
                isLeaf: 0,
                valueId: 100000336,
                valueIdPath: null,
                valuePath: null,
                selected: 0,
                value: "粉玫瑰"
              },
              {
                sequence: 0,
                text: "",
                isLeaf: 0,
                valueId: 100000335,
                valueIdPath: null,
                valuePath: null,
                selected: 0,
                value: "康乃馨"
              },
              {
                sequence: 0,
                text: "",
                isLeaf: 0,
                valueId: 100000334,
                valueIdPath: null,
                valuePath: null,
                selected: 0,
                value: "百合"
              },
              {
                sequence: 0,
                text: "",
                isLeaf: 0,
                valueId: 100000333,
                valueIdPath: null,
                valuePath: null,
                selected: 0,
                value: "混搭花束"
              },
              {
                sequence: 0,
                text: "",
                isLeaf: 0,
                valueId: 100000332,
                valueIdPath: null,
                valuePath: null,
                selected: 0,
                value: "红玫瑰"
              }
            ],
            attrType: 1,
            attrName: "主花材",
            isRequired: 1,
            id: 0
          },
          1200000106: {
            sequence: 6,
            level: 0,
            inputType: 1,
            isLeaf: 0,
            templateId: 615,
            categoryId: 200001483,
            wmPoiId: 0,
            spuId: 0,
            attrId: 1200000106,
            valueList: [
              {
                sequence: 0,
                text: "",
                isLeaf: 0,
                valueId: 100000445,
                valueIdPath: null,
                valuePath: null,
                selected: 0,
                value: "网红同款"
              },
              {
                sequence: 0,
                text: "",
                isLeaf: 0,
                valueId: 100000375,
                valueIdPath: null,
                valuePath: null,
                selected: 0,
                value: "高端礼盒"
              },
              {
                sequence: 0,
                text: "",
                isLeaf: 0,
                valueId: 100000372,
                valueIdPath: null,
                valuePath: null,
                selected: 0,
                value: "DIY花材包"
              },
              {
                sequence: 0,
                text: "",
                isLeaf: 0,
                valueId: 100000371,
                valueIdPath: null,
                valuePath: null,
                selected: 0,
                value: "开业花篮"
              },
              {
                sequence: 0,
                text: "",
                isLeaf: 0,
                valueId: 100000370,
                valueIdPath: null,
                valuePath: null,
                selected: 0,
                value: "手提花篮"
              },
              {
                sequence: 0,
                text: "",
                isLeaf: 0,
                valueId: 100000369,
                valueIdPath: null,
                valuePath: null,
                selected: 0,
                value: "瓶花"
              },
              {
                sequence: 0,
                text: "",
                isLeaf: 0,
                valueId: 100000368,
                valueIdPath: null,
                valuePath: null,
                selected: 0,
                value: "玩偶花束"
              },
              {
                sequence: 0,
                text: "",
                isLeaf: 0,
                valueId: 100000367,
                valueIdPath: null,
                valuePath: null,
                selected: 0,
                value: "永生花礼盒"
              },
              {
                sequence: 0,
                text: "",
                isLeaf: 0,
                valueId: 100000366,
                valueIdPath: null,
                valuePath: null,
                selected: 0,
                value: "抱抱桶"
              },
              {
                sequence: 0,
                text: "",
                isLeaf: 0,
                valueId: 100000365,
                valueIdPath: null,
                valuePath: null,
                selected: 0,
                value: "心形花束"
              },
              {
                sequence: 0,
                text: "",
                isLeaf: 0,
                valueId: 100000364,
                valueIdPath: null,
                valuePath: null,
                selected: 0,
                value: "大型花束"
              },
              {
                sequence: 0,
                text: "",
                isLeaf: 0,
                valueId: 100000363,
                valueIdPath: null,
                valuePath: null,
                selected: 0,
                value: "韩式花束"
              },
              {
                sequence: 0,
                text: "",
                isLeaf: 0,
                valueId: 100000362,
                valueIdPath: null,
                valuePath: null,
                selected: 0,
                value: "花盒"
              },
              {
                sequence: 0,
                text: "",
                isLeaf: 0,
                valueId: 100000361,
                valueIdPath: null,
                valuePath: null,
                selected: 1,
                value: "花束"
              }
            ],
            attrType: 3,
            attrName: "款式",
            isRequired: 1,
            id: 0
          }
        },
        // categoryAttrMap: {
        //   '300000028': {
        //     id: 0,
        //     isLeaf: 0,
        //     spuId: 0,
        //     attrName: '大乳品',
        //     attrId: 300000028,
        //     attrType: 3,
        //     valueList: [
        //       {
        //         value: '可口',
        //         valueId: 400002677,
        //         valueIdPath: null,
        //         valuePath: null,
        //         selected: 1,
        //         text: '',
        //         sequence: 0
        //       },
        //       {
        //         value: '酸',
        //         valueId: 400002676,
        //         valueIdPath: null,
        //         valuePath: null,
        //         selected: 0,
        //         text: '',
        //         sequence: 0
        //       },
        //       {
        //         value: '可可否',
        //         valueId: 400000037,
        //         valueIdPath: null,
        //         valuePath: null,
        //         selected: 0,
        //         text: '',
        //         sequence: 0
        //       }
        //     ],
        //     categoryId: 200000062,
        //     templateId: 0,
        //     isRequired: 2,
        //     inputType: 1,
        //     wmPoiId: 0,
        //     level: 0,
        //     sequence: 2
        //   },
        //   '300005190': {
        //     id: 0,
        //     isLeaf: 0,
        //     spuId: 0,
        //     attrName: '品牌',
        //     attrId: 300005190,
        //     attrType: 1,
        //     valueList: null,
        //     categoryId: 200000062,
        //     templateId: 0,
        //     isRequired: 1,
        //     inputType: 3,
        //     wmPoiId: 0,
        //     level: 0,
        //     sequence: 1,
        //     valueList: [{
        //       value: '大苹果',
        //       valueId: 123,
        //       valueIdPath: null,
        //       valuePath: null,
        //       selected: 1,
        //       text: '',
        //       sequence: 0
        //     }]
        //   },
        //   '300005192': {
        //     id: 0,
        //     isLeaf: 0,
        //     spuId: 0,
        //     attrName: 'adfa',
        //     attrId: 300005192,
        //     attrType: 3,
        //     valueList: [
        //       {
        //         value: '6789',
        //         valueId: 400003137,
        //         valueIdPath: null,
        //         valuePath: null,
        //         selected: 1,
        //         text: '',
        //         sequence: 0
        //       },
        //       {
        //         value: '12345',
        //         valueId: 400003136,
        //         valueIdPath: null,
        //         valuePath: null,
        //         selected: 1,
        //         text: '',
        //         sequence: 0
        //       }
        //     ],
        //     categoryId: 200000062,
        //     templateId: 0,
        //     isRequired: 1,
        //     inputType: 2,
        //     wmPoiId: 0,
        //     level: 0,
        //     sequence: 4
        //   }
        // },
        // spuSaleAttrMap: {
        //   '300000029': {
        //     id: 0,
        //     isLeaf: 0,
        //     spuId: 0,
        //     attrName: '颜色1',
        //     attrId: 300000029,
        //     valueList: [
        //       {
        //         value: '红色',
        //         valueId: 0,
        //         valueIdPath: null,
        //         valuePath: null,
        //         selected: 1,
        //         text: null,
        //         sequence: 0,
        //         isCustomized: true,
        //       },
        //       {
        //         value: '白色',
        //         valueId: 1,
        //         valueIdPath: null,
        //         valuePath: null,
        //         selected: 1,
        //         text: '',
        //         sequence: 0
        //       },
        //       {
        //         value: '黄色',
        //         valueId: 2,
        //         valueIdPath: null,
        //         valuePath: null,
        //         selected: 0,
        //         text: '',
        //         sequence: 0
        //       },
        //       {
        //         value: '绿色',
        //         valueId: 3,
        //         valueIdPath: null,
        //         valuePath: null,
        //         selected: 0,
        //         text: '',
        //         sequence: 0
        //       }
        //     ],
        //     categoryId: 0,
        //     templateId: 0,
        //     isRequired: 1,
        //     inputType: 2,
        //     attrType: 2,
        //     wmPoiId: 0,
        //     level: 0,
        //     sequence: 0
        //   },
        //   '300000030': {
        //     id: 1,
        //     isLeaf: 0,
        //     spuId: 1,
        //     attrName: '颜色2',
        //     attrId: 300000030,
        //     valueList: [
        //       {
        //         value: '红色',
        //         valueId: 0,
        //         valueIdPath: null,
        //         valuePath: null,
        //         selected: 1,
        //         text: null,
        //         sequence: 0,
        //         isCustomized: true,
        //       },
        //       {
        //         value: '白色',
        //         valueId: 1,
        //         valueIdPath: null,
        //         valuePath: null,
        //         selected: 1,
        //         text: '',
        //         sequence: 0
        //       },
        //       {
        //         value: '黄色',
        //         valueId: 2,
        //         valueIdPath: null,
        //         valuePath: null,
        //         selected: 0,
        //         text: '',
        //         sequence: 0
        //       },
        //       {
        //         value: '绿色',
        //         valueId: 3,
        //         valueIdPath: null,
        //         valuePath: null,
        //         selected: 0,
        //         text: '',
        //         sequence: 0
        //       }
        //     ],
        //     categoryId: 1,
        //     templateId: 1,
        //     isRequired: 1,
        //     inputType: 2,
        //     attrType: 2,
        //     wmPoiId: 0,
        //     level: 0,
        //     sequence: 1
        //   }
        // },
        spuSaleAttrMap: {
          1200000115: {
            sequence: 7,
            level: 0,
            inputType: 2,
            isLeaf: 0,
            templateId: 615,
            categoryId: 200001483,
            wmPoiId: 0,
            spuId: 0,
            attrId: 1200000115,
            valueList: [
              {
                sequence: 0,
                text: "",
                isLeaf: 0,
                valueId: 100000443,
                valueIdPath: null,
                valuePath: null,
                selected: 0,
                value: "含花瓶"
              },
              {
                sequence: 0,
                text: "",
                isLeaf: 0,
                valueId: 100000442,
                valueIdPath: null,
                valuePath: null,
                selected: 0,
                value: "不含花瓶"
              },
              {
                sequence: 0,
                text: null,
                isLeaf: 0,
                valueId: 0,
                valueIdPath: null,
                valuePath: null,
                selected: 1,
                value: "500g"
              }
            ],
            attrType: 2,
            attrName: "花瓶",
            isRequired: 2,
            id: 0
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
            weight: 10001,
            'weightUnit|1': ['千克(kg)', '毫升(ml)'],
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
    // 'code|1': [0, 6000, 6001, 9102, 9101, 9103],
    code: 0,
    msg: "当前商品的售卖资质缺少资质名称1、资质名称2，请请前往门店资质处上传"
  };
};
