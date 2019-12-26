<template>
  <div>
    <PriceTip :price="price" :warningText="warningText" />
    <h3 class="title">基本信息</h3>
    <div class="diffs">
      <DiffItem
        v-for="(item, idx) in changes"
        :context="context"
        :key="idx"
        :type="item.field"
        :old-value="item.oldValue"
        :new-value="item.newValue"
      />
    </div>
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
      price: [String, Number],
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
        return {
          weightUnit: this.weightUnit
        }
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
