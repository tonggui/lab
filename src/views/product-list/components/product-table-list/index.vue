<template>
  <ProductList
    :sorting="sorting"
    :tab-value="status"
    :tabs="statusList"
    :render-tab-label="renderTabLabel"
    :tab-pane-filter="isShowTabPane"
    @tab-change="handleTabChange"
    :batch-operation="batchOperation"
    :batch-operation-filter="isShowBatchOp"
    @batch="handleBatchOp"
    @on-sort-change="handleSortChange"
    :product-list="productList"
    :pagination="pagination"
    :loading="loading"
    :columns="columns"
    :show-header="!sorting"
    @page-change="handlePageChange"
    @change-list="handleChangeList"
    @toggle-smart-sort="handleToggleSmartSort"
    :smart-sort-switch="smartSort"
    show-smart-sort
  >
    <div slot="tabs-extra" class="search">
      <Search @search="handleSearch" placeholder="商品名称/品牌/条码/货号" :fetch-data="getSuggestionList" />
    </div>
    <template slot="empty">
      <slot name="empty" />
    </template>
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
  import emptyImg from '@/assets/empty.jpg'
  import Search from '@components/search-suggest'
  import ProductList from '@/views/components/product-list'
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
    name: 'product-list-table-container',
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
      emptyImg () {
        return emptyImg
      },
      batchOperation () {
        return batchOperation
      },
      columns () {
        return [...columns, {
          title: '操作',
          width: 200,
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
          query: {
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
      handleBatchPutOn (idList) {
        this.$Modal.confirm({
          title: '批量上架',
          content: `共选择了 ${idList.length} 件商品`,
          okText: '确认上架',
          onOk: async () => {
            // TODO 上架
          }
        })
      },
      handleBatchPutOff (idList) {
        this.$Modal.confirm({
          title: '批量下架',
          content: `共选择了 ${idList.length} 件商品，商品下架后可能导致已加入购物车的商品无法付款`,
          okText: '确认下架',
          onOk: async () => {
            // TODO 上架
          }
        })
      },
      handleBatchDelete (idList) {
        this.$Modal.confirm({
          title: '批量删除',
          content: `删除商品后，已提交订单及加入购物车的商品将无法付款，本次将要删除 ${idList.length} 件商品，请慎重操作`,
          okText: '确认删除',
          onOk: async () => {
            // TODO 上架
          }
        })
      },
      handleBatchOp (type, idList, cb) {
        console.log('handleBathOp:', type, idList)
        switch (type) {
        case PRODUCT_BATCH_OP.PUT_ON:
          this.handleBatchPutOn(idList)
          break
        case PRODUCT_BATCH_OP.PUT_OFF:
          this.handleBatchPutOff(idList)
          break
        case PRODUCT_BATCH_OP.MOD_TAG:
          break
        case PRODUCT_BATCH_OP.MOD_STOCK:
          break
        case PRODUCT_BATCH_OP.MOD_TIME:
          break
        case PRODUCT_BATCH_OP.MOD_LABEL:
          break
        case PRODUCT_BATCH_OP.DELETE:
          this.handleBatchDelete(idList)
          break
        }
      },
      handleSortChange ({ column, key, order } = {}) {
        console.log('sorting:', column, key, order)
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
