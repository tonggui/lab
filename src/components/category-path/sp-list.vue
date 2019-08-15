<template>
  <div class="category-path-sp-list" :class="{ active: !!categoryId }">
    <div class="search-input">
      <div class="category-name" v-show="categoryName">{{ categoryName }}</div>
      <Input :value="search" icon="search" placeholder="请输入标准品名" @on-change="handleSearch" style="width: 100%" />
    </div>
    <div class="loading-container" v-show="firstLoading">
      <Spin />
    </div>
    <Menu
      class="product-list"
      :width="240"
      :height="0"
      :itemHeight="0"
      :list="list"
      :pageNum="pageNum"
      :total="total"
      :onLoadMore="handleLoadMore"
      v-if="!firstLoading"
    >
      <template v-slot:renderItem="{ item }">
        <div class="product" @click="handleSelect($event, item)">
          <img :src="item.pictureList[0] || ''" alt="" class="pic">
          <div class="detail">
            <div class="name">{{ item.name }}</div>
            <div class="meta">
              <span class="brand">{{ item.brand.name }}</span>
              <span class="weight">{{ item.skuList[0] ? item.skuList[0].weight.value : '0' }}g</span>
              <span class="spec">{{ item.skuList[0] ? item.skuList[0].spec : '' }}</span>
            </div>
            <div class="upc">{{ item.upcCode }}</div>
          </div>
        </div>
      </template>
    </Menu>
  </div>
</template>

<script>
  import Menu from '@/components/cascader/menu'
  import { debounce } from 'lodash'
  import { fetchGetSpList } from '@/data/repos/standardProduct'

  export default {
    name: 'sp-list',
    components: { Menu },
    props: {
      categoryId: {
        type: [Number, String],
        default: null
      },
      categoryName: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        loading: true,
        search: '',
        list: [],
        pageNum: 0,
        pageSize: 20,
        total: 0
      }
    },
    computed: {
      firstLoading () {
        return this.pageNum === 0 && this.loading
      }
    },
    watch: {
      categoryId (v) {
        if (v) {
          this.reset()
        }
      }
    },
    methods: {
      // 重置
      reset () {
        this.loading = true
        this.search = ''
        this.list = []
        this.pageNum = 0
        // 延缓1秒再进行查询
        this.debouncedSearch()
      },
      // 触发查找
      handleSearch (e) {
        const search = e.target.value
        this.search = search
        this.loading = true
        this.pageNum = 0
        this.debouncedSearch()
      },
      // 去抖
      debouncedSearch: debounce(function () {
        this.getList()
      }, 1000),
      // 获取标品列表
      getList (pageNum = 1) {
        this.loading = true
        return fetchGetSpList({
          categoryId: this.categoryId,
          name: this.search,
          pagination: {
            current: pageNum,
            pageSize: this.pageSize
          }
        }).then((data) => {
          const { list, pagination: { total } } = data
          if (pageNum === 1) {
            this.list = list || []
          } else {
            this.list = this.list.concat(list)
          }
          this.pageNum = pageNum
          this.loading = false
          this.total = total
        }).catch(err => {
          this.list = []
          this.loading = false
          this.$Message.error(err.message)
        })
      },
      // 无限加载
      handleLoadMore () {
        return this.getList(this.pageNum + 1)
      },
      // 选中商品
      handleSelect (e, product) {
        e.stopPropagation()
        this.$emit('on-select', product)
      }
    }
  }
</script>

<style lang="less" scoped>
  .category-path-sp-list {
    background: #fff;
    margin-left: 0;
    height: 288px;
    width: 240px;
    display: none;
    flex-direction: column;
    align-items: center;
    margin-left: 1px;
    &.active {
      display: flex;
    }
    .product-list {
      flex: 1;
    }
    .product {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      padding: 10px;
      border-bottom: 1px solid @border-color-base;
      .pic {
        width: 60px;
      }
      .detail {
        margin-left: 5px;
        flex: 1;
        font-size: 12px;
        color: @text-tip-color;
        width: 140px;
        .name {
          color: @primary-color;
        }
        span {
          margin-right: 5px;
          word-break: break-all;
        }
      }
    }

    .category-name {
      margin: 5px auto 10px;
      text-align: center;
      font-weight: 500;
    }

    .search-input {
      width: 100%;
      padding: 4px 10px;
    }
    .loading-container {
      text-align: center;
      margin-top: 10px;
    }
  }
</style>
