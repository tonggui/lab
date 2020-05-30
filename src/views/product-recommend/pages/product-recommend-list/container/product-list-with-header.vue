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
          <SelectedProductButtonOperations :total="totalSelectedCount" @on-click-view="drawerVisible = true" @on-click-create="handleClickCreate" />
        </div>
      </Header>
      <ProductTableList slot="product-list" :totalSelectedCount="totalSelectedCount" :maxSelect="maxSelect" />
      <TagList slot="tag-list" />
    </ProductListPage>
    <ProductSelectedDrawer v-model="drawerVisible" @on-drawer-close="drawerVisible = false" />
    <DeleteProductsModal v-model="deleteVisible" :dataSource="dataSource" :isAllDeleted="false" @on-click-reselect="deleteVisible = false" />
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
  import { fetchCheckProducts } from '@/data/repos/product'
  import { helper } from '@/views/product-recommend/store'
  import { objToList } from '../../../utils'

  const { mapActions, mapGetters } = helper()

  export default {
    name: 'product-list-header',
    props: {
    },
    data () {
      return {
        drawerVisible: false,
        error: false,
        maxSelect: 8,
        deleteVisible: false,
        dataSource: []
      }
    },
    computed: {
      ...mapGetters({
        totalSelectedCount: 'getTotalCount',
        selectedProductList: 'getSelectedProducts'
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
        getData: 'getData',
        deSelectProduct: 'deSelectProduct'
      }),
      handleSearch (item) {
        this.getData({ keyword: item.name })
      },
      handleClickCreate () {
        fetchCheckProducts(objToList(this.selectedProductList))
          .then(res => {
            if (!res.deleteSpuList.length) {
              this.$router.push({ path: '/product/recommend/edit', query: this.$route.query })
            } else {
              this.dataSource = res.deleteSpuList
              this.deleteVisible = true
              this.deSelectProduct(res.deleteSpuList)
              this.getData()
            }
          }).catch(err => {
            this.$Message(err.message || err)
          })
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
