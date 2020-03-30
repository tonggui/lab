<template>
  <Tooltip trigger="hover" placement="top" transfer max-width="300px" :disabled="disabled">
    <InputBlurTrim :disabled="disabled" placeholder='请输入' :value="value" @on-change="handleChange" />
    <span slot="content">{{ `规格ID：${data.id || '待生成'}` }}</span>
  </Tooltip>
</template>
<script>
  import InputBlurTrim from './input-blur-trim'

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
    },
    components: {
      InputBlurTrim
    }
  }
</script>
<style lang="less" scoped>
</style>
