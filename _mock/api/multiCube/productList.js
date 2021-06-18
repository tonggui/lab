const Mockjs = require('mockjs');
/**
 * @url reuse/sc/product/hqcc/cube/r/cubeProductList
 */
let data = [
  {
    "id": 1,
    "name": "后作",
    "tagList": [
      {
        "tagName": "未分类",
        "sequence": 0,
        "tagId": 1
      }
    ],
    "isHqExist" : Math.random() * 10 > 5 ? 0 : 1,
    "relatedPoiIds" : [1,2,3],
    "totalPoiIds" : [1,2,3,4,5,6,7,8,9,10],
    "isSp": 0,
    "spId": "EBF57858-4543-dBe0-AdfB-047fB590D78e",
    "picture": "http://p0.meituan.net/xianfu/8216af051c08df43c7288b6dbabd254194208.jpg",
    "upcCode": "123",
    "monthSale": 1000,
    "sellStatus": 1,
    "spec": "2121",
    "price": 12,
    "unit": "g",
    "weight": 500,
    "weightUnit": "g",
    "suggestedPrice": 100,
    "isExist": 0,

    // "skuAttrs": [
    //   {
    //     "value": "族型次前广称情了发",
    //     "valueId": 0,
    //     "valueIdPath": null,
    //     "valuePath": null,
    //     "sequence": 0,
    //     "isCustomized": true,
    //     "attrId": 300000029
    //   },
    //   {
    //     "value": "低织最儿真还世",
    //     "valueId": 1,
    //     "valueIdPath": null,
    //     "valuePath": null,
    //     "sequence": 0,
    //     "isCustomized": true,
    //     "attrId": 300000030
    //   }
    // ],
    "skus": [
      {
        // "skuAttrs": null,
        "minOrderCount": 1,
        "id": 1,
        "stock": 0,
        "price": 0,
        "upc": "6Be16Eb8-Ebcd-Ccfc-0A8B-2Dce0ed1b8F2",
        "spec": "至火内写厂深在才容众万交质果用还团类代能四技属并成化可发",
        "spuId": null,
        "bizValue": null,
        "weightUnit": "千克(kg)",
        "boxPrice": 0,
        "boxNum": 1,
        "limitStock": 1,
        "itemNum": "",
        "shelfNum": "",
        "skuCode": "aaaaaaa",
        "weight": 106,
        "productName": null,
        "unit": "份",
        "sequence": 0
      },
      {
        "skuAttrs": [
          {
            "value": "族型次前广称情了发",
            "valueId": 0,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000029
          },
          {
            "value": "低织最儿真还世",
            "valueId": 1,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000030
          }
        ],
        "minOrderCount": 1,
        "id": 2,
        "stock": 0,
        "price": 0,
        "upc": "94Bd78fC-881D-E2Bd-f7de-155a525D8D74",
        "spec": "格效法处件时两知积气文",
        "spuId": null,
        "bizValue": null,
        "weightUnit": "千克(kg)",
        "boxPrice": 0,
        "boxNum": 1,
        "limitStock": 1,
        "itemNum": "",
        "shelfNum": "",
        "skuCode": "aaaaaaa",
        "weight": 106,
        "productName": null,
        "unit": "份",
        "sequence": 0
      }
    ],
    "lockStatus": 0,
    "lockTips": "超出经营范围，请申请对应营业资质",
  },
  {
    "id": 0,
    "name": "上装接张叫全在适求部科先决党听六按可得求派度带新气",
    "tagList": [
      {
        "tagName": "未分类",
        "sequence": 0,
        "tagId": 1
      }
    ],
    "isHqExist" : Math.random() * 10 > 5 ? 0 : 1,
    "relatedPoiIds" : [1,3,5],
    "totalPoiIds" : [1,2,3,4,5,6,7,8,9,10],
    "isSp": 2,
    "spId": "Fdc6A2f0-4AB4-973e-9431-87cDB9cA535D",
    "picture": "http://p0.meituan.net/xianfu/5272bfc0a117e2ccea48efc06b79768e67245.jpg",
    "upcCode": "123",
    "monthSale": 1000,
    "sellStatus": 1,
    "skus": [
      {
        "skuAttrs": [
          {
            "value": "族用极到表单期百",
            "valueId": 0,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000029
          },
          {
            "value": "么公改参记装并太及",
            "valueId": 1,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000030
          }
        ],
        "minOrderCount": 1,
        "id": 3,
        "stock": 0,
        "price": 0,
        "upc": "eB9cB102-B6ff-80E7-1423-8aECA1775879",
        "spec": "验约生入合就江并学验科方量",
        "spuId": null,
        "bizValue": null,
        "weightUnit": "千克(kg)",
        "boxPrice": 0,
        "boxNum": 1,
        "limitStock": 1,
        "itemNum": "",
        "shelfNum": "",
        "skuCode": "aaaaaaa",
        "weight": 106,
        "productName": null,
        "unit": "份",
        "sequence": 0
      },
      {
        "skuAttrs": [
          {
            "value": "么长油群容合效",
            "valueId": 0,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000029
          },
          {
            "value": "东林支电取照你性积",
            "valueId": 1,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000030
          }
        ],
        "minOrderCount": 1,
        "id": 4,
        "stock": 0,
        "price": 0,
        "upc": "B7A5fdd4-bD9b-cA41-fFBE-111BFC55F58D",
        "spec": "队派酸同山团接几算般干红百究团众下说文意",
        "spuId": null,
        "bizValue": null,
        "weightUnit": "千克(kg)",
        "boxPrice": 0,
        "boxNum": 1,
        "limitStock": 1,
        "itemNum": "",
        "shelfNum": "",
        "skuCode": "aaaaaaa",
        "weight": 106,
        "productName": null,
        "unit": "份",
        "sequence": 0
      }
    ],
    "lockStatus": 9102,
    "lockTips": "售卖当前商品需要【资质XX，资质XX，资质XX...】, 请上传资质，审核通过后方可售卖"
  },
  {
    "id": 0,
    "name": "都么劳清和月毛今只林的感从业那种低上将路管自段状",
    "tagList": [
      {
        // "tagName": "测试分类1",
        // "sequence": 2,
        // "tagId": 2
      }
    ],
    "isSp": 1,
    "isHqExist" : Math.random() * 10 > 5 ? 0 : 1,
    "relatedPoiIds" : [1,2,4],
    "totalPoiIds" : [1,2,3,4],
    "spId": "DC1D4eb1-eEF6-Ca99-ccBc-babAeCBbDDfd",
    "picture": "http://p0.meituan.net/xianfu/5272bfc0a117e2ccea48efc06b79768e67245.jpg",
    "upcCode": "123",
    "monthSale": 1000,
    "sellStatus": 1,
    "skus": [
      {
        "skuAttrs": null,
        "minOrderCount": 1,
        "id": 5,
        "stock": 0,
        "price": 0,
        "upc": "1982De56-f69b-fFFd-735b-E8c3FcD283E6",
        "spec": "需点安层油队民去看儿并系",
        "spuId": null,
        "bizValue": null,
        "weightUnit": "千克(kg)",
        "boxPrice": 0,
        "boxNum": 1,
        "limitStock": 1,
        "itemNum": "",
        "shelfNum": "",
        "skuCode": "aaaaaaa",
        "weight": 106,
        "productName": null,
        "unit": "份",
        "sequence": 0
      },
      {
        "skuAttrs": null,
        "minOrderCount": 1,
        "id": 6,
        "stock": 0,
        "price": 0,
        "upc": "46D2f4eA-fa4f-2137-Cb0A-C4b311874dCb",
        "spec": "斯化交完业些今作系同等反接指与层果里起",
        "spuId": null,
        "bizValue": null,
        "weightUnit": "千克(kg)",
        "boxPrice": 0,
        "boxNum": 1,
        "limitStock": 1,
        "itemNum": "",
        "shelfNum": "",
        "skuCode": "aaaaaaa",
        "weight": 106,
        "productName": null,
        "unit": "份",
        "sequence": 0
      }
    ]
  },
  {
    "id": 3,
    "name": "许劳道住件达必离备儿斯没出际较儿在八",
    "tagList": [
      {
        "tagName": "未分类",
        "sequence": 0,
        "tagId": 1
      },
      {
        "tagName": "测试分类1",
        "sequence": 2,
        "tagId": 2
      }
    ],
    "isSp": 2,
    "isHqExist" : Math.random() * 10 > 5 ? 0 : 1,
    "relatedPoiIds" : [1,2,4],
    "totalPoiIds" : [1,2,3,4,5,8,7],
    "spId": "F09F63e8-e4e7-bAF5-daBD-65776dB50e11",
    "picture": "http://p0.meituan.net/xianfu/8216af051c08df43c7288b6dbabd254194208.jpg",
    "upcCode": "123",
    "monthSale": 1000,
    "sellStatus": 1,
    "skus": [
      {
        "skuAttrs": null,
        "minOrderCount": 1,
        "id": 7,
        "stock": 0,
        "price": 0,
        "upc": "f94b3D02-B9B6-e6CE-f2db-FF685DaA7f4b",
        "spec": "际色年同起写白济程一必物把道认信并目反我七省具",
        "spuId": null,
        "bizValue": null,
        "weightUnit": "千克(kg)",
        "boxPrice": 0,
        "boxNum": 1,
        "limitStock": 1,
        "itemNum": "",
        "shelfNum": "",
        "skuCode": "aaaaaaa",
        "weight": 106,
        "productName": null,
        "unit": "份",
        "sequence": 0
      },
      {
        "skuAttrs": [
          {
            "value": "术状四由验上种其",
            "valueId": 0,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000029
          },
          {
            "value": "规始商验则土",
            "valueId": 1,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000030
          }
        ],
        "minOrderCount": 1,
        "id": 8,
        "stock": 0,
        "price": 0,
        "upc": "BA92e99b-7a49-1A16-E8bF-43FD2bFcec9D",
        "spec": "却入林制铁难候地个传六把百大农构华论美",
        "spuId": null,
        "bizValue": null,
        "weightUnit": "千克(kg)",
        "boxPrice": 0,
        "boxNum": 1,
        "limitStock": 1,
        "itemNum": "",
        "shelfNum": "",
        "skuCode": "aaaaaaa",
        "weight": 106,
        "productName": null,
        "unit": "份",
        "sequence": 0
      }
    ]
  },
  {
    "id": 4,
    "name": "件工维满许理第将眼局才亲",
    "tagList": [
      {
        "tagName": "测试分类1",
        "sequence": 2,
        "tagId": 2
      },
      {
        "tagName": "测试分类2",
        "sequence": 3
      }
    ],
    "isSp": 1,
    "isHqExist" : Math.random() * 10 > 5 ? 0 : 1,
    "relatedPoiIds" : [1,2,4],
    "totalPoiIds" : [1,2,3,4,9,8,6],
    "spId": "c3Ac23BE-fe2B-bd6C-30B6-F860fBee20BA",
    "picture": "http://p0.meituan.net/xianfu/6d593a6582f4a31e1b51c670634c4a32131072.jpg",
    "upcCode": "123",
    "monthSale": 1000,
    "sellStatus": 1,
    "skus": [
      {
        "skuAttrs": [
          {
            "value": "离土么示队连",
            "valueId": 0,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000029
          },
          {
            "value": "声志照特那分改气王",
            "valueId": 1,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000030
          }
        ],
        "minOrderCount": 1,
        "id": 9,
        "stock": 0,
        "price": 0,
        "upc": "7DFeD670-966c-AabD-E25A-fadC5DF5A34f",
        "spec": "选快研受在油众都至没标名般除许斗都往数意无土命开",
        "spuId": null,
        "bizValue": null,
        "weightUnit": "千克(kg)",
        "boxPrice": 0,
        "boxNum": 1,
        "limitStock": 1,
        "itemNum": "",
        "shelfNum": "",
        "skuCode": "aaaaaaa",
        "weight": 106,
        "productName": null,
        "unit": "份",
        "sequence": 0
      },
      {
        "skuAttrs": [
          {
            "value": "身级只文题争级",
            "valueId": 0,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000029
          },
          {
            "value": "至空步达取育党其",
            "valueId": 1,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000030
          }
        ],
        "minOrderCount": 1,
        "id": 10,
        "stock": 0,
        "price": 0,
        "upc": "76A55f6E-bfFf-E8eA-2B93-ab68FA5f1E01",
        "spec": "名查间现下满只又至件效府式交万代质计比向道土",
        "spuId": null,
        "bizValue": null,
        "weightUnit": "千克(kg)",
        "boxPrice": 0,
        "boxNum": 1,
        "limitStock": 1,
        "itemNum": "",
        "shelfNum": "",
        "skuCode": "aaaaaaa",
        "weight": 106,
        "productName": null,
        "unit": "份",
        "sequence": 0
      },
      {
        "skuAttrs": [
          {
            "value": "下价见科约难到毛",
            "valueId": 0,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000029
          },
          {
            "value": "手构战亲影度音重采白",
            "valueId": 1,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000030
          }
        ],
        "minOrderCount": 1,
        "id": 11,
        "stock": 0,
        "price": 0,
        "upc": "782311Ee-aDDD-0dcF-1FbA-0e8A336ccc37",
        "spec": "任设阶务党别新参感道再商实回没适高消由战",
        "spuId": null,
        "bizValue": null,
        "weightUnit": "千克(kg)",
        "boxPrice": 0,
        "boxNum": 1,
        "limitStock": 1,
        "itemNum": "",
        "shelfNum": "",
        "skuCode": "aaaaaaa",
        "weight": 106,
        "productName": null,
        "unit": "份",
        "sequence": 0
      }
    ]
  },
  {
    "id": 0,
    "name": "第音们例流群受题较反厂科文热把改地华率长间火高置是程设",
    "tagList": [
      {
        "tagName": "未分类",
        "sequence": 0,
        "tagId": 1
      },
      {
        "tagName": "测试分类2",
        "sequence": 3
      }
    ],
    "isSp": 2,
    "spId": "Ed71Cd58-e1D4-ADDc-Af4B-CB3BDE8eA092",
    "picture": "http://p0.meituan.net/xianfu/8216af051c08df43c7288b6dbabd254194208.jpg",
    "upcCode": "123",
    "monthSale": 1000,
    "sellStatus": 1,
    "skus": [
      {
        "skuAttrs": [
          {
            "value": "么层传直物世际其习",
            "valueId": 0,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000029
          },
          {
            "value": "众响保年统六原先何",
            "valueId": 1,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000030
          }
        ],
        "minOrderCount": 1,
        "id": 12,
        "stock": 0,
        "price": 0,
        "upc": "35DCCf7e-ec66-eAfB-bC2C-dA9FC4eB837C",
        "spec": "那西分相过经现广管细理育具造志机开合难层众养道",
        "spuId": null,
        "bizValue": null,
        "weightUnit": "千克(kg)",
        "boxPrice": 0,
        "boxNum": 1,
        "limitStock": 1,
        "itemNum": "",
        "shelfNum": "",
        "skuCode": "aaaaaaa",
        "weight": 106,
        "productName": null,
        "unit": "份",
        "sequence": 0
      },
      {
        "skuAttrs": null,
        "minOrderCount": 1,
        "id": 13,
        "stock": 0,
        "price": 0,
        "upc": "44EEc19d-70CE-Ed86-F5fe-cdF2613D0Df4",
        "spec": "步容如根可之器影心持外向接深形发命节你天是",
        "spuId": null,
        "bizValue": null,
        "weightUnit": "千克(kg)",
        "boxPrice": 0,
        "boxNum": 1,
        "limitStock": 1,
        "itemNum": "",
        "shelfNum": "",
        "skuCode": "aaaaaaa",
        "weight": 106,
        "productName": null,
        "unit": "份",
        "sequence": 0
      },
      {
        "skuAttrs": null,
        "minOrderCount": 1,
        "id": 14,
        "stock": 0,
        "price": 0,
        "upc": "b1ecd19f-B36E-3cAf-6fA0-575c692ccAF8",
        "spec": "才段领指度意规王书七话料识派导清就亲更办时部色今",
        "spuId": null,
        "bizValue": null,
        "weightUnit": "千克(kg)",
        "boxPrice": 0,
        "boxNum": 1,
        "limitStock": 1,
        "itemNum": "",
        "shelfNum": "",
        "skuCode": "aaaaaaa",
        "weight": 106,
        "productName": null,
        "unit": "份",
        "sequence": 0
      }
    ]
  },
  {
    "id": 0,
    "name": "己边决石公究行化压列红气外给一却专",
    "tagList": [
      {
        "tagName": "未分类",
        "sequence": 0,
        "tagId": 1
      },
      {
        "tagName": "测试分类2",
        "sequence": 3
      }
    ],
    "isSp": 1,
    "spId": "6E7A9E89-d782-Bbbe-EdcA-46D6e5488FA3",
    "picture": "http://p0.meituan.net/xianfu/8216af051c08df43c7288b6dbabd254194208.jpg",
    "upcCode": "123",
    "monthSale": 1000,
    "sellStatus": 1,
    "skus": [
      {
        "skuAttrs": [
          {
            "value": "至经子所交设八",
            "valueId": 0,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000029
          },
          {
            "value": "专使由小布须式更平",
            "valueId": 1,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000030
          }
        ],
        "minOrderCount": 1,
        "id": 15,
        "stock": 0,
        "price": 0,
        "upc": "E2f3EB2f-8BDC-8E59-2378-52Cb910c748f",
        "spec": "世许为斯保给近格指社果回电件分学程同",
        "spuId": null,
        "bizValue": null,
        "weightUnit": "千克(kg)",
        "boxPrice": 0,
        "boxNum": 1,
        "limitStock": 1,
        "itemNum": "",
        "shelfNum": "",
        "skuCode": "aaaaaaa",
        "weight": 106,
        "productName": null,
        "unit": "份",
        "sequence": 0
      }
    ]
  },
  {
    "id": 7,
    "name": "百做火己的等空深点单细低事京广海到间集干当非成科",
    "tagList": [
      {
        "tagName": "测试分类1",
        "sequence": 2,
        "tagId": 2
      }
    ],
    "isSp": 2,
    "spId": "eCEa5cdd-e10f-d7C4-48Bf-41C6Eca3aEc6",
    "picture": "http://p0.meituan.net/xianfu/5272bfc0a117e2ccea48efc06b79768e67245.jpg",
    "upcCode": "123",
    "monthSale": 1000,
    "sellStatus": 1,
    "skus": [
      {
        "skuAttrs": [
          {
            "value": "料线意精往标相下设",
            "valueId": 0,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000029
          },
          {
            "value": "整成写参需外示",
            "valueId": 1,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000030
          }
        ],
        "minOrderCount": 1,
        "id": 16,
        "stock": 0,
        "price": 0,
        "upc": "01fC9842-e6DE-E9ed-28c3-5CcAe6dB354C",
        "spec": "整情必标广严较定治展容织断列",
        "spuId": null,
        "bizValue": null,
        "weightUnit": "千克(kg)",
        "boxPrice": 0,
        "boxNum": 1,
        "limitStock": 1,
        "itemNum": "",
        "shelfNum": "",
        "skuCode": "aaaaaaa",
        "weight": 106,
        "productName": null,
        "unit": "份",
        "sequence": 0
      },
      {
        "skuAttrs": [
          {
            "value": "传历外报类象局亲",
            "valueId": 0,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000029
          },
          {
            "value": "越年想无道比元",
            "valueId": 1,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000030
          }
        ],
        "minOrderCount": 1,
        "id": 17,
        "stock": 0,
        "price": 0,
        "upc": "9fe06cCe-001F-d9eE-92dE-C9f36d46df8a",
        "spec": "加者斯入相第和斯国运级",
        "spuId": null,
        "bizValue": null,
        "weightUnit": "千克(kg)",
        "boxPrice": 0,
        "boxNum": 1,
        "limitStock": 1,
        "itemNum": "",
        "shelfNum": "",
        "skuCode": "aaaaaaa",
        "weight": 106,
        "productName": null,
        "unit": "份",
        "sequence": 0
      },
      {
        "skuAttrs": [
          {
            "value": "前法儿思军国红",
            "valueId": 0,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000029
          },
          {
            "value": "太求称包委参任少克",
            "valueId": 1,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000030
          }
        ],
        "minOrderCount": 1,
        "id": 18,
        "stock": 0,
        "price": 0,
        "upc": "ae13Db3C-2013-b184-19dF-DEc4AbaFcaef",
        "spec": "算人消半张团划济器走许或率间律",
        "spuId": null,
        "bizValue": null,
        "weightUnit": "千克(kg)",
        "boxPrice": 0,
        "boxNum": 1,
        "limitStock": 1,
        "itemNum": "",
        "shelfNum": "",
        "skuCode": "aaaaaaa",
        "weight": 106,
        "productName": null,
        "unit": "份",
        "sequence": 0
      }
    ]
  },
  {
    "id": 8,
    "name": "出手七本真片识格后院整三族越广叫东品究海极里教将为",
    "tagList": [
      {
        "tagName": "测试分类1",
        "sequence": 2,
        "tagId": 2
      }
    ],
    "isSp": 1,
    "spId": "9Abbf8eb-684f-8eD2-ad7C-4790BeCbCdBA",
    "picture": "http://p0.meituan.net/xianfu/8216af051c08df43c7288b6dbabd254194208.jpg",
    "upcCode": "123",
    "monthSale": 1000,
    "sellStatus": 1,
    "skus": [
      {
        "skuAttrs": [
          {
            "value": "天回断素统感段内青",
            "valueId": 0,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000029
          },
          {
            "value": "决比事府节是分两市",
            "valueId": 1,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000030
          }
        ],
        "minOrderCount": 1,
        "id": 19,
        "stock": 0,
        "price": 0,
        "upc": "6C45B8D2-7bbE-a94A-EDA9-483BCA7cF75a",
        "spec": "好究基特着江那段表全更月变传压争门头感九广查",
        "spuId": null,
        "bizValue": null,
        "weightUnit": "千克(kg)",
        "boxPrice": 0,
        "boxNum": 1,
        "limitStock": 1,
        "itemNum": "",
        "shelfNum": "",
        "skuCode": "aaaaaaa",
        "weight": 106,
        "productName": null,
        "unit": "份",
        "sequence": 0
      },
      {
        "skuAttrs": [
          {
            "value": "民生声工型道组白一",
            "valueId": 0,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000029
          },
          {
            "value": "改族原都集争亲热",
            "valueId": 1,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000030
          }
        ],
        "minOrderCount": 1,
        "id": 20,
        "stock": 0,
        "price": 0,
        "upc": "aFD3dBFB-B9AF-0869-44EE-4DE7694f473D",
        "spec": "准取题目平积世专明经过",
        "spuId": null,
        "bizValue": null,
        "weightUnit": "千克(kg)",
        "boxPrice": 0,
        "boxNum": 1,
        "limitStock": 1,
        "itemNum": "",
        "shelfNum": "",
        "skuCode": "aaaaaaa",
        "weight": 106,
        "productName": null,
        "unit": "份",
        "sequence": 0
      }
    ]
  },
  {
    "id": 0,
    "name": "去利严太万交年验带参产进构少标数无议克办每节今白示",
    "tagList": [
      {
        "tagName": "测试分类1",
        "sequence": 2,
        "tagId": 2
      }
    ],
    "isSp": 2,
    "spId": "2cb42EDF-365A-FfBD-cce4-3bB869bB28BF",
    "picture": "http://p0.meituan.net/xianfu/8216af051c08df43c7288b6dbabd254194208.jpg",
    "upcCode": "123",
    "monthSale": 1000,
    "sellStatus": 1,
    "skus": [
      {
        "skuAttrs": [
          {
            "value": "家合约出式着果省员",
            "valueId": 0,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000029
          },
          {
            "value": "领成资层北质元体口连",
            "valueId": 1,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000030
          }
        ],
        "minOrderCount": 1,
        "id": 21,
        "stock": 0,
        "price": 0,
        "upc": "23FAdd75-FAfe-c2BB-EAEB-A6302F1081fe",
        "spec": "民容查机必能现示十头土走多求身厂济而次华常性事复",
        "spuId": null,
        "bizValue": null,
        "weightUnit": "千克(kg)",
        "boxPrice": 0,
        "boxNum": 1,
        "limitStock": 1,
        "itemNum": "",
        "shelfNum": "",
        "skuCode": "aaaaaaa",
        "weight": 106,
        "productName": null,
        "unit": "份",
        "sequence": 0
      },
      {
        "skuAttrs": [
          {
            "value": "回太毛车学情记",
            "valueId": 0,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000029
          },
          {
            "value": "我叫际且同选反他收",
            "valueId": 1,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000030
          }
        ],
        "minOrderCount": 1,
        "id": 22,
        "stock": 0,
        "price": 0,
        "upc": "eE99275F-8F19-D444-1Cb8-A32AFeB6B3DC",
        "spec": "清百放志电快海种知质数火色",
        "spuId": null,
        "bizValue": null,
        "weightUnit": "千克(kg)",
        "boxPrice": 0,
        "boxNum": 1,
        "limitStock": 1,
        "itemNum": "",
        "shelfNum": "",
        "skuCode": "aaaaaaa",
        "weight": 106,
        "productName": null,
        "unit": "份",
        "sequence": 0
      }
    ]
  },
  {
    "id": 0,
    "name": "以相儿各毛资里每结每白期示难",
    "tagList": [
      {
        "tagName": "测试分类1",
        "sequence": 2,
        "tagId": 2
      }
    ],
    "isSp": 1,
    "spId": "9172F152-aEdC-E2e6-EA53-5F57AaACbb82",
    "picture": "http://p0.meituan.net/xianfu/8216af051c08df43c7288b6dbabd254194208.jpg",
    "upcCode": "123",
    "monthSale": 1000,
    "sellStatus": 1,
    "skus": [
      {
        "skuAttrs": null,
        "minOrderCount": 1,
        "id": 23,
        "stock": 0,
        "price": 0,
        "upc": "585CfC53-712e-183e-b9cd-Ff5DEcf06BAB",
        "spec": "例龙政该济二叫热温系且她物都基海那强火完情三每万",
        "spuId": null,
        "bizValue": null,
        "weightUnit": "千克(kg)",
        "boxPrice": 0,
        "boxNum": 1,
        "limitStock": 1,
        "itemNum": "",
        "shelfNum": "",
        "skuCode": "aaaaaaa",
        "weight": 106,
        "productName": null,
        "unit": "份",
        "sequence": 0
      },
      {
        "skuAttrs": [
          {
            "value": "价去制很变设工米花",
            "valueId": 0,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000029
          },
          {
            "value": "江研论复住现片",
            "valueId": 1,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000030
          }
        ],
        "minOrderCount": 1,
        "id": 24,
        "stock": 0,
        "price": 0,
        "upc": "d491dEfD-97C9-0DE3-1Aa7-fF98DaEBF1F4",
        "spec": "群统色条改须解片包队要自热领白条到便约格构影热海",
        "spuId": null,
        "bizValue": null,
        "weightUnit": "千克(kg)",
        "boxPrice": 0,
        "boxNum": 1,
        "limitStock": 1,
        "itemNum": "",
        "shelfNum": "",
        "skuCode": "aaaaaaa",
        "weight": 106,
        "productName": null,
        "unit": "份",
        "sequence": 0
      }
    ]
  },
  {
    "id": 0,
    "name": "连联什半派花果事道度手造在好也界金任最织按酸效候内相质结",
    "tagList": [
      {
        "tagName": "测试分类1",
        "sequence": 2,
        "tagId": 2
      }
    ],
    "isSp": 2,
    "spId": "71328e4d-c13a-1FEE-dd39-89ACCf3dDFaB",
    "picture": "http://p0.meituan.net/xianfu/8216af051c08df43c7288b6dbabd254194208.jpg",
    "upcCode": "123",
    "monthSale": 1000,
    "sellStatus": 1,
    "skus": [
      {
        "skuAttrs": [
          {
            "value": "改子连斯除元毛",
            "valueId": 0,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000029
          },
          {
            "value": "族养传业细决火南四",
            "valueId": 1,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000030
          }
        ],
        "minOrderCount": 1,
        "id": 25,
        "stock": 0,
        "price": 0,
        "upc": "a338dBf4-CbF8-91A4-2717-D23Dd960d747",
        "spec": "美王专达西活次叫军等专维温书低持民千想采队手质复图放条三还",
        "spuId": null,
        "bizValue": null,
        "weightUnit": "千克(kg)",
        "boxPrice": 0,
        "boxNum": 1,
        "limitStock": 1,
        "itemNum": "",
        "shelfNum": "",
        "skuCode": "aaaaaaa",
        "weight": 106,
        "productName": null,
        "unit": "份",
        "sequence": 0
      },
      {
        "skuAttrs": null,
        "minOrderCount": 1,
        "id": 26,
        "stock": 0,
        "price": 0,
        "upc": "F1bD0bEd-Fbb4-212A-95cc-BedE9E988CB9",
        "spec": "产称资里每性状造水口上建候所如",
        "spuId": null,
        "bizValue": null,
        "weightUnit": "千克(kg)",
        "boxPrice": 0,
        "boxNum": 1,
        "limitStock": 1,
        "itemNum": "",
        "shelfNum": "",
        "skuCode": "aaaaaaa",
        "weight": 106,
        "productName": null,
        "unit": "份",
        "sequence": 0
      }
    ]
  },
  {
    "id": 0,
    "name": "区深相压以转后工反按角广美同关信断数边商相本展",
    "tagList": [
      {
        "tagName": "未分类",
        "sequence": 0,
        "tagId": 1
      }
    ],
    "isSp": 1,
    "spId": "5beAC7D2-68fc-fD15-266B-5b88D9627c71",
    "picture": "http://p0.meituan.net/xianfu/701a8e89aef8e791b8ac7436675fafa3393216.jpg",
    "upcCode": "123",
    "monthSale": 1000,
    "sellStatus": 1,
    "skus": [
      {
        "skuAttrs": [
          {
            "value": "得交育知次调就观",
            "valueId": 0,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000029
          },
          {
            "value": "步务法每所是",
            "valueId": 1,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000030
          }
        ],
        "minOrderCount": 1,
        "id": 27,
        "stock": 0,
        "price": 0,
        "upc": "7Bb129db-DBed-C2C6-dDCc-6DDd9bfBd4FB",
        "spec": "气矿业所影办该认与求治",
        "spuId": null,
        "bizValue": null,
        "weightUnit": "千克(kg)",
        "boxPrice": 0,
        "boxNum": 1,
        "limitStock": 1,
        "itemNum": "",
        "shelfNum": "",
        "skuCode": "aaaaaaa",
        "weight": 106,
        "productName": null,
        "unit": "份",
        "sequence": 0
      }
    ]
  },
  {
    "id": 13,
    "name": "最资至事细民称真格照里布习子市律第南级生有了三因算",
    "tagList": [
      {
        "tagName": "未分类",
        "sequence": 0,
        "tagId": 1
      }
    ],
    "isSp": 2,
    "spId": "6CdeFB72-BDFC-cCEb-D489-7bE29f1AF5F4",
    "picture": "http://p0.meituan.net/xianfu/701a8e89aef8e791b8ac7436675fafa3393216.jpg",
    "upcCode": "123",
    "monthSale": 1000,
    "sellStatus": 1,
    "skus": [
      {
        "skuAttrs": null,
        "minOrderCount": 1,
        "id": 28,
        "stock": 0,
        "price": 0,
        "upc": "5Cc5cEDf-Df1E-7AEC-d93F-7BdBd49C2b9A",
        "spec": "调问周也至厂矿也消常况与历号片东",
        "spuId": null,
        "bizValue": null,
        "weightUnit": "千克(kg)",
        "boxPrice": 0,
        "boxNum": 1,
        "limitStock": 1,
        "itemNum": "",
        "shelfNum": "",
        "skuCode": "aaaaaaa",
        "weight": 106,
        "productName": null,
        "unit": "份",
        "sequence": 0
      }
    ]
  },
  {
    "id": 14,
    "name": "走务用家七引平将手她进角",
    "tagList": [
      {
        "tagName": "未分类",
        "sequence": 0,
        "tagId": 1
      }
    ],
    "isSp": 1,
    "spId": "EBF76fcB-432C-ABFF-7813-779d9D982e22",
    "picture": "http://p0.meituan.net/xianfu/5272bfc0a117e2ccea48efc06b79768e67245.jpg",
    "upcCode": "123",
    "monthSale": 1000,
    "sellStatus": 1,
    "skus": [
      {
        "skuAttrs": null,
        "minOrderCount": 1,
        "id": 29,
        "stock": 0,
        "price": 0,
        "upc": "B6d1EE04-4E78-FbDd-33Db-Ff4DBe57Cb6B",
        "spec": "究较持党称联间后王别原北手引电位消制行采",
        "spuId": null,
        "bizValue": null,
        "weightUnit": "千克(kg)",
        "boxPrice": 0,
        "boxNum": 1,
        "limitStock": 1,
        "itemNum": "",
        "shelfNum": "",
        "skuCode": "aaaaaaa",
        "weight": 106,
        "productName": null,
        "unit": "份",
        "sequence": 0
      },
      {
        "skuAttrs": null,
        "minOrderCount": 1,
        "id": 30,
        "stock": 0,
        "price": 0,
        "upc": "a9ef73dA-06bC-B4F4-cb49-1EFE00A1f154",
        "spec": "决场方便口办色单热新小县流东化电认要置众分西电",
        "spuId": null,
        "bizValue": null,
        "weightUnit": "千克(kg)",
        "boxPrice": 0,
        "boxNum": 1,
        "limitStock": 1,
        "itemNum": "",
        "shelfNum": "",
        "skuCode": "aaaaaaa",
        "weight": 106,
        "productName": null,
        "unit": "份",
        "sequence": 0
      },
      {
        "skuAttrs": [
          {
            "value": "但强石己界人斯",
            "valueId": 0,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000029
          },
          {
            "value": "着放识机路斗酸例着",
            "valueId": 1,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000030
          }
        ],
        "minOrderCount": 1,
        "id": 31,
        "stock": 0,
        "price": 0,
        "upc": "6ecfB6F8-A77F-Cbf9-6cEd-f1BBEf5Fec57",
        "spec": "信为书部数专情育改也现安八确六象都况京员行定无解第满战西",
        "spuId": null,
        "bizValue": null,
        "weightUnit": "千克(kg)",
        "boxPrice": 0,
        "boxNum": 1,
        "limitStock": 1,
        "itemNum": "",
        "shelfNum": "",
        "skuCode": "aaaaaaa",
        "weight": 106,
        "productName": null,
        "unit": "份",
        "sequence": 0
      }
    ]
  },
  {
    "id": 15,
    "name": "图成军件条间市间飞再",
    "tagList": [
      {
        "tagName": "测试分类1",
        "sequence": 2,
        "tagId": 2
      }
    ],
    "isSp": 2,
    "spId": "eBF2Ba2e-2C9b-0E1A-ABc4-db23a6949c8f",
    "picture": "http://p0.meituan.net/xianfu/8216af051c08df43c7288b6dbabd254194208.jpg",
    "upcCode": "123",
    "monthSale": 1000,
    "sellStatus": 1,
    "skus": [
      {
        "skuAttrs": null,
        "minOrderCount": 1,
        "id": 32,
        "stock": 0,
        "price": 0,
        "upc": "2FcaE7AA-6322-D2E4-8d7A-fEab59E57F7c",
        "spec": "整要影在线取影示老达什度层关革即就管农史",
        "spuId": null,
        "bizValue": null,
        "weightUnit": "千克(kg)",
        "boxPrice": 0,
        "boxNum": 1,
        "limitStock": 1,
        "itemNum": "",
        "shelfNum": "",
        "skuCode": "aaaaaaa",
        "weight": 106,
        "productName": null,
        "unit": "份",
        "sequence": 0
      }
    ]
  },
  {
    "id": 16,
    "name": "我反术安照集石果交了运先院革对人收切专革利太品约光通难",
    "tagList": [
      {
        "tagName": "未分类",
        "sequence": 0,
        "tagId": 1
      }
    ],
    "isSp": 1,
    "spId": "A5637695-1aEf-AFDc-b497-e799AAA8eF8E",
    "picture": "http://p0.meituan.net/xianfu/6d593a6582f4a31e1b51c670634c4a32131072.jpg",
    "upcCode": "123",
    "monthSale": 1000,
    "sellStatus": 1,
    "skus": [
      {
        "skuAttrs": null,
        "minOrderCount": 1,
        "id": 33,
        "stock": 0,
        "price": 0,
        "upc": "9E0d9935-d1db-BAcC-45CE-e4AFfdcF2BD2",
        "spec": "作更活石龙习更使道究学同劳被世酸点器头或光支性心专变感府",
        "spuId": null,
        "bizValue": null,
        "weightUnit": "千克(kg)",
        "boxPrice": 0,
        "boxNum": 1,
        "limitStock": 1,
        "itemNum": "",
        "shelfNum": "",
        "skuCode": "aaaaaaa",
        "weight": 106,
        "productName": null,
        "unit": "份",
        "sequence": 0
      },
      {
        "skuAttrs": null,
        "minOrderCount": 1,
        "id": 34,
        "stock": 0,
        "price": 0,
        "upc": "a1b47cAf-a28D-e8DA-eDFC-34FD0FaA1Bdc",
        "spec": "你常权思表发子精好计儿",
        "spuId": null,
        "bizValue": null,
        "weightUnit": "千克(kg)",
        "boxPrice": 0,
        "boxNum": 1,
        "limitStock": 1,
        "itemNum": "",
        "shelfNum": "",
        "skuCode": "aaaaaaa",
        "weight": 106,
        "productName": null,
        "unit": "份",
        "sequence": 0
      }
    ]
  },
  {
    "id": 17,
    "name": "直团转示变制管料想术联段或石要形历导通国社称",
    "tagList": [
      {
        "tagName": "未分类",
        "sequence": 0,
        "tagId": 1
      }
    ],
    "isSp": 2,
    "spId": "be0201cd-F9D8-F186-cA2c-Ec9d55c65b2c",
    "picture": "http://p0.meituan.net/xianfu/5272bfc0a117e2ccea48efc06b79768e67245.jpg",
    "upcCode": "123",
    "monthSale": 1000,
    "sellStatus": 1,
    "skus": [
      {
        "skuAttrs": [
          {
            "value": "法列目日色发非",
            "valueId": 0,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000029
          },
          {
            "value": "如增合争己做看验次新",
            "valueId": 1,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000030
          }
        ],
        "minOrderCount": 1,
        "id": 35,
        "stock": 0,
        "price": 0,
        "upc": "D2D1CA1f-21d8-5Eb8-b8C3-ecF0E49cd76A",
        "spec": "电市合织象列信长难得进我它深别于火最划关式西识见率事务比",
        "spuId": null,
        "bizValue": null,
        "weightUnit": "千克(kg)",
        "boxPrice": 0,
        "boxNum": 1,
        "limitStock": 1,
        "itemNum": "",
        "shelfNum": "",
        "skuCode": "aaaaaaa",
        "weight": 106,
        "productName": null,
        "unit": "份",
        "sequence": 0
      },
      {
        "skuAttrs": [
          {
            "value": "利南通东是组江素",
            "valueId": 0,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000029
          },
          {
            "value": "一只展很业达论",
            "valueId": 1,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000030
          }
        ],
        "minOrderCount": 1,
        "id": 36,
        "stock": 0,
        "price": 0,
        "upc": "7A6cb54E-C54a-6C22-3DcE-b452acecE21b",
        "spec": "列术我记结法产林天次非便起样工济",
        "spuId": null,
        "bizValue": null,
        "weightUnit": "千克(kg)",
        "boxPrice": 0,
        "boxNum": 1,
        "limitStock": 1,
        "itemNum": "",
        "shelfNum": "",
        "skuCode": "aaaaaaa",
        "weight": 106,
        "productName": null,
        "unit": "份",
        "sequence": 0
      }
    ]
  },
  {
    "id": 18,
    "name": "及成接因书象即下为",
    "tagList": [
      {
        "tagName": "未分类",
        "sequence": 0,
        "tagId": 1
      }
    ],
    "isSp": 1,
    "spId": "Bc6d8fA5-a26d-59E0-6FD6-E8fA4BBb5bEf",
    "picture": "http://p0.meituan.net/xianfu/5272bfc0a117e2ccea48efc06b79768e67245.jpg",
    "upcCode": "123",
    "monthSale": 1000,
    "sellStatus": 1,
    "skus": [
      {
        "skuAttrs": null,
        "minOrderCount": 1,
        "id": 37,
        "stock": 0,
        "price": 0,
        "upc": "16CAF845-Cf7c-79BD-6Ecc-49F836fcfcdb",
        "spec": "界省生下七技后业按如众般铁厂",
        "spuId": null,
        "bizValue": null,
        "weightUnit": "千克(kg)",
        "boxPrice": 0,
        "boxNum": 1,
        "limitStock": 1,
        "itemNum": "",
        "shelfNum": "",
        "skuCode": "aaaaaaa",
        "weight": 106,
        "productName": null,
        "unit": "份",
        "sequence": 0
      },
      {
        "skuAttrs": [
          {
            "value": "天军花到每人中建水",
            "valueId": 0,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000029
          },
          {
            "value": "现三就点认观快与",
            "valueId": 1,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000030
          }
        ],
        "minOrderCount": 1,
        "id": 38,
        "stock": 0,
        "price": 0,
        "upc": "cf3c1cA3-457e-1cfb-4ade-A2F74BeFdBf3",
        "spec": "通建圆正小思声里度以时斗风老也头生",
        "spuId": null,
        "bizValue": null,
        "weightUnit": "千克(kg)",
        "boxPrice": 0,
        "boxNum": 1,
        "limitStock": 1,
        "itemNum": "",
        "shelfNum": "",
        "skuCode": "aaaaaaa",
        "weight": 106,
        "productName": null,
        "unit": "份",
        "sequence": 0
      }
    ]
  },
  {
    "id": 19,
    "name": "级对断号信阶即强满素设马",
    "tagList": [
      {
        "tagName": "未分类",
        "sequence": 0,
        "tagId": 1
      }
    ],
    "isSp": 2,
    "spId": "eDdFFaEE-10bd-cE1c-3E8B-2Bd8b599FeDF",
    "picture": "http://p0.meituan.net/xianfu/8216af051c08df43c7288b6dbabd254194208.jpg",
    "upcCode": "123",
    "monthSale": 1000,
    "sellStatus": 1,
    "skus": [
      {
        "skuAttrs": null,
        "minOrderCount": 1,
        "id": 39,
        "stock": 0,
        "price": 0,
        "upc": "5d36669D-6B9E-A5fE-4cFE-0AECdF9B4CdC",
        "spec": "志党数想部院易最小她很再儿政之改确且",
        "spuId": null,
        "bizValue": null,
        "weightUnit": "千克(kg)",
        "boxPrice": 0,
        "boxNum": 1,
        "limitStock": 1,
        "itemNum": "",
        "shelfNum": "",
        "skuCode": "aaaaaaa",
        "weight": 106,
        "productName": null,
        "unit": "份",
        "sequence": 0
      },
      {
        "skuAttrs": [
          {
            "value": "给整干半路学出",
            "valueId": 0,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000029
          },
          {
            "value": "里史酸无受多比水思资",
            "valueId": 1,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000030
          }
        ],
        "minOrderCount": 1,
        "id": 40,
        "stock": 0,
        "price": 0,
        "upc": "63C2e3aF-39D1-dCAF-5d82-6864bC156b77",
        "spec": "取张知价平况单决期度话民",
        "spuId": null,
        "bizValue": null,
        "weightUnit": "千克(kg)",
        "boxPrice": 0,
        "boxNum": 1,
        "limitStock": 1,
        "itemNum": "",
        "shelfNum": "",
        "skuCode": "aaaaaaa",
        "weight": 106,
        "productName": null,
        "unit": "份",
        "sequence": 0
      }
    ]
  },
  {
    "id": 20,
    "name": "己边造市前法代单名很放标江战温接观关后却工更率东",
    "tagList": [
      {
        "tagName": "测试分类1",
        "sequence": 2,
        "tagId": 2
      }
    ],
    "isSp": 1,
    "spId": "dfCf8F68-5726-328f-81ef-74aEd2aBd8D9",
    "picture": "http://p0.meituan.net/xianfu/8216af051c08df43c7288b6dbabd254194208.jpg",
    "upcCode": "123",
    "monthSale": 1000,
    "sellStatus": 1,
    "skus": [
      {
        "skuAttrs": null,
        "minOrderCount": 1,
        "id": 41,
        "stock": 0,
        "price": 0,
        "upc": "Bd1d52cA-FFEb-614A-8FCD-1FeB4e8AbfAE",
        "spec": "上业克西按角却常适实存计地前产速例",
        "spuId": null,
        "bizValue": null,
        "weightUnit": "千克(kg)",
        "boxPrice": 0,
        "boxNum": 1,
        "limitStock": 1,
        "itemNum": "",
        "shelfNum": "",
        "skuCode": "aaaaaaa",
        "weight": 106,
        "productName": null,
        "unit": "份",
        "sequence": 0
      },
      {
        "skuAttrs": null,
        "minOrderCount": 1,
        "id": 42,
        "stock": 0,
        "price": 0,
        "upc": "8FB9dAf2-373a-d22C-ccbb-4BA3Ed386CeC",
        "spec": "机力目没动的员感儿才么务展比界群连",
        "spuId": null,
        "bizValue": null,
        "weightUnit": "千克(kg)",
        "boxPrice": 0,
        "boxNum": 1,
        "limitStock": 1,
        "itemNum": "",
        "shelfNum": "",
        "skuCode": "aaaaaaa",
        "weight": 106,
        "productName": null,
        "unit": "份",
        "sequence": 0
      },
      {
        "skuAttrs": [
          {
            "value": "火通该分被究时品",
            "valueId": 0,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000029
          },
          {
            "value": "易系先因号状开",
            "valueId": 1,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000030
          }
        ],
        "minOrderCount": 1,
        "id": 43,
        "stock": 0,
        "price": 0,
        "upc": "dB6F646C-4FEe-cff8-c6DF-365dfEeeEeC4",
        "spec": "张五基她火查问七队造院发事研并积江线周",
        "spuId": null,
        "bizValue": null,
        "weightUnit": "千克(kg)",
        "boxPrice": 0,
        "boxNum": 1,
        "limitStock": 1,
        "itemNum": "",
        "shelfNum": "",
        "skuCode": "aaaaaaa",
        "weight": 106,
        "productName": null,
        "unit": "份",
        "sequence": 0
      }
    ]
  },
  {
    "id": 0,
    "name": "非表片眼影象规难先林织划离边社较应青记争见那目务米数几",
    "tagList": [
      {
        "tagName": "未分类",
        "sequence": 0,
        "tagId": 1
      }
    ],
    "isSp": 2,
    "spId": "dDd6b9f3-A2da-CC7c-DF5E-917bDb4a8c44",
    "picture": "http://p0.meituan.net/xianfu/701a8e89aef8e791b8ac7436675fafa3393216.jpg",
    "upcCode": "123",
    "monthSale": 1000,
    "sellStatus": 1,
    "skus": [
      {
        "skuAttrs": [
          {
            "value": "区处层日民却边满单",
            "valueId": 0,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000029
          },
          {
            "value": "然条种易小史经口改",
            "valueId": 1,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000030
          }
        ],
        "minOrderCount": 1,
        "id": 44,
        "stock": 0,
        "price": 0,
        "upc": "7711510C-BbCc-c66C-2D6A-0fCe113e626d",
        "spec": "想会队合委公声三决化消象适才必江织细风才金被说打资空按飞按包",
        "spuId": null,
        "bizValue": null,
        "weightUnit": "千克(kg)",
        "boxPrice": 0,
        "boxNum": 1,
        "limitStock": 1,
        "itemNum": "",
        "shelfNum": "",
        "skuCode": "aaaaaaa",
        "weight": 106,
        "productName": null,
        "unit": "份",
        "sequence": 0
      }
    ]
  },
  {
    "id": 0,
    "name": "教走解年支做强京不日为听结社见海程律",
    "tagList": [
      {
        "tagName": "测试分类1",
        "sequence": 2,
        "tagId": 2
      }
    ],
    "isSp": 1,
    "spId": "Ad3DfA77-C38C-8F3a-5ffF-Df6d4E11fe6B",
    "picture": "http://p0.meituan.net/xianfu/6d593a6582f4a31e1b51c670634c4a32131072.jpg",
    "upcCode": "123",
    "monthSale": 1000,
    "sellStatus": 1,
    "skus": [
      {
        "skuAttrs": [
          {
            "value": "酸很适进思养好热消",
            "valueId": 0,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000029
          },
          {
            "value": "切压些和空机",
            "valueId": 1,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000030
          }
        ],
        "minOrderCount": 1,
        "id": 45,
        "stock": 0,
        "price": 0,
        "upc": "433D0Ee5-a5AF-CeCa-77eF-d1fB183845D4",
        "spec": "水制行元转活政区识般花规般分要革养强领百因先外验必水六",
        "spuId": null,
        "bizValue": null,
        "weightUnit": "千克(kg)",
        "boxPrice": 0,
        "boxNum": 1,
        "limitStock": 1,
        "itemNum": "",
        "shelfNum": "",
        "skuCode": "aaaaaaa",
        "weight": 106,
        "productName": null,
        "unit": "份",
        "sequence": 0
      },
      {
        "skuAttrs": null,
        "minOrderCount": 1,
        "id": 46,
        "stock": 0,
        "price": 0,
        "upc": "6BD6E9D5-68Ef-6AFd-D2Fc-D54c5bBb409A",
        "spec": "山本合离将管须调治很连论",
        "spuId": null,
        "bizValue": null,
        "weightUnit": "千克(kg)",
        "boxPrice": 0,
        "boxNum": 1,
        "limitStock": 1,
        "itemNum": "",
        "shelfNum": "",
        "skuCode": "aaaaaaa",
        "weight": 106,
        "productName": null,
        "unit": "份",
        "sequence": 0
      },
      {
        "skuAttrs": [
          {
            "value": "处增加理他真构机",
            "valueId": 0,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000029
          },
          {
            "value": "强周的民但感年达他音",
            "valueId": 1,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000030
          }
        ],
        "minOrderCount": 1,
        "id": 47,
        "stock": 0,
        "price": 0,
        "upc": "599A96ee-3622-aEe2-DB2f-3E41ACcc06D2",
        "spec": "海色人并之步等复之须要第",
        "spuId": null,
        "bizValue": null,
        "weightUnit": "千克(kg)",
        "boxPrice": 0,
        "boxNum": 1,
        "limitStock": 1,
        "itemNum": "",
        "shelfNum": "",
        "skuCode": "aaaaaaa",
        "weight": 106,
        "productName": null,
        "unit": "份",
        "sequence": 0
      }
    ]
  },
  {
    "id": 23,
    "name": "于道电器交见战程周是",
    "tagList": [
      {
        "tagName": "未分类",
        "sequence": 0,
        "tagId": 1
      }
    ],
    "isSp": 2,
    "spId": "A5bEFbf8-8E25-4F69-4214-fdFd161cAc79",
    "picture": "http://p0.meituan.net/xianfu/8216af051c08df43c7288b6dbabd254194208.jpg",
    "upcCode": "123",
    "monthSale": 1000,
    "sellStatus": 1,
    "skus": [
      {
        "skuAttrs": [
          {
            "value": "感三治表维力",
            "valueId": 0,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000029
          },
          {
            "value": "身日风者无技",
            "valueId": 1,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000030
          }
        ],
        "minOrderCount": 1,
        "id": 48,
        "stock": 0,
        "price": 0,
        "upc": "fe8eCbE8-0618-43cA-C456-AAF49Ab6c3Dd",
        "spec": "最节建易眼气数容法题行连再它则政却民县",
        "spuId": null,
        "bizValue": null,
        "weightUnit": "千克(kg)",
        "boxPrice": 0,
        "boxNum": 1,
        "limitStock": 1,
        "itemNum": "",
        "shelfNum": "",
        "skuCode": "aaaaaaa",
        "weight": 106,
        "productName": null,
        "unit": "份",
        "sequence": 0
      },
      {
        "skuAttrs": null,
        "minOrderCount": 1,
        "id": 49,
        "stock": 0,
        "price": 0,
        "upc": "ecDFBE25-ACcD-8a3d-d8fA-520127cfb104",
        "spec": "还率也由回根通情消果中而北调",
        "spuId": null,
        "bizValue": null,
        "weightUnit": "千克(kg)",
        "boxPrice": 0,
        "boxNum": 1,
        "limitStock": 1,
        "itemNum": "",
        "shelfNum": "",
        "skuCode": "aaaaaaa",
        "weight": 106,
        "productName": null,
        "unit": "份",
        "sequence": 0
      }
    ]
  },
  {
    "id": 0,
    "name": "素活划步这音关般决都头",
    "tagList": [
      {
        "tagName": "未分类",
        "sequence": 0,
        "tagId": 1
      }
    ],
    "isSp": 1,
    "spId": "37Fe6F2D-f3eb-1EED-5C24-4dDd868Ab41f",
    "picture": "http://p0.meituan.net/xianfu/6d593a6582f4a31e1b51c670634c4a32131072.jpg",
    "upcCode": "123",
    "monthSale": 1000,
    "sellStatus": 1,
    "skus": [
      {
        "skuAttrs": [
          {
            "value": "存已导容准动铁往平",
            "valueId": 0,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000029
          },
          {
            "value": "都导必线想值志流按流",
            "valueId": 1,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000030
          }
        ],
        "minOrderCount": 1,
        "id": 50,
        "stock": 0,
        "price": 0,
        "upc": "58639D3D-4bE9-ebFc-b879-aA1d48c9D98C",
        "spec": "技取发极白问地光速约年转象素",
        "spuId": null,
        "bizValue": null,
        "weightUnit": "千克(kg)",
        "boxPrice": 0,
        "boxNum": 1,
        "limitStock": 1,
        "itemNum": "",
        "shelfNum": "",
        "skuCode": "aaaaaaa",
        "weight": 106,
        "productName": null,
        "unit": "份",
        "sequence": 0
      },
      {
        "skuAttrs": [
          {
            "value": "论都相通布才半平重",
            "valueId": 0,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000029
          },
          {
            "value": "干建元例两己关属",
            "valueId": 1,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000030
          }
        ],
        "minOrderCount": 1,
        "id": 51,
        "stock": 0,
        "price": 0,
        "upc": "23EbF6EF-DB1F-877C-7997-9FEbb1cC75c2",
        "spec": "日难内反基走社正历响",
        "spuId": null,
        "bizValue": null,
        "weightUnit": "千克(kg)",
        "boxPrice": 0,
        "boxNum": 1,
        "limitStock": 1,
        "itemNum": "",
        "shelfNum": "",
        "skuCode": "aaaaaaa",
        "weight": 106,
        "productName": null,
        "unit": "份",
        "sequence": 0
      }
    ]
  },
  {
    "id": 0,
    "name": "速格说众面外压儿提还间这华属基两老心无织段术整有何活",
    "tagList": [
      {
        "tagName": "未分类",
        "sequence": 0,
        "tagId": 1
      }
    ],
    "isSp": 2,
    "spId": "1D45A0fB-4fC4-1d6B-887f-fF5fFF2deAb0",
    "picture": "http://p0.meituan.net/xianfu/6d593a6582f4a31e1b51c670634c4a32131072.jpg",
    "upcCode": "123",
    "monthSale": 1000,
    "sellStatus": 1,
    "skus": [
      {
        "skuAttrs": [
          {
            "value": "反克流素分基运体四华",
            "valueId": 0,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000029
          },
          {
            "value": "七到被统代少金引",
            "valueId": 1,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000030
          }
        ],
        "minOrderCount": 1,
        "id": 52,
        "stock": 0,
        "price": 0,
        "upc": "71fD15eB-5caa-7f2e-28a2-cfd55B88bf2C",
        "spec": "识道通里造着称照共根与际济内况音受最示八步持断车千论用地率",
        "spuId": null,
        "bizValue": null,
        "weightUnit": "千克(kg)",
        "boxPrice": 0,
        "boxNum": 1,
        "limitStock": 1,
        "itemNum": "",
        "shelfNum": "",
        "skuCode": "aaaaaaa",
        "weight": 106,
        "productName": null,
        "unit": "份",
        "sequence": 0
      },
      {
        "skuAttrs": null,
        "minOrderCount": 1,
        "id": 53,
        "stock": 0,
        "price": 0,
        "upc": "d91AFbbC-928b-ff79-8FBA-70AFAD7e8dac",
        "spec": "解存而满龙组委年给但身流花认报收管周光于育实关时低战些存",
        "spuId": null,
        "bizValue": null,
        "weightUnit": "千克(kg)",
        "boxPrice": 0,
        "boxNum": 1,
        "limitStock": 1,
        "itemNum": "",
        "shelfNum": "",
        "skuCode": "aaaaaaa",
        "weight": 106,
        "productName": null,
        "unit": "份",
        "sequence": 0
      },
      {
        "skuAttrs": [
          {
            "value": "们开料说则打新",
            "valueId": 0,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000029
          },
          {
            "value": "最还共干革出会专",
            "valueId": 1,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000030
          }
        ],
        "minOrderCount": 1,
        "id": 54,
        "stock": 0,
        "price": 0,
        "upc": "556CcCfb-c542-4472-efbb-9E7d2786Bc01",
        "spec": "应深观化产重计矿种程保别却采酸便你安世会矿务的思即状",
        "spuId": null,
        "bizValue": null,
        "weightUnit": "千克(kg)",
        "boxPrice": 0,
        "boxNum": 1,
        "limitStock": 1,
        "itemNum": "",
        "shelfNum": "",
        "skuCode": "aaaaaaa",
        "weight": 106,
        "productName": null,
        "unit": "份",
        "sequence": 0
      }
    ]
  },
  {
    "id": 0,
    "name": "导部国采程海布形住对",
    "tagList": [
      {
        "tagName": "测试分类1",
        "sequence": 2,
        "tagId": 2
      }
    ],
    "isSp": 1,
    "spId": "889EE3C3-16d1-dcf1-2AbB-f9FF9605cEb4",
    "picture": "http://p0.meituan.net/xianfu/8216af051c08df43c7288b6dbabd254194208.jpg",
    "upcCode": "123",
    "monthSale": 1000,
    "sellStatus": 1,
    "skus": [
      {
        "skuAttrs": null,
        "minOrderCount": 1,
        "id": 55,
        "stock": 0,
        "price": 0,
        "upc": "e2A67fAE-D5fb-F76d-b6ee-FD704cfCF97F",
        "spec": "情民更进必难术一保果型增别同算用子毛群",
        "spuId": null,
        "bizValue": null,
        "weightUnit": "千克(kg)",
        "boxPrice": 0,
        "boxNum": 1,
        "limitStock": 1,
        "itemNum": "",
        "shelfNum": "",
        "skuCode": "aaaaaaa",
        "weight": 106,
        "productName": null,
        "unit": "份",
        "sequence": 0
      },
      {
        "skuAttrs": [
          {
            "value": "可两济小次都加",
            "valueId": 0,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000029
          },
          {
            "value": "写称图格包算集候何",
            "valueId": 1,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000030
          }
        ],
        "minOrderCount": 1,
        "id": 56,
        "stock": 0,
        "price": 0,
        "upc": "8AbD79DF-2D7a-C9BC-a629-b16B8bBf29A3",
        "spec": "东边候调下况等再历单查快志造月流根议是天",
        "spuId": null,
        "bizValue": null,
        "weightUnit": "千克(kg)",
        "boxPrice": 0,
        "boxNum": 1,
        "limitStock": 1,
        "itemNum": "",
        "shelfNum": "",
        "skuCode": "aaaaaaa",
        "weight": 106,
        "productName": null,
        "unit": "份",
        "sequence": 0
      }
    ]
  },
  {
    "id": 0,
    "name": "教争用济万与已带断也同己",
    "tagList": [
      {
        "tagName": "测试分类1",
        "sequence": 2,
        "tagId": 2
      }
    ],
    "isSp": 2,
    "spId": "24Ee8D29-f5C9-bEcF-10d4-7bC87c730780",
    "picture": "http://p0.meituan.net/xianfu/8216af051c08df43c7288b6dbabd254194208.jpg",
    "upcCode": "123",
    "monthSale": 1000,
    "sellStatus": 1,
    "skus": [
      {
        "skuAttrs": null,
        "minOrderCount": 1,
        "id": 57,
        "stock": 0,
        "price": 0,
        "upc": "3C5dAF9E-feD1-02c2-ff7d-faCeCD0b60f8",
        "spec": "打号确听多接压件不带改五出接斗",
        "spuId": null,
        "bizValue": null,
        "weightUnit": "千克(kg)",
        "boxPrice": 0,
        "boxNum": 1,
        "limitStock": 1,
        "itemNum": "",
        "shelfNum": "",
        "skuCode": "aaaaaaa",
        "weight": 106,
        "productName": null,
        "unit": "份",
        "sequence": 0
      }
    ]
  },
  {
    "id": 0,
    "name": "自说张意月与称单千己论我石它了数作动",
    "tagList": [
      {
        "tagName": "测试分类1",
        "sequence": 2,
        "tagId": 2
      }
    ],
    "isSp": 1,
    "spId": "683AD58d-8a8e-cDF8-22B1-eEC77fB787d2",
    "picture": "http://p0.meituan.net/xianfu/5272bfc0a117e2ccea48efc06b79768e67245.jpg",
    "upcCode": "123",
    "monthSale": 1000,
    "sellStatus": 1,
    "skus": [
      {
        "skuAttrs": [
          {
            "value": "建角东族无验市百是",
            "valueId": 0,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000029
          },
          {
            "value": "和感被心题当",
            "valueId": 1,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000030
          }
        ],
        "minOrderCount": 1,
        "id": 58,
        "stock": 0,
        "price": 0,
        "upc": "2D7fdC6f-9dA9-eD16-79Ef-2bec8CbAe82B",
        "spec": "程术委给难却时风这月打活热生百其于细毛",
        "spuId": null,
        "bizValue": null,
        "weightUnit": "千克(kg)",
        "boxPrice": 0,
        "boxNum": 1,
        "limitStock": 1,
        "itemNum": "",
        "shelfNum": "",
        "skuCode": "aaaaaaa",
        "weight": 106,
        "productName": null,
        "unit": "份",
        "sequence": 0
      },
      {
        "skuAttrs": null,
        "minOrderCount": 1,
        "id": 59,
        "stock": 0,
        "price": 0,
        "upc": "EB3B12C2-3CcC-9Ea3-bDbD-e398dEF99C76",
        "spec": "亲社成状层北快工品战理无眼关面拉院外",
        "spuId": null,
        "bizValue": null,
        "weightUnit": "千克(kg)",
        "boxPrice": 0,
        "boxNum": 1,
        "limitStock": 1,
        "itemNum": "",
        "shelfNum": "",
        "skuCode": "aaaaaaa",
        "weight": 106,
        "productName": null,
        "unit": "份",
        "sequence": 0
      }
    ]
  },
  {
    "id": 0,
    "name": "术生基儿个状转员治完",
    "tagList": [
      {
        "tagName": "未分类",
        "sequence": 0,
        "tagId": 1
      }
    ],
    "isSp": 2,
    "spId": "451dEdCE-37aB-e528-EEE7-7934dbB72BD4",
    "picture": "http://p0.meituan.net/xianfu/701a8e89aef8e791b8ac7436675fafa3393216.jpg",
    "upcCode": "123",
    "monthSale": 1000,
    "sellStatus": 1,
    "skus": [
      {
        "skuAttrs": null,
        "minOrderCount": 1,
        "id": 60,
        "stock": 0,
        "price": 0,
        "upc": "3ce8FC62-ED1d-8d96-9f89-A3D1D7ec8cDc",
        "spec": "马世次包是历离识次温候新高现市段格事带际长传住称连具酸么命",
        "spuId": null,
        "bizValue": null,
        "weightUnit": "千克(kg)",
        "boxPrice": 0,
        "boxNum": 1,
        "limitStock": 1,
        "itemNum": "",
        "shelfNum": "",
        "skuCode": "aaaaaaa",
        "weight": 106,
        "productName": null,
        "unit": "份",
        "sequence": 0
      }
    ]
  },
  {
    "id": 30,
    "name": "立书还山少现验解真要须铁十",
    "tagList": [
      {
        "tagName": "未分类",
        "sequence": 0,
        "tagId": 1
      }
    ],
    "isSp": 1,
    "spId": "FDB8E1BC-AfdE-9B21-c39A-a85e7EFBDD59",
    "picture": "http://p0.meituan.net/xianfu/701a8e89aef8e791b8ac7436675fafa3393216.jpg",
    "upcCode": "123",
    "monthSale": 1000,
    "sellStatus": 1,
    "skus": [
      {
        "skuAttrs": [
          {
            "value": "复式指厂听快工又华",
            "valueId": 0,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000029
          },
          {
            "value": "能许到想将经约",
            "valueId": 1,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000030
          }
        ],
        "minOrderCount": 1,
        "id": 61,
        "stock": 0,
        "price": 0,
        "upc": "A3B4d63d-E1Eb-0C1c-D0D5-803fF8b79AD6",
        "spec": "段特象史界两候治月米么位他提选部料南办",
        "spuId": null,
        "bizValue": null,
        "weightUnit": "千克(kg)",
        "boxPrice": 0,
        "boxNum": 1,
        "limitStock": 1,
        "itemNum": "",
        "shelfNum": "",
        "skuCode": "aaaaaaa",
        "weight": 106,
        "productName": null,
        "unit": "份",
        "sequence": 0
      },
      {
        "skuAttrs": null,
        "minOrderCount": 1,
        "id": 62,
        "stock": 0,
        "price": 0,
        "upc": "EEfC4Dbd-9dfa-D6ab-b4b1-e1f47D2b7D93",
        "spec": "始机张切参学区安使已太列用规温济热压定话使基为",
        "spuId": null,
        "bizValue": null,
        "weightUnit": "千克(kg)",
        "boxPrice": 0,
        "boxNum": 1,
        "limitStock": 1,
        "itemNum": "",
        "shelfNum": "",
        "skuCode": "aaaaaaa",
        "weight": 106,
        "productName": null,
        "unit": "份",
        "sequence": 0
      },
      {
        "skuAttrs": null,
        "minOrderCount": 1,
        "id": 63,
        "stock": 0,
        "price": 0,
        "upc": "CD63E51e-c87b-C368-eb31-bCB523C1ccef",
        "spec": "传四置入数阶对众几红圆下格后广知日数队斗",
        "spuId": null,
        "bizValue": null,
        "weightUnit": "千克(kg)",
        "boxPrice": 0,
        "boxNum": 1,
        "limitStock": 1,
        "itemNum": "",
        "shelfNum": "",
        "skuCode": "aaaaaaa",
        "weight": 106,
        "productName": null,
        "unit": "份",
        "sequence": 0
      }
    ]
  },
  {
    "id": 0,
    "name": "队队条起验造图者命总出象眼分总联极条四",
    "tagList": [
      {
        "tagName": "未分类",
        "sequence": 0,
        "tagId": 1
      }
    ],
    "isSp": 2,
    "spId": "bb9EF8cB-81c2-893B-dfbc-5C7A3cbFBB9C",
    "picture": "http://p0.meituan.net/xianfu/6d593a6582f4a31e1b51c670634c4a32131072.jpg",
    "upcCode": "123",
    "monthSale": 1000,
    "sellStatus": 1,
    "skus": [
      {
        "skuAttrs": null,
        "minOrderCount": 1,
        "id": 64,
        "stock": 0,
        "price": 0,
        "upc": "8EdC7ABD-51f1-70AA-FfBd-ff6b95cd0ECB",
        "spec": "支酸取发种京照属基越劳支造办情局带并",
        "spuId": null,
        "bizValue": null,
        "weightUnit": "千克(kg)",
        "boxPrice": 0,
        "boxNum": 1,
        "limitStock": 1,
        "itemNum": "",
        "shelfNum": "",
        "skuCode": "aaaaaaa",
        "weight": 106,
        "productName": null,
        "unit": "份",
        "sequence": 0
      }
    ]
  },
  {
    "id": 32,
    "name": "想快县空斯生律原",
    "tagList": [
      {
        "tagName": "未分类",
        "sequence": 0,
        "tagId": 1
      }
    ],
    "isSp": 1,
    "spId": "2dEBAf4f-728A-5D10-a028-6C9cA7787FF9",
    "picture": "http://p0.meituan.net/xianfu/6d593a6582f4a31e1b51c670634c4a32131072.jpg",
    "upcCode": "123",
    "monthSale": 1000,
    "sellStatus": 1,
    "skus": [
      {
        "skuAttrs": [
          {
            "value": "今再识法候铁专分",
            "valueId": 0,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000029
          },
          {
            "value": "学种包去院边活",
            "valueId": 1,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000030
          }
        ],
        "minOrderCount": 1,
        "id": 65,
        "stock": 0,
        "price": 0,
        "upc": "48314Abd-7A6b-FfC8-867d-06cA3F341f43",
        "spec": "点其群极值车集万外最山信领说行建式提别水些求里决能需近使",
        "spuId": null,
        "bizValue": null,
        "weightUnit": "千克(kg)",
        "boxPrice": 0,
        "boxNum": 1,
        "limitStock": 1,
        "itemNum": "",
        "shelfNum": "",
        "skuCode": "aaaaaaa",
        "weight": 106,
        "productName": null,
        "unit": "份",
        "sequence": 0
      },
      {
        "skuAttrs": null,
        "minOrderCount": 1,
        "id": 66,
        "stock": 0,
        "price": 0,
        "upc": "88eBDfF6-1dc6-2FA2-AC72-3721503eb4ec",
        "spec": "确走位结米复目具必一斗反快记最西路得林打清也组交",
        "spuId": null,
        "bizValue": null,
        "weightUnit": "千克(kg)",
        "boxPrice": 0,
        "boxNum": 1,
        "limitStock": 1,
        "itemNum": "",
        "shelfNum": "",
        "skuCode": "aaaaaaa",
        "weight": 106,
        "productName": null,
        "unit": "份",
        "sequence": 0
      }
    ]
  },
  {
    "id": 33,
    "name": "美报或积张平造劳色第会众局为时段定",
    "tagList": [
      {
        "tagName": "未分类",
        "sequence": 0,
        "tagId": 1
      }
    ],
    "isSp": 2,
    "spId": "a1d2f3fC-FCCE-6BDd-222A-dF2FC77979e8",
    "picture": "http://p0.meituan.net/xianfu/701a8e89aef8e791b8ac7436675fafa3393216.jpg",
    "upcCode": "123",
    "monthSale": 1000,
    "sellStatus": 1,
    "skus": [
      {
        "skuAttrs": null,
        "minOrderCount": 1,
        "id": 67,
        "stock": 0,
        "price": 0,
        "upc": "4e54d8c6-17A5-Ec6c-eE1D-E721b9C252b4",
        "spec": "口验严小样型应水族离山报反知它教类员统该商",
        "spuId": null,
        "bizValue": null,
        "weightUnit": "千克(kg)",
        "boxPrice": 0,
        "boxNum": 1,
        "limitStock": 1,
        "itemNum": "",
        "shelfNum": "",
        "skuCode": "aaaaaaa",
        "weight": 106,
        "productName": null,
        "unit": "份",
        "sequence": 0
      },
      {
        "skuAttrs": null,
        "minOrderCount": 1,
        "id": 68,
        "stock": 0,
        "price": 0,
        "upc": "9F6ceEC2-cFf4-36A5-c2d4-cD58FBa669E6",
        "spec": "重光参影维道么对出派八群资争江你起取活",
        "spuId": null,
        "bizValue": null,
        "weightUnit": "千克(kg)",
        "boxPrice": 0,
        "boxNum": 1,
        "limitStock": 1,
        "itemNum": "",
        "shelfNum": "",
        "skuCode": "aaaaaaa",
        "weight": 106,
        "productName": null,
        "unit": "份",
        "sequence": 0
      },
      {
        "skuAttrs": [
          {
            "value": "话王科提近二工米而",
            "valueId": 0,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000029
          },
          {
            "value": "结权或例化各定一构做",
            "valueId": 1,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000030
          }
        ],
        "minOrderCount": 1,
        "id": 69,
        "stock": 0,
        "price": 0,
        "upc": "D6Cffe5E-C2AE-0a6f-304f-0f24Df8B9fDb",
        "spec": "王真名集且头其做两立件铁交西比土持法斗把解没族安片元最儿府",
        "spuId": null,
        "bizValue": null,
        "weightUnit": "千克(kg)",
        "boxPrice": 0,
        "boxNum": 1,
        "limitStock": 1,
        "itemNum": "",
        "shelfNum": "",
        "skuCode": "aaaaaaa",
        "weight": 106,
        "productName": null,
        "unit": "份",
        "sequence": 0
      }
    ]
  },
  {
    "id": 0,
    "name": "办机低调只",
    "tagList": [
      {
        "tagName": "未分类",
        "sequence": 0,
        "tagId": 1
      }
    ],
    "isSp": 1,
    "spId": "7740f988-7C6b-05D7-C25B-2aB1cA9CCEf6",
    "picture": "http://p0.meituan.net/xianfu/8216af051c08df43c7288b6dbabd254194208.jpg",
    "upcCode": "123",
    "monthSale": 1000,
    "sellStatus": 1,
    "skus": [
      {
        "skuAttrs": null,
        "minOrderCount": 1,
        "id": 70,
        "stock": 0,
        "price": 0,
        "upc": "DeF1af18-c1Ed-cE3C-de52-3D0b5FF8b68B",
        "spec": "专发力平内战路物即别八的铁话已毛段机声难满统转九金好王",
        "spuId": null,
        "bizValue": null,
        "weightUnit": "千克(kg)",
        "boxPrice": 0,
        "boxNum": 1,
        "limitStock": 1,
        "itemNum": "",
        "shelfNum": "",
        "skuCode": "aaaaaaa",
        "weight": 106,
        "productName": null,
        "unit": "份",
        "sequence": 0
      },
      {
        "skuAttrs": null,
        "minOrderCount": 1,
        "id": 71,
        "stock": 0,
        "price": 0,
        "upc": "2eA176Fc-deF2-bB1A-E1ff-Fd88FBB74cEe",
        "spec": "住长对头同少思属志建标增身比取业音解利是式",
        "spuId": null,
        "bizValue": null,
        "weightUnit": "千克(kg)",
        "boxPrice": 0,
        "boxNum": 1,
        "limitStock": 1,
        "itemNum": "",
        "shelfNum": "",
        "skuCode": "aaaaaaa",
        "weight": 106,
        "productName": null,
        "unit": "份",
        "sequence": 0
      }
    ]
  },
  {
    "id": 0,
    "name": "众专容属制线西个清严不小布声习声家度照间",
    "tagList": [
      {
        "tagName": "测试分类1",
        "sequence": 2,
        "tagId": 2
      }
    ],
    "isSp": 2,
    "spId": "5bbA2caD-cc6f-3cf7-2CE0-Fe5E6cC686cD",
    "picture": "http://p0.meituan.net/xianfu/6d593a6582f4a31e1b51c670634c4a32131072.jpg",
    "upcCode": "123",
    "monthSale": 1000,
    "sellStatus": 1,
    "skus": [
      {
        "skuAttrs": [
          {
            "value": "不法门本列复层京即",
            "valueId": 0,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000029
          },
          {
            "value": "参九局增行部得半住厂",
            "valueId": 1,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000030
          }
        ],
        "minOrderCount": 1,
        "id": 72,
        "stock": 0,
        "price": 0,
        "upc": "77cc6bF3-1EdA-FFaa-F10b-30A4e47d7744",
        "spec": "这工证完想车图王根住者她度什办成层六",
        "spuId": null,
        "bizValue": null,
        "weightUnit": "千克(kg)",
        "boxPrice": 0,
        "boxNum": 1,
        "limitStock": 1,
        "itemNum": "",
        "shelfNum": "",
        "skuCode": "aaaaaaa",
        "weight": 106,
        "productName": null,
        "unit": "份",
        "sequence": 0
      }
    ]
  },
  {
    "id": 0,
    "name": "第增种白战条往后马养",
    "tagList": [
      {
        "tagName": "未分类",
        "sequence": 0,
        "tagId": 1
      }
    ],
    "isSp": 1,
    "spId": "58eac7Ef-baCf-2dcf-d4Ce-DC45DD4D3ecd",
    "picture": "http://p0.meituan.net/xianfu/5272bfc0a117e2ccea48efc06b79768e67245.jpg",
    "upcCode": "123",
    "monthSale": 1000,
    "sellStatus": 1,
    "skus": [
      {
        "skuAttrs": null,
        "minOrderCount": 1,
        "id": 73,
        "stock": 0,
        "price": 0,
        "upc": "cAE01d6F-abda-DFdc-f9b3-5dBbDfCA587d",
        "spec": "米调每用商南至铁力时定周始声反车派才质",
        "spuId": null,
        "bizValue": null,
        "weightUnit": "千克(kg)",
        "boxPrice": 0,
        "boxNum": 1,
        "limitStock": 1,
        "itemNum": "",
        "shelfNum": "",
        "skuCode": "aaaaaaa",
        "weight": 106,
        "productName": null,
        "unit": "份",
        "sequence": 0
      },
      {
        "skuAttrs": [
          {
            "value": "种非就电方点",
            "valueId": 0,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000029
          },
          {
            "value": "方状验研长派日立道",
            "valueId": 1,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000030
          }
        ],
        "minOrderCount": 1,
        "id": 74,
        "stock": 0,
        "price": 0,
        "upc": "D1DB24E3-ED2a-Dbb4-db1F-1b1A7Bfbf439",
        "spec": "体就条总民情要器他运济理南就存克还问层一群情因原持目满",
        "spuId": null,
        "bizValue": null,
        "weightUnit": "千克(kg)",
        "boxPrice": 0,
        "boxNum": 1,
        "limitStock": 1,
        "itemNum": "",
        "shelfNum": "",
        "skuCode": "aaaaaaa",
        "weight": 106,
        "productName": null,
        "unit": "份",
        "sequence": 0
      }
    ]
  },
  {
    "id": 37,
    "name": "子是方力省别想事员节听拉",
    "tagList": [
      {
        "tagName": "未分类",
        "sequence": 0,
        "tagId": 1
      }
    ],
    "isSp": 2,
    "spId": "45a95262-b7BE-96dE-FDDF-B414ACAcBAA6",
    "picture": "http://p0.meituan.net/xianfu/5272bfc0a117e2ccea48efc06b79768e67245.jpg",
    "upcCode": "123",
    "monthSale": 1000,
    "sellStatus": 1,
    "skus": [
      {
        "skuAttrs": [
          {
            "value": "它起做清之参铁",
            "valueId": 0,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000029
          },
          {
            "value": "目几酸结又维料毛",
            "valueId": 1,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000030
          }
        ],
        "minOrderCount": 1,
        "id": 75,
        "stock": 0,
        "price": 0,
        "upc": "9dFC8fA0-Bfaa-A1cB-7950-2DFee4E028dE",
        "spec": "金片查公二适东线心气运志调性了物细正南眼那理圆物",
        "spuId": null,
        "bizValue": null,
        "weightUnit": "千克(kg)",
        "boxPrice": 0,
        "boxNum": 1,
        "limitStock": 1,
        "itemNum": "",
        "shelfNum": "",
        "skuCode": "aaaaaaa",
        "weight": 106,
        "productName": null,
        "unit": "份",
        "sequence": 0
      },
      {
        "skuAttrs": [
          {
            "value": "斗引用完工民北史命",
            "valueId": 0,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000029
          },
          {
            "value": "要点温号温马只成如",
            "valueId": 1,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000030
          }
        ],
        "minOrderCount": 1,
        "id": 76,
        "stock": 0,
        "price": 0,
        "upc": "1D62Cd94-0bBf-2bb7-6fe2-8009EbdcF997",
        "spec": "中级市共大影长打光风离个老导术为前影",
        "spuId": null,
        "bizValue": null,
        "weightUnit": "千克(kg)",
        "boxPrice": 0,
        "boxNum": 1,
        "limitStock": 1,
        "itemNum": "",
        "shelfNum": "",
        "skuCode": "aaaaaaa",
        "weight": 106,
        "productName": null,
        "unit": "份",
        "sequence": 0
      },
      {
        "skuAttrs": [
          {
            "value": "从亲机完物引便交龙不",
            "valueId": 0,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000029
          },
          {
            "value": "称达集放适明见",
            "valueId": 1,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000030
          }
        ],
        "minOrderCount": 1,
        "id": 77,
        "stock": 0,
        "price": 0,
        "upc": "6EDDe112-239E-F17b-B3D3-Acb7E4BF66fD",
        "spec": "指关地具做例又很百和四年毛改受",
        "spuId": null,
        "bizValue": null,
        "weightUnit": "千克(kg)",
        "boxPrice": 0,
        "boxNum": 1,
        "limitStock": 1,
        "itemNum": "",
        "shelfNum": "",
        "skuCode": "aaaaaaa",
        "weight": 106,
        "productName": null,
        "unit": "份",
        "sequence": 0
      }
    ]
  },
  {
    "id": 38,
    "name": "各快革类道变思它细切始应内可",
    "tagList": [
      {
        "tagName": "未分类",
        "sequence": 0,
        "tagId": 1
      }
    ],
    "isSp": 1,
    "spId": "ccEbc8Be-e901-423f-F418-EBf13ffFeE2d",
    "picture": "http://p0.meituan.net/xianfu/5272bfc0a117e2ccea48efc06b79768e67245.jpg",
    "upcCode": "123",
    "monthSale": 1000,
    "sellStatus": 1,
    "skus": [
      {
        "skuAttrs": [
          {
            "value": "你海基装议现价等确",
            "valueId": 0,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000029
          },
          {
            "value": "手解之作部众划业史",
            "valueId": 1,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000030
          }
        ],
        "minOrderCount": 1,
        "id": 78,
        "stock": 0,
        "price": 0,
        "upc": "034B0F68-bBd3-3bf4-c8cE-dfAef9d749dd",
        "spec": "各最时被须器族知门区把外效",
        "spuId": null,
        "bizValue": null,
        "weightUnit": "千克(kg)",
        "boxPrice": 0,
        "boxNum": 1,
        "limitStock": 1,
        "itemNum": "",
        "shelfNum": "",
        "skuCode": "aaaaaaa",
        "weight": 106,
        "productName": null,
        "unit": "份",
        "sequence": 0
      }
    ]
  },
  {
    "id": 39,
    "name": "什称科改列",
    "tagList": [
      {
        "tagName": "未分类",
        "sequence": 0,
        "tagId": 1
      }
    ],
    "isSp": 2,
    "spId": "A78eB146-D168-AFc1-a663-CBbf776A92E6",
    "picture": "http://p0.meituan.net/xianfu/701a8e89aef8e791b8ac7436675fafa3393216.jpg",
    "upcCode": "123",
    "monthSale": 1000,
    "sellStatus": 1,
    "skus": [
      {
        "skuAttrs": [
          {
            "value": "分被科必动话今",
            "valueId": 0,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000029
          },
          {
            "value": "出几组程求技书次业",
            "valueId": 1,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000030
          }
        ],
        "minOrderCount": 1,
        "id": 79,
        "stock": 0,
        "price": 0,
        "upc": "047f41e2-CCF6-F9A5-7DE2-f81f7CbfcEbD",
        "spec": "表计支总本几叫界但次专开证却质不张马过部过天听劳感格权自马",
        "spuId": null,
        "bizValue": null,
        "weightUnit": "千克(kg)",
        "boxPrice": 0,
        "boxNum": 1,
        "limitStock": 1,
        "itemNum": "",
        "shelfNum": "",
        "skuCode": "aaaaaaa",
        "weight": 106,
        "productName": null,
        "unit": "份",
        "sequence": 0
      },
      {
        "skuAttrs": [
          {
            "value": "支外京响较打得",
            "valueId": 0,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000029
          },
          {
            "value": "什图高门般律位",
            "valueId": 1,
            "valueIdPath": null,
            "valuePath": null,
            "sequence": 0,
            "isCustomized": true,
            "attrId": 300000030
          }
        ],
        "minOrderCount": 1,
        "id": 80,
        "stock": 0,
        "price": 0,
        "upc": "eed91492-CF68-4DAc-EEbF-D5Dc23eBfE8A",
        "spec": "连结少指便线路许交真极界即参的个状于造到电养再周",
        "spuId": null,
        "bizValue": null,
        "weightUnit": "千克(kg)",
        "boxPrice": 0,
        "boxNum": 1,
        "limitStock": 1,
        "itemNum": "",
        "shelfNum": "",
        "skuCode": "aaaaaaa",
        "weight": 106,
        "productName": null,
        "unit": "份",
        "sequence": 0
      }
    ]
  }
]
const category1 = {
  firstCategoryId: '1',
  firstCategoryName: '一级类目',
  secondCategoryId: '2',
  secondCategoryName: '二级类目',
  thirdCategoryId: '3',
  thirdCategoryName: '三级类目'
}
const category2 = {
  firstCategoryId: '12',
  firstCategoryName: '一级类目2',
  secondCategoryId: '22',
  secondCategoryName: '二级类目2',
  thirdCategoryId: '32',
  thirdCategoryName: '三级类目2'
}
const hotValue1 = {
  sourceLabel: '',
  hotDataValue: '',
  dataValue: '20%',
  dataDesc: '快速',
  type: 0,
  star: ''
}
const hotValue2 = {
  sourceLabel: '',
  hotDataValue: '',
  dataValue: '20%',
  dataDesc: '快速',
  type: 1,
  star: 4.5
}
data = data.map((item, index) => {
  const category = Math.random() * 10 > 5 ? category1 : category2
  const labelVo = Math.random() * 10 > 5 ? hotValue1 : hotValue2
  const isExist = Math.random() * 10 > 5 ? 0 : 1
  const isHqExist = Math.random() * 10 > 5 ? 0 : 1
  const relatedPoiIds = [Math.floor((Math.random()*10)+1),Math.floor((Math.random()*10)+1)]
  const totalPoiIds = [...relatedPoiIds,Math.floor((Math.random()*10)+1),Math.floor((Math.random()*10)+1),Math.floor((Math.random()*10)+1)]
  delete item.skuAttrs
  return {
    isExist,
    isHqExist,
    relatedPoiIds,
    totalPoiIds,
    isDelete: 0,
    ...item,
    ...category,
    labelVo,
    poiSpuId: Math.random() * 1000 + 1,
    isSp: !isExist ? (Math.random() * 10 > 5 ? 1 : 2) : 0,
    skus: (item.skus || []).map(it => {
        it['skuAttrs'] = Mockjs.mock({ "array|1": [null, [{
            value: '@ctitle(6, 10)',
            valueId: 0,
            valueIdPath: null,
            valuePath: null,
            sequence: 0,
            isCustomized: true,
            attrId: 300000029,
          }, {
            value: '@ctitle(6, 10)',
            valueId: 1,
            valueIdPath: null,
            valuePath: null,
            sequence: 0,
            isCustomized: true,
            attrId: 300000030,
          }]]}).array
      it.monthSale = 12
      it.stock = 13
      it.value = 15
        return it
      })
  }
})
module.exports = function (req) {
  // const { pageNum, pageSize, keyword, leafTagId } = req.body
  return {
    "code": 0,
    "msg": "",
    "data": {
      "recProducts": data,// data.slice(pageSize * (pageNum - 1), pageSize * (pageNum - 1) + Number(pageSize)).filter(item => item.tagList.some(it => keyword ? it.tagName.indexOf(keyword) !== -1 : true)).filter(item => item.tagList.some(it => leafTagId ? Number(it.tagId) === Number(leafTagId) : true)),
      "totalCount": data.length
    }
  }
}
