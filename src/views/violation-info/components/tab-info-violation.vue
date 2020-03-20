<template>
  <div class="tab-info-violation">
    <div class="info-violation-tips">
      <h3>违规商品类型</h3>
      <ul>
        <li v-for="(item) in INFO_VIO_TIPS" :key="item">{{ item }}</li>
      </ul>
    </div>

    <div class="info-vio-list-container">
      <TableWithPage
        :loading="loading"
        :columns="infoViolationColumns"
        :data="infoViolationList"
        :pagination="pagination"
        @on-page-change="handlePageChange"
      >
        <div slot="empty">
          <EncouragingTip />
        </div>
      </TableWithPage>
    </div>

    <Modal v-model="displayProductDetailModal" title="商品违规详情">
      <Alert type="error">
        <div>违规类型：{{ curVioProductInfo.violationType }}</div>
        <div class="vio-reason-break">违规原因：{{ curProductDetail.violationReason }}</div>
      </Alert>
      <table class="vio-product-detail-table">
        <tr>
          <td class="label">商品名称:</td>
          <td>{{ curProductDetail.productName }}</td>
        </tr>
        <tr>
          <td class="label">商品分类:</td>
          <td>{{ curProductDetail.productTagName }}</td>
        </tr>
        <tr>
          <td class="label">分类描述:</td>
          <td>{{ curProductDetail.productTagDesc }}</td>
        </tr>
        <tr>
          <td class="label">商品规格:</td>
          <td>
            <div v-html="curProductDetail.productSpec"></div>
          </td>
        </tr>
        <tr>
          <td class="label">商品属性:</td>
          <td>
            <div v-html="curProductDetail.productAttr"></div>
          </td>
        </tr>
        <tr>
          <td class="label">商品单位:</td>
          <td>{{ curProductDetail.productUnit }}</td>
        </tr>
        <tr>
          <td class="label">商品描述:</td>
          <td>{{ curProductDetail.productDesc }}</td>
        </tr>
        <tr>
          <td class="label">商品图片:</td>
          <td>
            <ListPictureDidsplay :src="curProductDetail.productPicUrl" :size="138" />
          </td>
        </tr>
      </table>
      <div slot="footer">
        <Button @click="displayProductDetailModal = false" type="primary">我知道啦</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import EncouragingTip from './encouraging-tip'
  import TableWithPage from '@/components/table-with-page'
  import InfoViolationProductInfos from './info-violation-product-infos'
  import ListPictureDidsplay from '@/components/list-picture-display'
  import moment from 'moment'
  import { INFO_VIO_TIPS } from '../constants'
  import { fetchGetInfoViolationList, fetchGetInfoVioProductDetail } from '@/data/repos/product'

  export default {
    name: 'tab-info-violation',
    components: {
      EncouragingTip,
      TableWithPage,
      ListPictureDidsplay
    },
    props: {
      tabShowedCount: {
        type: Number,
        default: 0
      }
    },
    data () {
      return {
        INFO_VIO_TIPS,
        loading: false,
        pageNum: 1,
        pageSize: 30,
        total: 0,
        infoViolationList: [],
        infoViolationColumns: [{
          title: '创建时间',
          key: 'processingTime',
          align: 'left',
          width: 180,
          render: (h, { row }) => {
            return h('span', {}, moment(row.processingTime).format('YYYY-MM-DD HH:mm:ss'))
          }
        }, {
          title: '商品 | 分类 | 商品ID',
          align: 'left',
          render: (h, { row }) => {
            return h(InfoViolationProductInfos, {
              props: {
                rowData: row
              }
            })
          }
        }, {
          title: '违规类型',
          key: '',
          align: 'left',
          width: 150,
          render: (h, { row }) => {
            return h('span', {}, `${row.violationType}`)
          }
        }, {
          title: '处理方式',
          key: '',
          align: 'left',
          width: 150,
          render: (h, { row }) => {
            return h('span', {}, this.computeProcessingMethodText(row.processingMethod))
          }
        }, {
          title: '状态',
          key: '',
          align: 'left',
          width: 150,
          render: (h, { row }) => {
            return h('span', {}, this.computeStatusText(row.status))
          }
        }, {
          title: '操作',
          key: '',
          align: 'left',
          width: 150,
          render: (h, { row, col, index }) => {
            return h('span', {
              style: {
                color: '#F89800',
                cursor: 'pointer'
              },
              on: {
                click: () => this.fetchProductDetail(row.id, index)
              }
            }, '查看详情')
          }
        }],
        displayProductDetailModal: false, // 查看详情弹窗
        curVioProductInfo: {}, // 当前查看详情的这条数据的列表信息
        curProductDetail: {} // 当前查看详情的这个商品的通过接口拉取回来的数据
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
      }
    },
    watch: {
      tabShowedCount: {
        handler () {
          this.fetchInfoViolationListData()
        }
      }
    },
    methods: {
      async fetchInfoViolationListData () {
        this.loading = true
        try {
          const { page = {} } = await fetchGetInfoViolationList(this.pagination)
          const { list = [], pageNum, pageSize, totalSize } = page
          this.pageNum = pageNum
          this.pageSize = pageSize
          this.total = totalSize
          this.infoViolationList = list || []
          this.$emit('refresh-tab-label-count', {
            countInfoViolation: totalSize
          })
        } catch (err) {
          this.$Message.error(err.message)
        } finally {
          this.loading = false
        }
      },
      handlePageChange (pagination) {
        const { current } = pagination
        this.pageNum = current
        this.fetchInfoViolationListData()
      },
      computeProcessingMethodText (processingMethod) {
        let text = ''
        if (processingMethod === 1) {
          text = '删除商品'
        } else if (processingMethod === 2) {
          text = '替换敏感词'
        } else if (processingMethod === 3) {
          text = '删除图片'
        }
        return text
      },
      computeStatusText (status) {
        let text = ''
        if (status === 1 || status === 3) {
          text = '已完成'
        } else if (status === 2) {
          text = '已撤销'
        }
        return text
      },
      async fetchProductDetail (violationProcessingId, index) {
        try {
          const data = await fetchGetInfoVioProductDetail(violationProcessingId)
          this.curProductDetail = data
          const { violationProcessingLogs } = data
          this.displayProductDetailModal = true
          // 记录当前查看的是哪条数据的详情，方便展示其违规类型
          this.curVioProductInfo = this.infoViolationList[index]
          // 为展示违规原因
          violationProcessingLogs.forEach(item => {
            if (item.violationReason) {
              this.curProductDetail.violationReason = item.violationReason
            }
          })
        } catch (err) {
          this.$Message.error(err.message)
        }
      }
    },
    created () {
      this.fetchInfoViolationListData()
    }
  }
</script>

<style lang='less' scoped>
.tab-info-violation {
  padding: 10px;
  .info-violation-tips {
    font-size: 12px;
    color: @menu-item-color;
    padding: 15px;
    background-color: @light-background;
    border: 1px solid @color-gray5;
    margin: 0 20px 20px 20px;
    h3 {
      margin-bottom: 1em;
    }
    ul {
      li {
        list-style: none;
      }
    }
  }
  .info-vio-list-container {
    padding: 20px;
  }
}

.vio-reason-break {
  word-break: break-all;
}

.vio-product-detail-table {
  margin-top: 15px;
  td {
    padding-bottom: 15px;
    margin-right: 10px;
  }
  td.label {
    width: 68px;
    color: @color-gray2;
  }
}
</style>
