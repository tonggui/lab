<template>
  <Poptip
    placement="bottom-start"
    ref="triggerRef"
    class="custom-selector-poptip"
    :disabled="disabled"
    @on-popper-show="resetActive"
    @on-popper-hide="hide(true)"
    padding="0"
    :style="{ width: computedWidth }"
  >
    <Tooltip
      :content="customTip"
      always
      placement="right"
      :max-width="300"
      transfer
      :disabled="!focus || !customTip"
    >
      <div
        class="custom-selector"
        :style="{ width: computedWidth }"
        :class="{ disabled: disabled, active: focus }"
        @click="handleFocus"
      >
        <div class="tags">
          <template v-if="multiple">
            <Tag
              :fade="false"
              v-for="(item, index) in val"
              :key="item[valueKey]"
              :closable="!disabled"
              class="tag"
              @on-close="e => handleDelete(e, index)"
            >
              {{ item[labelKey] }}
            </Tag>
          </template>
          <input
            ref="inputRef"
            class="input"
            :disabled="disabled"
            :value="focus ? search : name"
            :maxlength="maxLength"
            @input="handleSearch"
            @keydown="handleKeydown"
            :placeholder="
              multiple
                ? compatibleValue.length > 0
                  ? ''
                  : placeholder
                : name || placeholder
            "
            :readOnly="!showSearch"
          />
        </div>
        <div class="status">
          <template v-if="clearable && !disabled">
            <span class="icon clear" v-show="compatibleValue.length > 0 || name || search">
              <Icon type="cancel" :size="16" @click="handleClear" />
            </span>
          </template>
          <span v-if="arrow" class="icon arrow" :class="{ active: focus }">
            <Icon type="keyboard-arrow-down" :style="{ 'font-size': 10, color: '#BABCCC' }" />
          </span>
        </div>
      </div>
    </Tooltip>
    <template slot="content">
      <div class="popup">
        <div
          class="options"
          @mouseleave="activeIndex = -1"
        >
          <Menu
            ref="menu"
            width="100%"
            :list="renderList"
            :group="group"
            :total="total"
            :keyword="search"
            :multiple="multiple"
            :exist="exist"
            :active="active"
            triggerMode="hover"
            @trigger="handleTrigger"
          >
            <template slot="empty" v-if="$slots.empty">
              <slot name="empty"></slot>
            </template>
            <template v-slot:renderItem="{ item, included, keyword }">
              <div class="render-item">
                <template v-if="item.isGroup">
                  <div class="name">{{ item.name }}</div>
                </template>
                <template v-else>
                  <div class="name">
                    <span v-html="highlight(item.name, keyword)" />
                  </div>
                  <span class="tip" v-if="item.isNew">选中即新增自定义</span>
                  <Icon v-if="included" class="icon-check" type="check" />
                </template>
              </div>
            </template>
          </Menu>
        </div>
        <slot name="append"></slot>
      </div>
    </template>
  </Poptip>
</template>

