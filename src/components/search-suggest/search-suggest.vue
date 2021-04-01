<template>
  <div class="search-suggest" :style="{ width: width + 'px' }">
    <Poptip
      trigger="focus"
      placement="bottom"
      class="search-suggest-pop"
      popper-class="search-suggest-pop-body"
      :visible="visible"
      transfer
      :width="width"
      :disabled="disabled"
    >
      <Input
        :value="value"
        :disabled="disabled"
        @on-focus="handleFocus"
        @on-change="handleChange"
        search
        enter-button
        :maxlength="maxlength"
        :placeholder="placeholder"
        @on-search="handleSearch"
        :clearable="clearable"
        v-mc="{ bid: 'b_shangou_online_e_vg5skxdr_mc' }"
        class="search-suggest-input"
      />
      <div slot="content" class="content">
        <template v-if="!value && !loading">
          <div :title="name" v-for="name in historyList" class="history-list-item" :key="name" @click="handleSearch(name)">
            <Icon type="query-builder" size=18 />{{ name }}
          </div>
        </template>
        <template v-else>
          <div class="suggestion-list" v-if="needSuggest">
            <template v-if="!loading">
              <div v-if="showSuggestionList.length > 0" v-mv="{ bid: 'b_shangou_online_e_pb6awxbc_mv', val: { keyword: value, status: 1 }, show: true }">
                <div v-for="(item, index) in showSuggestionList" class="suggestion-list-item" :key="index" @click="handleSelect(item)" v-mc="{ bid: 'b_shangou_online_e_8z37fumh_mc' }">
                  <div class="suggestion-list-item-name" :title="item.name">{{ item.name }}</div>
                  <div v-if="isBrand(item)"><Tag>品牌</Tag></div>
                  <div v-if="item.tagPath.length > 0" class="suggestion-list-item-desc">{{ item.tagPath.join('>') }}</div>
                </div>
              </div>
              <Empty v-else v-mv="{ bid: 'b_shangou_online_e_pb6awxbc_mv', val: { keyword: value, status: 0 }, show: true }" />
            </template>
            <Loading v-else size="small" />
          </div>
        </template>
      </div>
    </Poptip>
  </div>
</template>
<script>
  import {
    uniq
  } from 'lodash'
  import {
    SUGGESTION_TYPE
  } from '@/data/enums/common'
  import LocalStorage, { KEYS } from '@/common/local-storage'
  import lx from '@/common/lx/lxReport'

  const CACHE_SEPARATOR = ','

  export default {
    name: 'search-suggest',
    props: {
      disabled: Boolean,
      loading: Boolean,
      value: String,
      cache: {
        type: Boolean,
        default: true
      },
      cacheKey: {
        type: String,
        default: KEYS.SEARCH_SUGGEST_HISTORY
      },
      maxCount: {
        type: Number,
        default: 5
      },
      suggestionList: {
        type: Array,
        default: () => []
      },
      clearable: Boolean,
      placeholder: String,
      maxlength: Number,
      width: Number,
      needSuggest: {
        type: Boolean,
        default: true
      }
    },
    data () {
      let historyList = []
      if (this.cacheKey) {
        const history = LocalStorage[this.cacheKey]
        if (history) {
          historyList = (history.toString()).split(CACHE_SEPARATOR)
        }
      }
      return {
        visible: false,
        historyList
      }
    },
    watch: {
      historyList (list) {
        LocalStorage[this.cacheKey] = list.join(CACHE_SEPARATOR)
      }
    },
    computed: {
      showSuggestionList () {
        return this.suggestionList.slice(0, this.maxCount)
      }
    },
    methods: {
      handleFocus () {
        if (!this.value && this.historyList.length <= 0) {
          this.visible = false
          return
        }
        this.visible = true
      },
      handleChange (e) {
        console.log('change', e.target.value)
        this.$emit('change', e.target.value)
      },
      handleCache (name) {
        if (!this.cache) {
          return
        }
        this.historyList = uniq([name, ...this.historyList]).slice(0, this.maxCount)
      },
      handleSearch (value) {
        lx.mc({ bid: 'b_z1hhtw9c', val: { keyword: value } })
        if (value) {
          value = this.formatName(value)
          this.handleCache(value)
        }
        this.$emit('search', { name: value })
      },
      handleSelect (item) {
        if (item) {
          item = { ...item, name: this.formatName(item.name) }
          this.handleCache(item.name)
          this.$emit('search', item)
        }
      },
      isBrand (item) {
        return item.type === SUGGESTION_TYPE.BRAND
      },
      formatName (name) {
        if (this.maxlength) {
          return String(name).slice(0, this.maxlength)
        }
        return name
      }
    }
  }
</script>
<style lang="less">
@width: 240px;
.search-suggest {
  width: @width;
  display: inline-block;
  vertical-align: middle;
  position: relative;
  /deep/ .boo-poptip-rel {
    width: 100%;
  }
  &-pop {
    display: flex;
    flex-direction: column;
    align-items: center;
    &-body {
      width: @width;
      // min-height: 30px;
      .boo-poptip-rel {
        width: 100%;
      }
      .boo-poptip-body {
        padding: 0;
      }
    }
  }
}
.search-suggest-input {
  /deep/ .boo-input {
    padding-right: 24px;
  }
}
.suggestion-list {
  position: relative;
  min-height: 60px;
}
.history-list-item,
.suggestion-list-item {
  padding: 12px;
  cursor: pointer;
  i {
    color: @text-helper-color;
    margin-right: 4px;
    margin-top: -2px;
  }
  &:hover {
    background: #f0f0f0;
  }
  &:not(:last-child) {
    border-bottom: 1px solid @border-color-base;
  }
}
.history-list-item {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}
.suggestion-list-item {
  &-name {
    width: 100%;
    line-height: 1.5;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: bold;
  }
  &-desc {
    margin-top: 4px;
    font-size: @font-size-small;
    color: @text-helper-color;
  }
}
</style>
