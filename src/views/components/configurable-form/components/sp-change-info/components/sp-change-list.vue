<template>
  <div>
    <PriceTip v-if="price !== undefined" :price="price" :warningText="warningText" />
    <template v-if="changes.length">
      <h3 class="title">{{title}}</h3>
      <div class="diffs">
        <DiffItem
          v-for="(item, idx) in context"
          :key="item.id || idx"
          :context="item"
          :type="item.renderType"
        />
      </div>
    </template>
  </div>
</template>

<script>
  import PriceTip from './price-tip'
  import DiffItem from './diff-item'

  export default {
    name: 'SpChangeList',
    components: {
      PriceTip,
      DiffItem
    },
    props: {
      title: {
        type: String,
        default: '基本信息'
      },
      price: {
        type: [String, Number],
        default: undefined
      },
      warningText: String,
      weightUnit: {
        type: String,
        default: () => '克(g)'
      },
      changes: {
        type: Array,
        default: () => []
      }
    },
    computed: {
      context () {
        return this.changes.map(item => {
          item.weightUnit = this.weightUnit
          item.renderType = item.field || `${item.render.type}`
          return item
        })
      }
    }
  }
</script>

<style scoped lang="less">
  .title {
    margin-bottom: 6px;
    font-weight: normal;
    font-size: @font-size-base;
    color: @text-color;
  }
  .diffs {
    background: #F7F8FA;
    padding: 10px;
  }
</style>
