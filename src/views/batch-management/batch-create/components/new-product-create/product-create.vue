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
          await fetchSubmitBatchCreateByProduct({
            product: {
              ...rest,
              categoryAttrList,
              categoryAttrValueMap
            },
            poiIdList: this.poiIdList,
            context
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
