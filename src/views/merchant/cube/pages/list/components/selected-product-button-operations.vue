<template>
  <div class="selected-product-button-operations">
    <a
      :class="[total ? 'selected' : 'un-select']"
      @click="handleViewSelected"
      >查看已选商品</a
    >
    <Button type="primary" :disabled="!total" :loading="submitting" @click="handleCreate">{{
      computedButtonText
    }}</Button>
  </div>
</template>

<script>
  export default {
    name: 'selected-product-button-operations',
    props: {
      total: {
        type: Number,
        default: 0
      },
      btnText: {
        type: String,
        default: '确定创建'
      }
    },
    data () {
      return {
        submitting: false
      }
    },
    computed: {
      computedButtonText () {
        return `${this.btnText}${this.total ? `(${this.total})` : ''}`
      }
    },
    methods: {
      handleViewSelected () {
        if (this.total) this.$emit('on-click-view')
      },
      handleCreate () {
        if (this.total) {
          this.submitting = true
          this.$emit('on-click-create', () => {
            this.submitting = false
          })
        }
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
