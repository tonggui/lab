<template>
  <ErrorBoundary
    :top="200"
    :error="error"
    @refresh="getData"
    description="搜索哪里出了问题～"
  >
    <ProductListPage>
      <Header slot="header">
        <div slot="left">新店必建商品</div>
        <div slot="right" class="header-right">
          <ProductSearch @on-search="handleSearch" />
          <SelectedProductButtonOperations :total="totalSelectedCount" @on-click-view="drawerVisible = true" />
        </div>
      </Header>
      <ProductTableList slot="product-list" @select="handleSelectProduct" @de-select="handleDeSelectProduct" :maxSelect="maxSelect" :selectedIdList="selectedIdList" />
      <TagList slot="tag-list" @select="handleChangeTag" />
    </ProductListPage>
    <ProductSelectedDrawer v-model="drawerVisible" @on-drawer-close="drawerVisible = false" :total="totalSelectedCount" />
    <DeleteProductsModal v-model="deleteVisible" />
  </ErrorBoundary>
</template>
<script>
  import ProductListPage from '@/views/components/layout/product-list-page'
  import Header from '@/components/header-layout'
  import ProductSearch from '../components/product-search'
  import SelectedProductButtonOperations from '../components/selected-product-button-operations'
  import DeleteProductsModal from '../../../components/delete-products-modal'
  import TagList from './tag-list'
  import ProductTableList from './product-list'
  import ProductSelectedDrawer from './product-selected-drawer'
  import { helper } from '@/views/product-recommend/store'

  const { mapActions } = helper('recommendList')

  export default {
    name: 'product-list-with-header',
    props: {
      selectedIdList: Array
    },
    data () {
      return {
        drawerVisible: false,
        error: false,
        maxSelect: 11,
        deleteVisible: false
      }
    },
    components: {
      ProductListPage,
      Header,
      ProductSearch,
      ProductTableList,
      TagList,
      ProductSelectedDrawer,
      SelectedProductButtonOperations,
      DeleteProductsModal
    },
    computed: {
      totalSelectedCount () {
        return this.selectedIdList.length
      }
    },
    methods: {
      ...mapActions({
        getData: 'getData',
        search: 'search',
        handleChangeTag: 'changeTag'
      }),
      handleDeSelectProduct (productList) {
        this.$emit('de-select', productList)
      },
      handleSelectProduct (productList) {
        this.$emit('select', productList)
      },
      handleSearch (item) {
        this.search({ keyword: item.name })
      }
    },
    mounted () {
      this.getData()
    }
  }
</script>

<style lang="less" scoped>
.header-right {
  display: flex;
  align-items: center;
  font-family: PingFangSC-Regular;
}
</style>
