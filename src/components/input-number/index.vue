<!-- 主要fix bootes input number 组件 默认值 1的问题
  采用null的hack方法
  因为Number(null) === 0 然后vue 也不渲染 null
 -->
<template>
  <InputNumber v-bind="$attrs" :value="currentValue" :disabled="disabled" v-on="$listeners" />
</template>
<script>
  import { InputNumber } from '@roo-design/roo-vue'

  export default {
    name: 'fix-input-number',
    props: {
      value: Number,
      disabled: Boolean
    },
    computed: {
      currentValue () {
        if (this.value === undefined) {
          return null
        }
        return this.value
      }
    },
    components: {
      InputNumber
    }
  }
</script>
