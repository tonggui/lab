<template>
  <div class="subscription-poi-list">
    <div class="subscription-poi-list-filters">
      <Form inline label-position="left" :label-width="70">
        <FormItem label="门店名称">
          <Input />
        </FormItem>
        <FormItem>
          <Button style="margin-right: 20px" type="primary">查询</Button>
          <Button>重置</Button>
        </FormItem>
      </Form>
    </div>
    <ErrorBoundary :error="error" class="subscription-poi-list-table">
      <Table tableFixed :data="showList" :pagination="pagination" :loading="loading" :columns="columns" @on-page-change="handlePageChange" @on-select="handleTableSelect" @on-select-cancel="handleTableSelectCancel">
        <template slot="header">
          <div class="subscription-poi-list-table-batch-op">
            <div class="subscription-poi-list-table-batch-select">
              <Checkbox @on-change="handleChangeSelectStatus" v-bind="checkboxStatus" />
              <Select v-model="selectType">
                <Option v-for="option in options" :value="option.value" :key="option.value">{{ option.label }}</Option>
              </Select>
            </div>
            <ButtonGroup>
              <Button type="primary" @click="handleBatchUpdate(true)">批量开启</Button>
              <Button @click="handleBatchUpdate(false)">批量关闭</Button>
            </ButtonGroup>
          </div>
        </template>
        <template v-slot:operation="{ row, rowIndex }">
          <div class="subscription-poi-list-table-operation">
            <span @click="handleGoToList(row)">商品列表</span>
            <span @click="handleUpdateState(!row.status, row, rowIndex)">{{ row.status ? '关闭订阅' : '开启订阅' }}</span>
          </div>
        </template>
      </Table>
    </ErrorBoundary>
  </div>
</template>
<script>
  import { stringify } from 'qs'
  import Table from '@/components/table-with-page'
  import {
    fetchGetPoiSubscriptionInfoList,
    fetchSubmitUpdatePoiSubscriptionStatus,
    fetchSubmitBatchUpdatePoiSubscriptionStatus
  } from '@/data/repos/merchantPoi'
  import columns from './columns'
  import { defaultPagination } from '@/data/constants/common'

  const SELECT_ALL_TYPE = {
    ALL: 0,
    PAGE: 1
  }

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
        },
        options: [{
          label: '全选所以',
          value: SELECT_ALL_TYPE.ALL
        }, {
          label: '全选本页',
          value: SELECT_ALL_TYPE.PAGE
        }],
        selectType: SELECT_ALL_TYPE.PAGE,
        poiInfo: {
          isAll: false,
          poiList: []
        }
      }
    },
    components: { Table },
    computed: {
      showList () {
        return this.list.map(i => {
          const includes = this.poiInfo.poiList.includes(i.id)
          const checked = this.poiInfo.isAll ? !includes : includes
          return { ...i, _checked: checked }
        })
      },
      checkboxStatus () {
        const result = {
          value: false,
          indeterminate: false
        }
        const { isAll, poiList } = this.poiInfo
        if (this.selectType === SELECT_ALL_TYPE.ALL) {
          result.value = isAll ? poiList.length === 0 : poiList.length === this.pagination.total
          result.indeterminate = !result.value && isAll ? poiList.length < this.pagination.total : poiList.length > 0
        } else {
          result.value = true
          result.indeterminate = false
          this.list.forEach(i => {
            const includes = poiList.includes(i.id)
            const selected = isAll ? !includes : includes
            if (!selected) {
              result.value = false
            }
            if (selected) {
              result.indeterminate = true
            }
          })
          if (result.value) {
            result.indeterminate = false
          }
        }
        return result
      }
    },
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
      handlePageChange (pagination) {
        if (pagination.pageSize !== this.pagination.pageSize) {
          this.pagination = { ...pagination, current: 1 }
        } else {
          this.pagination = { ...pagination }
        }
        this.getData()
      },
      async handleUpdateState (status, poi, index) {
        try {
          await fetchSubmitUpdatePoiSubscriptionStatus(status, poi.id)
          this.list.splice(index, 1, {
            ...this.list[index],
            status
          })
          this.$Message.success('配置更新成功')
        } catch (err) {
          console.error(err)
          this.$Message.error(err.message)
        }
      },
      async handleBatchUpdate (status) {
        try {
          await fetchSubmitBatchUpdatePoiSubscriptionStatus(status, this.poiInfo.poiList, this.poiInfo.isAll)
        } catch (err) {
          console.error(err)
          this.$Message.error(err.message)
        }
      },
      handleChangeSelectStatus (status) {
        if (this.selectType === SELECT_ALL_TYPE.ALL) {
          this.poiInfo.isAll = status
          this.poiInfo.poiList = []
          return
        }
        if ((!this.poiInfo.isAll && status) || (this.poiInfo.isAll && !status)) {
          const list = []
          this.list.forEach(i => {
            const includes = this.poiInfo.poiList.includes(i.id)
            if (!includes) {
              list.push(i.id)
            }
          })
          this.poiInfo.poiList = [...this.poiInfo.poiList, ...list]
        } else {
          this.poiInfo.poiList = this.poiInfo.poiList.filter(id => {
            const includes = this.list.find(i => i.id === id)
            return !includes
          })
        }
      },
      handleTableSelect (selection, row) {
        const index = this.poiInfo.poiList.findIndex(id => id === row.id)
        if (this.poiInfo.isAll && index >= 0) {
          this.poiInfo.poiList.splice(index, 1)
        } else if (!this.poiInfo.isAll && index < 0) {
          this.poiInfo.poiList.push(row.id)
        }
      },
      handleTableSelectCancel (selection, row) {
        const index = this.poiInfo.poiList.findIndex(id => id === row.id)
        if (!this.poiInfo.isAll && index >= 0) {
          this.poiInfo.poiList.splice(index, 1)
        } else if (this.poiInfo.isAll && index < 0) {
          this.poiInfo.poiList.push(row.id)
        }
      },
      handleGoToList (product) {
        const query = {
          wmPoiId: product.id
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
    &-table {
      height: auto;
      flex: 1;
      overflow: hidden;
      background: @component-bg;
      .boo-table-header .boo-table-cell-with-selection {
        display: none;
      }
      .boo-table td {
        height: 90px;
      }
      &-batch-op {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 20px 10px 23px;
      }
      &-batch-select {
        display: inline-flex;
        align-items: center;
        .boo-checkbox-wrapper {
          margin-right: 15px;
        }
        .boo-select {
          width: 120px;
        }
      }
      &-operation {
        color: @link-color;
        font-size: @font-size-base;
        > span {
          margin-right: 20px;
          cursor: pointer;
        }
      }
    }
    &-filters {
      background: @component-bg;
      margin: 20px 0;
      padding: 20px 20px 0 20px;
    }
  }
</style>
