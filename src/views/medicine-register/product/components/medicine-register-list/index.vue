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
        :visible="batch.visible"
        :op="batch.op"
        :count="batch.count"
        @cancel="handleBatchModalCancel"
        @submit="handleBatchModalSubmit"
      />
    </template>
  </div>
</template>
<script>
  import { noop } from 'lodash'
  import { Message } from '@roo-design/roo-vue'
  import { createCallback } from '@/common/vuex'
  import localStorage, { KEYS } from '@/common/local-storage'
  import MedicineRegisterTable from './components/list-table'
  import Columns from './components/columns'
  import BatchModifyModal from './components/batch-modify-modal'
  import { batchOperation } from './constants'
  import { helper } from '../../store'

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
          chooseAll: false,
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
      handleDelete (data, callback) {
        this.$emit('delete', { data, callback })
      },
      handleEdit (data, callback) {
        return new Promise((resolve, reject) => {
          this.$emit('edit', { data, callback }, this.createCallback(resolve, reject))
        })
      },
      handlePageChange (pagination) {
        if (pagination.pageSize !== this.pagination.pageSize) {
          localStorage[KEYS.MEDICINE_REGISTER_LIST] = pagination.pageSize
        }
        this.$emit('page-change', pagination)
      },
      handleBatchOp (op, chooseAll, idList, cb) {
        this.batch.visible = true
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
      async handleBatchModalSubmit () {
        this.batch.loading = true
        this.$emit('batch', this.batch, this.createCallback((data) => {
          this.batch.loading = false
          this.batch.visible = false
          this.batch.callback()
        }, (err) => {
          Message.error(err.message || this.batch.op.tip.error)
        }))
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
