<template>
  <div class="related-product">
    <div class="container all">
      <div class="tag-tree-container">
        <div class="content-wrapper">
          <div class="header" @click="activeSearch" :class="{ active: activeTag.id === 0 }"><a>搜索添加</a></div>
          <tag-tree :data="tagList" @select="onSelectTag" :activeId="activeTag.id" />
        </div>
      </div>
      <div class="product-list-container">
        <div class="content-wrapper" ref="productListWrapper">
          <div class="header">
            <template v-if="activeTag.id === 0">
              <div class="search-by">
                <Select size="small" v-model="searchBy">
                  <Option v-for="item in searchByOptions" :key="item.value" :value="item.value">{{ item.label }}</Option>
                </Select>
                <div class="split"></div>
              </div>
              <div class="search-input">
                <Input v-model="search" :placeholder="searchPlaceholder" />
                <Icon class="search-icon" type="search" size="18" />
              </div>
            </template>
            <template v-else-if="activeTag.id > 0">
              <span>{{ activeTag.name }}</span>
              <span class="weak">（最多选择3个）</span>
            </template>
          </div>
          <div class="spin-container">
            <Spin v-show="loading" fix />
          </div>
          <product-list :selectedIds="selectedIds" :list="list" :pageNum="pageNum" :pageSize="pageSize" :total="total" @select="onSelect"></product-list>
        </div>
      </div>
    </div>
    <div class="container related">
      <div class="content-wrapper">
        <div class="header">已选商品：{{ relatedProductList.length }}</div>
        <div class="related-product-list">
          <product
            v-for="(product, index) in relatedProductList"
            :key="product.id"
            :data="product"
            :num="index + 1"
            related
            @remove="onRemove"
            >
          </product>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import globalState from '@/common/global-state'
import TagTree from './tag-tree'
import ProductList from './product-list'
import Product from './product'

import { fetchProductList } from '@/data/repos/productRepository'

export default {
  name: 'related-product',
  components: { TagTree, ProductList, Product },
  props: {
    video: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      relatedProductList: [],
      activeTag: { id: 0 },
      searchBy: 1,
      searchByOptions: [
        { value: 1, label: '商品名称' },
        { value: 2, label: 'UPC码' },
        { value: 3, label: 'SKU码' }
      ],
      search: '',
      loading: false,
      list: [],
      pageSize: 20,
      pageNum: 1,
      total: 0
    }
  },
  computed: {
    searchPlaceholder () {
      const searchByItem = this.searchByOptions.find(opt => opt.value === this.searchBy)
      return `请输入${searchByItem ? searchByItem.label : '商品名称'}进行查询`
    },
    tagList () {
      return globalState.tagList
    },
    selectedIds () {
      return this.relatedProductList.map(v => v.id)
    }
  },
  watch: {
    video (v) {
      this.relatedProductList = v ? (v.relSpuList || []).slice() : []
      this.initProductList()
    }
  },
  methods: {
    initProductList () {
      if (!this.initFlag) {
        this.reset()
        this.getProductList()
        this.initFlag = true
      }
    },
    // 激活搜索模式
    activeSearch () {
      this.activeTag = {
        id: 0
      }
    },
    // 重置列表
    reset () {
      this.pageNum = 1
      this.$refs.productListWrapper.scrollTop = 0
    },
    // 选中店内分类
    onSelectTag (tag) {
      this.activeTag = tag
      this.reset()
      this.getProductList()
    },
    // 从已关联中删除商品
    onRemove (id) {
      const index = this.relatedProductList.findIndex(v => v.id === id)
      this.relatedProductList.splice(index, 1)
    },
    // 选中商品
    onSelect (check, id) {
      if (check) {
        const p = this.list.find(v => v.id === id)
        this.relatedProductList.push(p)
      } else {
        this.onRemove(id)
      }
    },
    // 获取商品信息
    getProductList () {
      // 如果当前没有video，则无需获取商品数据
      if (!this.video || !this.video.id) return
      const { pageSize, pageNum, activeTag, search } = this
      this.loading = true
      fetchProductList({
        tagId: activeTag.id || 0,
        searchWord: search,
        pageNum,
        pageSize
      }).then(data => {
        this.list = data.productList || []
        this.total = data.totalCount || 0
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
.related-product {
  display: flex;
  height: 100%;
  .container {
    display: flex;
    height: 100%;
    border: 1px solid @color-gray3;
    font-size: 14px;
    line-height: 1;
    &.all {
      flex: 1;
      margin-right: 10px;
    }
    &.related {
      width: 360px;
    }
  }
  .content-wrapper {
    width: 100%;
    height: 100%;
    overflow: auto;
    padding: 0 15px;
    background: inherit;
  }
  .tag-tree-container {
    position: relative;
    width: 33.3%;
    height: 100%;
    background: #FDFDFD;
    border-right: 1px solid @color-gray2;
    .header {
      cursor: pointer;
    }
  }
  .product-list-container {
    position: relative;
    height: 100%;
    flex: 1;
    background: #fff;
    &.disabled {
      overflow: hidden;
    }
    .search-by {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: auto;
      height: 100%;
      padding: 12px 0;
    }
    .split {
      width: 1px;
      height: 100%;
      margin: 0 10px;
      background: @color-gray3;
    }
    .search-input {
      position: relative;
      flex: 1;
      display: flex;
      align-items: center;
      .search-icon {
        cursor: pointer;
        color: @color-gray4;
        &:hover {
          color: @color-link;
        }
      }
    }
  }
  .header {
    position: sticky;
    top: 0;
    display: flex;
    align-items: center;
    height: 50px;
    line-height: 50px;
    background: inherit;
    border-bottom: 1px solid #f7f7f7;
    z-index: 1;
    .weak {
      color: @color-gray4;
    }
    a {
      color: inherit;
    }
    &:hover {
      a {
        color: @color-link;
      }
    }
    &.active {
      a {
        color: @color-link;
      }
    }
  }
}
</style>
<style lang="less">
.related-product {
  // 改造select
  .boo-select {
    width: auto;
    .boo-select-selection {
      border: none;
      height: 30px;
      .boo-select-selected-value {
        padding: 0 20px 0 0;
      }
      .boo-select-arrow {
        margin-top: -9px;
        right: 0;
      }
    }
  }
  .boo-select-dropdown {
    width: auto;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
    border-radius: 2px;
  }
  // 改造input
  .boo-input {
    border: none;
  }
}
</style>
