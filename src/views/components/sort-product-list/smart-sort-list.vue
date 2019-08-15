<template>
  <Layout name="商品" class="smart-sort-product-list">
    <div slot="smart-sort-top">
      <Item v-for="(product, index) in topProductList" :product="product" :index="index + 1" :key="product.id">
        <div slot="item">
          <span v-if="index > 0" class="smart-sort-product-list-icon add" @click.stop="handleForward(item)">
            <Icon type="vertical-align-top" size=14 />
          </span>
          <span class="smart-sort-product-list-icon remove" @click.stop="handleRemove(item)">
            <Icon type="minus" size=12 />
          </span>
        </div>
      </Item>
    </div>
    <div slot="smart-sort-default">
      <Item v-for="(product, index) in defaultProductList" :product="product" :index="index + 1" :key="product.id">
        <div slot="item">
          <span v-if="item.level === 0" class="smart-sort-product-list-icon add" :class="{disabled: overLimit}" @click.stop="handleAdd(item)">
            <Icon type="add" size=12 />
          </span>
        </div>
      </Item>
    </div>
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
        return this.dataSource.filter(tag => tag.id !== item.id)
      },
      handleToggleTop (item, status) {
        const list = this.filterTag(item)
        list.push({
          ...item,
          isSmartSort: status
        })
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
    display: table;
    width: 100%;
    &-icon {
      .smart-sort-icon
    }
  }
</style>
