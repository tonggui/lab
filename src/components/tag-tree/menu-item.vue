<template>
  <div class="tag-tree-item-container" :class="{'is-active': actived}" @mouseenter="handleHover" @mouseleave="handleBlur">
    <div class="tag-tree-item-info">
      <CustomIcon v-if="!item.isLeaf" type="right-fill-arrow" class="tag-tree-item-icon" :class="{'is-opened': opened}" />
      <div class="tag-tree-item-title">
        <slot name="title">{{ item.name }}</slot>
      </div>
      <small class="tag-tree-item-desc">
        <slot name="desc">
          <span>商品 {{ item.productCount }}</span>
          <span v-if="!item.isLeaf">子分类 {{ item.children.length }}</span>
        </slot>
      </small>
    </div>
    <slot
      :item="item"
      :index="index"
      name="extra"
      :hover="hovering"
      :actived="actived"
      :opened="opened"
    ></slot>
    <div class="tag-tree-item-badge">
      <slot name="tag" :item="item"></slot>
      <div v-if="item.topFlag" class="manage-tag-list-top-flag">
        <Tooltip placement="right" transfer>
          <span slot="content" v-html="item.timeZoneForHuman"></span>
          <CustomIcon type="top" size=28 />
        </Tooltip>
      </div>
    </div>
  </div>
</template>
<script>
import CustomIcon from '@components/custom-icon'

export default {
  name: 'tag-tree-item',
  props: {
    item: Object,
    index: Number,
    actived: {
      type: Boolean,
      default: false
    },
    opened: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      hovering: false
    }
  },
  components: {
    CustomIcon
  },
  methods: {
    handleHover () {
      this.hovering = true
    },
    handleBlur () {
      this.hovering = false
    }
  }
}
</script>
<style lang="less">
  .tag-tree-item {
    &-container {
      // !! TODO container 一定不能设置 position: relative
      display: flex;
      height: 60px;
      box-sizing: border-box;
      padding: 10px 20px 10px 35px;
      cursor: pointer;
      &:hover {
        background: @hover-bg;
      }
      &.is-active {
        background: #fff;
        color: @highlight-color;
        .desc {
          color: @highlight-color;
        }
      }
      &.is-active {
        border-left: 2px solid @highlight-color;
      }
    }
    &-info {
      flex: 1;
      position: relative;
    }
    &-icon {
      position: absolute;
      top: 2px;
      left: -15px;
      transition: transform .3s linear;
      transform: scale(0.4);
      transform-origin: left center;
      &.is-opened {
        transform: scale(0.4) rotate(90deg);
      }
    }
    &-desc {
      font-size: @font-size-small;
      color: @text-tip-color;
    }
    &-badge {
      position: relative;
      right: -20px;
      top: -10px;
    }
  }
</style>
