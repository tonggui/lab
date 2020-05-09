<template>
  <div class="subscription-poi-list">
    <BreadcrumbHeader>
      门店列表
    </BreadcrumbHeader>
    <FilterForm @submit="handleSearch" :data="filters" />
    <ErrorBoundary :error="error" class="subscription-poi-list-table-container">
      <PoiTable
        :list="list"
        :pagination="pagination"
        :loading="loading"
        :columns="columns"
        @page-change="handlePageChange"
        @batch-update-status="handleBatchUpdate"
        ref="poiTable"
      >
        <template v-slot:operation="{ row, index }">
          <div class="subscription-poi-list-operation">
            <span @click="handleGoToSubProductList(row)" v-if="row.subscribeCount > 0">商品列表</span>
            <span @click="handleUpdateState(!row.status, row, index)">{{ row.status ? '关闭订阅' : '开启订阅' }}</span>
          </div>
        </template>
      </PoiTable>
    </ErrorBoundary>
  </div>
</template>
<script>
  import BreadcrumbHeader from '@/views/merchant/components/breadcrumb-header'
  import { stringify } from 'qs'
  import {
    fetchGetPoiSubscriptionInfoList,
    fetchSubmitUpdatePoiSubscriptionStatus,
    fetchSubmitBatchUpdatePoiSubscriptionStatus
  } from '@/data/repos/merchantPoi'
  import { sleep } from '@/common/utils'
  import columns from './columns'
  import { defaultPagination } from '@/data/constants/common'
  import FilterForm from './components/filter-form'
  import PoiTable from '../components/poi-table'

  export default {
    name: 'subscription-poi-list',
    data () {
      return {
        columns,
        loading: false,
        error: false,
        list: [],
        filters: {
          keyword: ''
        },
        pagination: {
          ...defaultPagination
        }
      }
    },
    components: { PoiTable, FilterForm, BreadcrumbHeader },
    methods: {
      async getData () {
        try {
          this.loading = true
          this.error = false
          const { list, pagination } = await fetchGetPoiSubscriptionInfoList(this.pagination, this.filters)
          this.pagination = pagination
          this.list = list
        } catch (err) {
          this.error = true
        } finally {
          this.loading = false
        }
      },
      resetPoiInfo () {
        const $poiTable = this.$refs.poiTable
        if ($poiTable) {
          $poiTable.reset()
        }
      },
      async triggerUpdateRefresh () {
        try {
          this.loading = true
          await sleep(1000)
          this.getData()
        } catch (err) {
          this.loading = false
          console.error(err)
        }
      },
      handlePageChange (pagination) {
        if (pagination.pageSize !== this.pagination.pageSize) {
          this.pagination = { ...pagination, current: 1 }
        } else {
          this.pagination = { ...pagination }
        }
        this.getData()
      },
      handleSearch (filters) {
        this.filters = { ...filters }
        this.pagination.current = 1
        this.getData()
        this.resetPoiInfo()
      },
      async handleUpdateState (status, poi, index) {
        try {
          await fetchSubmitUpdatePoiSubscriptionStatus(status, poi.id)
          this.$Message.success('配置更新成功')
          this.triggerUpdateRefresh()
        } catch (err) {
          console.error(err)
          this.$Message.error(err.message)
        }
      },
      async handleBatchUpdate (status, { poiIdList, isAll }) {
        try {
          await fetchSubmitBatchUpdatePoiSubscriptionStatus(status, poiIdList, isAll)
          this.resetPoiInfo()
          const poiCount = isAll ? this.pagination.total - poiIdList : poiIdList.length
          const $modal = this.$Modal.confirm({
            title: '提示',
            content: `本次共需${status ? '开启' : '关闭'}${poiCount}个门店已操作，请稍后进入“任务进度”查看是否全部开启完成`,
            centerLayout: true,
            iconType: '',
            okText: '进入任务进度',
            cancelText: '我知道了',
            onOk: () => {
              this.$router.push({ name: 'merchantProgress' })
              $modal.destory()
            },
            onCancel: () => this.getData()
          })
        } catch (err) {
          console.error(err)
          this.$Message.error(err.message)
        }
      },
      handleGoToSubProductList (product) {
        const query = {
          wmPoiId: product.id,
          poiName: product.name
        }
        window.location.href = `/reuse/sc/product/views/setting/subscriptionList?${stringify(query)}`
      }
    },
    mounted () {
      this.getData()
    }
  }
</script>
<style lang="less">
  .subscription-poi-list {
    height: 100%;
    display: flex;
    flex-direction: column;
    &-operation {
      color: @link-color;
      font-size: @font-size-base;
      > span {
        margin-right: 20px;
        cursor: pointer;
      }
    }
    &-table-container {
      height: auto;
      flex: 1;
      overflow: hidden;
      background: @component-bg;
    }
  }
</style>
