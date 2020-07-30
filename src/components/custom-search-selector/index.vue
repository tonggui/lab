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
          clearable
          :disabled="disabled"
          :placeholder="placeholder"
          ref="inputRef"
          @on-focus="$emit('on-input-focus')"
          @on-change="handleInputChange"
          @on-blur="$emit('on-input-blur')"
          @on-keyup.enter="$emit('on-input-enter')"
        >
          <slot name="input-prefix" slot="prefix" />
          <slot name="input-suffix" slot="suffix" />
        </Input>
      </div>
    </Tooltip>
    <slot name="append" />
    <template slot="content">
      <div class="popup">
        <div
          class="options"
        >
          <div ref="spinRef" class="base loading" v-if="!dataSource.length && loading">
            <FlashLoading size="mini" />
          </div>
          <ul v-else-if="dataSource.length" class="popup-list" @scroll="handleScroll" ref="popup-list">
            <template v-for="(item, index) in dataSource">
              <slot name="list-item" :data="item" :index="index" :keyword="val"></slot>
            </template>
            <li v-if="Number(total) > dataSource.length" class="base-item" key="loading" ref="loading">正在加载...</li>
            <li v-else-if="Number(total) <= dataSource.length" class="base-item" key="complete">已全部显示</li>
            <li v-else-if="error" class="base-item" key="fail">加载失败，<a @click="$emit('on-click-retry')">请重试</a></li>
          </ul>
          <div class="base empty" v-else-if="!loading && !total">
            暂未找到
          </div>
        </div>
      </div>
    </template>
  </Poptip>
</template>

<script>
  import FlashLoading from '@/components/loading/flash-loading'

  export default {
    name: 'custom-search-selector',
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
      }
    },
    components: {
      FlashLoading
    },
    computed: {
      computedWidth () {
        return typeof this.width === 'number' ? `${this.width}px` : this.width
      }
    },
    data () {
      return {
        val: this.value,
        focus: false
      }
    },
    watch: {
      value (val) {
        this.val = val
      },
      val (val) {
        if (val) this.$refs['popup-list'] && this.$refs['popup-list'].scrollTo({ top: 0 })
      }
    },
    methods: {
      handleClickItem (item) {
        this.$emit('on-click-item', item)
        this.focus = false
        this.$refs['triggerRef'].handleClose()
      },
      handleInputChange (event) {
        this.$emit('on-input-change', event.target.value)
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
      handleScroll (event) {
        if (this.$refs['popup-list']) {
          const scrollLength = this.$refs['popup-list'].scrollTop
          const scrollHeight = this.$refs['popup-list'].scrollHeight
          const offsetHeight = this.$refs['popup-list'].offsetHeight
          if (offsetHeight + scrollLength >= scrollHeight && this.total > this.dataSource.length) {
            this.$emit('on-reach-bottom', this.val)
          }
        }
      },
      hide (adjust = false) {
        this.focus = false
        this.$refs.triggerRef.handleClose()
        this.$refs.inputRef.blur()
        this.$emit('close')
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
      border: 1px solid @disabled-border-color;
      border-radius: 2px;
      font-size: @font-size-base;
      padding: 0px 10px;
      line-height: 28px;
      background: #fff;
      cursor: pointer;
      transition: all 0.2s;
      .input {
        width: 100%;
        /deep/ input {
          border: none;
          box-shadow: none;
          padding: 0;
        }
      }
      transition: all 0.2s;
      &:hover, &:focus, &.active {
        border-radius: 3px;
        border: 1px solid @input-hover-border-color;
      }
      &.disabled {
        background-color: @disabled-bg;
        cursor: not-allowed;
        color: @disabled-color;
        &:hover, &:focus, &.active {
          border-color: @disabled-border-color;
        }
      }
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
