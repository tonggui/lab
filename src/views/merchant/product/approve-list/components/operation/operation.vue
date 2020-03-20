<template>
  <div class="approve-list-operation">
    <span v-mc="{ bid: 'b_shangou_online_e_jpkf5kdl_mc' }" class="approve-list-operation-item" @click="handleInclude">收录</span>
    <ProductDelete @submit="handleDelete" :product="product" :with-poi-select="false" v-mc="{ bid: 'b_shangou_online_e_r5jtsq67_mc', val: { spu_id: product.id } }">
      <span class="approve-list-operation-item" style="margin-right: 0">删除</span>
    </ProductDelete>
  </div>
</template>
<script>
  import ProductDelete from '@/views/merchant/components/product-delete'

  export default {
    name: 'approve-list-operation',
    props: {
      product: {
        type: Object,
        required: true
      },
      createCallback: {
        type: Function,
        default: success => success
      }
    },
    components: {
      ProductDelete
    },
    methods: {
      handleInclude () {
        return new Promise((resolve, reject) => {
          this.$emit('include', this.product, this.createCallback(resolve, reject))
        })
      },
      handleDelete ({ isMerchantDelete, isSelectAll }) {
        return new Promise((resolve, reject) => {
          this.$emit('delete', this.product, { isMerchant: isMerchantDelete, isSelectAll }, this.createCallback(resolve, reject))
        })
      }
    }
  }
</script>
<style lang="less" scoped>
.approve-list-operation {
  display: inline-block;
  text-align: right;
  &,.active {
    color: @link-color;
    font-size: @font-size-base;
  }
  &-item {
    text-decoration: underline;
    margin-right: 20px;
    cursor: pointer;
  }
}
</style>
