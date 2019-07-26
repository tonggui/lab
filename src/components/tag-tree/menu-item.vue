<template>
  <div class="tag-tree-item-container" :class="{'is-active': actived}" @mouseenter="handleHover" @mouseleave="handleBlur">
    <div class="tag-tree-item-info">
      <Icon v-if="!item.isLeaf" local="right-fill-arrow" class="tag-tree-item-icon" :class="{'is-opened': opened}" />
      <div class="tag-tree-item-title">
        <slot name="title">{{ item.name }}</slot>
      </div>
      <small class="tag-tree-item-desc">
        <slot name="desc">
          <span v-if="item.productCount !== undefined">商品 {{ item.productCount }}</span>
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
      <div v-if="showTopTime && item.topFlag" class="tag-tree-item-top-flag">
        <Tooltip placement="right" transfer>
          <span slot="content" v-html="convertTime(item.timeZone)"></span>
          <Icon local="top" size=28 />
        </Tooltip>
      </div>
    </div>
  </div>
</template>
<script>
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
      },
      showTopTime: Boolean
    },
    data () {
      return {
        hovering: false
      }
    },
    methods: {
      convertTime (timeZone) {
        if (!timeZone) {
          return ''
        }
        const DAY = ['一', '二', '三', '四', '五', '六', '日']
        const { days, timeList } = timeZone
        return `每周${days.map(d => DAY[d]).join('、')}<br>${timeList.map(v => v.time).join('、')}`
      },
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
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    &-icon {
      position: absolute;
      top: 2px;
      left: -15px;
      transition: transform .3s linear;
      transform: scale(0.6);
      transform-origin: left center;
      &.is-opened {
        transform: scale(0.6) rotate(90deg);
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
    &-top-flag {
      position: absolute;
      right: 0px;
      top: 0px;
    }
  }
</style>
