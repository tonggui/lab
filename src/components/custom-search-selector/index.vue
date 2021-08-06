<template>
  <Poptip
    placement="bottom-start"
    ref="triggerRef"
    class="custom-search-selector-poptip"
    :disabled="disabled"
    @on-popper-hide="hide(true)"
    padding="0"
    :style="{ width: computedWidth }"
  >
    <Tooltip
      :content="error"
      :width="250"
      always
      placement="right"
      transfer
      :disabled="!error"
    >
      <div
        class="custom-input"
        :style="{ width: computedWidth }"
        :class="{ disabled: disabled, active: focus }"
        @click="handleFocus"
      >
        <Input
          class="input"
          v-model="val"
          v-bind="inputAttrs"
          clearable
          :disabled="disabled"
          :placeholder="placeholder"
          ref="inputRef"
          @on-focus="$emit('on-input-focus')"
          @on-change="handleInputChange"
          @on-blur="$emit('on-input-blur')"
          @on-keydown="handleKeyDownEvent"
        >
          <slot name="input-prefix" slot="prefix" />
          <slot name="input-suffix" slot="suffix" />
        </Input>
      </div>
    </Tooltip>
    <slot name="append" />
    <template slot="content">
      <div class="popup" v-if="val">
        <div
          class="options"
        >
          <div ref="spinRef" class="base loading" v-if="!dataSource.length && loading">
            <slot name="loading">
              <FlashLoading size="mini" />
            </slot>
          </div>
          <ul v-else-if="dataSource.length" class="popup-list" @scroll="handleScroll" ref="popup-list">
            <template v-for="(item, index) in dataSource">
              <li
                :key="item.id || index"
                class="list-item-container"
                :class="{ disabled: isItemDisabled(item), 'selection-state': index === selectionIndex }"
                @click="handleClickItem(item)"
              >
                <slot name="list-item" :data="item" :index="index" :keyword="val"></slot>
              </li>
            </template>
            <li v-if="Number(total) > dataSource.length" class="base-item" key="loading" ref="loading">正在加载...</li>
            <li v-else-if="Number(total) <= dataSource.length" class="base-item" key="complete">已全部显示</li>
            <li v-else-if="error" class="base-item" key="fail">加载失败，<a @click="$emit('on-click-retry')">请重试</a></li>
          </ul>
          <div class="base empty" v-else-if="!loading && !total">
            <slot name="empty">
              暂未找到
            </slot>
          </div>
        </div>
      </div>
    </template>
  </Poptip>
</template>

<script>
  import FlashLoading from '@/components/loading/flash-loading'
  import { scrollTo } from '@/common/domUtils'
  import buildListSelection, { ActionNames } from '@/mixins/listSelection'

  export default {
    name: 'custom-search-selector',
    components: {
      FlashLoading
    },
    mixins: [
      buildListSelection({
        actionMap: {
          [ActionNames.SELECT_LIST_ITEM]: 'handleListItemSelected'
        }
      })
    ],
    props: {
      error: {
        type: [String, Object]
      },
      disabled: {
        type: Boolean,
        default: false
      },
      loading: {
        type: Boolean,
        default: false
      },
      value: {
        type: [String, Number],
        default: ''
      },
      dataSource: {
        type: Array,
        default: () => []
      },
      width: {
        type: [Number, String],
        default: 440
      },
      placeholder: {
        type: String,
        default: ''
      },
      complete: {
        type: Boolean,
        default: false
      },
      total: {
        type: [Number, String],
        default: 0
      },
      inputAttrs: {
        type: Object,
        default: () => {}
      }
    },
    data () {
      return {
        val: this.value,
        focus: false
      }
    },
    computed: {
      computedWidth () {
        return typeof this.width === 'number' ? `${this.width}px` : this.width
      }
    },
    watch: {
      value (val) {
        this.val = val
      },
      val (val) {
        if (val) {
          if (this.$refs['popup-list']) {
            scrollTo(this.$refs['popup-list'], {
              top: 0
            })
          }
        }
      }
    },
    methods: {
      isItemDisabled (item) {
        if ('disabled' in item) {
          return item.disabled
        }
        return false
      },
      handleClickItem (item) {
        console.log(item)
        this.$emit('on-select-item', item, err => {
          if (err) {
            return
          }
          this.focus = false
          this.$refs['triggerRef'].handleClose()
        })
      },
      handleInputChange (event) {
        this.$emit('on-input-change', event.target.value)
      },
      setFocusState () {
        this.focus = true
        this.$refs['triggerRef'].handleClick()
        setTimeout(() => {
          if (this.$refs['inputRef']) {
            this.$refs['inputRef'].focus()
          }
        }, 300)
      },
      handleFocus (e) {
        if (this.disabled) return
        if (!this.focus) {
          this.focus = true
          this.$refs['inputRef'].focus()
        } else {
          e && e.stopPropagation()
        }

        this.$emit('on-input-focus')
      },
      handleScroll () {
        if (this.$refs['popup-list']) {
          const scrollLength = this.$refs['popup-list'].scrollTop
          const scrollHeight = this.$refs['popup-list'].scrollHeight
          const offsetHeight = this.$refs['popup-list'].offsetHeight
          if (offsetHeight + scrollLength >= scrollHeight && this.total > this.dataSource.length) {
            this.$emit('on-reach-bottom', this.val)
          }
        }
      },
      hide () {
        this.focus = false
        this.$refs.triggerRef.handleClose()
        this.$refs.inputRef.blur()
        this.$emit('close')
      },
      handleListItemSelected (item) {
        if (item) {
          this.handleClickItem(item)
          console.log(item)
        } else {
          this.$emit('on-input-enter')
        }
      },
      setItemSelection (item, idx) {
        const $targetItemContainer = this.$refs['popup-list'].children[idx]
        if ($targetItemContainer && $targetItemContainer.scrollIntoViewIfNeeded) {
          $targetItemContainer.scrollIntoViewIfNeeded()
        }
      }
    }
  }
