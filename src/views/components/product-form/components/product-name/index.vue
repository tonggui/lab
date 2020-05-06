<template>
  <div class="product-name">
    <Input v-bind="$attrs" :value="value" v-on="$listeners" @on-focus="handleFocus" @on-blur="handleBlur" @on-change="handleInput" />
    <AuditFieldTip :contents="auditTips" />
  </div>
</template>

<script>
  import Input from '../Input'
  import AuditFieldTip from '../audit-field-tip'

  export default {
    name: 'product-name',
    components: { Input, AuditFieldTip },
    props: {
      value: {
        type: String,
        default: ''
      },
      auditTips: Array
    },
    data () {
      return {
        val: this.value
      }
    },
    created () {
      // 初始如果有值，则触发一次
      if (this.val) {
        this.$emit('change', this.val)
      }
    },
    watch: {
      value (v) {
        // 正在输入时无需考虑外部变更
        if (this.val !== v && !this.using) {
          this.$emit('change', v)
        }
      }
    },
    methods: {
      handleFocus (e) {
        this.using = true
        this.$emit('focus', e)
        this.val = this.value
      },
      handleBlur (e) {
        this.using = false
        this.$emit('blur', e)
        if (this.value !== this.val) {
          this.$emit('change', this.value)
          this.val = this.value
        }
      },
      handleInput (e) {
        this.$emit('input', e.target.value)
      }
    }
  }
</script>

<style lang="less" scoped>
  .product-name {
    display: flex;
    align-items: flex-start;
  }
</style>
