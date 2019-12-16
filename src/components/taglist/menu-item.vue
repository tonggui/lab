<template>
  <div class="tag-list-menu-item" @click="handleTrigger" :class="cls">
    <span v-if="multiple" class="checkbox-wrapper" @click.stop>
      <Checkbox :value="checked" :indeterminate="indeterminate" @on-change="handleCheck" />
    </span>
    <div class="name">{{ data.name }}</div>
    <template v-if="data.isLeaf">
      <Icon v-if="!multiple && checked" class="icon-check" type="check" />
    </template>
    <Icon v-else class="icon-right" :size="16" type="chevron-right" />
  </div>
</template>

<script>
  import Checkbox from '@/components/checkbox'

  export default {
    name: 'tag-list-menu-item',
    components: { Checkbox },
    props: {
      multiple: Boolean,
      activeId: Number,
      data: {
        type: Object,
        required: true
      },
      exist: {
        type: Array,
        default: () => ([])
      }
    },
    computed: {
      checkedChildrenCount () {
        let count = 0
        if (!this.data.children || !this.data.children.length) {
          return count
        }
        this.data.children.forEach(it => {
          if (this.isExist(it)) {
            count++
          }
        })
        return count
      },
      checked () {
        const len = this.data.children ? this.data.children.length : 0
        return len ? this.checkedChildrenCount === len : this.isExist(this.data)
      },
      indeterminate () {
        const len = this.data.children ? this.data.children.length : 0
        return this.checkedChildrenCount > 0 && this.checkedChildrenCount < len
      },
      cls () {
        return {
          active: this.data.id === this.activeId,
          checked: this.checked || this.indeterminate
        }
      }
    },
    methods: {
      isExist (item) {
        return this.multiple ? this.exist.some(v => v.includes(item.id)) : this.exist.includes(item.id)
      },
      handleTrigger () {
        this.$emit('trigger', this.data)
      },
      handleCheck (checked) {
        this.$emit('check', this.data, checked)
      }
    }
  }
</script>

<style lang="less" scoped>
  .checkbox-wrapper {
    display: inline-flex;
    align-items: center;
    margin-right: 5px;
  }
  .tag-list-menu-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    height: 36px;
    line-height: 36px;
    cursor: pointer;
    color: @menu-item-color;
    .name {
      line-height: 1;
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .icon-right, .icon-check {
      color: @menu-item-icon-color;
    }
    &:hover, &.active, &.checked {
      color: @menu-item-active-color;
      font-weight: 500;
      .icon-right, .icon-check {
        color: @menu-item-active-color;
      }
    }
    &:hover, &.active {
      background: @menu-item-hover-bg;
    }
    &.active {
      .icon-right {
        transform: rotate(180deg);
        transform-origin: 49% 50%;
      }
    }
  }
</style>
