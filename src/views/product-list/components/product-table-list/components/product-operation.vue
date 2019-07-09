<template>
  <div class="product-table-op-cell" :class="{ disabled: disabled }">
    <span>
      <NamedLink tag="a" class="active" :name="editPage" :query="{spuId: product.id}">编辑</NamedLink>
    </span>
    <span :class="{ disabled: product.isStopSell }">
      <template v-if="product.sellStatus === PRODUCT_SELL_STATUS.ON" @click="handleChangeStatus(PRODUCT_SELL_STATUS.ON)">上架</template>
      <template v-if="product.sellStatus === PRODUCT_SELL_STATUS.OFF" @click="handleChangeStatus(PRODUCT_SELL_STATUS.OFF)">下架</template>
    </span>
    <span @click="handleDelete">删除</span>
  </div>
</template>
<script>
import NamedLink from '@/components/link/named-link'
import editPage from '@sgfe/eproduct/navigator/pages/product/edit'
import {
  PRODUCT_SELL_STATUS
} from '@/data/enums/product'
// import {
//   fetchSubmitModProduct,
//   fetchSubmitDeleteProduct,
//   fetchSubmitDeleteProductTagById
// } from '@/data/repos/product'

export default {
  name: 'product-table-operation-cell',
  props: {
    product: {
      type: Object,
      default: () => ({})
    },
    disabled: Boolean
  },
  computed: {
    editPage () {
      return editPage.name
    },
    PRODUCT_SELL_STATUS () {
      return PRODUCT_SELL_STATUS
    }
  },
  methods: {
    async handleChangeStatus (status) {
      // if (this.disabled) {
      //   return
      // }
      // try {
      //   await fetchSubmitModProduct({

      //   }, {
      //     type: 'sellStatus',
      //     value: status
      //   })
      // }
    },
    async handleDelete () {
      // if (this.disabled) {
      //   return
      // }
    }
  },
  components: {
    NamedLink
  }
}
</script>
<style lang="less" scoped>
.product-table-op-cell {
  &,.active {
    color: @link-color;
    font-size: @font-size-base;
  }
  > span {
    margin-right: 20px;
    cursor: pointer;
  }
  .disabled {
    cursor: not-allowed;
    color: @disabled-color;
  }
}
</style>
