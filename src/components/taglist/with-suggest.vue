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
      <div class="tag-with-suggest-popup">
        <InputBox
          ref="inputBox"
          :value="value"
          :name="name"
          :separator="separator"
          :placeholder="placeholder"
          :search="search"
          :width="computedWidth"
          :disabled="disabled"
          :multiple="multiple"
          :focus="focus"
          @focus="handleFocus"
          @search="handleSearch"
          @del="handleDelete"
          @clear="handleClear"
        />
        <div class="suggestion" v-if="suggestList.length">
          <div class="multiple" v-if="multiple">
            <span class="label">推荐分类：</span>
            <div class="suggest-items">
              <SuggestItem
                v-for="(suggest, i) in suggestList"
                :key="suggest.id || i"
                :data="suggest"
                :exist="exist"
                @trigger="handleSuggestTrigger"
                multiple
              />
            </div>
          </div>
          <div class="single" v-else :class="{ checked: firstSuggestion.checked }" @click="handleSuggestTrigger(firstSuggestion)">
            <span class="label">推荐分类：</span>
            <SuggestItem :data="firstSuggestion" />
            <Icon class="checked-icon" v-if="firstSuggestion.checked" :size="14" type="check" />
          </div>
        </div>
        <div class="cascader">
          <Menu :multiple="multiple" :list="source" :exist="exist" @trigger="handleTrigger" @check="handleCheck" :activeId="curBranchTag ? curBranchTag.id : -1" />
          <Menu :multiple="multiple" v-if="hasSub" :list="subTags" :exist="exist" sub @trigger="handleTrigger" @check="handleCheck" />
        </div>
      </div>
    </template>
  </Poptip>
</template>
<script>
  import debounce from 'lodash/debounce'
  import InputBox from './input-box'
  import Menu from './menu'
  import SuggestItem from './suggest-item'

  export default {
    name: 'tag-list-with-sugguest',
    components: { InputBox, Menu, SuggestItem },
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
        curBranchTag: null,
        focus: false,
        search: ''
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
          level: 0,
          isLeaf: true,
          checked: this.value.includes(first.id)
        }
      },
      hasSub () {
        return this.source.some(v => !v.isLeaf)
      },
      subTags () {
        return this.curBranchTag ? (this.curBranchTag.children || []) : []
      },
      exist () {
        return this.multiple ? this.value.map(v => v.idPath) : this.value
      },
      computedWidth () {
        return typeof this.width === 'number' ? `${this.width}px` : this.width
      }
    },
    methods: {
      handleSuggestTrigger (item) {
        if (this.multiple) {
          const newVal = this.value.slice()
          const index = newVal.findIndex(v => v.idPath.includes(item.id))
          if (index >= 0) {
            newVal.splice(index, 1)
          } else {
            newVal.push({ idPath: item.idPath, namePath: item.namePath })
          }
          this.handleChange(newVal)
        } else {
          if (this.value.includes(item.id)) {
            this.handleChange([])
          } else {
            this.handleChange(item.idPath, item.namePath)
          }
        }
      },
      handleTrigger (item) {
        if (item.isLeaf) {
          if (this.multiple) {
            const newVal = this.value.slice()
            const index = newVal.findIndex(v => v.idPath.includes(item.id))
            if (index >= 0) {
              newVal.splice(index, 1)
            } else {
              const idPath = (this.curBranchTag && item.level > 0) ? [this.curBranchTag.id, item.id] : [item.id]
              const namePath = (this.curBranchTag && item.level > 0) ? [this.curBranchTag.name, item.name] : [item.name]
              newVal.push({ idPath, namePath })
            }
            this.handleChange(newVal)
          } else {
            if (this.value.includes(item.id)) {
              this.handleChange([])
            } else {
              const idPath = (this.curBranchTag && item.level > 0) ? [this.curBranchTag.id, item.id] : [item.id]
              const namePath = (this.curBranchTag && item.level > 0) ? [this.curBranchTag.name, item.name] : [item.name]
              this.handleChange(idPath, namePath)
            }
          }
        } else {
          this.curBranchTag = item
        }
      },
      // checkbox选择，此情况下肯定是multiple
      handleCheck (item, checked) {
        if (item.isLeaf) {
          this.handleTrigger(item)
        } else {
          let newVal = this.value.slice()
          const leftCount = this.maxCount - newVal.length
          if (checked) { // 把没选上的都选上
            let count = 0
            item.children.forEach(child => {
              if (!newVal.some(v => v.idPath.includes(child.id))) {
                count++
                newVal.push({ idPath: [item.id, child.id], namePath: [item.name, child.name] })
              }
            })
            if (count > leftCount && leftCount > 0) {
              this.$Message.warning(`只能再选${leftCount}个分类了`)
              return
            }
          } else { // 把选上的都去掉
            newVal = newVal.filter(v => !v.idPath.includes(item.id))
          }
          this.handleChange(newVal)
        }
      },
      handleTrigger2 (item, hover) {
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
      // 删除已选项，只有multiple才有
      handleDelete (e, index) {
        e.stopPropagation()
        const newVal = this.value.slice()
        newVal.splice(index, 1)
        this.$emit('change', newVal)
      },
      debouncedSearch: async function () {
        const query = {
          keyword: this.search
        }
        try {
          const result = await this.onSearch(query)
          const data = result.data || []
          let searchResult = data
          // 加载下一页数据expend
          this.loadingId = -1
          this.searchResult = searchResult
        } catch (e) {
          this.loadingId = -1
          this.searchResult = []
        }
      },
      handleSearch (search) {
        this.loadingId = search ? 0 : -1
        this.search = search
        this.$emit('search', search)
        if (!search) return
        this.debouncedSearch()
      },
      handleFocus () {
        this.focus = true
        // 点开后poptip里的input聚焦的hack，poptip的动画是300ms，所以这里等待350ms
        setTimeout(() => {
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
    top: 0 !important;
    right: -1px;
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
.tag-with-suggest-popup {
  /deep/ .boo-checkbox-wrapper {
    margin-right: 0;
    line-height: @font-size-large;
    .boo-checkbox {
      line-height: 0;
      margin-right: 2px;
      vertical-align: bottom;
    }
  }
}
.suggestion {
  font-size: @font-size-small;
  padding: 6px 10px;
  border-top: 1px solid @disabled-border-color;
  white-space: normal;
  .label {
    display: inline-block;
    line-height: 24px;
  }
  .suggest-items {
    flex: 1;
  }
  .single {
    display: flex;
    align-items: center;
    cursor: pointer;
    .checked-icon {
      color: @menu-item-active-color;
    }
    &.checked {
      .suggest-item {
        font-weight: 500;
        color: @menu-item-active-color;
      }
    }
  }
  .multiple {
    display: flex;
  }
}
.cascader {
  display: flex;
  flex-direction: row;
  border-top: 1px solid @disabled-border-color;
}
</style>
