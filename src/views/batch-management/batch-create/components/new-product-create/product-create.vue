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
  import OrderFormItem from '@components/order-form-item'
  import createForm from '@/views/components/configurable-form/instance/common-form'
  import TagInput from './tag-input'
  import { SPU_FELID } from '@/views/components/configurable-form/felid'

  const ProductForm = createForm({
    components: {
      TagList: TagInput
    }
  })

  export default {
    name: 'new-batch-product-create',
    props: {
      index: {
        type: Number,
        default: 0
      },
      poiIdList: Array
    },
    components: {
      ProductForm,
      OrderFormItem
    },
    data () {
      return {
        product: {},
        context: {
          felid: {
            [SPU_FELID.LIMIT_SALE]: {
              visible: false
            }
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
      handleConfirm (callback) {
        // TODO validType 差图处理
        console.log('confirm')
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
