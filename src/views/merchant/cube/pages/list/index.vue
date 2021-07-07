<template>
  <div class="merchant-cube-list-container">
    <ErrorBoundary
      type="loading"
      :error="pageError"
      @refresh="handleRefresh"
    >
      <SelectedScopeShop @updateSelectedProducts="updateSelectedProducts"/>
      <ProductListFixedPage class="product-recommend-container-product">
        <div slot="content" class="product-recommend-container-product-content">
          <ProductListWithHeader
            :selectedIdList="selectedIdList"
            :classifySelectedProducts="classifySelectedProducts"
            @on-select="handleSelect"
            @on-de-select="handleDeSelect"
            @set-edit-product="handleSetEditProduct"
            class="recommend-table-list"
          />
        </div>
      </ProductListFixedPage>
    </ErrorBoundary>
  </div>
</template>

<script>
  import ProductListFixedPage from '@/views/components/layout/product-list-fixed-page'
  import ProductListWithHeader from './container/product-list-with-header'
  import SelectedScopeShop from './components/select-scope'
  import { helper } from '../../store'
  import { get } from 'lodash'

  const { mapState, mapActions } = helper()

  export default {
    name: 'cubeList',
    data () {
      return {
        title: '店内暂无商品',
        desc: '',
        error: false
      }
    },
    watch: {
      'currentScope': {
        immediate: true,
        handler (v) {
          // this.updateSelectedProducts()
        }
      }
    },
    computed: {
      ...mapState({
        currentScope: state => state.multiCubeList.productList.scopeId,
        scopeList: state => state.multiCubeList.scopeList,
        currentPoiIds: state => state.multiCubeList.currentPoiIds,
        classifySelectedProducts: 'classifySelectedProducts',
        tagListError: state => state.multiCubeList.tagList.error,
        productListError: state => state.multiCubeList.productList.error
      }),
      operationInfo () {
        const scope = this.scopeList && this.scopeList.find(item => item.id === this.currentScope.poiId)
        return {
          cityName: get(scope, 'cityName') || '',
          poiName: get(scope, 'poiName') || ''
        }
      },
      pageError () {
        return this.error && this.tagListError && this.productListError
      },
      selectedIdList () {
        console.log(this.classifySelectedProducts)
        return this.selectionList()
      }
    },
    components: {
      ProductListFixedPage,
      ProductListWithHeader,
      SelectedScopeShop
    },
    methods: {
      ...mapActions({
        handleDestroyStatus: 'destroyStatus',
        handleSelect: 'selectProduct',
        handleDeSelect: 'deSelectProduct',
        handleSetEditProduct: 'setEditProductList',
        handleGetData: 'multiCubeList/getData',
        handleGetScopeData: 'multiCubeList/getScopeList',
        updateSelectedProducts: 'updateSelectedProducts'
      }),
      handleRefresh () {
        this.handleGetData()
        this.handleGetScopeData()
      },
      handleGoBack () {
        this.handleDestroyStatus()
        this.$router.push({ name: 'productList', query: this.$route.query })
      },
      // 勾选状态：手动勾选 or 自动勾选type = true
      selectionList () {
        return Object.values(this.classifySelectedProducts).reduce((prev, { productList }) => {
          productList.forEach(({ __id__, relatedPoiIds, addedPoiIds, totalPoiIds }) => {
            // 当前商品在所选范围下可关联的所有门店 是否在该商品的 待关联门店范围 和 已关联门店范围内
            let flag = totalPoiIds.every(item => {
              return addedPoiIds.indexOf(item) > -1 || relatedPoiIds.indexOf(item) > -1
            })
            // console.log(flag)
            if (flag) {
              prev.push({ __id__, relatedPoiIds, addedPoiIds })
            }
          })
          // console.log(prev)
          return prev
        }, [])
      }
    }
    // mounted () {
    //   this.handleGetScopeData()
    // }
  }
</script>
<style lang="less">
.product-recommend-container-product .product-list-fixed-page-layout-content {
  height: calc(100% - 94px);
}
</style>
<style lang="less" scoped>
.merchant-cube-list-container {
  height: 100%;
  overflow: hidden;
  /deep/ .container {
    height: calc(100% - 14px);
  }
  &-product {
    margin-bottom: 0;
    overflow: hidden;
    height: 100%;
    /deep/ .boo-alert-with-desc {
      margin-bottom: 0;
    }
    .alert {
      margin-top: 16px;
    }
    &-content {
      width: 100%;
      height: 100%;
      background: #F7F8FA;
      .recommend-table-list {
        height: calc(100% - 8px);
        margin-top: 8px;
      }
    }
  }
  .operation-info-tip {
    height: 40px;
    line-height: 40px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 0;
    font-weight: 500;
    font-family: PingFangSC-Medium;
    font-size: 14px;
    color: #36394D;
    padding: 0 20px 0 41px;
    border: 1px solid rgba(248, 181, 0, 0.2);
    background-color: rgba(248, 181, 0, 0.1);
    .icon {
      margin-right: 9px;
    }
  }
}
</style>
