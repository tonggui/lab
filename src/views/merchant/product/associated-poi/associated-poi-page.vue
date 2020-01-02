<template>
  <div class="associated-poi">
    <BreadcrumbHeader>关联门店详情</BreadcrumbHeader>
    <div>
      <ProductInfo :product="product">
        <Tooltip slot="extra" type="help" placement="bottom-end" :offset="14" content="给未售卖此商品的门店，新建该商品">
          <Button @click="handleShowPoiDrawer" v-mc="{ bid: 'b_shangou_online_e_atugv141_mc' }">
            <Icon local="add" />新增关联门店
          </Button>
        </Tooltip>
      </ProductInfo>
      <div class="associated-poi-content">
        <FilterForm :filterData="filterData" @submit="handleSearch" />
        <PoiTable />
      </div>
      <Loading v-if="loading" />
    </div>
    <PoiSelectDrawer
      title="新增关联门店"
      v-model="showAddPoiDrawer"
      :support="['search', 'input']"
      :poiIdList="product.poiIdList"
      :disabledIdList="product.poiIdList"
      @on-confirm="handleAddPoi"
    />
  </div>
</template>
<script>
  import { helper, register, remove } from './store'
  import PoiSelectDrawer from '@/views/merchant/components/poi-select-drawer'
  import BreadcrumbHeader from '@/views/merchant/components/breadcrumb-header'
  import ProductInfo from './components/product-info'
  import FilterForm from './components/filter-form'
  import PoiTable from './components/poi-table'

  const { mapState, mapActions } = helper

  export default {
    name: 'product-associated-poi',
    data () {
      return {
        showAddPoiDrawer: false
      }
    },
    computed: {
      ...mapState(['loading', 'product', 'filterData'])
    },
    components: {
      PoiSelectDrawer,
      BreadcrumbHeader,
      ProductInfo,
      FilterForm,
      PoiTable
    },
    methods: {
      ...mapActions({
        getData: 'getData',
        handleSearch: 'setFilterData',
        handleAddPoi: 'addAssociatedPoi'
      }),
      handleShowPoiDrawer () {
        this.showAddPoiDrawer = true
      }
    },
    created () {
      register()
    },
    mounted () {
      this.getData()
    },
    destroyed () {
      remove()
    }
  }
</script>
<style lang="less" scoped>
  .associated-poi {
    min-width: 1000px;
    min-height: 700px;
    &-content {
      background: #fff;
      margin-top: 10px;
      padding: 20px;
    }
  }
</style>
