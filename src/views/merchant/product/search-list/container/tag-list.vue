<template>
  <ErrorBoundary
    :error="error"
    @refresh="getList"
    description="分类获取失败～"
  >
    <TagListLayout :loading="loading">
      <TagTree
        slot="content"
        :value="currentTagId"
        :dataSource="list"
        @select="handleTagIdChange"
        @expand="handleExpand"
        showAllData
        :productCount="productCount"
        :expandList="expandList"
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
    name: 'merchant-search-list-tag-container',
    computed: {
      ...mapState(['error', 'loading', 'list', 'productCount', 'expandList']),
      ...mapGetters(['currentTagId'])
    },
    methods: {
      ...mapActions({
        handleExpand: 'expand'
      }),
      ...listMapActions({
        getList: 'getTagList',
        handleTagIdChange: 'changeCurrentTag'
      })
    },
    components: {
      TagListLayout,
      TagTree
    }
  }
</script>
