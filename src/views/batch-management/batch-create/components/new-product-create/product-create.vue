<template>
  <OrderFormItem label="填写表格" :index="index + 1" style="margin-bottom: 0;">
    <ProductForm
      v-model="product"
      :context="context"
      @validate="handleValidate"
      @confirm="handleConfirm"
      hide-cancel
      class="batch-create-form"
    />
  </OrderFormItem>
</template>
<script>
  import { fetchSubmitBatchCreateByProduct } from '@/data/repos/batch'
  import OrderFormItem from '@components/order-form-item'
  import ProductForm from './form'
  import { SPU_FIELD } from '@/views/components/configurable-form/field'
  import errorHandler from '@/views/edit-page-common/error'
  import { combineCategoryMap } from '@/data/helper/category/operation'
  import { FillTime, SearchTime } from '@/common/lx/lxReport/lxTime'
  import lx from '@/common/lx/lxReport'

  export default {
    name: 'new-batch-product-create',
    props: {
      index: {
        type: Number,
        default: 0
      },
      poiIdList: Array,
      isBusinessClient: Boolean
    },
    components: {
      ProductForm,
      OrderFormItem
    },
    data () {
      return {
        product: {},
        context: {
          field: {
            [SPU_FIELD.LIMIT_SALE]: {
              visible: false
            },
            [SPU_FIELD.PRODUCT_VIDEO]: {
              visible: false
            }
          },
          features: {
            showCellularTopSale: false,
            allowAttrApply: false
          }
        }
      }
    },
    mounted () {
      FillTime.fillStartTime = +new Date()
    },
    methods: {
      handleValidate (cb) {
        let error
        if (this.poiIdList.length <= 0) {
          error = '请先选择目标门店'
        }
        cb(error)
      },
      async handleConfirm (callback, context = {}) {
        try {
          const { normalAttributes, normalAttributesValueMap, sellAttributes, sellAttributesValueMap, ...rest } = this.product
          const { categoryAttrList, categoryAttrValueMap } = combineCategoryMap(normalAttributes, sellAttributes, normalAttributesValueMap, sellAttributesValueMap)
          const response = await fetchSubmitBatchCreateByProduct({
            product: {
              ...rest,
              categoryAttrList,
              categoryAttrValueMap
            },
            poiIdList: this.poiIdList,
            context
          })
          FillTime.fillEndTime = +new Date()
          lx.mv({
            bid: 'b_shangou_online_e_aifq7sdx_mv',
            val: {
              spu_id: this.product.spuId || response.id || 0,
              st_spu_id: this.product.spId || 0,
              source_id: 1,
              viewtime: `${FillTime.getFillTime() + SearchTime.getSearchTime()}, ${SearchTime.getSearchTime()}, ${FillTime.getFillTime()}`
            }
          })

          lx.mv({
            bid: 'b_shangou_online_e_5f609qb1_mv',
            val: {
              st_spu_id: this.product.spId || 0,
              op_type: this.product.spId ? 1 : 0,
              poi_num: this.poiIdList.length
            }
          })

          this.$emit('submit')
        } catch (err) {
          errorHandler(err)({
            isBusinessClient: this.isBusinessClient,
            confirm: this.handleConfirm
          })
        } finally {
          callback()
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  .batch-create-form {
    /deep/ .form .card {
      box-shadow: none;
    }
    /deep/ .footer {
      box-shadow: none;
    }
  }
</style>
