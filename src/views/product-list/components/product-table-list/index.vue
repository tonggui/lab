<template>
  <ProductList
    :sorting="sorting"
    :tab-value="status"
    :tabs="statusList"
    :render-tab-label="renderTabLabel"
    :tab-pane-filter="isShowTabPane"
    @tab-change="handleTabChange"
    :batchOperation="batchOperation"
    :batch-operation-filter="isShowBatchOp"
    :productList="productList"
    :pagination="pagination"
    :loading="loading"
    :columns="columns"
    :show-header="!sorting"
    @page-change="handlePageChange"
    @change-list="handleChangeList"
    @toggle-smart-sort="handleToggleSmartSort"
    :smartSortSwitch="smartSort"
    :showSmartSort="true"
  >
    <div slot="tabs-extra" class="search">
      <Search @search="handleSearch" placeholder="商品名称/品牌/条码/货号" :fetch-data="getSuggestionList" />
    </div>
  </ProductList>
</template>
<script>
  import {
    defaultPagination
  } from '@/data/constants/common'
  import {
    fetchGetProductInfoList,
    fetchGetSearchSuggestion
  } from '@/data/repos/product'
  import {
    productStatus,
    defaultProductStatus
  } from '@/data/constants/product'
  import {
    PRODUCT_STATUS,
    PRODUCT_BATCH_OP
  } from '@/data/enums/product'
  import {
    POI_IS_MEDICINE,
    PRODUCT_SELLTIME,
    PRODUCT_LABEL
  } from '@/common/cmm'
  import withModules from '@/mixins/withModules'
  import Search from '@components/search-suggest'
  import ProductList from '@/views/components/sort-product-list'
  import ProductOperation from './components/product-table-operation'
  import columns from './columns'

  const batchOperation = [{
    name: '上架',
    id: PRODUCT_BATCH_OP.PUT_ON
  }, {
    name: '下架',
    id: PRODUCT_BATCH_OP.PUT_OFF
  }, {
    name: '修改分类',
    id: PRODUCT_BATCH_OP.MOD_TAG
  }, {
    name: '更多',
    id: 'more',
    children: [{
      name: '修改库存',
      id: PRODUCT_BATCH_OP.MOD_STOCK
    }, {
      name: '修改可售时间',
      id: PRODUCT_BATCH_OP.MOD_TIME
    }, {
      name: '修改商品标签',
      id: PRODUCT_BATCH_OP.MOD_LABEL
    }, {
      name: '删除',
      id: PRODUCT_BATCH_OP.DELETE
    }]
  }]

  export default {
    name: 'product-list-table',
    props: {
      sorting: Boolean,
      tagId: Number,
      smartSortSwitch: Boolean
    },
    mixins: [withModules({
      isMedicine: POI_IS_MEDICINE,
      sellTimeEditable: PRODUCT_SELLTIME,
      labelEditable: PRODUCT_LABEL
    })],
    data () {
      return {
        loading: false,
        error: false,
        productList: [],
        status: defaultProductStatus,
        statusList: productStatus,
        pagination: { ...defaultPagination },
        smartSort: this.smartSortSwitch
      }
    },
    computed: {
      batchOperation () {
        return batchOperation
      },
      columns () {
        return [...columns, {
          title: '操作',
          width: 150,
          align: 'center',
          render: (h, { row }) => {
            return h(ProductOperation, { props: { product: row } })
          }
        }]
      }
    },
    watch: {
      tagId () {
        this.pagination.current = 1
        this.getData()
      }
    },
    methods: {
      async getData () {
        try {
          this.loading = true
          const { list, statusList, pagination } = await fetchGetProductInfoList({
            status: this.status,
            tagId: this.tagId
          }, this.pagination, this.statusList)
          this.productList = list
          this.pagination = pagination
          this.statusList = statusList
        } catch (err) {
          this.$Message.error(err.message || err)
        } finally {
          this.loading = false
        }
      },
      async getSuggestionList () {
        const list = await fetchGetSearchSuggestion()
        return list
      },
      renderTabLabel (h, item) {
        const { name, count, needDanger = false } = item
        return (
          <div>{name} <span class={needDanger ? 'danger' : ''}>{count}</span></div>
        )
      },
      isShowTabPane (item) {
        if (item.id === PRODUCT_STATUS.INCOMPLETE) {
          return this.isMedicine
        }
        return true
      },
      isShowBatchOp (op) {
        if (op.id === PRODUCT_BATCH_OP.MOD_TIME) {
          return this.sellTimeEditable
        }
        if (op.id === PRODUCT_BATCH_OP.MOD_LABEL) {
          return this.labelEditable
        }
        return true
      },
      handleToggleSmartSort (value) {
        this.smartSort = value
      },
      handleChangeList (list) {
        this.productList = list
      },
      handleSearch (item) {
        this.$router.push({
          name: 'searchList',
          params: {
            tagId: item.tagId,
            brandId: item.id,
            keyword: item.name
          }
        })
      },
      handlePageChange (pagination) {
        this.pagination = pagination
        this.getData()
      },
      handleTabChange (status) {
        this.status = status
        this.getData()
      },
      handleBatchOp (name) {
        console.log('handleBathOp:', name)
      }
    },
    components: {
      ProductList,
      Search
    },
    mounted () {
      this.getData()
    }
  }
</script>
<style lang="less" scoped>
  .search {
    margin-right: 20px;
    padding-top: 12px;
  }
</style>
