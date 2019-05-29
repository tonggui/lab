/*
 * @description
 *   Please write the products script's description
 * @author
 *   rdshoep (zhangliang15@meituan.com)
 * @version
 *   1.0.0(2019-05-27)
 */
export default {
  state () {
    return {
      loading: false,
      selectIds: [],
      selectSkuIds: [],
      list: [],
      pagination: {
        pageSize: 20,
        current: 1,
        total: 0,
        showQuickJumper: true,
        showSizeChanger: true,
        pageSizeOptions: ['20', '50', '100']
      },
      query: {
        sorter: {},
        tagId: 0,
        state: 0
      }
    }
  }
}
