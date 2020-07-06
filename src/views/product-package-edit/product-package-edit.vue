<template>
  <div>
    <div>新建组合商品</div>
    <Button @click="visible = !visible">trigger</Button>
    <ProductPackageForm
      :modules="modules"
    />
    <PorductList v-model="visible" @on-ok="handleOk" @on-cancel="visible = false" :selectedProductList="selectedProductList" />
  </div>
</template>

<script>
  import PorductList from './container/product-list'
  import ProductPackageForm from './components/form/form'

  export default {
    name: 'ProductPackageEdit',
    components: {
      ProductPackageForm,
      PorductList
    },
    data () {
      return {
        visible: false,
        selectedProductList: [],
        modules: {
          maxTagCount: 1,
          productVideo: true,
          limitSale: true,
          sellTime: true,
          description: true,
          picContent: true
        }
      }
    },
    methods: {
      handleOk (items) {
        console.log(items)
        this.visible = false
        this.selectedProductList = [...items]
      }
    }
  }
</script>

<style scoped>

</style>
