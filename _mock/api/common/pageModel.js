/**
 * @url /reuse/sc/product/retail/r/indexPageModel
 */
module.exports = function () {
  return {
    data: {
      realPoiTag: [
        {
          isPrimary: 1,
          level: 2,
          tagIds: null,
          name: '超市',
          id: 13030000
        }
      ],
      gray: {
        batch_sync: true,
        multi_poi: true,
        process_progress: true,
        product_edit_vue: true,
        product_list: true,
        product_list_vue: true,
        product_search_vue: true,
        single_poi: true,
        batch_create_vue: true
      },
      isB: 1,
      prefix: '/',
      wmPoiId: 5108726,
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
    },
    code: 0,
    msg: ''
  }
}
