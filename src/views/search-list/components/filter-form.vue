<template>
  <div class="container">
    <Form :model="formData" :label-width="80" label-position="left">
      <FormItem label="关键字">
        <Input v-model="formData.keyword" placeholder="商品名称/品牌/条码/货号" @on-keydown.enter.prevent.stop/>
      </FormItem>
      <FormItem label="商品标签">
        <CheckboxGroup v-model="formData.labelIdList">
          <Checkbox>力荐</Checkbox>
        </CheckboxGroup>
      </FormItem>
      <FormItem label="其他">
        <Checkbox v-model="formData.saleStatus">滞销30天商品</Checkbox>
      </FormItem>
    </Form>
    <div class="submit-btn-group">
      <Button class="button" @click="handleClear">清空</Button>
      <Button class="button" type="primary" @click="handleSubmit">搜索</Button>
    </div>
  </div>
</template>
<script>
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
        }
      }
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
