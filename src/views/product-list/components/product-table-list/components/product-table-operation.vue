<template>
  <div class="product-table-op-cell" :class="{ disabled: disabled }">
    <span>
      <NamedLink tag="a" class="active" :name="editPage" :query="{spuId: product.id}">编辑</NamedLink>
    </span>
    <span :class="{ disabled: product.isStopSell }">
      <span v-if="product.sellStatus === PRODUCT_SELL_STATUS.OFF" @click="handleChangeStatus(PRODUCT_SELL_STATUS.ON)">上架</span>
      <span v-if="product.sellStatus === PRODUCT_SELL_STATUS.ON" @click="handleChangeStatus(PRODUCT_SELL_STATUS.OFF)">下架</span>
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
  import { defaultTagId } from '@/data/constants/poi'

  export default {
    name: 'product-list-table-operation',
    props: {
      product: {
        type: Object,
        default: () => ({})
      },
      disabled: Boolean,
      tagId: Number
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
        if (this.disabled) {
          return
        }
        this.$emit('change-sell-status', this.product, status)
      },
      async handleDelete () {
        if (this.disabled) {
          return
        }
        if (this.product.tagCount > 1 && this.tagId !== defaultTagId) {
          this.$Modal.confirm({
            title: '删除商品',
            content: '是否确认删除商品',
            okText: '彻底删除商品',
            okType: 'danger',
            cancelText: '仅移出当前分类',
            onOk: () => {
              this.$emit('delete', this.product)
            },
            onCancel: () => {
              this.$emit('delete', this.product, true)
            }
          })
          return
        }
        this.$Modal.confirm({
          title: '删除商品',
          content: '是否确认删除商品',
          onOk: () => {
            this.$emit('delete', this.product)
          }
        })
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
