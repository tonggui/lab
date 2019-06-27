<template>
  <div class="item" :class="{'is-active': actived}">
    <Icon v-if="!item.isLeaf" type="keyboard-arrow-right" size="12" class="icon" :class="{'is-opened': !opened}" />
    <div class="title">
      <slot name="title">{{ item.name }}</slot>
    </div>
    <small class="desc">
      <slot name="desc">
        <span v-if="!Number.isNaN(Number(item.productCount))">商品 {{ item.productCount }}</span>
        <span v-if="item.children">子分类 {{ item.children.length }}</span>
      </slot>
    </small>
  </div>
</template>
<script>
export default {
  name: 'category-tree-item',
  props: {
    item: Object,
    actived: {
      type: Boolean,
      default: false
    },
    opened: {
      type: Boolean,
      default: false
    }
  }
}
</script>
<style lang="less" scoped>
  .item {
    height: 60px;
    box-sizing: border-box;
    padding: 10px 20px 10px 35px;
    cursor: pointer;
    &.is-active {
      border-left: 1px solid red;
    }
    position: relative;
  }
  .icon {
    position: absolute;
    top: 12px;
    left: 20px;
    transition: transform .3s linear;
    &.is-open {
      transform: rotate(90deg);
    }
  }
  .desc {
    font-size: 12px;
  }
</style>
