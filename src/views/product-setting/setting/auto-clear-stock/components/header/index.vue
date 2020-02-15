<template>
  <div class="auto-clear-stock-header">
    <div class="content">
      <Tooltip type="help" placement="bottom" :offset="120" :max-width="260" content="订单中包含本次设置的商品时，当买家或门店在取消订单中选择商品无货，则本次设置的商品库存会被自动清零（仅支持部分退款或整单中只有本次设置的商品）">
        <span class="title">设置缺货商品库存自动清零</span>
      </Tooltip>
      <div class="description danger">
        如需取消自动清零，则勾选商品取消勾选内容即可 <a class="guide-link">查看设置说明</a>
      </div>
    </div>
    <div class="status">
      <Tooltip :max-width="260" type="help" placement="bottom-end" :offset="14" content="如需取消自动清零，则关闭开关提交即可">
        设置状态：
        <iSwitch size="large" :value="status" :disabled="disabled" @on-change="handleChange">
          <span slot="open">开启</span>
          <span slot="close">关闭</span>
        </iSwitch>
      </Tooltip>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'auto-clear-stock-header',
    props: {
      status: Boolean,
      disabled: Boolean
    },
    methods: {
      handleChange (status) {
        this.$emit('change', status)
      }
    }
  }
</script>
<style lang="less" scoped>
  .auto-clear-stock-header {
    background: @component-bg;
    box-shadow: 0 2px 10px 0 #F3F3F4;
    padding: 16px 20px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    .content {
      flex: 1;
    }
    .title {
      font-weight: 600;
      font-size: 20px;
      line-height: 32px;
      color: @text-color;
    }
    .description {
      font-size: @font-size-small;
      color: @text-description-color;
      .guide-link {
        text-decoration: underline;
      }
    }
  }
</style>
