<template>
  <div class="false-price-product-infos">
    <VioProductInfos
      :pic="rowData.picture_url"
      :extraTextUp="rowData.sku_name"
      :extraTextDown="extraTextDown"
    />
  </div>
</template>

<script>
  import VioProductInfos from './vio-product-infos'

  export default {
    name: 'false-price-product-infos',
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
        return `${this.rowData.tag_name} | 规格ID ${this.rowData.sku_id}`
      }
    }
  }
</script>

<style lang='less' scoped>
.false-price-product-infos {}
</style>
