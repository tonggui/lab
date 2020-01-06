<template>
  <ErrorBoundary
    class="associated-poi-table"
    :error="error"
    description="获取关联门店列表失败~"
    @refresh="getData"
  >
    <Table
      stripe
      disabled-hover
      :data="poiList"
      :columns="columns"
      :pagination="pagination"
      :loading="loading"
      @on-page-change="handlePageChange"
      no-text-data="暂无关联门店"
    />
  </ErrorBoundary>
</template>
<script>
  import Table from '@components/table-with-page'
  import { helper } from '../../store'
  import columns from './columns'
  import {
    PRODUCT_SELL_STATUS
  } from '@/data/enums/product'

  const { mapState, mapActions } = helper

  export default {
    name: 'associated-poi-table',
    computed: {
      ...mapState({
        poiList: (state) => state.poi.list,
        pagination: (state) => state.poi.pagination,
        loading: (state) => state.poi.loading,
        error: (state) => state.poi.error
      }),
      columns () {
        return [...columns, {
          title: '操作',
          key: 'associateStatus',
          width: 240,
          align: 'left',
          render: (h, { row, index }) => {
            const bid = 'b_shangou_online_e_53gn1afz_mc'
            const { sellStatus } = row
            if (!Object.values(PRODUCT_SELL_STATUS).includes(sellStatus)) {
              return <EmptyDefaultShow style={{ paddingLeft: '30px' }} />
            }
            return (
              <div class="operation" style={{ paddingLeft: '30px' }}>
                { sellStatus === PRODUCT_SELL_STATUS.OFF && <span onClick={() => this.handleChangeSellStatus({ poiId: row.id, status: PRODUCT_SELL_STATUS.ON, index })} vMc={{ bid, val: { button_nm: '上架' } }}>上架</span> }
                { sellStatus === PRODUCT_SELL_STATUS.ON && <span onClick={() => this.handleChangeSellStatus({ poiId: row.id, status: PRODUCT_SELL_STATUS.OFF, index })} vMc={{ bid, val: { button_nm: '下架' } }}>下架</span> }
                <span onClick={() => this.handleClearAssociated(row.id)} vMc={{ bid, val: { button_nm: '取消关联' } }}>取消关联</span>
              </div>
            )
          },
          renderHeader: (h, { column }) => {
            return <span style={{ paddingLeft: '30px' }}>{ column.title }</span>
          }
        }]
      }
    },
    components: {
      Table
    },
    methods: {
      ...mapActions({
        getData: 'getPoiList',
        handleChangeSellStatus: 'changeSellStatus',
        handleClearAssociated: 'clearAssociated',
        handlePageChange: 'changePagination'
      })
    }
  }
</script>
<style lang="less" scoped>
  .associated-poi-table {
    min-height: 400px;
    /deep/ .error-boundary {
      padding-top: 120px;
    }
    /deep/ .operation {
      color: @link-color;
      > span:hover {
        color: @link-hover-color;
      }
      cursor: pointer;
      > span:not(:last-child) {
        margin-right: 10px;
      }
    }
    /deep/ .boo-table {
      border: 1px solid @border-color-base;
      border-radius: @border-radius-base;
      .boo-table-overflowX {
        overflow: hidden;
      }
      .boo-table-cell {
        padding-top: 10px;
        padding-bottom: 10px;
      }
      th {
        color: @table-thead-color;
        white-space: nowrap;
        border-bottom: none;
      }
      td {
        vertical-align: baseline;
        border-bottom: none;
      }
      &::after { display: none }
    }
  }
</style>
