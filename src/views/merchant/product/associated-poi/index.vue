<template>
  <div class="associated-poi">
    <BreadcrumbHeader>关联门店详情</BreadcrumbHeader>
    <div class="panel">
      <div class="product-to-associate">
        <div class="product-info-container">
          <div class="img">
            <img :src="product.picture" alt="关联商品图片">
          </div>
          <div class="info">
            <p class="product-name">{{ product.name }}</p>
            <p class="product-info">
              <span>UPC: {{ product.upcCode }}</span>
              <span>SKU码/货号：{{ product.skuCode }}</span>
            </p>
          </div>
        </div>
        <div class="operate-association">
          <Button @click="handleShowPoiDrawer"><Icon type="add" />新增关联门店</Button>
        </div>
      </div>
      <div class="pois-to-associate">
        <Form inline>
          <FormItem props="name" label="选择门店" class="form-item-width">
            <SelectPoi v-model="selectedId" :fetchData="fetchGetPoiList" style="width:200px" />
          </FormItem>
          <FormItem class="search-form-btns">
            <Button @click="handleRest">重置</Button>
            <Button type="primary" @click="handleSearch">查询</Button>
          </FormItem>
        </Form>
        <Table
          stripe
          class="table"
          :data="poiList"
          :columns="columns"
          :pagination="pagination"
          :loading="loading"
          @on-page-change="handlePageChange"
        />
      </div>
    </div>
    <PoiSelectDrawer
      title="新增关联门店"
      v-model="showAddPoiDrawer"
      @on-confirm="handleAddPoi"
      :query-poi-list="({ name, pagination }) => fetchGetPoiList(name, pagination)"
    />
  </div>
</template>

<script>
  import BreadcrumbHeader from '@/views/merchant/components/breadcrumb-header'
  import Table from '@components/table-with-page'
  import SelectPoi from '@components/selector-loadmore'
  import PoiSelectDrawer from '@/views/components/poi-select/poi-select-drawer'
  import {
    defaultPagination
  } from '@/data/constants/common'
  import {
    fetchGetProductRelPoiList,
    fetchSubmitClearRelPoi,
    fecthSubmitPoiProductSellStatus,
    fetchSubmitAddRelPoi
  } from '@/data/repos/merchantProduct'
  import {
    fetchGetPoiList
  } from '@/data/repos/merchantPoi'
  import {
    PRODUCT_SELL_STATUS
  } from '@/data/enums/product'
  import columns from './columns'

  export default {
    name: 'product-associated-poi',
    data () {
      return {
        loading: false,
        selectedId: '',
        poiList: [],
        product: {},
        pagination: {
          ...defaultPagination
        },
        showAddPoiDrawer: false
      }
    },
    computed: {
      fetchGetPoiList () {
        return fetchGetPoiList
      },
      spuId () {
        return this.$route.query.spuId
      },
      columns () {
        return [...columns, {
          title: '操作',
          key: 'associateStatus',
          render: (h, { row }) => {
            return (
              <div class="opreation">
                { row.sellStatus === PRODUCT_SELL_STATUS.OFF && <span vOn:click={() => this.handleChangeSellStatus(row.id, PRODUCT_SELL_STATUS.ON)}>上架</span> }
                { row.sellStatus === PRODUCT_SELL_STATUS.ON && <span vOn:click={() => this.handleChangeSellStatus(row.id, PRODUCT_SELL_STATUS.OFF)}>下架</span> }
                <span vOn:click={() => this.handleClearAssociated(row.id)}>取消关联</span>
              </div>
            )
          }
        }]
      }
    },
    components: {
      BreadcrumbHeader,
      Table,
      SelectPoi,
      PoiSelectDrawer
    },
    methods: {
      async getData () {
        try {
          this.loading = true
          const data = await fetchGetProductRelPoiList(this.spuId, this.pagination, this.selectedId)
          this.error = false
          return data
        } catch (err) {
          console.error(err)
          this.$Message.error(err.message || err)
          this.error = true
        } finally {
          this.loading = false
        }
      },
      handleShowPoiDrawer () {
        this.showAddPoiDrawer = true
      },
      async handleChangeSellStatus (poiId, status, index) {
        try {
          this.loading = true
          await fecthSubmitPoiProductSellStatus(this.spuId, poiId, status)
          this.$Message.success('操作成功', () => {
            const node = this.list[index]
            this.list.splice(index, 1, {
              ...node,
              sellStatus: status
            })
          })
        } catch (err) {
          this.$Message.error(err)
        } finally {
          this.loading = false
        }
      },
      async handleClearAssociated (poiId) {
        try {
          this.loading = true
          await fetchSubmitClearRelPoi(this.spuId, poiId)
          this.$Message.success('取消成功', () => {
            this.getData()
          })
        } catch (err) {
          this.$Message.error(err)
        } finally {
          this.loading = false
        }
      },
      async handleAddPoi (poiIdList) {
        try {
          await fetchSubmitAddRelPoi(this.spuId, this.poiList)
          this.$Message.success('添加成功', () => this.$router.go(0))
        } catch (err) {
          this.$Message.error(err)
        }
      },
      handleRest () {
        if (this.selectedId) {
          this.selectedId = ''
          this.handleSearch()
        }
      },
      async handleSearch () {
        try {
          this.pagination.current = 1
          const { list, pagination } = await this.getData()
          this.poiId = list
          this.pagination = pagination
        } catch (err) {}
      },
      async handlePageChange (page) {
        try {
          const { list, pagination } = await this.getData()
          this.poiId = list
          this.pagination = pagination
        } catch (err) {}
      }
    },
    async mounted () {
      try {
        const data = await this.getData()
        const { list, product, pagination } = data
        this.poiList = list
        this.product = product
        this.pagination = pagination
      } catch (err) {}
    }
  }
</script>

<style lang='less' scoped>
.associated-poi {
  font-size: 14px;
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
            > span:not(:last-child) {
              margin-right: 6px;
            }
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
    }
  }
  .table {
    /deep/ .boo-table {
      border: 1px solid @border-color-base;
      th, td {
        border-bottom: none;
      }
      &::after { display: none }
    }
  }
}
</style>
<style lang='less'>
.associated-poi {
  .form-item-width {
    .boo-form-item-label {
      font-size: 14px;
    }
  }
  .boo-btn {
    font-size: 14px;
  }
  .opreation {
    color: @link-color;
    cursor: pointer;
    > span:not(:last-child) {
      margin-right: 10px;
    }
  }
}
</style>
