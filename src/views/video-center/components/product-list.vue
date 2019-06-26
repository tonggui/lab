<template>
  <div class="video-relate-product-list" :class="{ 'has-paging': hasPaging }">
    <product
      :disabled="disabled"
      v-for="item in list"
      :key="item.id"
      :data="item"
      :selected="selectedIds.includes(item.id)"
      @select="$listeners.select"
      >
    </product>
    <div class="paging" v-show="hasPaging">
      <span style="margin-right: 10px">共 {{ total }} 个商品 </span>
      <Page :current="pageNum" :total="total" :page-size="pageSize" size="small" @on-change="handlePageChange" />
    </div>
  </div>
</template>

<script>
import Product from './product'
import { MAX_RELATED_COUNT } from '../constant'

export default {
  name: 'video-relate-product-list',
  components: { Product },
  props: {
    list: {
      type: Array,
      default () {
        return []
      }
    },
    selectedIds: {
      type: Array,
      default () {
        return []
      }
    },
    pageNum: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 20
    },
    total: {
      type: Number,
      default: 0
    }
  },
  computed: {
    hasPaging () {
      return this.total > this.list.length
    },
    disabled () {
      return this.selectedIds.length >= MAX_RELATED_COUNT
    }
  },
  methods: {
    handlePageChange (page) {
      this.$emit('pageChange', page)
    }
  }
}
</script>

<style lang="less" scoped>
.video-relate-product-list {
  @pagingHeight: 45px;
  padding: 0;
  font-size: 12px;
  &.has-paging {
    padding-bottom: @pagingHeight;
  }
  .paging {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    height: @pagingHeight;
    left: 0;
    bottom: 0;
    width: 100%;
    background: #fff;
    border-top: 1px solid @color-gray2;
    line-height: 1.5;
  }
}
</style>
