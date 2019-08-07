<template>
  <div class="attr-list">
    <div
      v-for="(val, idx) in value"
      :key="idx"
      class="attr-list-item"
    >
      <ProductAttribute
        :value="val"
        :count="10"
        @on-change="(item) => handleItemChange(idx, item)"
      />
      <Icon
        class="close"
        type="closed-thin-circle"
        @click="handleDeleteClick(idx)"
      />
    </div>
    <Button
      type="primary"
      :disabled="value.length >= maxCount"
      @click="handleAddClick"
    >添加属性</Button>
  </div>
</template>

<script>
  import ProductAttribute from './product-attribute'
  import { validateAttributes } from './utils'
  export default {
    name: 'ProductAttributeList',
    components: {
      ProductAttribute
    },
    props: {
      value: {
        type: Array,
        default: () => []
      },
      maxCount: {
        type: Number,
        default: 10
      }
    },
    methods: {
      handleAddClick () {
        this.triggerValueChanged([].concat(this.value, {}))
      },
      handleDeleteClick (idx) {
        this.value.splice(idx, 1)
        this.triggerValueChanged(this.value)
      },
      handleItemChange (idx, item) {
        const newValue = [].concat(this.value)
        newValue[idx] = item
        this.triggerValueChanged(newValue)
      },
      triggerValueChanged (val) {
        this.$emit('input', val)
        this.$emit('on-change', val)
      },
      validate () {
        return validateAttributes(this.value)
      }
    }
  }
</script>

<style scoped lang="less">
  .attr-list {
    .attr-list-item {
      position: relative;
      border: 1px solid @border-color-base;
      padding: 10px;
      margin-bottom: 10px;

      > .close {
        position: absolute;
        cursor: pointer;
        right: 5px;
        top: 10px;
        color: @icon-color;
        font-size: 16px;
      }
    }
  }
</style>
