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
          <SelectedProductButtonOperations @on-click-view="drawerVisible = true" />
        </div>
      </Header>
      <ProductTableList slot="product-list" :totalSelectedCount="totalSelectedCount" :maxSelect="maxSelect" />
      <TagList slot="tag-list" />
    </ProductListPage>
    <ProductSelectedDrawer v-model="drawerVisible" @on-drawer-close="drawerVisible = false" />
    <DeleteProductsModal v-model="deleteVisible" />
  </ErrorBoundary>
</template>
<script>
  import ProductListPage from '@/views/components/layout/product-list-page'
  import Header from '@/components/header-layout'
  import ProductSearch from '../components/product-search'
  import ProductTableList from '../components/product-table-list'
  import ProductSelectedDrawer from './product-selected-drawer'
  import SelectedProductButtonOperations from '../components/selected-product-button-operations'
  import TagList from './tag-list'
  import DeleteProductsModal from '../../../components/delete-products-modal'
  import { helper } from '@/views/product-recommend/store'

  const { mapActions, mapGetters } = helper()

  export default {
    name: 'product-list-header',
    props: {
      title: {
        type: String,
        default: ''
      },
      desc: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        drawerVisible: false,
        error: false,
        maxSelect: 8,
        deleteVisible: false
      }
    },
    computed: {
      ...mapGetters({
        totalSelectedCount: 'getTotalCount'
      })
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
    watch: {
      totalSelectedCount (val) {
        if (!val) this.drawerVisible = false
      }
    },
    methods: {
      ...mapActions({
        getData: 'getData'
      }),
      handleSearch (item) {
        this.getData({ keyword: item.name })
      }
    },
    mounted () {
      try {
        this.getData()
      } catch (err) {
        console.log(err)
      }
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
