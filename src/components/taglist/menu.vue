<template>
  <div class="tag-list-menu" :class="{ sub }">
    <MenuItem
      v-for="item in list"
      :key="item.id"
      :data="item"
      :activeId="activeId"
      :multiple="multiple"
      :exist="exist"
      @trigger="handleTrigger"
      @check="handleCheck"
    />
    <slot name="empty" />
  </div>
</template>

<script>
  import MenuItem from './menu-item'

  export default {
    name: 'tag-list-menu',
    components: { MenuItem },
    props: {
      multiple: Boolean,
      sub: Boolean,
      activeId: Number,
      list: {
        type: Array,
        default: () => ([])
      },
      exist: {
        type: Array,
        default: () => ([])
      }
    },
    methods: {
      handleTrigger (item) {
        this.$emit('trigger', item)
      },
      handleCheck (item, checked) {
        this.$emit('check', item, checked)
      }
    }
  }
</script>

<style lang="less" scoped>
  .tag-list-menu {
    flex: 1;
    max-height: 250px;
    overflow: auto;
    // box-shadow: 4px 0 8px 0 rgba(102,102,102,0.10);
    &.sub {
      border-left: 1px solid @disabled-border-color;
      background: @sub-menu-bg;
      box-shadow: none;
    }
  }
</style>
