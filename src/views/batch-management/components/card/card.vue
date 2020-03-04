<template>
  <div class="batch-card">
    <slot></slot>
    <span class="batch-card-delete" :class="{ 'is-hide': !deletable }" @click="handleDelete"><Icon type="close" /></span>
  </div>
</template>
<script>
  export default {
    name: 'batch-card',
    props: {
      index: Number,
      deletable: Boolean
    },
    methods: {
      handleDelete () {
        this.$emit('delete', this.index)
      }
    }
  }
</script>
<style lang="less" scoped>
  .batch-card {
    display: inline-flex;
    border: 1px solid @border-color-base;
    border-radius: @border-radius-base;
    padding: 20px;
    margin-bottom: 20px;
    &-delete {
      font-size: 18px;
      color: #a2a4b3;
      cursor: pointer;
      margin-left: 32px;
      &.is-hide {
        visibility: hidden;
      }
    }
  }
</style>
