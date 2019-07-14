<template>
  <div class="product-table-op" :class="{ disabled: disabled }">
    <span @click="handleEdit">编辑</span>
    <span :class="{ disabled: product.isStopSell }">
      <span v-if="product.sellStatus === PRODUCT_SELL_STATUS.OFF" @click="handleChangeStatus(PRODUCT_SELL_STATUS.ON)">上架</span>
      <span v-if="product.sellStatus === PRODUCT_SELL_STATUS.ON" @click="handleChangeStatus(PRODUCT_SELL_STATUS.OFF)">下架</span>
    </span>
    <span @click="handleDelete">删除</span>
  </div>
</template>
<script>
  import {
    fetchSubmitModProductSellStatus,
    fetchSubmitDeleteProduct
  } from '@/data/repos/merchantProduct'
  import {
    PRODUCT_SELL_STATUS
  } from '@/data/enums/product'

  export default {
    name: 'product-table-operation',
    props: {
      product: {
        type: Object,
        default: () => ({})
      },
      disabled: Boolean,
      index: Number
    },
    computed: {
      PRODUCT_SELL_STATUS () {
        return PRODUCT_SELL_STATUS
      }
    },
    methods: {
      handleEdit () {
        this.$router.push({ name: 'merchantEdit', params: { spuId: this.product.id } })
      },
      async handleChangeStatus (status) {
        const str = status === PRODUCT_SELL_STATUS.ON ? '上架' : '下架'
        try {
          await fetchSubmitModProductSellStatus([this.product.id], status)
          this.$emit('status', status, this.product, this.index)
          this.$Message.success(`${str}成功`)
        } catch (err) {
          this.$Message.error(`${str}失败`)
        }
      },
      async handleDelete () {
        try {
          await fetchSubmitDeleteProduct([this.product.id])
          this.$emit('delete', this.product, this.index)
          this.$Message.success('删除成功')
        } catch (err) {
          this.$Message.error('删除失败')
        }
      }
    }
  }
</script>
<style lang="less" scoped>
.product-table-op {
  display: inline-block;
  text-align: right;
  &,.active {
    color: @link-color;
    font-size: @font-size-base;
  }
  > span {
    &:not(:last-child) {
      margin-right: 20px;
    }
    cursor: pointer;
  }
  .disabled {
    cursor: not-allowed;
    color: @disabled-color;
  }
}
</style>
