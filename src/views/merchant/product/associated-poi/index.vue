<template>
  <div class="associated-poi">
    <BreadcrumbHeader>关联门店详情</BreadcrumbHeader>
    <div class="header">
      <div class="product-info">
        <div :class="imgClass">
          <img v-if="!!product.picture" :src="product.picture" alt="关联商品图片" @error="handleImgError">
          <Icon v-else local="picture" size="22" />
        </div>
        <div>
          <p class="name">{{ product.name }}</p>
          <p class="info">
            <span>UPC: <EmptyDefaultShow :value="product.upcCode" /></span>
            &nbsp;&nbsp;
            <span>SKU码/货号：<EmptyDefaultShow :value="product.skuCode" /></span>
          </p>
        </div>
      </div>
      <Tooltip type="help" placement="bottom-end" :offset="14" content="给未售卖此商品的门店，新建该商品">
        <Button @click="handleShowPoiDrawer" v-mc="{ bid: 'b_shangou_online_e_atugv141_mc' }">
          <Icon local="add" />新增关联门店
        </Button>
      </Tooltip>
    </div>
    <div class="content">
      <Form inline class="filter-form" :label-width="70" label-position="left">
        <FormItem props="name" label="选择门店">
          <SelectPoi v-model="filter.poiId" :fetchData="fetchGetPoiList" style="width:200px" placeholder="请选择门店" />
        </FormItem>
        <FormItem props="exist" label="是否存在" class="form-item-width">
          <Select v-model="filter.exist" style="width:150px">
            <Option v-for="option in existOptions" :value="option.value" :key="option.value">{{ option.label }}</Option>
          </Select>
        </FormItem>
        <FormItem class="search-form-btns">
          <Button @click="handleRest">重置</Button>
          <Button type="primary" @click="handleSearch" v-mc="{ bid: 'b_shangou_online_e_peq1c8pi_mc' }">查询</Button>
        </FormItem>
      </Form>
      <Table
        stripe
        class="table"
        disabled-hover
        :data="poiList"
        :columns="columns"
        :pagination="pagination"
        :loading="loading"
        @on-page-change="handlePageChange"
        no-text-data="暂无关联门店"
      />
    </div>
    <PoiSelectDrawer
      title="新增关联门店"
      v-model="showAddPoiDrawer"
      :support="['search', 'input']"
      :poiIdList="product.poiIdList"
      :disabledIdList="product.poiIdList"
      @on-confirm="handleAddPoi"
      :fetch-poi-list-by-ids="fetchPoiListByIdList"
      :query-poi-list="(params) => fetchGetPoiList(params.name, params.pagination, params.city)"
    />
  </div>
</template>

