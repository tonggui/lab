<template>
  <Layout name="商品" class="smart-sort-product-list">
    <template slot="smart-sort-top">
      <transition-group v-if="topProductList.length > 0" name="list-vertical-animation" class="smart-sort-top-product-list">
        <Item v-for="(item, index) in topProductList" :product="item" :index="index + 1" :key="item.id">
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
</template>
<script>
  import Layout from '@/views/components/layout/smart-sort'
  import Item from './list-item'

  export default {
    name: 'smart-sort-product-list',
    props: {
      loading: Boolean,
      dataSource: {
        type: Array,
        default: () => []
      },
      pagination: Object
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
      filterTag (item) {
        return this.dataSource.filter(product => product.id !== item.id)
      },
      handleToggleTop (item, status) {
        const list = this.filterTag(item)
        const newItem = {
          ...item,
          isSmartSort: status
        }
        if (status) {
          list.push(newItem)
        } else {
          list.unshift(newItem)
        }
        return this.$emit('change', list)
      },
      handleAdd (item) {
        this.handleToggleTop(item, true)
      },
      handleRemove (item) {
        this.handleToggleTop(item, false)
      },
      handleForward (item) {
        const list = this.filterTag(item)
        list.unshift(item)
        return this.$emit('change', list)
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
