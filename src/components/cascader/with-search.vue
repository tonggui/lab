<template>
  <Poptip placement="bottom-start" ref="triggerRef" class="cascader">
    <div
      class="withSearch"
      :style="{ width: width }"
      :class="{ disabled: disabled }"
      @click="attach"
    >
      <div class="tags">
        <template v-if="multiple">
          <Tag
            v-for="(item, index) in value"
            :key="item.idPath.join(separator)"
            @close="e => handleDelete(e, index)"
            closable
          >
            {{ item.namePath.join(separator) }}
          </Tag>
        </template>
        <input
          ref="inputRef"
          class="input"
          :disabled="disabled"
          :value="focus ? search : name"
          @input="handleSearch"
          @click="handleFocus"
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
        <span class="icon" v-show="searching">
          <Icon type="loading" />
        </span>
        <span class="icon clear" v-show="value.length > 0 || name">
          <Icon type="close-circle" theme="filled" @click="handleClear" />
        </span>
        <span v-if="arrow" class="icon arrow" :class="{ active: focus }">
          <Icon type="down" :style="{ 'font-size': 10, color: '#BABCCC' }" />
        </span>
      </div>
    </div>
    <template slot="content">
      <div class="popup">
        <div
          v-if="source"
          class="options"
          :class="{ active: focus && !!search }"
        >
          <Cascader
            ref="cascaderRef"
            :multiple="multiple"
            :source="source"
            :value="value"
            :loadingId="loadingId"
            :exist="exist"
            :triggerMode="triggerMode"
            :allowBranchSelect="allowBranchSelect"
            @loading-id-change="handleLoadingIdChange"
            @change="handleChange"
            @trigger="handleTrigger"
          >
            <template slot="renderItem">
              <slot v-if="$slots.renderItem" name="renderItem"></slot>
            </template>
          </Cascader>
        </div>
        <div
          class="options"
          :class="{ active: !searching && focus && !!search }"
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
          >
            <template slot="empty">
              <slot v-if="$slots.empty" name="empty"></slot>
            </template>
            <template slot="renderItem">
              <slot v-if="$scopedSlots.renderItem" name="renderItem"></slot>
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
/**
 * event {change, search, close}
 */
export default {
  name: 'cascader-with-search',
  props: {
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
      default: ''
    },
    debounce: {
      type: Number,
      default: 300
    },
    width: {
      type: Number,
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
    }
  },
  data () {
    return {
      searchResult: [],
      focus: false,
      search: '',
      keyword: '', // 搜索用到的关键字，和search同步
      loadingId: -1,
      pageNumSelf: this.pageNum,
      total: 0
    }
  },
  mounted () {
    this.debouncedSearch = debounce(this.debouncedSearch, this.debounce)
  },
  watch: {
    value () {
      this.forcePopupAlign()
    }
  },
  computed: {
    activeList () {
      return this.loadingId >= 0 ? [this.loadingId] : []
    },
    searching () {
      return this.loadingId === 0
    },
    exist () {
      return this.multiple ? this.value.map(v => v.idPath) : this.value
    }
  },
  methods: {
    forcePopupAlign () {
      this.$refs.triggerRef.forcePopupAlign()
    },
    handleTrigger (item, hover) {
      const { id, path } = item
      this.$emit('trigger', item, hover)
      if (!this.source) {
        this.focus = false
        this.search = ''
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
    handleChange (...params) {
      if (this.multiple) {
        const paths = params[0]
        if (paths.length > this.maxCount) {
          this.exceedWarning()
          return
        }
      }
      this.focus = this.multiple
      this.search = ''
      this.$nextTick(() => {
        this.$emit('change', ...params)
      })
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
        this.loadingId = -1
        this.searchResult = searchResult
        this.pageNumSelf = query.pageNum
        this.total = total || data.length
      } catch (e) {
        this.loadingId = -1
        this.searchResult = []
        this.pageNumSelf = 1
        this.total = 0
      }
    },
    handleSearch (e) {
      const search = e.target.value
      this.loadingId = search ? 0 : -1
      this.search = search
      this.keyword = search
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
      e.stopPropagation()
      if (this.disabled) return
      this.focus = true
      this.$refs.triggerRef.handleClick()
    },
    attach (e) {
      e.stopPropagation()
      this.$refs.inputRef.focus()
      this.handleFocus(e)
    },
    handleClear (e) {
      e.stopPropagation()
      this.handleChange([])
      this.hide(true)
    },
    handleVisibleChange (visible) {
      if (!visible) {
        this.hide(true)
      }
    },
    hide (adjust = false) {
      this.focus = false
      this.search = ''
      if (this.$refs.cascaderRef && adjust) {
        this.$refs.cascaderRef.adjust()
      }
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
.tags {
  line-height: 2;
  display: flex;
  align-items: center;
  flex: 1;
  flex-wrap: wrap;
  margin-right: 40px;
  .ant-tag {
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
  margin: 6px 0;
  cursor: inherit;
  &::-webkit-input-placeholder {
    color: rgb(173, 175, 187);
  }
}
.status {
  position: absolute;
  right: 10px;
  display: inline-block;
  width: auto;
  .icon {
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
</style>

<style lang="less" scope>
.cascader {
  .boo-poptip-arrow {
    display: none;
  }
  .boo-poptip-inner {
    box-shadow: none;
    border: 1px solid #ddd;
    border-radius: 0;
  }
  .boo-poptip-popper {
    padding: 0;
  }
}
.withSearch {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  border: 1px solid #e9eaf2;
  border-radius: 2px;
  width: 440px;
  max-width: 100%;
  font-size: var(--font-size);
  padding: 3px 10px;
  line-height: 28px;
  cursor: pointer;
  &:hover {
    :global {
      .status .icon.clear {
        display: inline-block;
      }
    }
  }
  &.disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
    color: rgb(173, 175, 187);
  }
}
</style>
