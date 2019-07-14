<template>
  <Layout name="商品">
    <Table
      slot="smart-sort-top"
      :dataSource="topProductList"
      :columns="columns"
      :pagination="null"
      :loading="loading"
    />
    <Table
      slot="smart-sort-default"
      :dataSource="defaultProductList"
      :columns="columns"
      :pagination="pagination"
      :loading="loading"
    />
  </Layout>
</template>
<script>
  import Layout from '@/views/components/layout/smart-sort'
  import Table from '@components/product-list-table'
  import columns from './columns'

  export default {
    name: 'smart-sort-product-list',
    props: {
      loading: Boolean,
      dataSource: Array,
      pagination: Object
    },
    computed: {
      columns () {
        return [...columns]
      }
    },
    components: {
      Layout,
      Table
    },
    methods: {
    }
  }
</script>
