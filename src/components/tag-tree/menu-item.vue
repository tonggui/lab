<template>
  <div class="container" :class="{'is-active': actived}">
    <div class="info">
      <CustomIcon v-if="!item.isLeaf" type="right-fill-arrow" class="icon" :class="{'is-opened': opened}" />
      <div class="title">
        <slot name="title">{{ item.name }}</slot>
      </div>
      <small class="desc">
        <slot name="desc">
          <span>商品 {{ item.productCount }}</span>
          <span v-if="!item.isLeaf">子分类 {{ item.children.length }}</span>
        </slot>
      </small>
    </div>
    <slot :item="item" name="extra"></slot>
  </div>
</template>
<script>
import CustomIcon from '@components/custom-icon'

export default {
  name: 'tag-tree-item',
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
  },
  components: {
    CustomIcon
  }
}
</script>
<style lang="less" scoped>
  .container {
    display: flex;
    height: 60px;
    box-sizing: border-box;
    padding: 10px 20px 10px 35px;
    cursor: pointer;
    &.is-active {
      background: @light-background;
      color: @highlight-color;
      .desc {
        color: @highlight-color;
      }
    }
    &.is-active {
      border-left: 2px solid @highlight-color;
    }
    position: relative;
  }
  .info {
    flex: 1
  }
  .icon {
    position: absolute;
    top: 12px;
    left: 20px;
    transition: transform .3s linear;
    transform: scale(0.6);
    &.is-opened {
      transform: scale(0.6) rotate(90deg);
    }
  }
  .desc {
    font-size: @font-size-small;
    color: @text-tip-color;
  }
</style>