<script>
  import { convertRegexpPattern } from '@/common/utils'
  import Menu from '../cascader/menu'

  export default {
    name: 'custom-selector',
    components: { Menu },
    props: {
      source: {
        type: Array,
        default: () => []
      },
      group: {
        type: Array,
        default: () => []
      },
      valueKey: {
        type: String,
        default: 'value'
      },
      customValueKeyPrefix: {
        type: String,
        default: ''
      },
      labelKey: {
        type: String,
        default: 'label'
      },
      value: {
        required: true,
        type: Array
      },
      extensible: Boolean,
      disabled: {
        type: Boolean,
        default: false
      },
      placeholder: {
        type: String,
        default: ''
      },
      customTip: {
        type: String,
        default: ''
      },
      multiple: {
        type: Boolean,
        default: false
      },
      maxLength: {
        type: Number,
        default: undefined
      },
      maxCount: {
        type: Number,
        default: 0
      },
      arrow: {
        type: Boolean,
        default: false
      },
      width: {
        type: [Number, String],
        default: 440
      },
      showSearch: {
        type: Boolean,
        default: true
      },
      clearable: Boolean
    },
    data () {
      return {
        activeIndex: 0,
        searchResult: [],
        focus: false,
        search: '',
        total: 0
      }
    },
    mounted () {
      // 初始自我清洗
      this.$emit('change', this.val.map(v => v[this.valueKey]))
    },
    computed: {
      compatibleValue () {
        return [].concat(this.value).filter(v => v !== undefined)
      },
      val () {
        return this.compatibleValue.map(v => this.source.find(s => s[this.valueKey].toString() === v.toString())).filter(v => v !== undefined)
      },
      renderList () {
        let isUnique = true // 当前输入项是否唯一，区别于所有选项
        const filteredList = []
        const { search, source, customValueKeyPrefix, extensible } = this
        if (!search) {
          return source.map(v => ({ ...v, id: v[this.valueKey], name: v[this.labelKey], isLeaf: true, isNew: false }))
        }
        source.forEach(v => {
          const label = v[this.labelKey]
          if (label === search) {
            isUnique = false
          }
          if (label.indexOf(search) >= 0) {
            filteredList.push({ ...v, id: v[this.valueKey], name: label, isLeaf: true, isNew: false })
          }
        })
        if (isUnique && extensible) {
          filteredList.unshift({ id: `${customValueKeyPrefix}${search}`, name: search, isLeaf: true, isNew: true })
        }
        return filteredList
      },
      name () {
        if (this.multiple) {
          return ''
        }
        return (this.val[0] || {})[this.labelKey] || ''
      },
      active () {
        return (this.activeIndex >= 0 && this.renderList.length) ? [this.renderList[this.activeIndex].id] : []
      },
      exist () {
        return this.multiple ? this.compatibleValue.map(v => [v]) : this.compatibleValue
      },
      computedWidth () {
        return typeof this.width === 'number' ? `${this.width}px` : this.width
      }
    },
    methods: {
      highlight (name = '', keyword = '') {
        if (!keyword || !name || name.indexOf(keyword) < 0) return name
        const reg = new RegExp(convertRegexpPattern(keyword), 'g')
        return name.replace(reg, `<span class="highlight">${keyword}</span>`)
      },
      handleChange (item) {
        if (this.disabled) {
          return
        }
        const { id, isNew } = item
        if (this.multiple) {
          const index = this.compatibleValue.indexOf(id)
          const newVal = this.compatibleValue.slice()
          if (index < 0) {
            if (this.maxCount && newVal.length >= this.maxCount) {
              this.exceedWarning()
              return
            }
            newVal.push(id)
            if (isNew) {
              this.$emit('add', item)
              this.search = ''
            }
          } else {
            newVal.splice(index, 1)
          }
          this.$emit('change', newVal)
        } else {
          if (!this.compatibleValue.includes(id)) {
            if (isNew) {
              this.$emit('add', item)
            }
            this.$emit('change', [id])
          }
          this.search = ''
          this.$refs.triggerRef.handleClose()
          this.$refs.inputRef.blur()
        }
        this.focus = this.multiple
      },
      handleTrigger (item, hover) {
        // 如果只是hover则设置active为hover项，否则点击的话就是改变值
        if (hover) {
          const index = this.renderList.findIndex(v => v.id === item.id)
          this.activeIndex = index >= 0 ? index : 0
        } else {
          this.handleChange(item)
        }
      },
      // 超出最大数量的警告
      exceedWarning () {
        this.$Message.warning(`超过最大选择数量${this.maxCount}个`)
      },
      // 删除已选项，只有multiple才有
      handleDelete (e, index) {
        e.stopPropagation()
        const newVal = this.compatibleValue.slice()
        newVal.splice(index, 1)
        this.$emit('change', newVal)
      },
      handleSearch (e) {
        this.activeIndex = 0
        const search = e.target.value
        this.search = search
        this.$emit('search', search)
      },
      handleFocus (e) {
        if (this.disabled) return
        this.$emit('open')
        if (!this.focus) {
          this.focus = true
          this.$refs.inputRef.focus()
          this.$emit('focus')
        } else {
          e && e.stopPropagation()
        }
      },
      handleClear (e) {
        e.stopPropagation()
        if (this.search) {
          this.search = ''
          this.resetActive()
          this.$refs.inputRef.focus()
          this.$emit('focus')
        } else {
          this.$emit('change', [])
          this.hide(true)
        }
      },
      // 按键处理
      handleKeydown (e) {
        const { code } = e
        switch (code) {
        case 'ArrowDown':
          this.activeIndex = this.activeIndex + 1 > this.renderList.length - 1 ? 0 : this.activeIndex + 1
          this.$refs.menu && this.$refs.menu.scrollTo(this.activeIndex)
          e.preventDefault()
          break
        case 'ArrowUp':
          this.activeIndex = this.activeIndex - 1 < 0 ? this.renderList.length - 1 : this.activeIndex - 1
          this.$refs.menu && this.$refs.menu.scrollTo(this.activeIndex)
          e.preventDefault()
          break
        case 'Enter':
          if (this.activeIndex >= 0 && this.renderList.length) {
            this.handleChange(this.renderList[this.activeIndex])
          }
          e.preventDefault()
          break
        }
      },
      resetActive () {
        // 将激活项重置为第一个选中项
        const firstValue = this.compatibleValue[0]
        if (firstValue === undefined) {
          this.activeIndex = 0
        } else {
          const firstValueIndex = this.renderList.findIndex(v => v.id === firstValue)
          this.activeIndex = firstValueIndex > 0 ? firstValueIndex : 0
        }
        this.$nextTick(() => {
          this.$refs.menu && this.$refs.menu.scrollTo(this.activeIndex)
        })
      },
      hide (adjust = false) {
        this.focus = false
        this.search = ''
        this.$refs.triggerRef.handleClose()
        this.$refs.inputRef.blur()
        this.$emit('close')
        this.$emit('blur')
      }
    }
  }
