<template>
  <div class="item" :data-checked="checked" :data-selected="selected">
    <Checkbox v-if="checkable" :value="checked" :indeterminate="selected && !checked" @on-change="handleChecked" />
    <span class="label" @click="handleSelect">{{ label }}</span>
    <Icon v-if="!isLeaf" type="keyboard-arrow-right" />
  </div>
</template>
<script>
  export default {
    name: 'multi-cascade-item',
    props: {
      data: {
        type: Object,
        required: true
      },
      checked: Boolean,
      selected: Boolean,
      checkable: Boolean
    },
    computed: {
      isLeaf () {
        return this.data.total === 0
      },
      label () {
        return this.data.name
      },
      className () {
        const className = ['item']
        if (this.checked) {
          className.push('is-checked')
        } else if (this.selected) {
          className.push('is-selected')
        }
        return className
      }
    },
    methods: {
      handleSelect () {
        this.$emit('select', this.data)
      },
      handleChecked (checked) {
        this.$emit('checked', checked)
      }
    }
  }
</script>
<style lang="less" scoped>
  .item {
    height: 34px;
    line-height: 34px;
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 0 10px;
    &.is-active {
      background: #F7F8FA;
    }
    .label {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .icon {
      color: #BABCCC;
      font-size: 12px;
    }
  }
</style>
