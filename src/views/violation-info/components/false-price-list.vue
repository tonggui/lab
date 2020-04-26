<template>
  <div class="false-price-list">
    <p class="false-price-list-caption" v-if="updateTime">
      本周({{ updateTime }}更新)原价虚高商品
      <span>(待整改<i>{{ notCorrectCount }}</i>,已整改{{ correctCount }})</span>
    </p>
    <Alert type="error" v-if="falsePriceModifyHint && pagination.total">{{ falsePriceModifyHint }}</Alert>

    <TableWithPage
      :loading="loading"
      :columns="falsePriceColumns"
      :data="falsePriceList"
      :pagination="pagination"
      @on-page-change="handlePageChange"
    >
      <div slot="empty">
        <EncouragingTip />
      </div>
    </TableWithPage>
  </div>
</template>

<script>
  import TableWithPage from '@/components/table-with-page'
  import EncouragingTip from './encouraging-tip'
  import FalsePriceProductInfos from './false-price-product-infos'
  import FalsePriceProductUpdate from './false-price-product-update'
  import { fetchGetFalsePriceList } from '@/data/repos/product'
  let firstLoad = true

  export default {
    inject: ['appState'],
    name: 'false-price-list',
    components: {
      TableWithPage,
      EncouragingTip
    },
    props: {
      active: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        loading: false, // 加载数据中
        pagination: {
          current: 1,
          pageSize: 30,
          total: 0,
          showSizer: false,
          showTotal: false
        },
        updateTime: '',
        isfalsePriceModifyAllowed: 1, // 是否允许修改建议价格
        falsePriceModifyAllowedTimeRange: {
          mondayBeginTime: '',
          fridayEndTime: ''
        },
        falsePriceModifyHint: '',
        notCorrectCount: 0,
        correctCount: 0,
        falsePriceList: [],
        columns: [{
          title: '整改状态',
          key: 'correct_status',
          align: 'left',
          width: 150,
          render: (h, { row }) => {
            return h('span', {}, row.correct_status ? '已整改' : '待整改')
          }
        }, {
          title: '商品 | 分类 | 规格ID',
          align: 'left',
          render: (h, { row }) => {
            return h(FalsePriceProductInfos, {
              props: {
                rowData: row
              }
            })
          }
        }, {
          title: '原价',
          key: 'origin_price',
          align: 'center',
          width: 150,
          render: (h, { row }) => {
            return h('span', {}, `${row.origin_price}元`)
          }
        }, {
          title: '建议价',
          key: 'suggest_price',
          align: 'center',
          width: 150,
          render: (h, { row }) => {
            return h('span', {
              style: {
                color: '#F89800'
              }
            }, `${row.suggest_price}元`)
          }
        }, {
          title: '操作',
          align: 'center',
          width: 240,
          render: (h, { row, col, index }) => {
            return h(FalsePriceProductUpdate, {
              props: {
                index,
                rowData: row,
                disabled: !!this.isfalsePriceModifyAllowed,
                timeAllowModify: this.falsePriceModifyAllowedTimeRange
              },
              on: {
                'on-false-price-updated': (index) => this.handleFalsePriceUpdated(index)
              }
            })
          }
        }]
      }
    },
    computed: {
      isBusinessClient () {
        return this.appState.isBusinessClient
      },
      falsePriceColumns () {
        const columns = this.columns
        if (!this.isBusinessClient) {
          columns.splice(columns.length - 1, 1)
        }
        return columns
      }
    },
    watch: {
      active: {
        handler (v) {
          if (v) {
            this.fetchFalsePriceListData()
          }
        }
      }
    },
    methods: {
      async fetchFalsePriceListData () {
        this.loading = true
        try {
          const {
            pagination,
            violationTotalCount,
            falsePriceTotalCount,
            updateTime,
            isfalsePriceModifyAllowed,
            falsePriceModifyAllowedTimeRange,
            falsePriceModifyHint,
            notCorrectCount,
            correctCount,
            falsePriceList
          } = await fetchGetFalsePriceList(window.specSkuIds, this.pagination)
          this.pagination = pagination
          this.updateTime = updateTime
          this.isfalsePriceModifyAllowed = isfalsePriceModifyAllowed
          this.falsePriceModifyAllowedTimeRange = falsePriceModifyAllowedTimeRange
          this.falsePriceModifyHint = falsePriceModifyHint
          this.notCorrectCount = notCorrectCount
          this.correctCount = correctCount
          this.falsePriceList = falsePriceList || []
          if (firstLoad) {
            this.$emit('on-refresh-tab-label-count', {
              countFalsePrice: falsePriceTotalCount,
              countInfoViolation: violationTotalCount
            })
            firstLoad = false
          }
        } catch (err) {
          this.$Message.error(err.message)
        } finally {
          this.loading = false
        }
      },
      handlePageChange (pagination) {
        this.pagination.current = pagination.current
        this.fetchFalsePriceListData()
      },
      handleFalsePriceUpdated (index) {
        this.notCorrectCount -= 1
        this.correctCount += 1
        const cur = this.falsePriceList[index]
        cur.correct_status = 1
        cur.origin_price = cur.suggest_price
        this.$set(this.falsePriceList, index, cur)
      }
    },
    created () {
      // 因为 默认tab改为了信息违规商品tab，所以这里不直接请求原价虚高数据了
      // this.fetchFalsePriceListData()
    }
  }
</script>

<style lang='less' scoped>
.false-price-list {
  padding: 20px;
  .false-price-list-caption {
    font-weight: bold;
    margin-bottom: 10px;
    span {
      color: @color-gray2;
      font-weight: normal;
    }
    i {
      color: @highlight-color;
      font-style: normal;
    }
  }
}
</style>
