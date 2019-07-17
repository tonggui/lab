/*
 * @description
 *   Please write the data script's description
 * @author
 *   rdshoep (zhangliang15@meituan.com)
 * @version
 *   1.0.0(2019-07-17)
 */
export const createInitialProduct = () => {
  return {
    name: '',
    tagList: [],
    category: undefined,
    brand: undefined,
    origin: undefined,
    pictureList: [],
    skuList: [],
    attributes: [],
    shippingTime: {
      status: false
    },
    labels: [],
    minOrderCount: 1,
    description: '',
    picContent: []
  }
}
