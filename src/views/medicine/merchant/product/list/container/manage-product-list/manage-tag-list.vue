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
      @change-level="handleChangeLevel"
      @open-sort="$emit('open-sort')"
      @delete="handleDelete"
      @edit="handleEdit"
      @add="handleAdd"
      @select="handleSelect"
      @expand="handleExpand"
      support-top-time
    />
  </ErrorBoundary>
</template>
<script>
  import { helper } from '../../store'
  import ManageTagList from '@/views/components/manage-tag-list' // 分类管理
  import withPromiseEmit from '@/hoc/withPromiseEmit'

  const { mapGetters, mapState, mapActions } = helper('tagList')

  export default {
    name: 'merchant-product-manage-tag-list-container',
    computed: {
      ...mapState(['productCount', 'expandList', 'loading', 'error']),
      ...mapGetters({
        tagId: 'currentTagId',
        tagList: 'list'
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
</style>
