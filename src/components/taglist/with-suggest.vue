<template>
  <Poptip
    placement="bottom-start"
    ref="triggerRef"
    class="tag-with-sugguest-poptip"
    :class="{ expand: !!search }"
    @on-popper-hide="hide(true)"
    padding="0"
    :style="{ width: computedWidth }"
  >
    <InputBox
      :value="value"
      :name="name"
      :separator="separator"
      :placeholder="placeholder"
      :search="search"
      :width="computedWidth"
      :searching="searching"
      :disabled="disabled"
      :multiple="multiple"
      :focus="focus"
      bordered
      @focus="handleFocus"
      @search="handleSearch"
      @del="handleDelete"
      @clear="handleClear"
    />
    <template slot="content">
      <div class="popup">
        <InputBox
          ref="inputBox"
          :value="value"
          :name="name"
          :separator="separator"
          :placeholder="placeholder"
          :search="search"
          :width="computedWidth"
          :searching="searching"
          :disabled="disabled"
          :multiple="multiple"
          :focus="focus"
          @focus="handleFocus"
          @search="handleSearch"
          @del="handleDelete"
          @clear="handleClear"
        />
        <div class="suggestion" v-if="suggestList.length">
          <div class="single" v-if="!multiple">
            推荐分类：
            <span class="suggest-item">{{ firstSuggestion.name }}</span>
            <Icon class="checked-icon" v-if="firstSuggestion.selected" type="checked" />
          </div>
        </div>
      </div>
    </template>
  </Poptip>
</template>
<script>
  import debounce from 'lodash/debounce'
  import InputBox from './input-box'

  export default {
    name: 'tag-list-with-sugguest',
    components: { InputBox },
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
      suggestList: {
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
      multiple: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      placeholder: {
        type: String,
        default: ''
      },
      maxCount: {
        type: Number,
        default: 1
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
    computed: {
      firstSuggestion () {
        const first = this.suggestList[0]
        return {
          id: first.id,
          name: first.name,
          selected: this.value.includes(first.id)
        }
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
      debouncedSearch: async function (params) {
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
      handleSearch (search) {
        this.loadingId = search ? 0 : -1
        this.search = search
        this.keyword = search
        this.$emit('search', search)
        if (!search) return
        this.debouncedSearch({ keyword: search, pageNum: 1 })
      },
      handleFocus () {
        this.focus = true
        // 点开后poptip里的input聚焦的hack
        setTimeout(() => {
          console.log(this.$refs.inputBox.$refs.inputRef)
          this.$refs.inputBox.$refs.inputRef.focus()
        }, 350)
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
    }
  }
</script>
<style lang="less">
.tag-with-sugguest-poptip {
  position: relative;
  .boo-poptip-arrow {
    display: none;
  }
  .boo-poptip-inner {
    border-radius: 0;
    box-shadow: 0 0 10px rgba(0,0,0,.2);
    margin-top: 0;
  }
  .boo-poptip-popper {
    padding: 0;
    z-index: 1000;
    // left: -1px !important;
    // top: 0 !important;
    right: -1px;
    transform: translate(0, -36px);
  }
  &.expand {
    .boo-poptip-popper {
      min-width: 100%;
    }
  }
}
</style>

<style lang="less" scoped>
.poptip {
  width: 100%;
  position: relative;
  /deep/ .boo-poptip-rel {
    width: 100%;
  }
}
.options {
  padding: 0;
}
.suggestion {
  font-size: @font-size-small;
  padding: 10px;
  border-top: 1px solid @disabled-border-color;
  .suggest-item {
    font-size: @font-size-base;
  }
  .single {
    display: flex;
    align-items: center;
    .checked-icon {
      color: @highlight-color;
    }
  }
}
</style>
