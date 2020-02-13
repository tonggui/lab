<template>
  <ProductListPage>
    <TagListLayout slot="tag-list">
      <TagTree
        slot="content"
        showAllData
        :data-source="tag.list"
        :value="tag.currentTagId"
        @select="handleChangeTag"
      />
    </TagListLayout>
    <div slot="product-list">
      <ProductListTable
        :dataSource="product.list"
        :columns="columns"
        :pagination="product.pagination"
        :loading="product.loading"
        @page-change="handlePageChange"
        batch-operation
        @on-select="handleSelect"
        @on-select-cancel="handleSelectCancel"
        ref="table"
      >
        <template v-slot:batchOperation="{ selectAll }">
          <Tooltip type="help" content="全选所有：选择当前分类下所有商品">
            <Checkbox @on-change="(status) => handleSelectTagAll(status, selectAll)" v-bind="selectStatus">全选所有</Checkbox>
            <small>已选择0个</small>
          </Tooltip>
        </template>
      </ProductListTable>
    </div>
  </ProductListPage>
</template>
<script>
  import { createNamespacedHelpers } from 'vuex'
  import TagListLayout from '@/views/components/layout/tag-list'
  import ProductListPage from '@/views/components/layout/product-list-page'
  import TagTree from '@components/tag-tree'
  import ProductListTable from '@components/product-list-table'
  import columns from './columns'

  const { mapActions, mapState, mapGetters } = createNamespacedHelpers('autoClearStockConfig')

  export default {
    name: 'auto-clear-stock-product-list',
    data () {
      return {
        columns
      }
    },
    computed: {
      ...mapState({
        tag: (state) => state.tag,
        product: (state) => state.product
      }),
      ...mapGetters({
        selectStatus: 'currentTagState'
      })
    },
    components: {
      TagTree,
      ProductListPage,
      ProductListTable,
      TagListLayout
    },
    methods: {
      ...mapActions({
        handleChangeTag: 'changeTag',
        handlePageChange: 'changePage',
        handleSelectTagAll: 'toggleSelectAll',
        toggleSelect: 'toggleSelect'
      }),
      handleSelect (_selectList, product) {
        this.toggleSelect({ product, status: true })
      },
      handleSelectCancel (_selectList, product) {
        this.toggleSelect({ product, status: false })
      }
    }
  }
</script>
