<template>
  <component :is="component" :tagId="tagId"></component>
</template>
<script>
  import SortProductList from './components/sort-product-list'
  import ManageProductList from './components/manage-product-list'

  export default {
    name: 'product-list-container',
    props: {
      tagId: {
        type: Number,
        required: true
      },
      sorting: Boolean
    },
    computed: {
      component () {
        return this.sorting ? SortProductList : ManageProductList
      }
    }
  }
</script>
