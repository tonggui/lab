<template>
  <div>
    <FormItemLayout label="取消订单方式" required>
      <CheckboxGroup v-model="config.type">
        <Checkbox :label="CANCEL_ORDER_TYPE.MERCHANT">门店因无货取消订单</Checkbox>
        <Checkbox :label="CANCEL_ORDER_TYPE.CUSTOMER">买家因无货取消订单</Checkbox>
      </CheckboxGroup>
    </FormItemLayout>
    <FormItemLayout label="门店系统自动同步库存">
      <Checkbox v-model="config.syncStatus">
        库存清0当日不允许同步，次日
        <TimePicker format="HH:mm" placeholder="Select time" style="width: 112px; vertical-align: middle;" v-model="config.syncTime" />
        后允许同步
      </Checkbox>
    </FormItemLayout>
    <FormItemLayout label="次日自动补充库存至">
      <div><InputNumber style="width: 400px" v-model="config.stock" :min="0" :max="PRODUCT_MAX_STOCK" :precision="0" /></div>
      <small class="danger">
        提醒：次日 <strong>00:00:00</strong> 时如果商品库存为0，则会按照当前设置的值自动补充库存
      </small>
    </FormItemLayout>
  </div>
</template>
<script>
  import {
    PRODUCT_MAX_STOCK
  } from '@/data/constants/product'
  import { createNamespacedHelpers } from 'vuex'
  import FormItemLayout from '@/views/components/product-form/form-item-layout'
  import { CANCEL_ORDER_TYPE } from '@/data/enums/poi'

  const { mapMutations, mapState } = createNamespacedHelpers('restricted-purchase')

  export default {
    name: 'auto-clear-stock-form',
    components: {
      FormItemLayout
    },
    data () {
      return {
        CANCEL_ORDER_TYPE,
        PRODUCT_MAX_STOCK
      }
    },
    computed: {
      ...mapState({
        storeConfig: 'config'
      }),
      config: {
        get () {
          return this.storeConfig
        },
        set (config) {
          this.setConfig(config)
        }
      }
    },
    methods: {
      ...mapMutations({
        handleChangeConfig: 'setConfig'
      })
    }
  }
</script>
