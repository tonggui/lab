<script>
  import { fetchGetCategoryAttrSwitch } from '@/data/repos/category'
  import withBatchSelectPoi from '@/hoc/withBatchSelectPoi'
  import ProductCreate from './product-create'
  import { forwardComponent } from '@/common/vnode'

  export default {
    name: 'product-batch-create-container',
    data () {
      return {
        categoryAttrSwitch: false,
        modules: {
          hasStock: true,
          shortCut: true,
          sellTime: true,
          picContent: true,
          spPicContent: true,
          description: true,
          suggestNoUpc: true,
          packingbag: true,
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
        },
        onChange: this.getCategoryAttrSwitch
      })(ProductCreate)
    },
    methods: {
      async getCategoryAttrSwitch (poiIdList) {
        let categoryAttrSwitch = false
        if (poiIdList && poiIdList.length > 0) {
          categoryAttrSwitch = await fetchGetCategoryAttrSwitch(poiIdList)
        }
        this.categoryAttrSwitch = categoryAttrSwitch
      }
    },
    render (h) {
      return forwardComponent(this, this.ProductCreateComponent, {
        props: {
          categoryAttrSwitch: this.categoryAttrSwitch,
          modules: this.modules
        }
      })
    }
  }
</script>
<style lang="less" scoped>

</style>
