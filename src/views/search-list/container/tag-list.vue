<template>
  <TagListLayout :loading="loading">
    <TagTree
      slot="content"
      labelInValue
      :value="tagId"
      :dataSource="list"
      @select="handleTagChange"
      showAllData
      :productCount="productCount"
    >
      <template slot="empty">
        <Empty description="暂无分类" v-if="!loading" />
      </template>
    </TagTree>
  </TagListLayout>
</template>
<script>
  import TagTree from '@/components/tag-tree'
  import TagListLayout from '@/views/components/layout/tag-list'
  import { createNamespacedHelpers } from 'vuex'

  const { mapGetters, mapState } = createNamespacedHelpers('searchList/tagList')

  export default {
    name: 'product-search-list-tag-list-container',
    computed: {
      ...mapState(['productCount', 'loading']),
      ...mapGetters({
        tagId: 'currentTagId',
        list: 'list'
      })
    },
    components: {
      TagListLayout,
      TagTree
    },
    methods: {
      handleTagChange (tag) {
        this.$emit('select', tag)
      }
    }
  }
</script>
