/**
 * @url /reuse/sc/product/retail/r/indexPageModel
 */
const medicine = {
  realPoiTag: [
    {
      isPrimary: 1,
      level: 2,
      tagIds: null,
      name: "综合药店",
      id: 179
    }
  ],
  poiTag: [
    {
      level: 0,
      tagIds: "179,180,181",
      name: "药品类",
      id: 22
    }
  ]
}
const product = {
  realPoiTag: [
    {
      isPrimary: 1,
      level: 2,
      tagIds: null,
      name: "超市",
      id: 173
    }
  ],
  poiTag: [{
    level: 0,
    tagIds: '106,175,2004,4014,4015,4016,4017,4018,4019,4020,4021,20,173',
    name: '五金杂货/进口零食',
    id: 4015
  },
  {
    level: 0,
    tagIds: '173,174,21',
    name: '百货果蔬',
    id: 21
  }]
}
module.exports = function () {
  return {
    data: {
<<<<<<< HEAD
=======
      realPoiTag: [
        {
          isPrimary: 1,
          level: 2,
          tagIds: null,
          name: '超市',
          id: 11020000
        }
      ],
>>>>>>> master
      gray: {
        batch_sync: true,
        multi_poi: true,
        process_progress: true,
        product_edit_vue: true,
        product_list: true,
        product_list_vue: true,
        product_search_vue: true,
        single_poi: true,
        batch_create_vue: true,
        medicine_edit_vue: true
      },
      isB: 1,
      prefix: '/',
      wmPoiId: 5108726,
<<<<<<< HEAD
      message: '',
      ...product
=======
      poiTag: [
        {
          level: 0,
          tagIds: '13030000,13010000',
          name: '五金杂货/进口零食',
          id: 13030000
        },
        {
          level: 0,
          tagIds: '13030000',
          name: '百货果蔬',
          id: 13000000
        }
      ],
      message: ''
>>>>>>> master
    },
    code: 0,
    msg: ''
  }
}
