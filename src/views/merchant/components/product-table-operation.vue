<template>
  <div class="product-table-op" :class="{ disabled: disabled }">
    <span @click="handleEdit" v-mc="{bid: 'b_sfkii6px'}">编辑</span>
    <span :class="{ disabled: product.isStopSell }">
      <span v-if="product.sellStatus === PRODUCT_SELL_STATUS.OFF" @click="handleChangeStatus(PRODUCT_SELL_STATUS.ON)" v-mc="{ bid: 'b_yo8d391g', val: { type: 1 } }">上架</span>
      <span v-if="product.sellStatus === PRODUCT_SELL_STATUS.ON" @click="handleChangeStatus(PRODUCT_SELL_STATUS.OFF)" v-mc="{ bid: 'b_yo8d391g', val: { type: 0 } }">下架</span>
    </span>
    <span @click="handleDelete" v-mc="{ bid: 'b_ugst7wnh' }">删除</span>
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
        this.$router.push({ name: 'merchantEdit', query: { spuId: this.product.id } })
      },
      async handleChangeStatus (status) {
        const str = status === PRODUCT_SELL_STATUS.ON ? '上架' : '下架'
        this.$Modal.confirm({
          title: '提示',
          content: `同时${str}所有已关联门店的该商品，是否确认${str}？`,
          onOk: async () => {
            try {
              await fetchSubmitModProductSellStatus([this.product.id], status)
              this.$emit('status', status, this.product, this.index)
              this.$Message.success(`${str}成功`)
            } catch (err) {
              this.$Message.error(`${str}失败`)
            }
          }
        })
      },
      async handleDelete () {
        this.$Modal.confirm({
          title: '提示',
          content: '该操作会导致所有已关联门店的商品均被删除，是否确认删除？',
          onOk: async () => {
            try {
              await fetchSubmitDeleteProduct([this.product.id])
              this.$emit('delete', this.product, this.index)
              this.$Message.success('删除成功')
            } catch (err) {
              this.$Message.error('删除失败')
            }
          }
        })
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
