<template>
  <div>
    <ErrorBoundary
      :error="error"
      :top="200"
      @refresh="handleRefresh"
      description="商品获取失败～"
    >
      <ProductTableList
        :tag-id="tagId"
        :status="status"
        :status-list="statusList"
        @status-change="handleTabChange"
        :dataSource="list"
        :pagination="pagination"
        :loading="loading"
        @page-change="handlePageChange"
        @delete="handleDelete"
        @edit="handleModify"
        @edit-sku="handleModifySku"
        @refresh="handleRefresh"
        @batch="handleBatch"
        @check-change="checkSpChangeInfo"
      >
        <div slot="tabs-extra" class="search-wrapper">
          <ProductSearch @search="handleSearch" />
        </div>
        <template slot="empty">
          <span>{{emptyTips[status] || '快去新建商品吧'}}~</span>
        </template>
      </ProductTableList>
    </ErrorBoundary>
    <SingleSpChangeInfo
      v-model="showSingleSpChange"
      :categoryAttrList="product.categoryAttrList"
      :product="product"
      :changeInfo="changeInfo"
      :onlyCheck="!INCOMPLETE"
      @confirm="replaceProductChangeInfo"
    ></SingleSpChangeInfo>
    <SpsChangeInfo
      v-model="showSpsChange"
      :products="productChangeInfos"
      @confirm="replaceProductChangeInfo"
    ></SpsChangeInfo>
  </div>
</template>
<script>
  import { MEDICINE_PRODUCT_BATCH_OP, MEDICINE_MERCHANT_PRODUCT_STATUS } from '@/data/enums/product'
  import { batchReplaceProductChangeInfo } from '@/data/api/medicineMerchantApi/product'
  import { getProductChangeInfo, getDetailOptimizedProduct, getlistProductChangeInfo, replaceProductChangeInfo } from '@/data/api/medicineMerchantApi/incomplete'
  import { getCategoryAttrs } from '@/data/api/medicine'
  import ProductTableList from '../../components/product-table-list'
  import ProductSearch from '@/views/merchant/components/product-search'
  import { helper } from '../../store'
  import withPromiseEmit from '@/hoc/withPromiseEmit'
  import SingleSpChangeInfo from '@/views/components/sp-change-info/merchant-medicine-sp-change/single-sp-change-info'
  import SpsChangeInfo from '@/views/components/sp-change-info/merchant-medicine-sp-change'

  const { mapState, mapActions } = helper('product')

  export default {
    name: 'merchant-product-manage-product-list-container',
    data () {
      return {
        product: {},
        changeInfo: {},
        productChangeInfos: {},
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
        'error'
      ]),
      INCOMPLETE () {
        return this.status === MEDICINE_MERCHANT_PRODUCT_STATUS.INCOMPLETE
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
        handleDelete: 'delete'
      }),
      // 批量替换商品
      async batchReplaceProductChangeInfo (params, cb) {
        await batchReplaceProductChangeInfo(params).then((res) => {
          if (!res.code) {
            cb && cb()
          }
        })
      },
      // 替换单个商品
      async replaceProductChangeInfo (product) {
        const { id: spuId } = product
        await replaceProductChangeInfo({ spuId }).then((res) => {
          if (!res.code) {
            this.showSingleSpChange = false
          }
        })
      },
      // 查看单个待优化商品详情
      async checkSpChangeInfo (product) {
        const categoryId = product.categoryId || 0
        let categoryAttrList = []
        try {
          // categoryAttrList = await getCategoryAttrs({ poiId, categoryId })
          categoryAttrList = await getCategoryAttrs({ categoryId })
        } catch (err) {
          console.error(err)
        }
        this.product = {
          ...product,
          categoryAttrList
        }
        try {
          const { spuId, opId, ctime } = product.id
          const changeInfo = this.INCOMPLETE ? await getProductChangeInfo({ spuId }) : await getDetailOptimizedProduct({ opId, ctime })
          if (changeInfo.basicInfoList.length || changeInfo.categoryAttrInfoList.length) {
            this.changeInfo = changeInfo
            this.showSingleSpChange = true
          }
        } catch (err) {
          console.error(err.message)
        }
      },
      // 查看多个待优化商品详情
      async getlistProductChangeInfo (params) {
        try {
          const res = await getlistProductChangeInfo(params)
          if (res.products) {
            const { products, ...pagination } = res
            console.log('pagination', pagination)
            this.getlistProductChangeInfo = products
            this.showSpsChange = true
            // this.batchReplaceProductChangeInfo({
            //   isAll: isAll ? 1 : 0,
            //   spuIds: !isAll ? spuIds : []
            // }, cb)
          }
        } catch (err) {
          console.error(err.message)
        }
      },
      handleSearch (item = {}) {
        this.$router.push({
          path: '/merchant/product/searchList',
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
          this.getlistProductChangeInfo({ spuIds, isAll })
          break
        }
        default:
          break
        }
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
