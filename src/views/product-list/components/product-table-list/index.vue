<template>
  <div>
    <Columns @delete="handleDelete" @edit-product="handleEdit">
      <template v-slot:default="{columns}">
        <ProductTableList
          :tab-value="status"
          :tabs="statusList"
          :render-tab-label="renderTabLabel"
          :tab-pane-filter="isShowTabPane"
          @on-sort-change="$listeners['sort-change']"
          @tab-change="$listeners['status-change']"
          :batchOperation="batchOperation"
          :batch-operation-filter="isShowBatchOp"
          :dataSource="dataSource"
          :columns="columns"
          :pagination="pagination"
          :loading="loading"
          @page-change="$listeners['page-change']"
          @batch="handleBatchOp"
        >
          <ProductSearch slot="tabs-extra" @search="handleSearch" />
          <template slot="empty">
            <slot name="empty" />
          </template>
        </ProductTableList>
      </template>
    </Columns>
    <BatchModal
      :loading="batch.loading"
      :value="batch.visible"
      :type="batch.type"
      :count="batch.selectIdList.length"
      @cancel="handleBatchModalCancel"
      @submit="handleBatchModalSubmit"
    />
  </div>
</template>
<script>
  import {
    noop
  } from 'lodash'
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
  import ProductTableList from '@components/product-list-table'
  import BatchModal from './components/batch-modal'
  import ProductSearch from './components/search'
  import Columns from './components/columns'
  import { batchOperation } from './constants'

  export default {
    name: 'product-list-table-container',
    props: {
      tagId: Number,
      status: [Number, String],
      statusList: Array,
      dataSource: Array,
      pagination: Object,
      loading: Boolean
    },
    mixins: [withModules({
      isMedicine: POI_IS_MEDICINE,
      sellTimeEditable: PRODUCT_SELLTIME,
      labelEditable: PRODUCT_LABEL
    })],
    data () {
      return {
        batch: {
          loading: false,
          type: undefined,
          visible: false,
          selectIdList: [],
          callback: noop
        }
      }
    },
    computed: {
      batchOperation () {
        return batchOperation
      }
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
      handleDelete (product, isCurrentTag = false) {
        this.$emit('delete', { product, isCurrentTag })
      },
      handleEdit (product, params) {
        this.$emit('edit', { product, params })
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
      handleBatchOp (type, idList, cb) {
        this.batch.type = type
        this.batch.selectIdList = idList
        this.batch.visible = true
        this.batch.callback = cb || noop
      },
      handleSortChange ({ column, key, order } = {}) {
        const sorter = {
          [key]: order
        }
        this.$emit('sort-change', sorter)
      },
      handleBatchModalCancel () {
        this.batch.visible = false
      },
      async handleBatchModalSubmit (data) {
        this.batch.loading = true
        this.$emit('batch', {
          type: this.batch.type,
          data,
          idList: this.batch.selectIdList
        }, () => {
          this.batch.loading = false
          this.batch.visible = false
          this.batch.callback()
        })
      }
    },
    components: {
      Columns,
      ProductTableList,
      ProductSearch,
      BatchModal
    }
  }
</script>
