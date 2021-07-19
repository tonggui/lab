<template>
  <Poptip
    placement="bottom-start"
    ref="triggerRef"
    class="poptip"
    popper-class="poptip"
    :class="{ expand: !!search }"
    :disabled="disabled"
    @on-popper-hide="hide(true)"
    padding="0"
    :style="{ width: computedWidth }"
    :transfer="transfer"
  >
    <div
      class="withSearch"
      :style="{ width: computedWidth }"
      :class="{ disabled: disabled, active: focus, [`withSearch-${size}`]: true }"
      @click="handleFocus"
      @mouseenter="hover = true"
      @mouseleave="hover = false"
    >
      <div class="disabled-display" v-if="disabled && $slots.disabled">
        <slot name="disabled"></slot>
      </div>
      <div class="tags" v-else>
        <template v-if="multiple">
          <Tag
            class="tag"
            :size="size"
            :fade="false"
            :closable="!disabled"
            v-for="(item, index) in value"
            :key="item.idPath.join(separator)"
            @on-close="e => handleDelete(e, index)"
          >
            {{ item.namePath.join(separator) }}
          </Tag>
        </template>
        <input
          ref="inputRef"
          class="input"
          :size="size"
          :disabled="disabled"
          :value="focus ? search : name"
          @input="handleSearch"
          @blur="$emit('blur')"
          @focus="$emit('focus')"
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
      <div class="status">
        <span class="icon loading" v-show="showIcon === 'loading'">
          <Icon type="loading" />
        </span>
        <span v-if="!disabled && clearable" class="icon clear" v-show="showIcon === 'clearable'">
          <Icon type="cancel" :class="`clear-${size}`" :size="16" @click="handleClear" />
        </span>
        <span v-if="arrow" class="icon arrow" :class="{ active: focus }" v-show="showIcon === 'arrow'">
          <Icon type="keyboard-arrow-down" :class="`arrow-${size}`" color="#BABCCC" />
        </span>
      </div>
    </div>
    <slot name="shortcut" />
    <template slot="content">
      <div class="popup">
        <div
          v-if="source"
          class="options"
          :class="{ active: noKeywordSearchActive }"
        >
          <Cascader
            ref="cascaderRef"
            :size="size"
            :multiple="multiple"
            :source="source"
            :value="value"
            :loadingId="loadingId"
            :exist="exist"
            :triggerMode="triggerMode"
            :allowBranchSelect="allowBranchSelect"
            :debounce="debounce"
            @loading-id-change="handleLoadingIdChange"
            @change="handleChange"
            @trigger="handleTrigger"
            @trigger-locked="handleTriggerLocked"
          >
            <template slot="renderItem" v-if="$slots.renderItem">
              <slot name="renderItem"></slot>
            </template>
          </Cascader>
        </div>
        <div
          class="options"
          :class="{ active: keywordSearchActive }"
        >
          <Menu
            :width="width"
            :list="searchResult"
            :total="total"
            :keyword="keyword"
            :multiple="multiple"
            :active="this.activeList"
            :exist="exist"
            :loadingId="loadingId"
            :triggerMode="triggerMode"
            :onLoadMore="handleSearchLoadMore"
            @trigger="handleTrigger"
            @trigger-locked="handleTriggerLocked"
          >
            <template slot="empty" v-if="$slots.empty">
              <slot name="empty"></slot>
            </template>
            <template slot="renderItem" v-if="$scopedSlots.renderItem">
              <slot name="renderItem"></slot>
            </template>
          </Menu>
        </div>
        <slot name="append"></slot>
      </div>
    </template>
  </Poptip>
