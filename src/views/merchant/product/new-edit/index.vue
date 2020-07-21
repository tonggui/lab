<template>
  <div>
    <Loading v-if="loading" />
    <Form
      v-model="product"
      @cancel="handleCancel"
      @confirm="handleConfirm"
    />
    <PoiSelectDrawer
      :value="drawerVisible"
      @on-confirm="handlePoiSelected"
      @on-visible-change="handlePoiDrawerVisibleChange"
    />
  </div>
</template>
<script>
  import Form from './form'
  import PoiSelectDrawer from './poi-select-drawer'
  import lx from '@/common/lx/lxReport'
  import {
    fetchGetProductDetail
  } from '@/data/repos/merchantProduct'

  export default {
    name: 'merchant-product-edit',
    data () {
      return {
        drawerVisible: false,
        loading: false,
        product: {}
      }
    },
    components: {
      Form,
      PoiSelectDrawer
    },
    computed: {
      spuId () {
        return this.$route.query.spuId
      }
    },
    async mounted () {
      if (this.spuId) {
        this.product = await fetchGetProductDetail(this.spuId)
      }
    },
    methods: {
      handleCancel () {
        window.history.go(-1)
      },
      handleConfirm () {
        console.log('handleConfirm')
      },
      handlePoiSelected (pois) {
        lx.mc({ bid: 'b_shangou_online_e_f4nwywyw_mc' })
        if (this.poiSelectCallback) {
          this.poiSelectCallback(null, pois)
        }
        this.poiSelectCallback = null
      },
      handlePoiDrawerVisibleChange (visible) {
        this.drawerVisible = visible
        if (!visible && this.poiSelectCallback) {
          this.poiSelectCallback()
          this.poiSelectCallback = null
        }
      }
    }
  }
</script>
