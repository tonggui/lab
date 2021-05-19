<template>
  <ProductListPage>
    <ErrorBoundary slot="tag-list" :error="tag.error" description="分类获取失败~" @refresh="getTagList">
      <TagListLayout :loading="tag.loading">
        <TagTree
          slot="content"
          show-all-data
          :data-source="tag.list"
          :value="tag.currentTagId"
          @select="handleChangeTag"
        />
      </TagListLayout>
    </ErrorBoundary>
    <div slot="product-list">
      <ErrorBoundary :error="product.error" description="商品获取失败~" @refresh="getProductList">
        <ProductListTable
          :data-source="product.list"
          :columns="columns"
          :pagination="product.pagination"
          :loading="product.loading"
          @page-change="handlePageChange"
          batch-operation
          @on-select="handleSelect"
          @on-select-cancel="handleSelectCancel"
          ref="table"
        >
          <template slot="batchOperation">
            <Tooltip type="help" :offset="80" content="已选择的全部商品，选择上限100个">
              <small>已选择{{ productCount }}个</small>
              <!-- <Checkbox @on-change="handleSelectTagAll" :value="selectStatus.value" :indeterminate="selectStatus.indeterminate">全选所有</Checkbox> -->
            </Tooltip>
          </template>
        </ProductListTable>
      </ErrorBoundary>
    </div>
  </ProductListPage>
</template>
<script>
  import { createNamespacedHelpers } from 'vuex'
  import TagListLayout from '@/views/components/layout/tag-list'
  import ProductListPage from '@/views/components/layout/product-list-page'
  import TagTree from '@components/tag-tree'
  import ProductListTable from '../../components/product-list-table'
  import columns from './columns'
  import { getRuleId } from '@/common/constants'

  const { mapActions, mapState, mapGetters } = createNamespacedHelpers('restricted-purchase')

  export default {
    name: 'auto-clear-stock-product-list',
    props: {
      productCount: Number
    },
    data () {
      return {
        columns
      }
    },
    computed: {
      ...mapState({
        tag: (state) => state.tag,
        product: (state) => state.product,
        productMap: 'productMap'
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
        toggleSelect: 'toggleSelect',
        getTagList: 'getTagList',
        getProductList: 'getProductList'
      }),
      handleSelect (_selectList, product) {
        if (product.limitRuleId && product.limitRuleId + '' !== getRuleId()) {
          this.$Message.error(`该商品已在[${product.limitRuleId}]号规则中，请从该规则中移出商品后再设置`)
          this.$emit('handleSelect', product)
          this.toggleSelect({ product, status: false })
          return
        }
        this.$emit('handleSelect', product)
        this.toggleSelect({ product, status: true })
      },
      handleSelectCancel (_selectList, product) {
        this.$emit('handleSelectCancel', product)

        this.toggleSelect({ product, status: false })
      }
    }
  }
</script>
