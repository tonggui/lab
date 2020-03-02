<script>
  import withBatchSelectPoi from '@/hoc/withBatchSelectPoi'
  import ProductModify from './product-modify'
  import { forwardComponent } from '@/common/vnode'
  import {
    PRODUCT_PICTURE_CONTENT,
    PRODUCT_TAG_COUNT
  } from '@/module/moduleTypes'
  import { mapModule } from '@/module/module-manage/vue'
  import { fetchGetTagList } from '@/data/repos/category'

  export default {
    name: 'product-batch-modify-container',
    props: {
      isSinglePoi: Boolean,
      isMedicine: Boolean
    },
    data () {
      return {
        tagList: []
      }
    },
    computed: {
      ...mapModule({
        showPicContent: PRODUCT_PICTURE_CONTENT,
        maxTagCount: PRODUCT_TAG_COUNT
      }),
      modules () {
        return {
          showPicContent: this.showPicContent,
          maxTagCount: this.maxTagCount,
          isSinglePoi: this.isSinglePoi,
          isMedicine: this.isMedicine,
          tagList: this.tagList
        }
      }
    },
    async mounted () {
      if (this.isSinglePoi) {
        try {
          const tagList = await fetchGetTagList()
          this.tagList = tagList
        } catch (err) {
          console.error(err)
        }
      }
    },
    created () {
      this.ProductModifyComponent = withBatchSelectPoi({
        allowClear: true,
        onEmpty: () => {
          this.$Message.error('请先选择目标门店')
        }
      })(ProductModify)
    },
    render (h) {
      return forwardComponent(this, this.ProductModifyComponent, {
        props: {
          context: this.modules,
          isSinglePoi: this.isSinglePoi
        }
      })
    }
  }
</script>
