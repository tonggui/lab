<template>
  <div>
    <ChooseProduct
      supportProductLibrary
      :selectedSp="selectedSp"
      @showSpListModal="spListModalShowHandle"
      @on-select-product="setSp"
      @delete-all-data="handleDelete"
    />
    <SpListModal
      v-model="spListModalShow"
      :userInput="spSearchKeyword"
      :showTopSale="false"
      defaultSelectedTab="all"
      outsideMode
      @on-select-product="setSp"
    />
  </div>
</template>
<script>
  import ChooseProduct from '@/views/medicine/merchant/components/choose-product'
  import SpListModal from '@/views/components/sp-list/sp-list-modal'
  import convertStandardProduct from '@/views/components/configurable-form/helper/convertStandardProduct'

  export default {
    components: { ChooseProduct, SpListModal },
    data () {
      return {
        spListModalShow: false,
        spSearchKeyword: '',
        selectedSp: null
      }
    },
    methods: {
      setSp (data) {
        const sp = convertStandardProduct(data)
        this.spListModalShow = false
        this.selectedSp = sp
        this.$emit('on-select-product', sp)
      },
      handleDelete () {
        this.$emit('on-delete')
      },
      spListModalShowHandle (keyword = '') {
        this.spListModalShow = true
        this.spSearchKeyword = keyword
      }
    }
  }
</script>
