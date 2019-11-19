<script>
  import withBatchSelectPoi from '@/hoc/withBatchSelectPoi'
  import ProductCreate from './product-create'
  import { forwardComponent } from '@/common/vnode'

  export default {
    name: 'product-batch-create-container',
    data () {
      return {
        modules: {
          hasStock: true,
          shortCut: true,
          sellTime: true,
          picContent: true,
          spPicContent: true,
          description: true,
          suggestNoUpc: true,
          packingBag: true,
          productVideo: false, // 批量不支持视频
          showCellularTopSale: false,
          allowApply: true
        }
      }
    },
    created () {
      this.ProductCreateComponent = withBatchSelectPoi({
        allowClear: true,
        onEmpty: () => {
          this.$Message.error('请先选择目标门店')
        }
      })(ProductCreate)
    },
    render (h) {
      return forwardComponent(this, this.ProductCreateComponent, {
        props: {
          modules: this.modules
        }
      })
    }
  }
</script>
<style lang="less" scoped>

</style>
