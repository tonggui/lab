<template>
  <div>
    <Scroll class="scroll" :on-reach-bottom="onReachBottom" v-if="!isEmpty">
      <template v-for="item in dataSource">
        <slot name="item" :item="item"></slot>
      </template>
    </Scroll>
    <Empty v-if="isEmpty" />
    <Spin fix v-if="loading" />
  </div>
</template>
<script>
  export default {
    name: 'multi-cascade-menu',
    props: {
      dataSource: {
        type: Array,
        default: () => []
      },
      loading: Boolean,
      total: Number,
      loadMore: Function
    },
    computed: {
      isEmpty () {
        return !this.loading && this.dataSource.length <= 0
      },
      onReachBottom () {
        if (this.dataSource.length >= this.total) {
          return
        }
        return this.loadMore
      }
    }
  }
</script>
<style lang="less" scoped>
  .scroll {
    &,
    /deep/ .boo-scroll-container {
      height: 100% !important;
    }
  }
</style>
