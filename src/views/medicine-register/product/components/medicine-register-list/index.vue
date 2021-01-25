<template>
  <div>
    <Columns
      @delete="handleDelete"
      @edit="handleEdit"
    >
      <template v-slot:default="{columns}">
        <MedicineRegisterTable
          show-header
          :batch-operation="batchOperation"
          :dataSource="dataSource"
          :columns="columns"
          :pagination="pagination"
          :loading="loading"
          @page-change="handlePageChange"
          @batch="handleBatchOp"
          class="medicine-register-list"
        >
          <template slot="empty">
            <slot name="empty" />
          </template>
        </MedicineRegisterTable>
      </template>
    </Columns>
    <template>
      <BatchModifyModal
        :loading="batch.loading"
        :value="batch.visible"
        :op="batch.op"
        :count="batch.count"
        @cancel="handleBatchModalCancel"
        @submit="handleBatchModalSubmit"
      />
    </template>
  </div>
</template>
<script>
  import { noop, pick } from 'lodash'
  import MedicineRegisterTable from './components/list-table'
  import Columns from './components/columns'
  import BatchModifyModal from './components/batch-modify-modal'
  import { createCallback } from '@/common/vuex'
  import localStorage, { KEYS } from '@/common/local-storage'
  import {
    MEDICINE_REGISTER_BATCH_OPARATION_ENUM
  } from '@/data/enums/register'
  // TODO 批量删除接口
  import {
    multiStoreProductDelete
  } from '@/data/api/medicineMultiStore'
  import { batchOperation } from './constants'
  import { helper } from '../../store'
  import { Message } from '@roo-design/roo-vue'

  const { mapState } = helper('product')

  export default {
    name: 'medicine-register-list',
    props: {
      dataSource: Array,
      pagination: Object,
      loading: Boolean,
      createCallback: {
        type: Function,
        default: createCallback
      }
    },
    data () {
      return {
        batch: {
          loading: false,
          visible: false,
          chooseAll: 0,
          selectIdList: [],
          callback: noop,
          op: {},
          count: 0
        }
      }
    },
    computed: {
      ...mapState([
        'list'
      ]),
      batchOperation () {
        return batchOperation
      }
    },
    methods: {
      handleDelete (registerData, callback) {
        this.$emit('delete', { registerData, callback })
      },
      handleEdit (registerData, callback) {
        return new Promise((resolve, reject) => {
          this.$emit('edit', { registerData, callback }, this.createCallback(resolve, reject))
        })
      },
      handlePageChange (pagination) {
        if (pagination.pageSize !== this.pagination.pageSize) {
          localStorage[KEYS.MEDICINE_REGISTER_LIST] = pagination.pageSize
        }
        this.$emit('page-change', pagination)
      },
      handleBatchOp (op, chooseAll, idList, cb) {
        this.batch.op = op
        this.batch.loading = false
        this.batch.chooseAll = chooseAll
        this.batch.selectIdList = idList
        this.batch.callback = cb || noop
        this.batch.count = chooseAll ? this.pagination.total : idList.length
      },
      handleBatchModalCancel () {
        this.batch.visible = false
      },
      async handleBatchModalSubmit (data, force = false) {
        this.batch.loading = true
        const { chooseAll, selectIdList } = this.batch
        // 筛选条件需要加上特定搜索条件
        let params = { chooseAll, ...pick(this.searchParams, ['cityIds', 'stockStatus', 'medicareType']) }
        if (!chooseAll) {
          // params.poiSkus = [...selectIdList]
          params.poiSkus = [...selectIdList]
          // console.log(params.poiSkus)
        } else {
          params = { ...params, ...this.searchParams }
        }
        switch (this.batch.op.type) {
        case MEDICINE_REGISTER_BATCH_OPARATION_ENUM.DELETE:
          await multiStoreProductDelete(params).then(() => {
            Message.success(this.batch.op.tip.success)
          }).catch(() => {
            Message.error(this.batch.op.tip.error)
          })
          break
        default:
          break
        }
        this.batch.loading = false
        this.batch.visible = false
      }
    },
    components: {
      Columns,
      MedicineRegisterTable,
      BatchModifyModal
    }
  }
</script>
<style scoped lang="less">
  .medicine-register-list {
    /deep/ .boo-table-row {
      .edit-icon {
        visibility: hidden;
        &.disabled {
          color: @disabled-color !important;
          cursor: not-allowed;
        }
      }
      &:hover .edit-icon {
        visibility: visible;
      }
    }
    /deep/ .medicine-register-list-body {
      .boo-table-cell {
        padding: 8px 10px;
        &.boo-table-cell-with-selection{
          padding: 8px 0 8px 20px;
        }
      }
    }
  }
</style>
