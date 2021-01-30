<template>
  <div>
    <ErrorBoundary
      :error="error"
      :top="200"
      @refresh="handleRefresh(searchParamsBefore)"
      description="未查询到配置~"
    >
      <MedicineRegisterList
        :dataSource="list"
        :pagination="pagination"
        :loading="loading"
        @page-change="handlePageChange"
        @delete="handleDelete"
        @refresh="handleRefresh"
        @batch="handleBatch"
      >
        <template slot="empty">
          <span>暂无配置数据~</span>
        </template>
      </MedicineRegisterList>
    </ErrorBoundary>
  </div>
</template>
<script>
  import MedicineRegisterList from '../../components/medicine-register-list'
  import { helper } from '../../store'
  import withPromiseEmit from '@/hoc/withPromiseEmit'

  const { mapState, mapActions } = helper('product')

  export default {
    name: 'medicine-register-list-container',
    computed: {
      ...mapState([
        'loading',
        'list',
        'pagination',
        'error',
        'searchParamsBefore'
      ])
    },
    components: {
      MedicineRegisterList: withPromiseEmit(MedicineRegisterList)
    },
    methods: {
      ...mapActions({
        handlePageChange: 'pageChange',
        handleRefresh: 'getList',
        handleDelete: 'delete',
        handleBatch: 'batch'
      })
    }
  }
</script>
