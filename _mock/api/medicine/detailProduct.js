/**
 * @url /reuse/sc/product/shangou/medicine/r/detailProduct
 */
module.exports = function(req) {
  return {
    code: 0,
    msg: '',
    data: {
      type: 3,
      id: 111111,
      wm_food_spu_id: 111111,
      wm_product_standard_id: 2222,
      name: '[天龙]维胺酯维E乳膏',
      upc_code: '6937115500061',
      categoryId: 200000769,
      categoryIdPath: ",200000763,200000768,200000769,",
      categoryNamePath: "中西药品,感冒用药,清热解毒",
      ori_price: 22.2,
      price: 349.4,
      sell_status: 0,
      source_food_code: 'fdsfdsfds',
      spPicContent: 'http://p1.meituan.net/xianfu/993ff9b9c46dc0e82c36d237590b9120138045.jpg,http://p1.meituan.net/xianfu/993ff9b9c46dc0e82c36d237590b9120138045.jpg',
      spec: '0.5g*32片',
      stock: 1,
      limitSale: JSON.stringify({
        limitSale: true,
        begin: '20200301',
        end: '20200401',
        type: 1,
        count: 100
      }),
      shippingTimeX: '[[],["11:21-11:24"],["11:21-11:24"],[],["11:21-11:24"],[],[]]',
      'tags|4': [
        {
          'id|+1': 1000001,
          'name|+1': ['清热解毒', '感冒用药', '消化系统', '皮肤用药'],
          code: '',
          'level|1': [1, 2]
        }
      ],
      'wmProductPics|2-3': [
        {
          pic_large_url: 'http://p1.meituan.net/xianfu/993ff9b9c46dc0e82c36d237590b9120138045.jpg'
        }
      ],
      wmProductSpuExtendMap: {
        "1200000015": {
          "value": "1.OTC药品请按药品说明书或在药师指导下购买和使用。",
        },
        "1200000016": {
          "value": '1,2'
        }
      }
    }
  }
}