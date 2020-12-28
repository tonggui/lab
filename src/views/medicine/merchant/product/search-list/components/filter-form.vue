<template>
  <div class="container">
    <Form :model="formData" :label-width="100" label-position="right" class="medicine-merchant-filter">
      <FormItem label="商品UPC编码">
        <Input :maxlength="maxlength" v-model="formData.upcCode" clearable @on-keydown.enter.prevent.stop/>
      </FormItem>
      <FormItem label="商品货号">
        <Input :maxlength="maxlength" v-model="formData.skuCode" clearable @on-keydown.enter.prevent.stop/>
      </FormItem>
      <FormItem label="商品名称">
        <Input :maxlength="maxlength" v-model="formData.spuName" clearable @on-keydown.enter.prevent.stop/>
      </FormItem>
      <FormItem label="药品类型">
        <Select v-model="formData.isOtc" placeholder="全部" clearable>
          <Option v-for="item in otcTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
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
  import { otcTypeList } from '@/data/constants/medicine/merchant'
  export default {
    name: 'medicine-merchant-product-search-list-filter-form',
    props: {
      defaultData: {
        type: Object,
        default: () => ({
          upcCode: '',
          spuName: '',
          skuCode: '',
          isOtc: ''
        })
      }
    },
    watch: {
      defaultData (data) {
        this.formData = { ...data }
      }
    },
    data () {
      return {
        formData: { ...this.defaultData },
        otcTypeList,
        maxlength: PRODUCT_NAME_MAX_LENGTH
      }
    },
    methods: {
      handleSubmit () {
        this.$emit('submit', this.formData)
      },
      handleClear () {
        this.formData = { ...this.defaultData }
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
    .medicine-merchant-filter {
      .boo-form-item {
        display: inline-block;
        width: 33.33%;
      }
    }
  }
</style>
