<template>
  <Poptip
    placement="bottom-start"
    ref="triggerRef"
    class="poptip"
    :class="{ expand: !!search }"
    @on-popper-hide="hide(true)"
    padding="0"
    :style="{ width: computedWidth }"
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
            @on-close="e => handleDelete(e, index)"
            closable
          >
            {{ item[labelKey] }}
          </Tag>
        </template>
        <input
          ref="inputRef"
          class="input"
          :disabled="disabled"
          :value="focus ? search : name"
          @input="handleSearch"
          :placeholder="
            multiple
              ? value.length > 0
                ? ''
                : placeholder
              : name || placeholder
          "
          :readOnly="!showSearch"
        />
      </div>
      <div v-if="!disabled" class="status">
        <span class="icon clear" v-show="value.length > 0 || name">
          <Icon type="cancel" @click="handleClear" />
        </span>
        <span v-if="arrow" class="icon arrow" :class="{ active: focus }">
          <Icon type="keyboard-arrow-down" :style="{ 'font-size': 10, color: '#BABCCC' }" />
        </span>
      </div>
    </div>
    <template slot="content">
      <div class="popup">
        <div
          class="options"
        >
          <Menu
            :width="width"
            :list="renderList"
            :total="total"
            :keyword="keyword"
            :multiple="multiple"
            :exist="exist"
            @trigger="handleTrigger"
          >
            <template slot="empty" v-if="$slots.empty">
              <slot name="empty"></slot>
            </template>
            <!-- <template v-slot:renderItem="{ item }">
              <div class="render-item">
                {{ item[labelKey] }}
              </div>
            </template> -->
          </Menu>
        </div>
        <slot name="append"></slot>
      </div>
    </template>
  </Poptip>
</template>

<script>
  import Menu from '../cascader/menu'

  export default {
    name: 'custom-selector',
    components: { Menu },
    props: {
      source: {
        type: Array,
        default: () => []
      },
      valueKey: {
        type: String,
        default: 'value'
      },
      labelKey: {
        type: String,
        default: 'label'
      },
      value: {
        required: true,
        type: Array,
        default: () => []
      },
      disabled: {
        type: Boolean,
        default: false
      },
      placeholder: {
        type: String,
        default: ''
      },
      multiple: {
        type: Boolean,
        default: false
      },
      maxCount: {
        type: Number,
        default: 1
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
      }
    },
    data () {
      return {
        searchResult: [],
        focus: false,
        search: '',
        keyword: '', // 搜索用到的关键字，和search同步
        total: 0
      }
    },
    computed: {
      val () {
        return this.value.map(v => this.source.find(s => s[this.valueKey] === v)).filter(v => !!v)
      },
      renderList () {
        let isUnique = true // 当前输入项是否唯一，区别于所有选项
        let filteredList = []
        const { search, source } = this
        if (!search) {
          return source.map(v => ({ id: v[this.valueKey], name: v[this.labelKey], isLeaf: true }))
        }
        source.forEach(v => {
          const label = v[this.labelKey]
          if (label === search) {
            isUnique = false
          }
          if (label.indexOf(search) >= 0) {
            filteredList.push({ id: v[this.valueKey], name: label, isLeaf: true })
          }
        })
        if (isUnique) {
          filteredList.unshift({ id: `_${search}`, name: search, isLeaf: true })
        }
        return filteredList
      },
      name () {
        if (this.multiple) {
          return ''
        }
        const firstValue = this.value[0]
        const item = this.source.filter(v => v[this.valueKey] === firstValue)[0] || {}
        return item[this.labelKey] || ''
      },
      exist () {
        return this.multiple ? this.value.map(v => [v]) : this.value
      },
      computedWidth () {
        return typeof this.width === 'number' ? `${this.width}px` : this.width
      }
    },
    methods: {
      handleChange (...params) {
        if (this.multiple) {
          const paths = params[0]
          if (paths.length > this.maxCount) {
            this.exceedWarning()
            return
          }
        } else {
          this.$refs.triggerRef.handleClose()
        }
        this.focus = this.multiple
        this.search = ''
        this.$nextTick(() => {
          this.$emit('change', ...params)
        })
        this.$emit('close')
      },
      handleTrigger (item, hover) {
        console.log(item, hover)
      },
      // 超出最大数量的警告
      exceedWarning () {
        this.$Message.warning(`超过最大选择数量${this.maxCount}个`)
      },
      // 删除已选项，只有multiple才有
      handleDelete (e, index) {
        e.stopPropagation()
        const newVal = this.value.slice()
        newVal.splice(index, 1)
        this.$emit('change', newVal)
      },
      handleSearch (e) {
        const search = e.target.value
        this.search = search
        this.keyword = search
        this.$emit('search', search)
      },
      handleFocus (e) {
        if (this.disabled) return
        if (!this.focus) {
          this.focus = true
          this.$refs.inputRef.focus()
        } else {
          e.stopPropagation()
        }
      },
      handleClear (e) {
        e.stopPropagation()
        this.handleChange([])
        this.hide(true)
      },
      hide (adjust = false) {
        this.focus = false
        this.search = ''
        if (this.$refs.cascaderRef && adjust) {
          this.$refs.cascaderRef.adjust()
        }
        this.$emit('close')
      }
    }
  }
</script>

<style lang="less">
.poptip {
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
      border-left: 1px solid #f1f1f1;
      border-right: 1px solid #f1f1f1;
      flex: 1;
      top: 0; //覆盖全局样式，这里受全局样式干扰了
      display: block;
    }
  }
}
.poptip {
  width: 100%;
  position: relative;
  /deep/ .boo-poptip-rel {
    width: 100%;
  }
}
.render-item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 10px;
}
.custom-selector {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  border: 1px solid #e9eaf2;
  border-radius: 2px;
  width: 440px;
  max-width: 100%;
  font-size: @font-size-base;
  padding: 3px 10px;
  line-height: 28px;
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
    background-color: #f5f5f5;
    cursor: not-allowed;
    color: rgb(173, 175, 187);
  }
  .tags {
    line-height: 2;
    display: flex;
    align-items: center;
    flex: 1;
    flex-wrap: wrap;
    margin-right: 40px;
    /deep/ .boo-tag {
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
  }
  .status {
    position: absolute;
    right: 10px;
    display: inline-block;
    width: auto;
    .icon {
      color: @icon-color;
      margin-left: 8px;
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
