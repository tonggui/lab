<template>
  <div>
    <ErrorBoundary
      :error="error"
      :top="200"
      @refresh="handleRefresh"
      description="商品获取失败～"
    >
      <ProductTableList
        showSelectAll
        :tag-id="tagId"
        :status="status"
        :status-list="statusList"
        @status-change="handleTabChange"
        :dataSource="list"
        :pagination="pagination"
        :loading="loading"
        :searchData="deaultSearchData"
        @page-change="handlePageChange"
        @delete="handleDelete"
        @edit="handleModify"
        @edit-sku="handleModifySku"
        @refresh="handleRefresh"
        @batch="handleBatch"
        @search="handleListSearch"
        @clear="handleClearSearch"
        @check-change="checkSpChangeInfo"
      >
        <div slot="tabs-extra" class="search-wrapper">
          <a @click="handleSearch">筛选</a>
          <ProductSearch @search="handleSearch" />
        </div>
        <template slot="empty">
          <span>{{emptyTips[status] || '快去新建商品吧'}}~</span>
        </template>
      </ProductTableList>
    </ErrorBoundary>
    <SingleSpChangeInfo
      v-model="showSingleSpChange"
      :product="changeInfo.product"
      :changeInfo="changeInfo"
      :onlyCheck="!INCOMPLETE"
      @confirm="replaceProductChangeInfo"
    ></SingleSpChangeInfo>
    <SpsChangeInfo
      v-model="showSpsChange"
      :products="productChangeInfos.products"
      :pagination="productChangeInfos.pagination"
      @confirm="batchReplaceProductChangeInfo"
      @page-change="handleSpPageChange"
    ></SpsChangeInfo>
  </div>
