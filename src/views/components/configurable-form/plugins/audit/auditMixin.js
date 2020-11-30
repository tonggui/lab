import { debounce, get } from 'lodash'
import { sameCategoryAndCategoryAttrs } from '@/common/product/audit'

export default (api) => {
  const { fetchGetSpInfoByUpc, fetchNeedAudit } = api
  return {
    data () {
      return {
        poiNeedAudit: false, // 门店开启审核状态
        supportAudit: true, // 是否支持审核状态
        categoryNeedAudit: false,
        originalProductCategoryNeedAudit: false,
        upcIsSp: true,
        productInfoByUpc: {}, // 编辑前upc查询的基础库信息
        upcProductNeedAudit: true // 基础库中已存在信息与修改后信息对比是否需审核
      }
    },
    watch: {
      'originalFormData.skuList': {
        async handler (val) {
          if (val) {
            const validSkuUpcCode = get(val.find(item => item.editable), 'upcCode', '').trim()
            this.productInfoByUpc = await this.getSpInfoByUpc(validSkuUpcCode)
            this.compareUpcProductWithEditProduct()
          }
        }
      },
      'product.normalAttributesValueMap' (val) {
        if (this.productInfoByUpc.category) {
          this.compareUpcProductWithEditProduct()
        }
      },
      'product.category.id' (id) {
        // 仅在类目改变时重新获取
        if (id !==
          get(this.originalFormData, 'category.id')) this.getGetNeedAudit()
        if (this.productInfoByUpc.category) {
          this.compareUpcProductWithEditProduct()
        }
      },
      'product.skuList' (newSkuList = [], oldSkuList = []) {
        const newSkuUpcCode = get(newSkuList.find(item => item.editable), 'upcCode', '').trim()
        const oldSkuUpcCode = get(oldSkuList.find(item => item.editable), 'upcCode', '').trim()

        if (newSkuUpcCode && newSkuUpcCode !== oldSkuUpcCode) {
          console.log('获取upcCode合法', newSkuUpcCode)
          this.getUpcIsSp(newSkuUpcCode)
          this.upcProductNeedAudit = true
        } else if (!newSkuUpcCode) {
          this.upcIsSp = true
        }
      }
    },
    methods: {
      compareUpcProductWithEditProduct () {
        this.upcProductNeedAudit = !sameCategoryAndCategoryAttrs(this.productInfoByUpc, this.product)
      },
      async getSpInfoByUpc (upcCode) {
        const res = await fetchGetSpInfoByUpc(upcCode)
        return res
      },
      getUpcIsSp: debounce(async function (upcCode) {
        try {
          this.upcIsSp = !!await this.getSpInfoByUpc(upcCode)
        } catch (err) {
          this.upcIsSp = false
        }
      }, 200),
      async getGetNeedAudit (changeOrigin = false) {
        const { category = { id: '' } } = this.product
        // 获取商品是否满足需要送审条件
        if (category && category.id) {
          const { poiNeedAudit, categoryNeedAudit } = await fetchNeedAudit(category.id)
          this.poiNeedAudit = poiNeedAudit
          this.categoryNeedAudit = categoryNeedAudit
          if (changeOrigin) this.originalProductCategoryNeedAudit = categoryNeedAudit
        }
      }
    }
  }
}