</template>
<script>
  import debounce from 'lodash/debounce'
  import Cascader from './index'
  import Menu from './menu'
  import { LX as lx } from '@/common/lx/lxReport'

  /**
   * event {change, search, close}
   */
  export default {
    name: 'cascader-with-search',
    props: {
      size: {
        type: String,
        default: 'default',
        validator: (size) => {
          return ['default', 'large', 'small'].includes(size)
        }
      },
      source: {
        type: [Object, Array, Function],
        default: null
      },
      value: {
        required: true,
        type: Array,
        default: () => []
      },
      name: {
        required: true,
        type: String,
        default: ''
      },
      triggerMode: {
        validator: val => ['click', 'hover'].indexOf(val) > -1,
        default: 'click'
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
      separator: {
        type: String,
        default: ' > '
      },
      debounce: {
        type: Number,
        default: 300
      },
      width: {
        type: [Number, String],
        default: 440
      },
      showSearch: {
        type: Boolean,
        default: true
      },
      allowBranchSelect: {
        type: Boolean,
        default: false
      },
      pageSize: {
        type: Number,
        default: 20
      },
      pageNum: {
        type: Number,
        default: 1
      },
      onSearch: {
        type: Function,
        default: () => Promise.resolve([])
      },
      transfer: Boolean,
      clearable: {
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
        loadingId: null,
        pageNumSelf: this.pageNum,
        total: 0,
        hover: false
      }
    },
    mounted () {
      this.debouncedSearch = debounce(this.debouncedSearch, this.debounce)
    },
    watch: {
      noKeywordSearchActive (active) {
        if (active) {
          this.keyword = ''
          lx.mv({ bid: 'b_shangou_online_e_tfmdliiw_mv' }, this)
        }
      },
      keywordSearchActive (active) {
        if (active && this.searchResult.length) {
          const tagId = this.searchResult.map(a => a.id).join(',')
          lx.mv({ bid: 'b_shangou_online_e_ympp2pif_mv', val: { query: this.keyword, tag_id: tagId } }, this)
        }
      }
    },
    computed: {
      noKeywordSearchActive () {
        return this.focus && !this.search
      },
      keywordSearchActive () {
        return !this.searching && this.focus && !!this.search
      },
      activeList () {
        return this.loadingId >= 0 ? [this.loadingId] : []
      },
      searching () {
        return this.loadingId === 0
      },
      exist () {
        return this.multiple ? this.value.map(v => v.idPath) : this.value
      },
      computedWidth () {
        return typeof this.width === 'number' ? `${this.width}px` : this.width
      },
      showIcon () {
        if (this.searching) {
          return 'loading'
        }
        if ((this.hover || this.focus) && (this.value.length > 0 || this.name)) {
          return 'clearable'
        }
        return 'arrow'
      }
    },
    methods: {
      handleTrigger (item, hover) {
        const { id, path } = item
        if (this.$listeners.trigger) {
          this.$emit('trigger', item, hover)
          if (!this.source) {
            this.focus = false
            this.search = ''
          }
        }
        // 无视hover
        if (hover) return
        // 没有path说明是级联中某项的触发，也可能是其他类型的项触发，在这里不用处理
        if (!path) return
        if (this.multiple) {
          const index = this.value.findIndex(v => v.idPath.includes(id))
          const newVal = this.value.slice()
          if (index < 0) {
            if (newVal.length >= this.maxCount) {
              this.exceedWarning()
              return
            }
            newVal.push({
              idPath: path.map(v => v.id),
              namePath: path.map(v => v.name)
            })
          } else {
            newVal.splice(index, 1)
          }
          this.$emit('change', newVal)
        } else {
          if (!this.value.includes(id)) {
            const idPath = path.map(v => v.id)
            const namePath = path.map(v => v.name)
            this.handleChange(idPath, namePath)
          }
        }
      },
      handleTriggerLocked (item) {
        this.$emit('trigger-locked', item)
      },
      handleChange (...params) {
        if (this.disabled) {
          return
        }
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
        this.$emit('change', ...params)
        this.$emit('close')
      },
      // 超出最大数量的警告
      exceedWarning () {
        this.$Message.warning(`超过最大选择数量${this.maxCount}个`)
      },
      // 有新的加载
      handleLoadingIdChange (loadingId) {
        this.loadingId = loadingId
      },
      // 删除已选项，只有multiple才有
      handleDelete (e, index) {
        e.stopPropagation()
        const newVal = this.value.slice()
        newVal.splice(index, 1)
        this.$emit('change', newVal)
      },
      debouncedSearch: async function (params, isLoadMore = false) {
        const query = {
          keyword: this.keyword,
          pageSize: this.pageSize,
          pageNum: this.pageNumSelf,
          ...params
        }
        try {
          const result = await this.onSearch(query)
          const data = result.data || []
          const { total } = result
          let searchResult = data
          // 加载下一页数据expend
          if (isLoadMore) {
            searchResult = [...this.searchResult, ...data]
          }
          this.loadingId = null
          this.searchResult = searchResult
          this.pageNumSelf = query.pageNum
          this.total = total || data.length
        } catch (e) {
          lx.mv({ bid: 'b_shangou_online_e_195sv7gp_mv', val: { query: this.keyword } }, this)
          this.loadingId = null
          this.searchResult = []
          this.pageNumSelf = 1
          this.total = 0
        }
      },
      handleSearch (e) {
        const search = e.target.value
        this.loadingId = search ? 0 : null
        this.search = search
        this.keyword = search
        this.$emit('search', search)
        if (!search) return
        this.debouncedSearch({ keyword: search, pageNum: 1 })
      },
      handleSearchLoadMore () {
        return this.debouncedSearch(
          { keyword: this.keyword, pageNum: this.pageNum + 1 },
          true
        )
      },
      handleFocus (e) {
        if (this.disabled) return
        this.$emit('open')
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
        this.$nextTick(() => {
          if (this.$refs.cascaderRef && adjust) {
            this.$refs.cascaderRef.adjust()
          }
        })
        this.$emit('close')
      }
    },
    components: {
      Cascader,
      Menu
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
      display: none;
      &.active {
        display: block;
      }
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
.withSearch {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  border: 1px solid @disabled-border-color;
  border-radius: 2px;
  width: 440px;
  max-width: 100%;
  line-height: 28px;
  cursor: pointer;
  transition: all 0.2s;
  &-default {
    font-size: @font-size-base;
    padding: 3px 10px;
  }
  &-small {
    font-size: @font-size-small;
    padding: 1px 6px 0px 6px;
  }
  &-large {
    font-size: @font-size-large;
    padding: 6px 12px;
  }
  &:hover, &:focus, &.active {
    border: 1px solid @input-hover-border-color;
  }
  // &:hover {
  //   .status .icon.clear {
  //     display: inline-block;
  //   }
  // }
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
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
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
    // top: 0;
    // bottom: 0;
    display: inline-block;
    width: auto;
    .icon {
      color: @icon-color;
      // position: absolute;
      // right: 0px;
      // display: none;
      // margin-left: 5px;
      // &:first-child {
      //   margin-left: 0;
      // }
      &.loading {
        // z-index: 3;
      }
      &.clear {
        // z-index: 2;
        &-default {
          font-size: 14px;
        }
        &-small {
          font-size: 12px;
        }
        &-large {
          font-size: 16px;
        }
      }
      .arrow {
        // z-index: 1;
        &-default {
          font-size: 16px;
        }
        &-small {
          font-size: 14px;
        }
        &-large {
          font-size: 18px;
        }
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
