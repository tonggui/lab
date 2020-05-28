<template>
  <div class="selected-product-button-operations">
    <a
      :class="[total ? 'selected' : 'un-select']"
      @click="handleViewSelected"
      >查看已选商品</a
    >
    <Button type="primary" :disabled="!total">{{
      computedButtonText
    }}</Button>
  </div>
</template>

<script>
  import { helper } from '@/views/product-recommend/store'

  const { mapGetters } = helper()

  export default {
    name: 'selected-product-button-operations',
    computed: {
      ...mapGetters({
        total: 'getTotalCount'
      }),
      computedButtonText () {
        return this.total
          ? `确定创建(${this.total})`
          : '确定创建'
      }
    },
    methods: {
      handleViewSelected () {
        if (this.total) this.$emit('on-click-view')
      }
    }
  }
</script>

<style lang="less" scoped>
.selected-product-button-operations {
  .un-select {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #cccccc;
    line-height: 14px;
    margin-right: 16px;
  }
  .selected {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #676a78;
    line-height: 14px;
    text-decoration: underline;
    margin-right: 16px;
    &:hover {
      cursor: pointer;
    }
  }
}
</style>
