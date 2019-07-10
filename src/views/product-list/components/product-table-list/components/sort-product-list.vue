<template>
  <Layout>
    <Table
      slot="smart-sort-top"
      :dataSource="productList"
      :columns="columns"
      :pagination="null"
      :loading="loading"
    />
    <Table
      slot="smart-sort-default"
      :dataSource="productList"
      :columns="columns"
      :pagination="null"
      :loading="loading"
    />
  </Layout>
</template>
<script>
import Layout from '@/views/components/product-list/layout/smart-sort'
import Table from '@components/product-list-table'
import ProductInfo from '@components/product-table-info'
import {
  fetchGetProductListOnSorting
} from '@/data/repos/product'

export default {
  name: 'sort-product-list',
  props: {
    tagId: Number
  },
  data () {
    return {
      loading: false,
      productList: [],
      columns: [{
        render (h, row, index) {
          return index + 1
        }
      }, {
        title: '商品信息',
        render: (h, { row }) => {
          return h(ProductInfo, { props: { product: row } })
        }
      }]
    }
  },
  components: {
    Layout,
    Table
  },
  methods: {
    async getData () {
      try {
        this.loading = true
        const { list } = await fetchGetProductListOnSorting({ tagId: this.tagId })
        this.productList = list
      } catch (err) {
        this.$Message.error(err.message || err)
      } finally {
        this.loading = false
      }
    }
  },
  mounted () {
    this.getData()
  }
}
</script>
