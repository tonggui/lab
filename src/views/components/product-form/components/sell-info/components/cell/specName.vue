<template>
  <Tooltip trigger="hover" placement="top" transfer max-width="300px">
    <Input :disabled="disabled" placeholder='请输入' :value="value" @on-change="handleChange" />
    <span slot="content">{{ `规格ID：${data.id || '待生成'}` }}</span>
  </Tooltip>
</template>
<script>
  export default {
    name: 'sell-info-specname',
    props: {
      data: Object,
      value: String,
      disabled: Boolean
    },
    methods: {
      handleChange (v) {
        this.$emit('on-change', v)
        this.$emit('input', v)
      }
    }
  }
</script>
<style lang="less" scoped>
</style>
