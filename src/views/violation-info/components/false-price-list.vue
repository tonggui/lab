<template>
  <div class="false-price-list" v-if="!loading && !total">
    <p class="false-price-list-caption" v-if="updateTime">
      本周({{ updateTime }}更新)原价虚高商品
      <span>(待整改<i>{{ notCorrectCount }}</i>,已整改{{ correctCount }})</span>
    </p>
    <Alert type="error" v-if="falsePriceModifyHint">{{ falsePriceModifyHint }}</Alert>

    <TableWithPage
      :loading="loading"
      :columns="falsePriceColumns"
      :data="falsePriceList"
      :pagination="pagination"
      @on-page-change="handlePageChange"
    />
  </div>
</template>

<script>
  import TableWithPage from '@/components/table-with-page'
  import FalsePriceProductInfos from './false-price-product-infos'
  import FalsePriceProductUpdate from './false-price-product-update'
  // import { isB } from '@/common/constants'
  import { fetchGetFalsePriceList } from '@/data/repos/product'
  let firstLoad = true

  export default {
    name: 'false-price-list',
    components: {
      TableWithPage
    },
    props: {
      tabShowedCount: {
        type: Number,
        default: 0
      }
    },
    data () {
      return {
        // isB: isB,
        isB: true,
        loading: false, // 加载数据中
        pageNum: 1,
        pageSize: 30,
        total: 0,
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
                'falsePriceUpdated': (index) => this.handleFalsePriceUpdated(index)
              }
            })
          }
        }]
      }
    },
    computed: {
      pagination () {
        return {
          current: this.pageNum,
          pageSize: this.pageSize,
          total: this.total,
          showSizer: false,
          showTotal: false
        }
      },
      falsePriceColumns () {
        const columns = this.columns
        if (!this.isB) {
          columns.splice(columns.length - 1, 1)
        }
        return columns
      }
    },
    watch: {
      tabShowedCount: {
        handler () {
          this.fetchFalsePriceListData()
        }
      }
    },
    methods: {
      async fetchFalsePriceListData () {
        this.loading = true
        try {
          const {
            pageNum,
            pageSize,
            violationTotalCount,
            falsePriceTotalCount,
            update_time: updateTime,
            isfalsePriceModifyAllowed,
            falsePriceModifyAllowedTimeRange,
            falsePriceModifyHint,
            productFalsePrices
          } = await fetchGetFalsePriceList(window.specSkuIds, this.pagination)
          const {
            not_correct_count: notCorrectCount = 0,
            correct_count: correctCount = 0,
            false_price_list: falsePriceList = []
          } = productFalsePrices
          this.pageNum = pageNum
          this.pageSize = pageSize
          this.total = falsePriceTotalCount
          this.updateTime = updateTime
          this.isfalsePriceModifyAllowed = isfalsePriceModifyAllowed
          this.falsePriceModifyAllowedTimeRange = falsePriceModifyAllowedTimeRange
          this.falsePriceModifyHint = falsePriceModifyHint
          this.notCorrectCount = notCorrectCount
          this.correctCount = correctCount
          this.falsePriceList = falsePriceList
          if (firstLoad) {
            this.$emit('refresh-tab-label-count', {
              countFalsePrice: falsePriceTotalCount,
              countInfoViolation: violationTotalCount
            })
            firstLoad = false
          }
          if (this.falsePriceList && this.falsePriceList.length === 0) {
            this.$emit('encouraging', true)
          }
        } catch (err) {
          this.$Message.error(err.message)
          this.$emit('encouraging', false)
        } finally {
          this.loading = false
        }
      },
      handlePageChange (pagination) {
        const { current } = pagination
        this.pageNum = current
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
      this.fetchFalsePriceListData()
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
