<template>
  <Layout>
    <template slot="header">
      <slot name="header"></slot>
    </template>
    <TagLayout slot="tag-list" :loading="loading">
      <TagTree
        slot="content"
        :value="tagId"
        :dataSource="tagList"
        @select="handleSelect"
        showAllData
      >
        <slot name="tag-empty">
          <div slot="empty" class="empty">暂无分类</div>
        </slot>
      </TagTree>
    </TagLayout>
    <ProductTable
      slot="product-list"
      :batchOperation="batchOperation"
      :dataSource="productList"
      :columns="columns"
      :pagination="pagination"
      :loading="loading"
      @page-change="handlePageChange"
      @batch="handleBatch"
    />
  </Layout>
</template>
<script>
  import Layout from '@/views/components/product-list/layout/page'
  import TagLayout from '@/views/components/product-list/layout/tag-list'
  import TagTree from '@components/tag-tree'
  import ProductTable from '@components/product-list-table'

  export default {
    name: 'search-list-container',
    props: {
      loading: Boolean,
      tagId: Number,
      tagList: Array,
      productList: Array,
      pagination: Object,
      batchOperation: {
        type: Array,
        default: () => []
      },
      columns: {
        type: Array,
        required: true
      }
    },
    components: {
      Layout,
      TagLayout,
      TagTree,
      ProductTable
    },
    methods: {
      handleBatch (...rest) {
        return this.$emit('batch', ...rest)
      },
      handlePageChange (page) {
        return this.$emit('page-change', page)
      },
      handleSelect (id) {
        return this.$emit('tag-id-change', id)
      }
    }
  }
</script>
<style lang="less" scoped>
.empty {
  text-align: center;
  position: absolute;
  width: 100%;
  top: 40%;
}
</style>
