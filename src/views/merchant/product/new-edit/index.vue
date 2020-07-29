<template>
  <div>
    <Loading v-if="loading" />
    <Form
      v-else
      v-model="product"
      :context="context"
      :is-edit-mode="isEditMode"
      @cancel="handleCancel"
      @confirm="handleConfirm"
    />
    <PoiSelectDrawer
      v-model="drawerVisible"
      @on-confirm="handlePoiSelected"
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
  import { SKU_FIELD } from '@/views/components/configurable-form/field'
  import { sleep } from '@/common/utils'

  const REL_TEXT = '关联门店'
  const NO_REL_TEXT = '暂不关联'

  export default {
    name: 'merchant-product-edit',
    data () {
      return {
        drawerVisible: false,
        loading: false,
        poiIds: [],
        product: {},
        context: {
          features: {
            supportLimitSaleMultiPoi: true,
            disabledExistSkuColumnMap: {
              [SKU_FIELD.STOCK]: true,
              [SKU_FIELD.PRICE]: true
            }
          }
        }
      }
    },
    components: {
      Form,
      PoiSelectDrawer
    },
    computed: {
      spuId () {
        return this.$route.query.spuId
      },
      isEditMode () {
        return this.spuId > 0
      }
    },
    async mounted () {
      if (this.spuId) {
        const { poiIds, ...product } = await fetchGetProductDetail(this.spuId)
        this.product = product || {}
        this.poiIds = poiIds || []
      }
    },
    methods: {
      handleCancel () {
        window.history.go(-1)
      },
      async handleConfirm (callback) {
        let cancel = false
        if (this.isEditMode) {
          cancel = await this.confirmEdit()
        } else {
          cancel = await this.confirmCreate()
        }
        if (!cancel) {
          await this.submit()
        }
        callback()
      },
      async confirmEdit () {
        let cancel = false
        if (this.poiIds.length > 0) {
          cancel = await new Promise((resolve) => {
            this.$Modal.confirm({
              title: '提示',
              content: `此商品关联了${this.poiIds.length}个门店，修改后将同步给所有关联的门店，是否确认保存？`,
              okText: '确认',
              cancelText: '取消',
              onOk: () => resolve(false),
              cancel: () => resolve(true)
            })
          })
        }
        return cancel
      },
      async confirmCreate () {
        const relPoi = await new Promise((resolve, reject) => {
          this.$Modal.confirm({
            title: '提示',
            content: '是否将此商品关联到下属门店',
            okText: REL_TEXT,
            cancelText: NO_REL_TEXT,
            transitionNames: [],
            onOk: () => resolve(true),
            onCancel: () => resolve(false)
          })
        })
        lx.mc({ bid: 'b_shangou_online_e_3u7qc7ro_mc', val: { button_nm: relPoi ? REL_TEXT : NO_REL_TEXT } })
        if (relPoi) {
          this.drawerVisible = true
        }
        return relPoi
      },
      handleSubmitError (err) {
        if (err.code === 1013) {
          this.$Modal.error({
            icon: null,
            width: 520,
            title: '条码不合法，请核对是否存在以下几种情况',
            content: err.message
          })
        } else {
          const errorMessage = (err && err.message) || err || '保存失败'
          this.$Message.error(errorMessage)
        }
      },
      async submit () {
        // 提交
        try {
          // TODO 发接口
          await sleep(2000)
          lx.mc({ bid: 'b_a3y3v6ek', val: { op_type: 0, op_res: 1, fail_reason: '', spu_id: this.spuId || 0 } })
          this.handleCancel()
        } catch (err) {
          lx.mc({ bid: 'b_a3y3v6ek', val: { op_type: 0, op_res: 0, fail_reason: err.message, spu_id: this.spuId || 0 } })
          this.handleSubmitError(err)
        }
      },
      async handlePoiSelected (pois) {
        lx.mc({ bid: 'b_shangou_online_e_f4nwywyw_mc' })
        this.poiIds = pois.map(poi => poi.id)
        await this.submit()
      }
    }
  }
</script>
