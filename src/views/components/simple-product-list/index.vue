<template>
  <Layout>
    <template slot="header">
      <slot name="header"></slot>
    </template>
    <TagLayout slot="tag-list" :loading="tagLoading || loading">
      <TagTree
        slot="content"
        :value="tagId"
        :dataSource="tagList"
        @select="handleSelect"
        showAllData
      >
        <template slot="empty">
          <slot name="tag-empty" v-if="!(tagLoading || loading)">
            <Empty description="暂无分类" />
          </slot>
        </template>
      </TagTree>
    </TagLayout>
    <ProductTable
      slot="product-list"
      :batchOperation="batchOperation"
      :dataSource="productList"
      :columns="columns"
      :pagination="pagination"
      :loading="productLoading || loading"
      @page-change="handlePageChange"
      @batch="handleBatch"
      :show-header="showHeader"
    >
      <template slot="empty">
        <slot name="product-empty" v-if="!(productLoading || loading)">
        </slot>
      </template>
    </ProductTable>
  </Layout>
</template>
<script>
  import Layout from '@/views/components/layout/product-list-page'
  import TagLayout from '@/views/components/layout/tag-list'
  import TagTree from '@components/tag-tree'
  import ProductTable from '@components/product-list-table'

  export default {
    name: 'smpile-product-list-container',
    props: {
      loading: Boolean,
      productLoading: Boolean,
      tagLoading: Boolean,
      tagId: Number,
      tagList: Array,
      productList: Array,
      pagination: Object,
      batchOperation: Array,
      showHeader: Boolean,
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
