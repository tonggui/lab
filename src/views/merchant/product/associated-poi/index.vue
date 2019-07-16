<template>
  <div class="associated-poi">
    <BreadcrumbHeader>关联门店详情</BreadcrumbHeader>
    <div class="panel">
      <div class="product-to-associate">
        <div class="product-info-container">
          <div class="img">
            <img src="http://p0.meituan.net/scproduct/249d088af44bd87744fd7569c833eae3147107.jpg" alt="关联商品图片">
          </div>
          <div class="info">
            <p class="product-name">汉斯 原味蘑菇意大利面酱 680/罐</p>
            <p class="product-info">
              <span>UPC: 239289923</span>
              <span>SKU码/货号：239289923</span>
            </p>
          </div>
        </div>
        <div class="operate-association">
          <Button><Icon type="add" />新增关联门店</Button>
        </div>
      </div>
      <div class="pois-to-associate">
        <Form inline ref="searchForm" :model="searchForm">
          <FormItem props="name" label="选择门店" class="form-item-width">
            <Select v-model="searchForm.model1" style="width:200px">
              <Option :value="-1">请选择</Option>
            </Select>
          </FormItem>
          <FormItem class="search-form-btns">
            <Button @click="console.log('重置')">重置</Button>
            <Button type="primary" @click="console.log('查询')">查询</Button>
          </FormItem>
        </Form>
        <Table :data="poiList" :columns="columns" />
        <div class="page-wrapper">
          <Page
            :current="current"
            :total="total"
            show-sizer
            :page-size="pageSize"
            :page-size-opts="pageSizeOpts"
            show-total
            show-elevator
            @on-change="changePage"
            @on-page-size-change="changePageSize"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import BreadcrumbHeader from '@/views/merchant/components/breadcrumb-header'

  export default {
    name: 'product-associated-poi',
    data () {
      return {
        searchForm: {
          model1: -1
        },
        columns: [
          {
            title: '门店ID',
            key: 'id',
            align: 'center'
          }, {
            title: '门店信息',
            key: 'name'
          }, {
            title: '价格',
            key: 'price',
            width: 100,
            align: 'center',
            render: (h, { row }) => {
              return h('span', {}, `￥${row.price}`)
            }
          }, {
            title: '库存',
            key: 'stock',
            width: 100,
            align: 'center'
          }, {
            title: '状态',
            key: 'sellStatus',
            render: (h, { row }) => {
              return h('span', {}, row.sellStatus === 1 ? '已下架' : '已上架')
            }
          }, {
            title: '操作',
            key: 'associateStatus',
            render: (h, { row }) => {
              return h('span', {}, [
                h('span', {
                  style: {
                    display: 'inline-block',
                    paddingRight: '10px',
                    color: '#f89800',
                    cursor: 'pointer'
                  },
                  on: {
                    click: () => {
                      this.handleAction('SINGLE_RECOVER', row)
                    }
                  }
                }, row.sellStatus === 1 ? '上架' : '下架'),
                h('span', {
                  style: {
                    color: '#f89800',
                    cursor: 'pointer'
                  },
                  on: {
                    click: () => {
                      this.handleAction('SINGLE_RECOVER', row)
                    }
                  }
                }, row.associateStatus === 1 ? '取消关联' : '关联')
              ])
            }
          }
        ],
        poiList: [{
          id: 1000001,
          name: '家乐福（华发商都店）',
          price: 56.9,
          stock: 100,
          sellStatus: 1, // 已下架
          associateStatus: 1 // 已关联
        }, {
          id: 1000002,
          name: '华联超市（华发商都店）',
          price: 56.9,
          stock: 20,
          sellStatus: 0, // 已下架
          associateStatus: 0 // 已关联
        }],
        current: 1,
        pageSize: 20,
        total: 0,
        pageSizeOpts: [20, 50, 100]
      }
    },
    computed: {
      selectPoiCategoryPathname () {
        return `/reuse/product/router/page/multiPoiRouter?routerTagId=${this.routerTagId}`
      }
    },
    components: {
      BreadcrumbHeader
    },
    methods: {
      changePage () {},
      changePageSize () {}
    },
    created () {}
  }
</script>

<style lang='less' scoped>
.associated-poi {
  font-size: 14px;
  .link {
    font-size: inherit;
    padding: 0;
    vertical-align: bottom;
    border: none;
  }
  .panel {
    min-width: 1000px;
    min-height: 700px;
    margin-top: 10px;
    .product-to-associate {
      display: flex;
      justify-content: space-around;
      align-items: center;
      width: 100%;
      height: 100px;
      padding: 20px;
      background-color: #fff;
      margin-bottom: 10px;
      .product-info-container {
        flex-basis: 60%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .img {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 60px;
          height: 60px;
          border: 1px solid @color-gray4;
          overflow: hidden;
          margin-right: 20px;
          img {
            width: 100%;
          }
        }
        .info {
          .product-name {
            font-size: 14px;
            font-weight: bold;
            line-height: 28px;
          }
          .product-info {
            font-size: 12px;
            color: @color-gray3;
            line-height: 26px;
          }
        }
      }
      .operate-association {
        flex-basis: 40%;
        text-align: right;
      }
    }
    .pois-to-associate {
      width: 100%;
      min-height: 640px;
      padding: 30px 20px;
      background-color: #fff;
      .form-item-width {
        width: 280px;
      }
      .search-form-btns {
        .boo-btn:not(:first-of-type) {
          margin-left: 10px;
        }
      }
      .page-wrapper {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        height: 60px;
        margin-top: 15px;
      }
    }
  }
}
</style>
<style lang='less'>
.associated-poi {
  .boo-breadcrumb-item-separator {
    color: @color-gray2;
  }
  .form-item-width {
    .boo-form-item-label {
      font-size: 14px;
    }
  }
  .boo-btn {
    font-size: 14px;
  }
}
</style>
