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
      </div>
      <Table border :data="list" :columns="columns" />
    </div>
  </div>
</template>

<script>
import productList from '@sgfe/eproduct/navigator/pages/product/list'
import NamedLink from '@/components/link/named-link'
import { poiId } from '@/common/constants'
import {
  fetchRecycleProductList
} from '@/data/repos/productRepository'

export default {
  name: 'recycle',
  components: {
    NamedLink
  },
  props: {},
  data () {
    return {
      PRODUCT_LIST_PAGE_NAME: productList.name,
      poiId,
      pageNum: 1,
      pageSize: 10,
      totalNum: 0,
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
                width: 60,
                height: 60
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
      loading: false // 列表加载中
    }
  },
  computed: {
    productListPageParams () {
      return {
        wmPoiId: this.poiId
      }
    }
  },
  watch: {},
  methods: {
    getRecycleProductList () {
      const params = {
        wmPoiId: poiId,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        name: this.productName,
        startDate: this.startDate,
        endDate: this.endDate
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
    padding: 30px;
    background-color: #fff;
    margin-top: 10px;
  }
}
</style>
