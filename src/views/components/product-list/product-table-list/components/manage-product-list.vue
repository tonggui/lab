<template>
  <Table
    :tab-value="status"
    :tabs="statusList"
    :render-tab-label="renderTabLabel"
    :tab-pane-filter="isShowTabPane"
    @tab-change="handleTabChange"
    :batchOperation="batchOperation"
    :batch-operation-filter="isShowBatchOp"
    :dataSource="productList"
    :columns="columns"
    :pagination="pagination"
    :loading="loading"
    @page-change="handlePageChange"
    @batch="handleBatchOp"
  >
    <Button slot="tabs-extra">扩展内容</Button>
  </Table>
</template>
<script>
  import {
    fetchGetProductInfoList
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
  import Table from '@components/product-list-table'
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
    name: 'manage-product-list',
    props: {
      tagId: {
        type: Number,
        required: true
      }
    },
    mixins: [withModules({
      isMedicine: POI_IS_MEDICINE,
      sellTimeEditable: PRODUCT_SELLTIME,
      labelEditable: PRODUCT_LABEL
    })],
    data () {
      return {
        productList: [],
        loading: false,
        error: false,
        status: defaultProductStatus,
        statusList: productStatus,
        pagination: {
          current: 1,
          pageSize: 20,
          total: 0,
          pageSizeOpts: [20, 50, 100],
          showElevator: true,
          showSizer: true
        }
      }
    },
    computed: {
      batchOperation () {
        return batchOperation
      },
      columns () {
        return columns
      }
    },
    watch: {
      tagId (tagId) {
        this.getData()
      }
    },
    components: {
      Table
    },
    methods: {
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
      handlePageChange (pagination) {
        this.pagination = pagination
        this.getData()
      },
      handleTabChange (status) {
        console.log('tab change', status)
        this.status = status
        this.getData()
      },
      handleBatchOp (name) {
        console.log('handleBathOp:', name)
      }
    },
    mounted () {
      this.getData()
    }
  }
</script>
