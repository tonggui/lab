<template>
  <ErrorBoundary :error="error" description="获取关联门店详情失败~" @refresh="getData">
    <div class="associated-poi">
      <BreadcrumbHeader>关联门店详情</BreadcrumbHeader>
      <div>
        <ProductInfo :product="product">
          <Tooltip v-if="!isMedicine" slot="extra" type="help" placement="bottom-end" :offset="14" content="给未售卖此商品的门店，新建该商品">
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
        @on-confirm="handleConfirm"
      />
    </div>
  </ErrorBoundary>
</template>
<script>
  import { helper } from './store'
  import PoiSelectDrawer from '@/views/merchant/components/poi-select-drawer'
  import BreadcrumbHeader from '@/views/merchant/components/breadcrumb-header'
  import ProductInfo from './components/product-info'
  import FilterForm from './components/filter-form'
  import PoiTable from './components/poi-table'
  // TODO 药品兼容 后期优化
  import { mapModule } from '@/module/module-manage/vue'
  import { BUSINESS_MEDICINE } from '@/module/moduleTypes'
  import { uuid } from '@utiljs/guid'

  const { mapState, mapActions } = helper()

  export default {
    name: 'product-associated-poi',
    data () {
      return {
        showAddPoiDrawer: false
      }
    },
    computed: {
      ...mapState(['loading', 'product', 'filterData', 'error']),
      ...mapModule({
        isMedicine: BUSINESS_MEDICINE
      })
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
        destroy: 'destroy',
        handleSearch: 'setFilterData',
        handleAddPoi: 'addAssociatedPoi'
      }),
      handleShowPoiDrawer () {
        this.showAddPoiDrawer = true
      },
      handleConfirm (list) {
        const traceId = uuid()
        this.handleAddPoi({ list, traceId })
      }
    },
    mounted () {
      this.getData()
    },
    beforeDestroy () {
      this.destroy()
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
