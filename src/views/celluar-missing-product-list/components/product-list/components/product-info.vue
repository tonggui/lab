<template>
  <Layout>
    <ProductInfoImage
      slot="image"
      :product="product"
      :show-marker="false"
    >
      <template slot="top-left-marker">
        <span v-if="showNoSpMarker" class="celluar-missing-product-info-no-sp-marker">非标品</span>
      </template>
    </ProductInfoImage>
    <template slot="info">
      <ValidateEidtProductName v-if="nameEditable" type="textarea" :autosize="{ minRows: 1 }" :value="product.name" @change="handleChangeName" />
      <div v-else>{{ product.name }}</div>
      <small>{{ description }}</small>
    </template>
  </Layout>
</template>
<script>
  import EditProductName from '@/components/product-name/edit-product-name'
  import ProductInfoImage from '@/components/product-table-info/product-info-image'
  import Layout from '@/components/product-table-info/layout'
  import WrapperValidatePoptip from '@/hoc/withValidatePoptip'

  const ValidateEidtProductName = WrapperValidatePoptip(EditProductName)

  export default {
    name: 'celluar-missing-product-info',
    props: {
      product: {
        type: Object,
        required: true
      },
      nameEditable: Boolean,
      description: String
    },
    data () {
      return {
        error: false,
        name: this.product.name
      }
    },
    computed: {
      showNoSpMarker () {
        return !this.product.isSp
      }
    },
    components: {
      Layout,
      ProductInfoImage,
      ValidateEidtProductName
    },
    methods: {
      handleChangeName (name) {
        this.$emit('change', name, this.product)
      }
    }
  }
</script>
<style lang="less">
  .celluar-missing-product-info-no-sp-marker {
    background: #FFFFFF;
    display: inline-block;
    border: 1px solid #FF8D62;
    border-radius: 1.5px 0 2px 0;
    color: #FF8D62;
    padding: 4px;
    transform: scale(.8);
    transform-origin: 0 0;
    margin-top: -1px;
    margin-left: -1px;
  }
</style>
