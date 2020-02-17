<template>
  <div class="container">
    <Form :model="formData" :label-width="80" label-position="left">
      <FormItem label="关键字">
        <Input :maxlength="maxlength" v-model="formData.keyword" placeholder="商品名称/品牌/条码/货号" @on-keydown.enter.prevent.stop/>
      </FormItem>
      <FormItem label="商品标签">
        <CheckboxGroup v-model="formData.labelIdList">
          <Checkbox :label="1">力荐</Checkbox>
        </CheckboxGroup>
      </FormItem>
      <FormItem label="其他">
        <Checkbox v-model="formData.saleStatus">滞销30天商品</Checkbox>
        <Checkbox v-model="formData.limitSale" v-if="showLimitSale">限购商品</Checkbox>
        <Checkbox v-model="formData.stockoutAutoClearStock" v-if="showAutoClearStock">设置缺货商品库存自动清零</Checkbox>
      </FormItem>
    </Form>
    <div class="submit-btn-group">
      <Button class="button" @click="handleClear">清空</Button>
      <Button class="button" type="primary" @click="handleSubmit">搜索</Button>
    </div>
  </div>
</template>
<script>
  import { PRODUCT_NAME_MAX_LENGTH } from '@/data/constants/product'
  import { PRODUCT_LIMIT_SALE, POI_AUTO_CLEAR_STOCK } from '@/module/moduleTypes'
  import { mapModule } from '@/module/module-manage/vue'

  export default {
    name: 'product-search-list-filter-form',
    props: {
      data: {
        type: Object,
        required: true
      }
    },
    watch: {
      data (data) {
        this.formData = { ...data }
      }
    },
    data () {
      return {
        formData: {
          ...this.data
        },
        maxlength: PRODUCT_NAME_MAX_LENGTH
      }
    },
    computed: {
      ...mapModule({
        showLimitSale: PRODUCT_LIMIT_SALE,
        showAutoClearStock: POI_AUTO_CLEAR_STOCK
      })
    },
    methods: {
      handleSubmit () {
        this.$emit('submit', this.formData)
      },
      handleClear () {
        this.$emit('clear')
      }
    }
  }
</script>
<style scoped lang="less">
  .container {
    margin: 10px 0;
    padding: 20px;
    background: @component-bg;
    /deep/ .boo-form-item {
      margin-bottom: 16px;
      .boo-form-item-label {
        font-size: @font-size-base;
      }
    }
    .submit-btn-group {
      text-align: right;
      .button:not(:last-child) {
        margin-right: 20px
      }
    }
  }
</style>
