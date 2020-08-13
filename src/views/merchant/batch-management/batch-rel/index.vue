<template>
  <div>
    <ProductRel
      isBusinessClient
      :routerTagId="routerTagId"
      @poiChange="handlePoiListChanged"
      @relTagChange="handleRelTagListChanged"
    />
    <BatchFooter
      :submitting="submitting"
      confirm-text="开始关联"
      @confirm="handleConfirm"
    />
  </div>
</template>

<script>
  import ProductRel from './components/product-rel'
  import BatchFooter from '@/views/batch-management/components/footer'
  import { KEYS } from '@/views/merchant/batch-management/menus'
  import { fetchSubmitBatchRel } from '@/data/repos/merchantPoi'

  export default {
    name: 'MerchantBatchRel',
    components: {
      ProductRel,
      BatchFooter
    },
    props: {
      routerTagId: [Number, String]
    },
    data () {
      return {
        submitting: false,
        selectedPoiIdList: [],
        selectedTagList: []
      }
    },
    methods: {
      handlePoiListChanged (poiIdList) {
        this.selectedPoiIdList = poiIdList
      },
      handleRelTagListChanged (tagList) {
        this.selectedTagList = tagList
      },
      async handleConfirm () {
        let errorMsg = ''
        if (!this.selectedTagList.length) {
          errorMsg = '请选择需要关联的分类/商品'
        } else if (!this.selectedPoiIdList.length) {
          errorMsg = '请选择需要关联的目标门店'
        }

        if (errorMsg) {
          this.$Message.error(errorMsg)
          return
        }

        this.submitting = true
        try {
          await fetchSubmitBatchRel(this.selectedPoiIdList, this.selectedTagList.map(tagNode => ({
            tagId: tagNode.id,
            includeSpuIds: tagNode.include,
            excludeSpuIds: tagNode.exclude,
            leaf: true
          })))
          this.$Message.success('提交商品关联任务成功，为您跳转到任务列表')
          setTimeout(() => this.$router.push({
            name: KEYS.PROGRESS,
            query: this.$route.query
          }), 1500)
        } catch (e) {
          this.$Message.error(e.message || '提交失败，请重试')
        } finally {
          this.submitting = false
        }
      }
    }
  }
</script>

<style scoped lang="less">

</style>
