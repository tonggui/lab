/**
 * @url /reuse/sc/product/shangou/medicine/r/detailChangeProduct
 */
module.exports = function(req) {
  return {
    code: 0,
    msg: '',
    data: {
      basicInfoList: [
        {
          field: 'wmProductPics',
          oldValue: 'http://p1.meituan.net/xianfu/6722411acf8c32b97d8ad304033258ea194201.jpg,http://p1.meituan.net/xianfu/c6a6e9ea810eb0bc01be75451032f785188079.jpg,http://p1.meituan.net/xianfu/63afa5f0b2688079641d7e2cb635c2b6109815.jpg',
          newValue: 'http://p0.meituan.net/xianfu/4a06ab15f39ce476bbda42d62b3a9b0c611469.jpg,http://p0.meituan.net/xianfu/da31956966e5de4b100cdf6d3cd48144346922.jpg,http://p0.meituan.net/xianfu/4bd337810af62a1a8abdc51f0f654389112141.jpg,http://p0.meituan.net/xianfu/83535dc3a234bbc6efdf1724c69cacc6160709.jpg,http://p0.meituan.net/xianfu/897075f699ee972ed8e8eaffcef44143316319.jpg',
        }
      ],
      categoryInfoList: [
        {
          field: '1200000015',
          oldValue: 'fdsfdsf',
          newValue: 'fdfdsfd'
        },
        {
          field: '1200000016',
          oldValue: '1,2',
          newValue: '0,2,3'
        }
      ]
    }
  }
}