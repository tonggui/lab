<template>
  <div
    ref="containerRef"
    class="menu"
    :class="`menu-${size}`"
    :style="{ width: computedWidth, 'max-height': height ? height + 'px' : 'none' }"
    @scroll="handleScroll"
  >
    <div
      ref="menuItem"
      v-for="item in renderList"
      :key="item.data.id || item.data.name"
      class="menuItem"
      :class="item.className"
      :style="{ height: itemHeight ? itemHeight + 'px' : 'auto' }"
      @mouseenter="() => handleTrigger(item.data, true)"
      @click.stop="() => handleTrigger(item.data)"
    >
      <slot
        v-if="$scopedSlots.renderItem"
        name="renderItem"
        :item="item.data"
        :highlight="highlight"
        :keyword="keyword"
        :included="item.included"
      ></slot>
      <div v-else class="default">
        <template v-if="item.data.isGroup">
          <div class="name">{{ item.data.name }}</div>
        </template>
        <template v-else>
          <div class="name">
            <span v-if="!item.data.textEffected" v-html="highlight(item.data.name, keyword)" />
            <span v-else v-html="highlight(item.data.text, keyword)" />
            <Icon style="margin-left: 4px" :size="16" type="lock" v-if="item.data.locked" />
          </div>
          <Icon type="loading" v-if="item.loading" />
          <template v-else-if="item.data.isLeaf">
            <Icon v-if="item.included" type="check" :style="item.style" />
          </template>
          <template v-else>
            <span v-if="item.included" style="font-size:12px;margin-right:6px;color:#F89800">{{ item.included }}</span>
            <Icon v-else type="chevron-right" :style="item.style" />
          </template>
        </template>
      </div>
    </div>
    <template v-if="!list.length">
      <slot name="empty" v-if="$slots.empty"></slot>
      <div v-else class="empty" :style="{ height: itemHeight || 'auto' }">
        无数据
      </div>
    </template>
    <div
      v-if="total && total > list.length"
      class="menuItem loadMore"
      :key="-1"
      :style="{ height: itemHeight + 'px' || 'auto' }"
    >
      <span ref="spinRef" style="display: inline-block; width: 15px;">
        <FlashLoading size="mini" />
      </span>
    </div>
  </div>
</template>