</script>

<style lang="less">
.custom-selector-poptip {
  .boo-poptip-arrow {
    display: none;
  }
  .boo-poptip-inner {
    border-radius: 0;
    box-shadow: 0 0 6px rgba(0,0,0,.1);
    margin-top: 5px;
  }
  .boo-poptip-popper {
    padding: 0;
    z-index: 1000;
    width: 100%;
  }
  &.expand {
    .boo-poptip-popper {
      min-width: 100%;
    }
  }
}
</style>

<style lang="less" scoped>
.popup {
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  :global {
    .options {
      border: 1px solid @border-color-base;
      flex: 1;
      top: 0; //覆盖全局样式，这里受全局样式干扰了
      display: block;
    }
  }
}
.custom-selector-poptip {
  width: 100%;
  position: relative;
  /deep/ .boo-poptip-rel {
    width: 100%;
  }
  /deep/ .boo-tooltip {
    display: block;
    .boo-tooltip-rel {
      display: block;
    }
  }
}
.render-item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 10px;
  .name {
    display: inline-block;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: left;
  }
  .tip {
    font-size: @font-size-small;
    color: @text-tip-color;
  }
  .icon-check {
    margin: 0 2px 0 4px;
    color: @highlight-color;
  }
  /deep/ .highlight {
    color: @highlight-color;
  }
}
.custom-selector {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  border: 1px solid @disabled-border-color;
  border-radius: 2px;
  width: 440px;
  max-width: 100%;
  font-size: @font-size-base;
  padding: 3px 10px;
  line-height: 28px;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s;
  &:hover, &:focus, &.active {
    border: 1px solid @input-hover-border-color;
  }
  &:hover {
    .status .icon.clear {
      display: inline-block;
    }
  }
  &.disabled {
    background-color: @disabled-bg;
    cursor: not-allowed;
    color: @disabled-color;
    &:hover, &:focus, &.active {
      border-color: @disabled-border-color;
    }
    .tags {
      .tag {
        /deep/ .boo-tag-text {
          color: @disabled-color;
        }
      }
    }
  }
  .tags {
    line-height: 2;
    display: flex;
    align-items: center;
    flex: 1;
    flex-wrap: wrap;
    margin-right: 40px;
    .tag {
      margin: 3px 6px 3px 0;
      vertical-align: middle;
    }
  }
  .input {
    display: inline-block;
    width: auto;
    line-height: 1;
    min-width: 1px;
    outline: none;
    flex: 1;
    background: transparent;
    border: none;
    padding: 0;
    margin: 4px 0px;
    cursor: inherit;
    &::-webkit-input-placeholder {
      color: @input-placeholder-color;
    }
    &:disabled {
      color: inherit;
    }
  }
  .status {
    position: absolute;
    right: 10px;
    display: inline-block;
    width: auto;
    .icon {
      color: @icon-color;
      margin-left: 5px;
      &:first-child {
        margin-left: 0;
      }
      &.clear {
        display: none;
      }
    }
    .arrow {
      display: inline-block;
      transition: all 0.25s;
      &.active {
        transform: rotate(180deg);
      }
    }
  }
}
</style>
