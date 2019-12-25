<template>
  <div>
    <component :is="scrollContainer" v-if="!isEmpty" :on-reach-bottom="onReachBottom" class="scroll">
      <template v-for="item in dataSource">
        <slot name="item" :item="item"></slot>
      </template>
    </component>
    <Empty v-if="isEmpty" />
    <Loading v-if="loading" size="small" />
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
      loadMore: Function,
      scrollable: {
        type: Boolean,
        default: true
      }
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
      },
      scrollContainer () {
        return this.scrollable ? 'Scroll' : 'div'
      }
    }
  }
</script>
<style lang="less" scoped>
  .scroll {
    overflow-y: auto;
    &,
    /deep/ .boo-scroll-container {
      height: 100% !important;
    }
  }
</style>
