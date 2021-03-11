<template>
  <div class="tag-tree-item-container" :class="{'is-active': actived}" @mouseenter="handleHover" @mouseleave="handleBlur">
    <div class="tag-tree-item-info">
      <div v-if="showCheckBox" :class="{ 'tag-tree-item-checkbox': true, 'is-leaf': isLeaf }">
        <Checkbox @click.native="handleClickCheckBox" />
      </div>
      <div class="tag-tree-item-icon" :class="{'is-opened': opened}">
        <Icon v-if="!isLeaf" local="right-fill-arrow" />
      </div>
      <div class="tag-tree-item-title">
        <slot name="title">{{ item.name }}</slot>
      </div>
      <small class="tag-tree-item-desc">
        <slot name="desc">
          <span v-if="item.productCount !== undefined">已选{{ selectedTotal || 0 }}/共{{ item.productCount }}</span>
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
      <slot name="tag" :item="item">
        <div v-if="item.isUnCategorized" class="tag-tree-item-un-categorized" />
      </slot>
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
      showTopTime: Boolean,
      showCheckBox: Boolean,
      selectedTotal: Number
    },
    data () {
      return {
        hovering: false
      }
    },
    computed: {
      isLeaf () {
        return !this.item.children || this.item.children.length <= 0
      }
    },
    methods: {
      handleClickCheckBox (e) {
        console.log('e', e.stopPropagation)
        e.stopPropagation()
        console.log('w1213')
        this.$emit('click-checkbox', this.item, this.index)
      },
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
      padding: 8px 10px 6px 45px;
      cursor: pointer;
      border-right: 1px solid #EEEEEE;
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
    &-checkbox {
      position: absolute;
      top: 4px;
      left: -30px;
      &.is-leaf {
        //left: -20px;
      }
    }
    &-icon {
      position: absolute;
      top: 3px;
      left: -9px;
      transition: transform .3s linear;
      transform-origin: 4px center;
      i {
        transform-origin: left center;
        transform: scale(0.6);
      }
      &.is-opened {
        transform: rotate(90deg);
      }
    }
    &-title {
      font-size: 12px;
    }
    &-desc {
      font-size: 8px;
      color: @text-tip-color;
    }
    &-badge {
      position: relative;
      right: -10px;
      top: -7px;
    }
    &-top-flag {
      position: absolute;
      right: 0px;
      top: 0px;
    }
    &-un-categorized {
      position: absolute;
      top: 0;
      right: 0;
      width: 58px;
      height: 58px;
      background: url(~@/assets/tag-badge.png);
      background-size: 100% 100%;
    }
  }
</style>
