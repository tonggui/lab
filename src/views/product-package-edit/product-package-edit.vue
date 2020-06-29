<template>
  <div>
    <div>新建组合商品</div>
    <ProductPackageForm
      :modules="modules"
    />
  </div>
</template>

<script>
  import ProductPackageForm from './components/form/form'
  export default {
    name: 'ProductPackageEdit',
    components: {
      ProductPackageForm
    },
    data () {
      return {
        modules: {
          maxTagCount: 1,
          productVideo: true,
          limitSale: true,
          sellTime: true,
          description: true,
          picContent: true
        }
      }
    }
  }
</script>

<style scoped>

</style>
