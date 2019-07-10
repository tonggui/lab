<template>
  <div class="search-suggest">
    <Poptip
      trigger="focus"
      placement="bottom"
      class="search-suggest-pop"
      popper-class="search-suggest-pop-body"
      :visible="visible"
    >
      <Input
        :value="value"
        @on-focus="handleFocus"
        @on-change="handleChange"
        search
        enter-button
        :placeholder="placeholder"
        @on-search="handleSearch"
        :clearable="clearable"
        size="small"
      />
      <div slot="content">
        <template v-if="!value" >
          <div v-for="name in historyList" class="history-list-item" :key="name" @click="handleSearch(name)">
            <Icon type="query-builder" size=18 /><span>{{ name }}</span>
          </div>
        </template>
        <template v-else>
          <div v-for="(item, index) in showSuggestionList" class="suggestion-list-item" :key="index" @click="handleSelect(item)">
            <div class="suggestion-list-item-name">{{ item.name }}</div>
            <div v-if="item.id"><Tag>品牌</Tag></div>
            <div v-if="item.tagPath.length > 0" class="suggestion-list-item-desc">{{ item.tagPath.join('>') }}</div>
          </div>
        </template>
      </div>
    </Poptip>
  </div>
</template>
<script>
  import LocalStorage, { KEYS } from '@/common/local-storage'

  const CACHE_SEPARATOR = ','

  export default {
    name: 'search-suggest',
    props: {
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
      placeholder: String
    },
    data () {
      return {
        visible: false
      }
    },
    computed: {
      historyList: {
        get () {
          if (this.cacheKey) {
            const strValue = LocalStorage[this.cacheKey]
            if (strValue) {
              return strValue.split(CACHE_SEPARATOR)
            }
            return []
          }
          return []
        },
        set (list) {
          if (this.cacheKey) {
            LocalStorage[this.cacheKey] = (list.slice(0, this.maxCount)).join(CACHE_SEPARATOR)
          }
        }
      },
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
        this.$emit('change', e.target.value)
      },
      handleCache (name) {
        if (!this.cache) {
          return
        }
        this.historyList.unshif(name)
      },
      handleSearch (value) {
        if (value) {
          this.handleCache(value)
          this.$emit('search', { name: value })
        }
      },
      handleSelect (item) {
        if (item) {
          this.handleCache(item.name)
          this.$emit('search', item)
        }
      }
    }
  }
</script>
<style lang="less">
.search-suggest {
  width: 240px;
  display: inline-block;
  vertical-align: middle;
  position: relative;
  &-pop {
    display: flex;
    flex-direction: column;
    align-items: center;
    &-body {
      width: 100%;
      min-height: 30px;
    }
    .boo-poptip-rel {
      width: 100%;
    }
    .boo-poptip-body {
      padding: 0;
    }
  }
}
.history-list-item,
.suggestion-list-item {
  padding: 12px;
  i {
    color: @text-helper-color;
    margin-right: 4px;
  }
  &:hover {
    background: #f0f0f0;
  }
  &:not(:last-child) {
    border-bottom: 1px solid @border-color-base;
  }
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