<script>
  import { isEqual } from 'lodash'
  import BreadcrumbHeader from '@/views/merchant/components/breadcrumb-header'
  import Table from '@components/table-with-page'
  import SelectPoi from '@components/selector-loadmore'
  import PoiSelectDrawer from '@/views/components/poi-select/poi-select-drawer'
  import {
    defaultPagination
  } from '@/data/constants/common'
  import {
    fetchGetProductRelPoiListWithProduct,
    fetchSubmitClearRelPoi,
    fetchSubmitPoiProductSellStatus,
    fetchSubmitAddRelPoi
  } from '@/data/repos/merchantProduct'
  import {
    fetchGetPoiInfoListByIdList
  } from '@/data/repos/poi'
  import errorImg from '@/assets/picture-broken.png'
  import {
    fetchGetPoiList
  } from '@/data/repos/merchantPoi'
  import {
    PRODUCT_SELL_STATUS
  } from '@/data/enums/product'
  import columns from './columns'
  import {
    existOptions,
    EXIST_TYPE
  } from './constants'

  const initFilter = {
    poiId: undefined,
    exist: EXIST_TYPE.INCLUDE
  }

  export default {
    name: 'product-associated-poi',
    data () {
      return {
        loading: false,
        filter: { ...initFilter },
        poiList: [],
        product: {},
        pagination: {
          ...defaultPagination
        },
        showAddPoiDrawer: false
      }
    },
    computed: {
      existOptions () {
        return existOptions
      },
      fetchGetPoiList () {
        return fetchGetPoiList
      },
      spuId () {
        return Number(this.$route.query.spuId)
      },
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
                { sellStatus === PRODUCT_SELL_STATUS.OFF && <span onClick={() => this.handleChangeSellStatus(row.id, PRODUCT_SELL_STATUS.ON, index)} vMc={{ bid, val: { button_nm: '上架' } }}>上架</span> }
                { sellStatus === PRODUCT_SELL_STATUS.ON && <span onClick={() => this.handleChangeSellStatus(row.id, PRODUCT_SELL_STATUS.OFF, index)} vMc={{ bid, val: { button_nm: '下架' } }}>下架</span> }
                <span onClick={() => this.handleClearAssociated(row.id)} vMc={{ bid, val: { button_nm: '取消关联' } }}>取消关联</span>
              </div>
            )
          },
          renderHeader: (h, { column }) => {
            return <span style={{ paddingLeft: '30px' }}>{ column.title }</span>
          }
        }]
      },
      imgClass () {
        return [
          'img',
          {
            'no-img': !this.product.picture,
            'is-error': this.product.picture === errorImg
          }
        ]
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
          const data = await fetchGetProductRelPoiListWithProduct(this.spuId, this.pagination, this.filter)
          const { list, product, pagination } = data
          this.poiList = list
          const newProduct = product
          if (isEqual(this.product.poiIdList, product.poiIdList)) {
            newProduct.poiIdList = this.product.poiIdList
          }
          this.product = newProduct
          this.pagination = pagination
          this.error = false
        } catch (err) {
          console.error(err)
          this.$Message.error(err.message || err)
          this.poiList = []
          this.product = {}
          this.pagination = { ...defaultPagination }
          this.error = true
        } finally {
          this.loading = false
        }
      },
      async fetchPoiListByIdList (poiIdList) {
        const data = await fetchGetPoiInfoListByIdList(this.$route.query.routerTagId, poiIdList)
        return data
      },
      handleImgError () {
        this.product.picture = errorImg
      },
      handleShowPoiDrawer () {
        this.showAddPoiDrawer = true
      },
      async handleChangeSellStatus (poiId, status, index) {
        try {
          this.loading = true
          await fetchSubmitPoiProductSellStatus(this.spuId, [poiId], status)
          const node = this.poiList[index]
          this.poiList.splice(index, 1, {
            ...node,
            sellStatus: status
          })
          this.$Message.success('操作成功')
        } catch (err) {
          console.error(err.message || err)
          this.$Message.error(err.message || err)
        } finally {
          this.loading = false
        }
      },
      async handleClearAssociated (poiId) {
        try {
          this.loading = true
          await fetchSubmitClearRelPoi(this.spuId, [poiId])
          this.$Message.success('取消成功')
          this.getData()
        } catch (err) {
          console.error(err)
          this.$Message.error(err.message || err)
        } finally {
          this.loading = false
        }
      },
      async handleAddPoi (poiList) {
        try {
          const addPoiIdList = []
          // 已经添加过的不提交
          poiList.forEach(item => {
            if (!this.product.poiIdList.includes(item.id)) {
              addPoiIdList.push(item.id)
            }
          })
          if (addPoiIdList.length <= 0) {
            throw Error('请选择新增关联的门店')
          }
          await fetchSubmitAddRelPoi(this.spuId, addPoiIdList)
          this.$Message.success({
            content: '添加成功',
            duration: 2
          })
          setTimeout(() => { this.$router.go(0) }, 2000)
        } catch (err) {
          console.error(err.message || err)
          const type = err.code ? 'error' : 'warning'
          this.$Message[type](err.message || err)
          throw err
        }
      },
      handleRest () {
        if (!isEqual(this.filter, initFilter)) {
          this.filter = { ...initFilter }
          this.handleSearch()
        } else {
          this.$Message.warning('当前的筛选项已经是初始状态了！')
        }
      },
      async handleSearch () {
        try {
          this.pagination.current = 1
          this.getData()
        } catch (err) {
          console.error(err.message || err)
          this.$Message.error(err.message || err)
        }
      },
      async handlePageChange (page) {
        try {
          this.pagination = page
          this.getData()
        } catch (err) {
          console.error(err.message || err)
          this.$Message.error(err.message || err)
        }
      }
    },
    mounted () {
      this.getData()
    }
  }
</script>

<style lang='less' scoped>
.associated-poi {
  min-width: 1000px;
  min-height: 700px;
  .header {
    display: flex;
    align-items: center;
    height: 100px;
    padding: 20px;
    background-color: #fff;
    margin-bottom: 10px;
    margin-top: 10px;
    .product-info {
      flex: 1;
      min-width: 200px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .img {
        width: 60px;
        height: 60px;
        line-height: 58px;
        margin-right: 20px;
        border: 1px solid @border-color-base;
        border-radius: @border-radius-base;
        text-align: center;
        &.no-img,
        &.is-error {
          background-color: @disabled-bg;
        }
        &.is-error img {
          width: 24px;
        }
        img {
          width: 100%;
        }
      }
      .name {
        font-size: @font-size-base;
        font-weight: bold;
        line-height: 28px;
      }
      .info {
        font-size: @font-size-small;
        color: @text-tip-color;
        line-height: 26px;
      }
    }
  }
  .content {
    background: #fff;
    margin-top: 10px;
    padding: 20px;
  }
  .filter-form {
    display: flex;
    align-items: center;
  }
  .search-form-btns {
    .boo-btn:not(:first-of-type) {
      margin-left: 10px;
    }
  }
  .table {
    min-height: 400px;
    /deep/ .operation {
      color: @link-color;
      &:hover {
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
}
</style>