</template>
<script>
  import moment from 'moment'
  import { MEDICINE_PRODUCT_BATCH_OP, MEDICINE_MERCHANT_PRODUCT_STATUS } from '@/data/enums/product'
  import { batchReplaceProductChangeInfo } from '@/data/api/medicineMerchantApi/product'
  import { fetchProductChangeInfo, getlistProductChangeInfo, replaceProductChangeInfo } from '@/data/api/medicineMerchantApi/incomplete'
  import ProductTableList from '../../components/product-table-list'
  import ProductSearch from '@/views/medicine/merchant/components/product-search'
  import { helper } from '../../store'
  import withPromiseEmit from '@/hoc/withPromiseEmit'
  import SingleSpChangeInfo from '@/views/components/sp-change-info/merchant-medicine-sp-change/single-sp-change-info'
  import SpsChangeInfo from '@/views/components/sp-change-info/merchant-medicine-sp-change'

  const { mapState, mapActions } = helper('product')

  export default {
    name: 'merchant-product-manage-product-list-container',
    data () {
      return {
        changeInfo: {},
        productChangeInfos: {
          products: [],
          pagination: {}
        },
        showSingleSpChange: false,
        showSpsChange: false,
        emptyTips: {
          [MEDICINE_MERCHANT_PRODUCT_STATUS.ALL]: '快去新建商品吧~',
          [MEDICINE_MERCHANT_PRODUCT_STATUS.INCOMPLETE]: '暂无待优化商品',
          [MEDICINE_MERCHANT_PRODUCT_STATUS.COMPLETED]: '暂无优化记录'
        }
      }
    },
    computed: {
      ...mapState([
        'status',
        'statusList',
        'loading',
        'list',
        'pagination',
        'tagId',
        'error',
        'searchData'
      ]),
      INCOMPLETE () {
        return this.status === MEDICINE_MERCHANT_PRODUCT_STATUS.INCOMPLETE
      },
      deaultSearchData () {
        const { startTime, endTime } = this.searchData
        return { date: [moment(startTime).format('YYYY-MM-DD'), moment(endTime).format('YYYY-MM-DD')] }
      }
    },
    components: {
      ProductTableList: withPromiseEmit(ProductTableList),
      ProductSearch,
      SingleSpChangeInfo,
      SpsChangeInfo
    },
    methods: {
      ...mapActions({
        handlePageChange: 'pageChange',
        handleTabChange: 'statusChange',
        handleModify: 'modify',
        handleModifySku: 'modifySkuList',
        handleRefresh: 'getList',
        handleDelete: 'delete',
        handleClearSearch: 'setDefaultSearch',
        setSearch: 'setSearch'
      }),
      // 批量替换商品
      async batchReplaceProductChangeInfo (params, cb) {
        await batchReplaceProductChangeInfo(params).then((res) => {
          this.showSpsChange = false
          cb && cb()
        }, (res) => {
          this.$Message.error(res.message)
        })
      },
      // 替换单个商品
      async replaceProductChangeInfo (product) {
        const { id: spuId } = product
        await replaceProductChangeInfo({ spuId }).then((res) => {
          this.showSingleSpChange = false
        }, (res) => {
          this.$Message.error(res.message)
        })
      },
      // 查看单个待优化商品详情
      async checkSpChangeInfo (product) {
        const { status } = this
        const { categoryId = 0, poiId, id: spuId, opLogId, opLogTime } = product
        const params = this.INCOMPLETE ? { spuId } : { opLogId, opLogTime }
        await fetchProductChangeInfo({ ...params, categoryId, poiId, status }).then((res) => {
          if (res.basicInfoList.length || res.categoryAttrInfoList.length) {
            this.changeInfo = {
              ...res,
              product: { ...product, ...res.product }
            }
            this.showSingleSpChange = true
          }
        }, (res) => {
          this.$Message.error(res.message)
        })
      },
      // 查看多个待优化商品详情
      async getlistProductChangeInfo (params) {
        await getlistProductChangeInfo(params).then((res) => {
          if (res.products) {
            const { products, pageSize, pageNum, totalCount } = res
            const pagination = { pageSize, current: pageNum, total: totalCount }
            this.productChangeInfos = {
              products,
              pagination
            }
            this.showSpsChange = true
            this.changeInfos = { ...params, ...pagination }
          }
        }, (res) => {
          this.$Message.error(res.message)
        })
      },
      handleSpPageChange (pagination) {
        console.log('pagination 222', pagination)
        this.getlistProductChangeInfo({ ...this.changeInfos, ...pagination })
      },
      handleSearch (item = {}) {
        this.$router.push({
          path: '/medicine/merchant/product/searchList',
          query: {
            tagId: item.tagId || '',
            brandId: item.brandId || '',
            keyword: item.name || '',
            dataType: item.type || ''
          }
        })
      },
      handleBatch (op, isAll, idList, cb) {
        switch (op.id) {
        case MEDICINE_PRODUCT_BATCH_OP.CHANGE: {
          const spuIds = idList.map(item => item.spuId)
          const { current: pageNum } = this.pagination
          const params = { isAll, pageNum, pageSize: 20 }
          isAll === 2 && (params.spuIds = spuIds)
          this.getlistProductChangeInfo(params)
          break
        }
        default:
          break
        }
      },
      handleListSearch (data) {
        const { skuCode, upcCode, spuName, date } = data
        const searchData = { }
        skuCode && (searchData.sourceFoodCode = skuCode)
        upcCode && (searchData.upc = upcCode)
        spuName && (searchData.name = spuName)
        if (date && date.length > 1) {
          date[0] && (searchData.startTime = this.getTime(date[0]))
          date[1] && (searchData.endTime = this.getTime(date[1]))
        }
        this.setSearch(searchData)
      },
      getTime (date) {
        return new Date(date).getTime()
      }
    }
  }
</script>
<style scoped lang="less">
  .search-wrapper {
    display: inline-flex;
    justify-content: space-between;
    align-items: center;
    height: 61px;
    > a {
      margin-right: 12px;
    }
  }
</style>
