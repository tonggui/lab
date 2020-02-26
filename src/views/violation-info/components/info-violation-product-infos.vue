<template>
  <div class="info-violation-product-infos">
    <VioProductInfos
      :pic="rowData.productPicUrl"
      :extraTextUp="rowData.productName"
      :extraTextDown="extraTextDown"
    />
  </div>
</template>

<script>
  import VioProductInfos from './vio-product-infos'

  export default {
    name: 'info-violation-product-infos',
    components: {
      VioProductInfos
    },
    props: {
      rowData: { // 列表中的单条数据
        type: Object,
        required: true
      }
    },
    data () {
      return {}
    },
    computed: {
      extraTextDown () {
        return `${this.rowData.productTagName} | 商品ID ${this.rowData.spuId}`
      }
    }
  }
</script>

<style lang='less' scoped>
.info-violation-product-infos {}
</style>
