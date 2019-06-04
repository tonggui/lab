<template>
  <div class="recycle">
    <Breadcrumb separator=">">
      <BreadcrumbItem>
        <NamedLink :name="PRODUCT_LIST_PAGE_NAME" :query="productListPageParams">商品管理</NamedLink>
      </BreadcrumbItem>
      <BreadcrumbItem>商品回收站</BreadcrumbItem>
    </Breadcrumb>
    <Alert class="tip-alert" type="warning" show-icon closable>回收站仅保留15天内删除的商品，逾期自动清空</Alert>
    <div class="panel">
      <div class="panel-header">
        <p class="header-title">商品回收站</p>
        <div class="header-opr">
          <Button @click="handleAction('CLEAN')">清理回收站</Button>
        </div>
      </div>
      <div class="panel-form">
        <Form inline ref="searchForm" :model="searchForm">
          <FormItem props="name" label="商品名称" class="form-item-width">
            <Input type="text" v-model="searchForm.name" placeholder="请输入商品名称" style="width: 200px" />
          </FormItem>
          <FormItem props="date" label="删除时间" class="form-item-width">
            <DatePicker
              v-model="searchForm.date"
              @on-change="handleDateChange"
              format="yyyy-MM-dd"
              type="daterange"
              placeholder="开始时间 - 结束时间"
              style="width: 200px"
            />
          </FormItem>
          <FormItem>
            <Button type="primary" @click="changePage(1)">搜索</Button>
          </FormItem>
        </Form>
      </div>
      <div class="recover-btn-wrapper">
        <Button type="primary" @click="handleAction('BATCH_RECOVER')">批量恢复</Button>
      </div>
      <Table :data="list" :columns="columns" :loading="loading" @on-selection-change="handleSelectionChange" />
      <div class="page-wrapper">
        <Page
          :current="pageNum"
          :total="totalNum"
          show-sizer
          :page-size="pageSize"
          :page-size-opts="pageSizeOpts"
          show-total
          @on-change="changePage"
          @on-page-size-change="changePageSize"
        />
      </div>
    </div>
    <Modal v-model="recycleModal" :title="modalTitle" :ok-text="modalOkText" @on-ok="onOk">
      <template v-if="modalContentConfig['TIP']">
        <Alert type="warning" show-icon>{{ modalContentTip }}</Alert>
      </template>
      <template v-if="modalContentConfig['TAG']">
      </template>
      <template v-if="modalContentConfig['DATE']">
        清空删除日期早于 <DatePicker :value="cleanDateBefore" @on-change="handleCleanDateChange" format="yyyy-MM-dd" /> 的商品
      </template>
    </Modal>
  </div>
</template>

<script>
import productList from '@sgfe/eproduct/navigator/pages/product/list'
import NamedLink from '@/components/link/named-link'
import { poiId } from '@/common/constants'
import { MODAL_TYPE } from '@/views/recycle/constants'
import {
  fetchRecycleProductList
  // cleanRecycleBin,
  // recoverRecycleSpus
} from '@/data/repos/productRepository'

export default {
  name: 'recycle',
  components: {
    NamedLink
  },
  data () {
    return {
      PRODUCT_LIST_PAGE_NAME: productList.name,
      poiId,
      pageSizeOpts: [20, 50, 100],
      pageNum: 1,
      pageSize: 20,
      totalNum: 0,
      searchForm: {
        name: '', // 商品名称
        date: []
      },
      productName: '', // 商品名称
      startDate: '', // 查询开始时间
      endDate: '', // 查询结束时间
      list: [], // 商品列表
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        }, {
          title: '商品图片',
          key: 'picture',
          width: 100,
          render: (h, { row }) => {
            return h('img', {
              attrs: {
                src: row.picture,
                width: 64,
                height: 64
              },
              style: {
                border: '1px solid #e9eaf2',
                verticalAlign: 'middle',
                marginTop: '12px',
                marginBottom: '11px'
              }
            })
          }
        }, {
          title: '商品名称',
          key: 'name'
        }, {
          title: '商品分类',
          key: 'tag_name'
        }, {
          title: '操作',
          key: 'action',
          width: 100,
          render: (h, { row }) => {
            return h('Button', {
              props: {
                type: 'text'
              },
              style: {
                color: '#f89800'
              },
              on: {
                click: () => {
                  this.handleRecover(row)
                }
              }
            }, '恢复')
          }
        }
      ],
      loading: false, // 列表加载中
      recycleModal: false,
      modalTitle: '恢复商品',
      modalOkText: '确认',
      modalContentTip: '',
      modalContentConfig: { // 模态框内容配置
        'TAG': false,
        'TIP': false,
        'DATE': false
      },
      cleanDateBefore: ''
    }
  },
  computed: {
    productListPageParams () {
      return {
        wmPoiId: this.poiId
      }
    }
  },
  methods: {
    handleDateChange (date) {
      this.searchForm.date = date
    },
    handleCleanDateChange (date) {
      this.cleanDateBefore = date
    },
    handleSelectionChange (selection) {
      console.log(selection)
    },
    handleAction (type) {
      if (type === 'BATCH_RECOVER') {}
      const { title, okText = '确认', tipText = '', config } = MODAL_TYPE[type]
      this.modalTitle = title
      this.modalOkText = okText
      this.modalContentTip = tipText
      this.modalContentConfig = config
      this.recycleModal = true
    },
    getRecycleProductList () {
      const params = {
        wmPoiId: poiId,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        name: this.searchForm.name,
        startDate: this.searchForm.date[0] || '',
        endDate: this.searchForm.date[1] || ''
      }
      return new Promise((resolve, reject) => {
        fetchRecycleProductList(params).then(res => {
          this.totalNum = res.total
          resolve(res.list)
        }).catch(err => {
          reject(err)
        })
      })
    },
    changePage (num) {
      this.pageNum = num
      this.loading = true
      this.getRecycleProductList().then(data => {
        this.loading = false
        this.list = data
      }).catch(err => {
        this.loading = false
        this.$Message.error(err.message || err)
      })
    },
    changePageSize (size) {
      this.pageSize = size
      this.changePage(1)
    },
    onOk () {

    },
    handleRecover (row) {
      console.log(row)
    }
  },
  created () {
    this.changePage(this.pageNum)
  }
}
</script>

<style lang='less' scoped>
.recycle {
  text-align: left;
  .link {
    font-size: 14px;
    padding: 0;
    vertical-align: bottom;
    border: none;
  }
  .tip-alert {
    margin-top: 10px;
  }
  .panel {
    min-width: 1000px;
    min-height: 700px;
    padding: 0 20px 30px;
    background-color: #fff;
    margin-top: 10px;
    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      padding: 20px 0;
      .header-title {
        font-size: 20px;
        line-height: 26px;
        align-self: baseline;
      }
    }
    .panel-form {
      .form-item-width {
        width: 280px;
      }
    }
    .recover-btn-wrapper {
      padding-bottom: 10px;
      text-align: right;
    }
    .boo-table-tbody {
      .boo-table-row {
        height: 70px;
      }
    }
    .page-wrapper {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      height: 60px;
    }
  }
}
</style>
