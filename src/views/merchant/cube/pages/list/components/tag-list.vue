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

  export default {
    name: 'product-search-list-tag-list-container',
    props: {
      tagList: {
        type: Array,
        default: () => ([])
      },
      loading: {
        type: Boolean,
        default: false
      },
      tagId: {
        type: [Number, String]
      },
      productCount: {
        type: Number,
        default: 0
      }
    },
    components: {
      TagListLayout,
      TagTree
    },
    methods: {
    }
  }
</script>
