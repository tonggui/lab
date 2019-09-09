<template>
  <TagListLayout :loading="loading">
    <TagTree
      slot="content"
      :value="tagId"
      :dataSource="tagList"
      @select="$emit('select', $event)"
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
  import { createNamespacedHelpers, mapActions } from 'vuex'

  const { mapGetters, mapState } = createNamespacedHelpers('searchList')

  export default {
    name: 'product-search-list-tag-list-container',
    computed: {
      ...mapState(['productCount', 'loading', 'tagList']),
      ...mapGetters({
        tagId: 'tagId'
      })
    },
    components: {
      TagListLayout,
      TagTree
    },
    methods: {
      ...mapActions({
        handleTagChange: 'changeTag'
      })
    }
  }
</script>
