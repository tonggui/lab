<script>
  import withBatchSelectPoi from '@/hoc/withBatchSelectPoi'
  import ProductCreate from './product-create'
  import { forwardComponent } from '@/common/vnode'
  import {
    PROPERTY_LOCK,
    WEIGHT_REQUIRED,
    UPC_REQUIRED,
    PRODUCT_PICTURE_CONTENT,
    PRODUCT_TAG_COUNT
  } from '@/module/subModule/product/moduleTypes'
  import { mapModule } from '@/module/module-manage/vue'

  export default {
    name: 'product-batch-create-container',
    created () {
      this.ProductCreateComponent = withBatchSelectPoi({
        allowClear: true,
        onEmpty: () => {
          this.$Message.error('请先选择目标门店')
        }
      })(ProductCreate)
    },
    computed: {
      ...mapModule('product', {
        propertyLock: PROPERTY_LOCK,
        weightRequired: WEIGHT_REQUIRED,
        upcRequired: UPC_REQUIRED,
        showPicContent: PRODUCT_PICTURE_CONTENT,
        maxTagCount: PRODUCT_TAG_COUNT
      }),
      modules () {
        return {
          isBatch: true, // 批量标识
          propertyLock: this.propertyLock,
          requiredMap: {
            weight: this.weightRequired,
            upc: this.upcRequired
          },
          shortCut: true,
          sellTime: true,
          picContent: this.showPicContent,
          description: true,
          productVideo: false,
          packingBag: true,
          maxTagCount: this.maxTagCount,
          showCellularTopSale: false,
          allowBrandApply: false,
          allowAttrApply: false
        }
      }
    },
    render (h) {
      return forwardComponent(this, this.ProductCreateComponent, {
        props: {
          suggestNoUpc: false,
          modules: this.modules
        }
      })
    }
  }
</script>
<style lang="less" scoped>

</style>
