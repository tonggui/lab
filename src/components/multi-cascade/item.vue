<template>
  <div class="item" :data-checked="checked" :data-selected="selected" :data-active="active" :class="className">
    <Checkbox v-if="checkable" :value="checked" :indeterminate="selected && !checked" @on-change="handleChecked" size="small" />
    <span class="label" @click="handleSelect">{{ label }}</span>
    <Icon v-if="!isLeaf" type="keyboard-arrow-right" class="icon" :class="{ 'is-active': active }" />
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
      checkable: Boolean,
      active: Boolean
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
        if (this.active) {
          className.push('is-active')
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
    height: 36px;
    line-height: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 0 8px;
    &[data-selected=true],
    &[data-active=true] {
      color: @link-color;
    }
    /deep/ .boo-checkbox-wrapper {
      margin-right: 12px;
    }
    &.is-active {
      background: #FFF8EE;
    }
    .label {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .icon {
      font-size: 12px;
      &.is-active {
        transform: rotate(180deg);
      }
    }
  }
</style>
