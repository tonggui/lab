<template>
  <div>
    <Layout name="商品" class="smart-sort-product-list">
      <template slot="smart-sort-top">
        <transition-group v-if="topProductList.length > 0" name="list-vertical-animation" class="smart-sort-top-product-list">
          <Item v-for="(item, index) in topProductList" :product="item" :index="index + 1" :key="item.id" :show-marker="productMarkerFilter(product)">
            <div slot="item" class="smart-sort-product-list-op">
              <span v-if="index > 0" class="smart-sort-product-list-icon add" @click.stop="handleForward(item)">
                <Icon local="set-top" size="16" />
                置顶
              </span>
              <span class="smart-sort-product-list-icon remove" @click.stop="handleRemove(item)">
                <Icon local="circle-remove" size="16" />
                移除
              </span>
            </div>
          </Item>
        </transition-group>
        <div v-else class="smart-sort-empty">尚未添加置顶商品</div>
      </template>
      <transition-group name="list-vertical-animation" slot="smart-sort-default" class="smart-sort-default-product-list">
        <Item v-for="(item, index) in defaultProductList" :product="item" :index="index + 1" :key="item.id">
          <div slot="item" class="smart-sort-product-list-op">
            <span class="smart-sort-product-list-icon add" @click.stop="handleAdd(item)">
              <Icon local="add-plus" size="16" />
              添加
            </span>
          </div>
        </Item>
      </transition-group>
    </Layout>
    <Pagination v-if="pagination" :pagination="pagination" class="drag-sort-list-page" @on-change="handlePageChange" />
  </div>
</template>
<script>
  import Layout from '@/views/components/layout/smart-sort'
  import Item from './list-item'
  import lx from '@/common/lx/lxReport'

  export default {
    name: 'smart-sort-product-list',
    props: {
      loading: Boolean,
      dataSource: {
        type: Array,
        default: () => []
      },
      pagination: Object,
      productMarkerFilter: {
        type: Function,
        default: () => true
      }
    },
    computed: {
      topProductList () {
        return this.dataSource.filter(product => product.isSmartSort)
      },
      defaultProductList () {
        return this.dataSource.filter(product => !product.isSmartSort)
      }
    },
    components: {
      Layout,
      Item
    },
    methods: {
      filterTag (item, dataSource) {
        return dataSource.filter(product => product.id !== item.id)
      },
      triggerChange (productList, product, stick = false) {
        // stick代表是否推到第一个
        this.$emit('change', productList, product, { stick })
      },
      handleToggleTop (item, status) {
        const newItem = {
          ...item,
          isSmartSort: status
        }
        let topProductList = this.topProductList
        let defaultProductList = this.defaultProductList

        if (status) {
          defaultProductList = this.filterTag(item, this.defaultProductList)
        } else {
          topProductList = this.filterTag(item, this.topProductList)
        }
        const list = [...topProductList, newItem, ...defaultProductList]
        return this.triggerChange(list, newItem)
      },
      handleAdd (item) {
        lx.mc({ bid: 'b_shangou_online_e_o5rqwb3j_mc', val: { type: 1 } })
        this.handleToggleTop(item, true)
      },
      handleRemove (item) {
        lx.mc({ bid: 'b_shangou_online_e_o5rqwb3j_mc', val: { type: 2 } })
        this.handleToggleTop(item, false)
      },
      handleForward (item) {
        lx.mc({ bid: 'b_shangou_online_e_o5rqwb3j_mc', val: { type: 0 } })
        const list = this.filterTag(item, this.dataSource)
        list.unshift(item)
        return this.triggerChange(list, item, true)
      },
      handlePageChange (page) {
        this.$emit('page-change', page)
      }
    }
  }
</script>
<style lang="less">
  @import '~@/styles/common.less';
  .smart-sort-product-list {
    &-icon {
      .smart-sort-icon
    }
    &-op {
      text-align: right;
    }
  }
  .smart-sort-default-product-list,
  .smart-sort-top-product-list {
    display: table;
    width: 100%;
  }
</style>
