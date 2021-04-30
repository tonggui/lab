<template>
  <Poptip
    placement="bottom-start"
    ref="triggerRef"
    class="tag-with-sugguest-poptip"
    popper-class="tag-with-sugguest-poptip"
    :class="{ expand: !!search }"
    :disabled="disabled"
    @on-popper-hide="hide(true)"
    padding="0"
    :style="{ width: computedWidth }"
    :transfer="transfer"
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
      @blur="handleBlur"
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
          @blur="handleBlur"
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
        <div class="cascader" v-if="!search">
          <Menu :multiple="multiple" :list="source" :exist="exist" @trigger="handleTrigger" @check="handleCheck" :activeId="curBranchTag ? curBranchTag.id : -1" />
          <Menu :multiple="multiple" v-if="hasSub" :list="subTags" :exist="exist" sub @trigger="handleTrigger" @check="handleCheck" />
        </div>
        <div class="search-result">
          <Menu :multiple="multiple" v-if="search" :list="searchResult" :exist="exist" @trigger="handleSuggestTrigger" @check="handleSuggestTrigger">
            <div v-if="!searchResult.length" class="empty" slot="empty">
              无数据
            </div>
          </Menu>
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
  import TimeCounters from '@/common/lx/lxReport/lxTime'

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
      },
      transfer: Boolean
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
          ...first,
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
          const idPath = params[0] || []
          // 选中项不在当前激活的一级分类下，则取消当前激活的一级分类的激活状态
          if (this.curBranchTag && !idPath.includes(this.curBranchTag.id)) {
            this.curBranchTag = null
          }
          if (this.$refs.triggerRef) {
            this.$refs.triggerRef.handleClose()
          }
        }
        this.focus = this.multiple
        if (!this.multiple) {
          this.search = ''
        }
        TimeCounters.setEndTime('tag', Date.now())

        this.$emit('change', ...params)
      },
      handleBlur () {
        TimeCounters.setEndTime('tag', Date.now())
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
        try {
          let searchResult = await this.onSearch(this.search)
          this.searchResult = searchResult
        } catch (e) {
          this.searchResult = []
        }
      },
      handleSearch (search) {
        this.search = search
        this.$emit('search', search)
        if (!search) return
        this.debouncedSearch()
      },
      handleFocus () {
        if (this.disabled) {
          return
        }
        this.$emit('open')
        TimeCounters.setTime('tag', Date.now(), 's2e')
        this.focus = true
        // 点开后poptip里的input聚焦的hack，poptip的动画是300ms，所以这里等待350ms
        setTimeout(() => {
          if (this.$refs.inputBox) {
            this.$refs.inputBox.inputFocus()
          }
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
        TimeCounters.stopTime('tag')
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
    right: 0;
    border: 1px solid #fff;
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
      margin-right: 0;
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
.search-result {
  border-top: 1px solid @disabled-border-color;
}
.empty {
  text-align: center;
  padding: 20px;
  color: @text-tip-color;
}
</style>
