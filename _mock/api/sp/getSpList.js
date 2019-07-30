/**
 * @url /reuse/sc/product/retail/r/getStandardProductListWithCond
 */
module.exports = function(req) {
  const productName = req.body.productName;
  const pageNo = +req.body.pageNo;
  const pageSize = +req.body.pageSize;
  const categoryId = +req.body.categoryId;
  const totalCount = productName ? (productName === 'none' ? 0 : 30) : 50;
  const pageCount = Math.ceil(totalCount / pageSize);
  const count = productName === 'none' ? 0 : 20;
  return {
    msg: '',
    code: 0,
    data: {
      pageNo,
      pageSize,
      totalCount,
      pageCount,
      [`list|${count}`]: [
        {
          'id|+1': pageSize * (pageNo - 1) + 1,
          'isSp|1': [0, 1],
          ean: '1234567890',
          name: '可口可乐,@cname',
          'brandId|+1': 1111,
          brandNamePath: '可口可乐',
          'weight|+1': 100,
          spec: "1500ml",
          pic: "http://p0.meituan.net/shangchao/6dfc564764de427f99bf7bc478a17baa.jpg@88h_88w_1e",
          'existInPoi|1': [false, true],
          source: 6,
          categoryId,
          categoryName: "哈哈",
          categoryIdPath: "12/123",
          categoryNamePath: "哈哈/呵呵",
          unit: "罐",
          origin: 0,
          description: "",
          sequence: 1,
          checkStatus: 0,
          checkerId: 0,
          checkerName: "",
          checkRemark: "",
          checkTime: 1527478723783,
          isMultiEan: 0,
          valid: 1,
          muid: 11,
          muname: "",
          ctime: 1527478723783,
          utime: 1527478723783,
          cuname: "",
          cuid: 11,
          eanList: [],
          is_receipt: 1,
          receiptorId: 11,
          suggestedPrice: 10,
          riseMax: 1,
          dropMax: 0,
          originType: 1,
          refCount: 11111111,
          avgPrice: 10,
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
              upcCode: '1234567890',
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
      ],
    },
  };
};
