<template>
  <div class="container">
    <div class="item">
      <InputNumber
        :disabled="disabled"
        :min="0"
        class="input"
        placeholder="请输入价格"
        :value="value.price"
        @on-change="handlePriceChange"
      />
      <span class="append">元/个</span>
    </div>
    <div class="item">
      <InputNumber
        :disabled="disabled"
        :min="0"
        class="input"
        :value="value.count"
        @on-change="handleCountChange"
      />
      <span class="append">个</span>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'sell-info-package-input',
    props: {
      value: Object,
      disabled: Boolean
    },
    methods: {
      handlePriceChange (v) {
        this.trigger({
          ...this.value,
          price: v
        })
      },
      handleCountChange (v) {
        this.trigger({
          ...this.value,
          count: v
        })
      },
      trigger (v) {
        this.$emit('on-change', v)
        this.$emit('input', v)
      }
    }
  }
</script>
<style lang="less" scoped>
  .container {
    display: flex;
    flex-wrap: nowrap;
  }
  .item {
    display: flex;
    &:not(:first-child) .input {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
    &:not(:last-child) .append {
      border-right: none;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
  }
  .input {
    width: 60px;
  }
  .append {
    padding: 0px 10px;
    white-space: nowrap;
    font-size: @font-size-base;
    color: @input-placeholder-color;
    background: @input-append-bg;
    border: 1px solid @border-color-base;
    border-left: none;
    border-top-right-radius: @border-radius-base;
    border-bottom-right-radius: @border-radius-base;
  }
</style>
