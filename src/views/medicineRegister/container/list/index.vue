<template>
  <div>
    <ErrorBoundary
      :error="error"
      :top="200"
      @refresh="handleRefresh(searchParamsBefore)"
      description="未查询到商品~"
    >
      <MedicineRegisterList
        :tag-id="tagId"
        :dataSource="list"
        :pagination="pagination"
        :loading="loading"
        @page-change="handlePageChange"
        @delete="handleDelete"
        @edit="handleModify"
        @refresh="handleRefresh"
      >
        <template slot="empty">
          <span>暂无商品~</span>
        </template>
      </MedicineRegisterList>
    </ErrorBoundary>
  </div>
</template>
<script>
  import MedicineRegisterList from '../../components/medicineRegisterList'
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
        handleModify: 'modify',
        handleRefresh: 'getList',
        handleDelete: 'delete'
      })
    }
  }
</script>
