<template>
  <div :data-lx-param="param">
    <ProductListPage class="product-list-container">
      <Header slot="header" class="header-slot-tabs">
        <Tabs slot="left" class="header-left-with-tabs" @on-change="getData">
          <ProductSearch @on-search="handleSearch" :searchValue="keyword" slot="tabs-extra" style="margin-right: 0" />
        </Tabs>
      </Header>
      <template slot="content">
        <ErrorPage @on-retry="getData" v-if="!loading && listError" />
        <EmptyPage v-else-if="!loading && !listError && !list.length && !keyword" desc="暂无上架商品推荐" />
        <EmptyPage v-else-if="!loading && !listError && !list.length && keyword" desc="暂无搜索结果" tip="可更换搜索词试试～" />
      </template>
      <template>
        <TagList slot="tag-list" @on-select="handleChangeTag" class="content-tag" />
        <ProductTableList
          slot="product-list"
          :maxSelect="maxSelect"
          :selectedIdList="selectedIdList"
          @on-select="handleSelectProduct"
          @on-de-select="handleDeSelectProduct"
        />
      </template>
      <div slot="footer" class="footer-button">
        <SelectedProductButtonOperations
          :total="totalSelectedCount"
          btnText="确定创建"
          @on-click-view="drawerVisible = true"
          @on-click-create="handleClickCreate"
        />
      </div>
    </ProductListPage>
    <ProductSelectedDrawer
      v-model="drawerVisible"
      :total="totalSelectedCount"
      @on-drawer-close="drawerVisible = false"
      @on-click-create="handleClickCreate"
    />
    <DeleteProductsModal
      v-model="deleteVisible"
      :dataSource="deletedProductList"
      :isAllDeleted="isAllDeleted"
      @on-click-reselect="deleteVisible = false"
      @on-click-create="handleGoToMultiCubeEdit"
    />
  </div>
</template>
<script>
  import ProductListPage from '@/views/components/layout/product-list-page'
  import Header from '@/components/header-layout'
  import ProductSearch from '@/views/product-recommend/pages/product-recommend-list/components/product-search'
  import SelectedProductButtonOperations from '../components/selected-product-button-operations'
  import DeleteProductsModal from '../../../components/delete-products-modal'
  import ErrorPage from '@/views/product-recommend/pages/product-recommend-list/components/error'
  import EmptyPage from '@/views/product-recommend/pages/product-recommend-list/components/empty'
  import { fetchMultiCubeCheckProducts } from '@/data/repos/merchantCube'
  import TagList from './tag-list'
  import Tabs from './product-tabs'
  import ProductTableList from './product-list'
  import ProductSelectedDrawer from './product-selected-drawer'
  import { helper } from '../../../store'
  import { objToArray } from '../../../utils'

  const MAX_SELECT = 100 // 最大可选数量

  const { mapActions, mapState } = helper('multiCubeList')
  export default {
    name: 'product-list-with-header',
    props: {
      selectedIdList: Array,
      classifySelectedProducts: Object
    },
    data () {
      return {
        drawerVisible: false,
        maxSelect: MAX_SELECT,
        deleteVisible: false,
        deletedProductList: [],
        editProductList: [],
        isAllDeleted: false
      }
    },
    computed: {
      ...mapState({
        currentTabId: state => state.currentTabId,
        loading: state => state.tagList.loading,
        list: state => state.tagList.list,
        listError: state => state.tagList.error,
        keyword: state => state.productList.filters.keyword
      }),
      param () {
        return JSON.stringify({
          tab_id: this.currentTabId
        })
      },
      totalSelectedCount () {
        const classifySelectedProducts = this.$store.state.productMultiCubeRecommend.classifySelectedProducts
        let totalLength = 0
        for (let key in classifySelectedProducts) {
          totalLength += classifySelectedProducts[key].productList.length
        }
        return totalLength
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
      DeleteProductsModal,
      EmptyPage,
      ErrorPage,
      Tabs
    },
    methods: {
      ...mapActions({
        getTabList: 'getTabList',
        getScopeList: 'getScopeList',
        getData: 'getData',
        search: 'search',
        handleChangeTag: 'changeTag',
        destroy: 'destroy'
      }),
      handleDeSelectProduct (productList) {
        this.$emit('on-de-select', productList)
      },
      handleSelectProduct (productList) {
        this.$emit('on-select', productList)
      },
      handleSearch (item) {
        this.search({ keyword: item.name })
      },
      handleGoToMultiCubeEdit () {
        this.$emit('set-edit-product', this.editProductList)
        this.$router.push({ name: 'merchantCubeEdit', query: this.$route.query })
      },
      handleClickCreate (callback) {
        if (this.drawerVisible) this.drawerVisible = false
        fetchMultiCubeCheckProducts(objToArray(this.classifySelectedProducts))
          .then(res => {
            this.deletedProductList = res.deletedProductList
            this.editProductList = res.editProductList
            if (!res.deletedProductList.length) {
              this.handleGoToMultiCubeEdit()
            } else {
              this.isAllDeleted = res.deletedProductList.length === this.totalSelectedCount
              this.deleteVisible = true
              this.$emit('on-de-select', res.deletedProductList)
              this.getData()
            }
          }).catch(err => {
            console.error(err)
            this.$Message.error(err.message || err)
          }).finally(() => {
            callback && callback()
          })
      }
    },
    async mounted () {
      await this.getScopeList()
      await this.getTabList()
      await this.getData()
    },
    beforeDestroy () {
      this.destroy()
    }
  }
</script>

<style lang="less" scoped>
.product-list-container {
  margin-bottom: 0;
  height: 80%;
  width:1280px;
  padding-bottom: 60px;
  .header-slot-tabs {
    height: auto;
    max-height: 109px;
    padding: 0;
  }
  .header-left {
    height: 100%;
    display: flex;
    align-items: center;
  }
  .header-left-with-tabs {
    width: 100%;
  }
  .header-left .teacher {
    line-height: 14px;
    font-size: 14px;
    color: #cccccc;
    font-family: PingFangSC-Regular;
    text-decoration: underline;
    margin-left: 16px;
  }
  .header-right {
    display: flex;
    align-items: center;
    font-family: PingFangSC-Regular;
  }
  /deep/ .product-list-page-layout-content {
    min-height: calc(100% - 158px);
  }
  /deep/ .product-list-page-layout-product-list {
    display: flex;
    flex-direction: column;
  }
  .content {
    &-tag {
      overflow: auto;
    }
  }
  .footer-button {
    display: flex;
    position: fixed;
    flex-direction: column;
    width: inherit;
    height: 60px;
    color: #CCCCCC;
    background: #FFFFFF;
    box-shadow: 0 0 6px 0;
    text-align: right;
    line-height: 5em;
    bottom: 0;
    clear:both;
  }
}
</style>
