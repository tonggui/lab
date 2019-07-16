<template>
  <Layout name="商品">
    <div slot="smart-sort-top">
      <Item v-for="product in topProductList" :product="product" :index="index + 1" :key="product.id">
        <div slot="item">
          <span>移除</span>
        </div>
      </Item>
    </div>
    <div slot="smart-sort-default">
      <Item v-for="product in defaultProductList" :product="product" :index="startIndex + index" :key="product.id">
        <div slot="item">
        <span>添加</span>
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
      dataSource: Array,
      pagination: Object
    },
    computed: {
      startIndex () {
        const { pageSize, current } = this.pagination
        return (current - 1) * pageSize + 1
      }
    },
    components: {
      Layout,
      Item
    },
    methods: {
    }
  }
</script>