<script>
  import { convertRegexpPattern } from '@/common/utils'
  import FlashLoading from '@/components/loading/flash-loading'
  import debounce from 'lodash/debounce'
  const menuItemHeight = 36
  const menuItemCount = 8
  const menuHeight = menuItemHeight * menuItemCount
  export default {
    name: 'cascader-menu',
    components: { FlashLoading },
    props: {
      size: {
        type: String,
        default: 'default',
        validator: (size) => {
          return ['default', 'large', 'small'].includes(size)
        }
      },
      list: {
        type: Array,
        required: true
      },
      group: {
        type: Array,
        default: () => []
      },
      pageNum: {
        type: Number,
        default: 1
      },
      total: {
        type: Number,
        required: true
      },
      // 当前menu层级
      level: {
        type: Number,
        default: 1
      },
      active: {
        type: Array,
        default: () => []
      },
      // multiple为true时，exist为二维数组
      exist: {
        type: Array,
        default: () => []
      },
      loadingId: {
        type: [Number, String],
        default: null
      },
      triggerMode: {
        validator: val => ['click', 'hover'].indexOf(val) > -1,
        default: 'click'
      },
      onLoadMore: {
        type: Function,
        default: () => Promise.resolve([])
      },
      multiple: {
        type: Boolean,
        default: false
      },
      keyword: {
        type: String,
        default: ''
      },
      width: {
        type: [Number, String],
        default: 240
      },
      height: {
        type: Number,
        default: menuHeight
      },
      itemHeight: {
        type: Number,
        default: menuItemHeight
      }
    },
    computed: {
      computedWidth () {
        return typeof this.width === 'number' ? `${this.width}px` : this.width
      },
      uniqueGroup () {
        return [...new Set(this.group)]
      },
      renderList () {
        let renderList = []
        if (this.uniqueGroup && this.uniqueGroup.length) {
          const groupList = this.uniqueGroup.map(g => ({ name: g, children: [] }))
          this.list.forEach(item => {
            const index = this.uniqueGroup.findIndex(g => item.group === g)
            if (index >= 0) {
              groupList[index].children.push(item)
            } else {
              renderList.push(item)
            }
          })
          groupList.forEach(({ name, children }) => {
            if (children.length) {
              renderList = renderList.concat({ name, isGroup: true }, children)
            }
          })
          return this.transList(renderList)
        }
        return this.transList(this.list)
      }
    },
    watch: {
      pageNum (val, oldVal) {
        if (oldVal !== 1 && val === 1 && !this.loading) {
          this.$refs.containerRef.scrollTop = 0
        }
      }
    },
    update () {
      const minSize = Math.min(this.total, menuItemCount)
      if (this.list.length < minSize) {
        this.loadMore()
      }
    },
    methods: {
      handleTrigger (item, hover = false) {
        if (item.isGroup) return
        if (hover && this.triggerMode !== 'hover') return
        if (!hover && item.locked) {
          this.$emit('trigger-locked', item)
          return
        }
        this.$emit(
          'trigger',
          {
            ...item,
            level: this.level
          },
          hover
        )
      },
      highlight (name = '', keyword = '') {
        if (!keyword || !name || name.indexOf(keyword) < 0) return name
        const reg = new RegExp(convertRegexpPattern(keyword), 'g')
        return name.replace(reg, `<span class="highlight">${keyword}</span>`)
      },
      transList (list) {
        return list.map(it => {
          if (it.isGroup) {
            return {
              data: it,
              className: {
                group: it.isGroup,
                [`menuItem-${this.size}`]: true
              }
            }
          }
          const included =
            this.multiple ? this.exist.filter(v => v.includes(it.id)).length : 0
          const iconFontSizeMap = { small: '12px', default: '16px', large: '20px' }
          return {
            data: it,
            className: {
              exist: !this.multiple && this.exist.includes(it.id),
              active: this.active.includes(it.id),
              disabled: it.locked,
              [`menuItem-${this.size}`]: true
            },
            included: included,
            style: {
              color: included ? '#F89800' : '#babccc',
              fontSize: iconFontSizeMap[this.size]
            },
            loading: this.loadingId === it.id
          }
        })
      },
      checkScroll: debounce(function (container, element) {
        const containerRect = container.getBoundingClientRect()
        const elementRect = element
          ? element.getBoundingClientRect()
          : {
            top: 0
          }
        const loadMore =
          elementRect.top &&
          elementRect.top <= containerRect.top + containerRect.height
        if (loadMore) {
          this.loadMore()
        }
      }, 200),
      loadMore () {
        if (
          !this.loading &&
          this.list.length > 0 &&
          this.list.length < this.total
        ) {
          this.loading = true
          this.onLoadMore().then(() => {
            this.loading = false
          })
        }
      },
      handleScroll (e) {
        this.checkScroll(e.target, this.$refs.spinRef)
      },
      scrollTo (index) {
        const realItem = this.list[index]
        if (!realItem) return
        const renderIndex = this.renderList.findIndex(v => v.data.id === realItem.id)
        const $ele = this.$refs.menuItem ? this.$refs.menuItem[renderIndex] : null
        const $container = this.$refs.containerRef
        if ($ele && $container) {
          const eleRect = $ele.getBoundingClientRect()
          const containerRect = $container.getBoundingClientRect()
          const scrollTopDelta = eleRect.top + eleRect.height - containerRect.top - containerRect.height
          $container.scrollTop += scrollTopDelta
        }
      }
    }
  }
</script>
<style lang="less">
.boo-icon-loading {
  animation: iconLoading 1s linear infinite normal;
}
@keyframes iconLoading {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
<style scoped lang="less">
.menu {
  background: #fff;
  border-right: 1px solid #f1f1f1;
  &-default {
    width: 240px;
    font-size: @font-size-base;
  }
  &-small {
    width: 200px;
    font-size: @font-size-small;
  }
  &-large {
    width: 260px;
    font-size: @font-size-large;
  }
  &:last-of-type {
    border-right: 0;
  }
  overflow: auto;
}
.default {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 10px;
  /deep/ .highlight {
    color: @highlight-color;
  }
}
.empty {
  text-align: center;
  margin: 20px 0;
  color: @input-placeholder-color;
}
.menuItem {
  cursor: pointer;
  &:hover {
    background: @color-gray6;
    :global {
      .btn {
        display: inline-block;
      }
    }
  }
  &.loadMore {
    text-align: center;
    padding: 10px;
  }
  &.disabled {
    color: @disabled-color;
    cursor: not-allowed;
  }
  &.exist {
    background: darken(@color-gray6, 3%);
  }
  &.active {
    background: darken(@color-gray6, 3%);
  }
  &.group {
    color: @text-tip-color;
    cursor: initial;
    font-size: @font-size-small;
    background: inherit;
  }
  :global {
    .name {
      display: inline-block;
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: left;
    }
    .highlight {
      color: @highlight-color;
    }
    .btn {
      margin-left: 4px;
      display: none;
      cursor: pointer;
      font-size: var(--small-font-size);
      color: var(--link-color);
    }
  }
}
</style>