</script>

<style lang="less">
.custom-search-selector-poptip {
  .boo-poptip-arrow {
    display: none;
  }
  .boo-poptip-inner {
    border-radius: 0;
    box-shadow: 0 0 6px rgba(0,0,0,.1);
    margin-top: 2px;
  }
  .boo-poptip-popper {
    padding: 0;
    z-index: 1000;
  }
  &.expand {
    .boo-poptip-popper {
      min-width: 100%;
    }
  }
  &.boo-poptip-popper[x-placement^="bottom"] {
    padding: 0;
  }
}
</style>

<style lang="less" scoped>
  .custom-search-selector-poptip {
    width: 100%;
    position: relative;
    display: flex;
    .custom-input {
      align-items: center;
      //border: 1px solid @disabled-border-color;
      border-radius: 2px;
      font-size: @font-size-base;
      //padding: 0px 10px;
      line-height: 28px;
      //background: #fff;
      cursor: pointer;
      transition: all 0.2s;
      //.input {
      //  width: 100%;
      //  /deep/ input {
      //    border: none;
      //    box-shadow: none;
      //    padding: 0;
      //  }
      //}
      //&:hover, &:focus, &.active {
      //  border-radius: 3px;
      //  border: 1px solid @input-hover-border-color;
      //}
      //&.disabled {
      //  background-color: @disabled-bg;
      //  cursor: not-allowed;
      //  color: @disabled-color;
      //  &:hover, &:focus, &.active {
      //    border-color: @disabled-border-color;
      //  }
      //}
    }
    /deep/ .boo-poptip-popper {
      width: 100%;
    }
    .popup {
      width: 100%;
      .base {
        width: 100%;
        height: 75px;
        display: flex;
        align-items: center;
        justify-content: center;
        &.empty {
          font-size: 12px;
          color: #A2A4B3;
          letter-spacing: 0;
          text-align: center;
        }
      }
      &-list {
        max-height: 270px;
        overflow-x: hidden;
        overflow-y: auto;
        .list-item-container {
          &:hover, &.selection-state {
            background: #F3F4F6;
            cursor: pointer;
          }
          &.recycle-state {
            width: 100%;
            min-height: 82px;
            position: relative;
            &::before {
              content: '';
              position: absolute;
              display: inline-block;
              cursor: default;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              min-height: 82px;
              background: #fff;
              z-index: 1;
              opacity: 0.5;
            }
          }
          &.disabled {
            width: 100%;
            min-height: 82px;
            position: relative;
            &::before {
              content: '';
              position: absolute;
              display: inline-block;
              cursor: not-allowed;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              min-height: 82px;
              background: #fff;
              z-index: 1;
              opacity: 0.5;
            }
          }
        }
        .base-item {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 49px;
          line-height: 49px;
          font-size: 12px;
          color: #A2A4B3;
        }
      }
    }
  }
</style>
