<template>
  <div>
    <HeaderBar :module-map="moduleMap" />
  </div>
</template>
<script>
  import HeaderBar from '@/components/header-bar'

  export default {
    name: 'merchant-product-list-header',
    data () {
      return {
        moduleMap: {
          createProduct: {
            show: true,
            link: '/merchant/product/edit'
          },
          unApproveProduct: true,
          taskProgress: true
        }
      }
    },
    components: {
      HeaderBar
    }
  }
</script>
