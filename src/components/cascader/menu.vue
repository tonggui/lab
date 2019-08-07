<template>
  <div
    ref="containerRef"
    class="menu"
    :style="{ width: width + 'px', 'max-height': height ? height + 'px' : 'none' }"
    @scroll="handleScroll"
  >
    <div
      v-for="item in transList(list)"
      :key="item.data.id"
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
      ></slot>
      <div v-else class="default">
        <span class="name" v-html="highlight(item.data.name, keyword)" />
        <Icon type="loading" v-if="item.loading" />
        <template v-else-if="item.data.isLeaf">
          <Icon v-if="item.included" type="check" :style="item.style" />
        </template>
        <template v-else>
          <span v-if="item.included" style="font-size:12px;margin-right:6px;color:#F89800">{{ item.included }}</span>
          <Icon v-else type="chevron-right" :style="item.style" />
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
        <Spin size="small" />
      </span>
    </div>
  </div>
</template>

<script>
  import debounce from 'lodash/debounce'
  const menuItemHeight = 36
  const menuItemCount = 8
  const menuHeight = menuItemHeight * menuItemCount
  export default {
    name: 'cascader-menu',
    props: {
      list: {
        type: Array,
        required: true
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
        default: -1
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
        type: Number,
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
    mounted () {
      // console.log(this)
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
        if (hover && this.triggerMode !== 'hover') return
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
        const reg = new RegExp(keyword, 'g')
        return name.replace(reg, `<span class="highlight">${keyword}</span>`)
      },
      transList (list) {
        return list.map(it => {
          const included =
            this.multiple ? this.exist.filter(v => v.includes(it.id)).length : 0
          return {
            data: it,
            className: {
              exist: !this.multiple && this.exist.includes(it.id),
              active: this.active.includes(it.id)
            },
            included: included,
            style: {
              color: included ? '#F89800' : '#babccc',
              fontSize: '16px'
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
  width: 240px;
  border-right: 1px solid #f1f1f1;
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
}
.empty {
  text-align: center;
  margin: 20px 0;
  color: #aaa;
}
.menuItem {
  cursor: pointer;
  &:hover {
    background: #f7f8fa;
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
  &.active {
    background: #f7f8fa;
  }
  &.exist {
    background: #f1f1f1;
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
      color: #eebc27;
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
