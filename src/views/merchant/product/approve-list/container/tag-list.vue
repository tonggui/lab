<template>
  <ErrorBoundary
    slot="tag-list"
    :error="error"
    @refresh="getTagList"
    description="分类获取失败～"
  >
    <TagListLayout :loading="loading">
      <TagTree
        slot="content"
        :value="currentTagId"
        :dataSource="list"
        @select="handleTagChange"
        @expand="handleExpand"
        showAllData
        :productCount="productCount"
      >
        <template slot="empty">
          <Empty description="暂无分类" v-if="!loading" />
        </template>
      </TagTree>
    </TagListLayout>
  </ErrorBoundary>
</template>
<script>
  import TagListLayout from '@/views/components/layout/tag-list'
  import TagTree from '@/components/tag-tree'
  import { helper } from '../store'

  const { mapActions, mapState, mapGetters } = helper('tag')
  const { mapActions: listMapActions } = helper()

  export default {
    name: 'merchant-approve-list-tag-container',
    computed: {
      ...mapState(['error', 'loading', 'list', 'productCount', 'expandList']),
      ...mapGetters(['currentTagId'])
    },
    methods: {
      ...mapActions({
        getList: 'getList',
        handleExpand: 'expand'
      }),
      ...listMapActions({
        handleTagChange: 'changeCurrentTag'
      })
    },
    components: {
      TagListLayout,
      TagTree
    }
  }
</script>
