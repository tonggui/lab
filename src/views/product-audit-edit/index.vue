<template>
  <ProductEdit :mode="mode" />
</template>

<script>
  import _isString from 'lodash/isString'
  import { EDIT_TYPE } from '@/data/enums/common'
  import { getPoiId } from '@/common/constants'
  import { setup, destroy, registerActionHandler, unregisterActionHandler, sendMessage } from '@/common/bridge/bridge_manager'
  import { convertProductFormToServer } from '@/data/helper/product/withCategoryAttr/convertToServer'
  import ProductEdit from '../product-edit/index'

  export default {
    name: 'product-audit-edit',
    components: { ProductEdit },
    provide () {
      return {
        injectProductForm: this.injectProductForm
      }
    },
    computed: {
      mode () {
        return EDIT_TYPE.CHECK_AUDIT
      }
    },
    methods: {
      injectProductForm ($productForm) {
        this.productForm = $productForm
      },
      async handleGetProductDataEvent ({ mid }) {
        if (this.productForm) {
          try {
            const { product } = await this.productForm.validateAndCompute()
            const productInfo = convertProductFormToServer({
              poiId: getPoiId(),
              product,
              context: {
                entranceType: this.$route.query.entranceType,
                dataSource: this.$route.query.dataSource
              }
            })
            sendMessage('productData', productInfo, null, mid)
          } catch (e) {
            const errorMsg = _isString(e) ? e : e.message
            sendMessage('productData', null, errorMsg, mid)
          }
        }
      }
    },
    mounted () {
      window.t = this
      setup()
      registerActionHandler('getProductData', this.handleGetProductDataEvent)
    },
    beforeDestroy () {
      unregisterActionHandler('getProductData', this.handleGetProductDataEvent)
      destroy()
    }
  }
</script>
