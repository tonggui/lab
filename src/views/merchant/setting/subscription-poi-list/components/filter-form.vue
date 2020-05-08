<template>
  <div class="subscription-poi-list-filters">
    <Form inline label-position="left" :label-width="70">
      <FormItem label="门店名称">
        <Input v-model="formData.keyword" />
      </FormItem>
      <FormItem>
        <Button style="margin-right: 20px" type="primary" @click="handleSubmit">查询</Button>
        <Button @click="handleReset">重置</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
  const defualtFormData = {
    keyword: ''
  }

  export default {
    name: 'subscription-list-filter-form',
    props: {
      data: Object
    },
    data () {
      return {
        formData: this.data || {
          ...defualtFormData
        }
      }
    },
    methods: {
      handleSubmit () {
        this.$emit('submit', this.formData)
      },
      handleReset () {
        this.formData = { ...defualtFormData }
        this.$emit('submit', this.formData)
      }
    }
  }
</script>
<style lang="less" scoped>
  .subscription-poi-list-filters {
    background: @component-bg;
    margin-bottom: 20px;
    padding: 20px 20px 0 20px;
  }
</style>
