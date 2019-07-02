<template>
  <div class="related-product">
    <div class="container all">
      <div class="tag-tree-container">
        <div class="content-wrapper">
          <div class="header" @click="activeSearch" :class="{ active: activeTag.id === 0 }"><a>搜索添加</a></div>
          <tag-list :tagList="tagList" @change="onSelectTag" :tagId="activeTag.id"></tag-list>
        </div>
      </div>
      <div class="product-list-container">
        <div class="content-wrapper" ref="productListWrapper">
          <div class="header">
            <template v-if="activeTag.id === 0">
              <div class="search-input">
                <Input v-model="search" placeholder="请输入商品名称/品牌/条码/货号进行查询" @on-enter="refresh" />
                <Icon class="search-icon" type="search" size="18" @click="refresh" />
              </div>
            </template>
            <template v-else-if="activeTag.id > 0">
              <span>{{ activeTag.name }}</span>
            </template>
          </div>
          <div class="spin-container">
            <Spin v-show="loading" fix />
          </div>
          <product-list
            :selectedIds="selectedIds"
            :list="list"
            :pageNum="pageNum"
            :pageSize="pageSize"
            :total="total"
            @select="onSelect"
            @page-change="handlePageChange"
          />
        </div>
      </div>
    </div>
    <div class="container related">
      <div class="content-wrapper">
        <div class="header">
          已选商品：{{ relatedProductList.length }}
          <span class="weak">注：最少1个，最多3个</span>
        </div>
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
import TagList from './tag-list'
import ProductList from './product-list'
import Product from './product'

import { fetchProductList } from '@/data/repos/productRepository'

export default {
  name: 'related-product',
  components: { TagList, ProductList, Product },
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
        this.refresh()
        this.initFlag = true
      }
    },
    // 激活搜索模式
    activeSearch () {
      // 当前就是搜索状态则无视
      if (this.activeTag.id === 0) return
      this.activeTag = {
        id: 0
      }
      this.refresh()
    },
    // 重置列表
    reset () {
      this.pageNum = 1
    },
    // 选中店内分类
    onSelectTag (tag) {
      // 与当前选择的店内分类一样则无视
      if (this.activeTag.id === tag.id) return
      this.activeTag = tag
      this.search = ''
      this.refresh()
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
    // 切换商品分页
    handlePageChange (pageNum) {
      this.pageNum = pageNum
      this.getProductList()
    },
    // 获取商品信息
    getProductList () {
      // 如果当前没有video，则无需获取商品数据
      if (!this.video || !this.video.id) return
      // 滚动至顶部
      this.$refs.productListWrapper.scrollTop = 0
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
    },
    // 重置并且重新搜索商品
    refresh () {
      this.reset()
      this.getProductList()
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
    border: 1px solid @border-color-base;
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
    padding: 0 20px;
    background: inherit;
  }
  .tag-tree-container {
    position: relative;
    width: 33.3%;
    height: 100%;
    background: #FDFDFD;
    border-right: 1px solid @border-color-base;
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
    .split {
      width: 1px;
      height: 100%;
      margin: 0 10px;
      background: @border-color-base;
    }
    .search-input {
      position: relative;
      flex: 1;
      display: flex;
      align-items: center;
      .search-icon {
        cursor: pointer;
        color: @icon-color;
        &:hover {
          color: @link-color;
        }
      }
    }
  }
  .header {
    position: sticky;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 50px;
    line-height: 50px;
    background: inherit;
    border-bottom: 1px solid #f7f7f7;
    z-index: 1;
    .weak {
      color: @text-helper-color;
    }
    a {
      color: inherit;
    }
    &:hover {
      a {
        color: @link-color;
      }
    }
    &.active {
      a {
        color: @link-color;
      }
    }
  }
}
.info {
  display: flex;
  align-items: center;
  cursor: pointer;
  line-height: 1.25;
  .icon {
    color: #979797;
    transition: all .4s;
    &.expand {
      transform: rotateZ(90deg);
    }
  }
  &:hover, &.active {
    color: @link-color;
    .icon {
      color: @link-color;
    }
  }
  .tag-name {
    flex: 1;
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
    color: @primary-color;
  }
}
</style>
