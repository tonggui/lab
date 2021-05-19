<template>
  <ErrorBoundary
    :error="error"
    :top="200"
    @refresh="handleRefresh"
    description="分类获取失败～"
  >
    <ManageTagList
      label-in-value
      :loading="loading"
      :tag-list="tagList"
      :product-count="productCount"
      :expand-list="expandList"
      :tag-id="tagId"
      :disabled="isMedicine"
      :toolTipDisable="true"
      :isMerchant="true"
      @change-level="handleChangeLevel"
      @open-sort="$emit('open-sort')"
      @delete="handleDelete"
      @edit="handleEdit"
      @add="handleAdd"
      @select="handleSelect"
      @expand="handleExpand"
      support-top-time
    >
      <div slot="empty" class="empty-tag-list">暂无分类</div>
    </ManageTagList>
  </ErrorBoundary>
</template>
<script>
  import { helper } from '../../store'
  import ManageTagList from '@/views/components/manage-tag-list' // 分类管理
  import withPromiseEmit from '@/hoc/withPromiseEmit'
  // TODO 药品兼容 后期优化
  import { mapModule } from '@/module/module-manage/vue'
  import { BUSINESS_MEDICINE } from '@/module/moduleTypes'

  const { mapGetters, mapState, mapActions } = helper('tagList')

  export default {
    name: 'merchant-product-manage-tag-list-container',
    computed: {
      ...mapState(['productCount', 'expandList', 'loading', 'error']),
      ...mapGetters({
        tagId: 'currentTagId',
        tagList: 'list'
      }),
      ...mapModule({
        isMedicine: BUSINESS_MEDICINE
      })
    },
    components: {
      ManageTagList: withPromiseEmit(ManageTagList)
    },
    methods: {
      ...mapActions({
        handleChangeLevel: 'changeLevel',
        handleEdit: 'modify',
        handleAdd: 'add',
        handleDelete: 'delete',
        handleExpand: 'expand',
        handleRefresh: 'getList',
        handleSelect: 'select'
      })
    }
  }
</script>
<style lang="less" scoped>
  .empty-tag-list {
    margin-top: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
