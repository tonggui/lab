<template>
  <div class="product-table-op" :class="{ disabled: disabled }">
    <span v-if="!isMedicine" class="product-table-op-item" @click="handleEdit" v-mc="{bid: 'b_sfkii6px'}">编辑</span>
    <span>
      <ProductSkuEdit
        :product="product"
        :sku-list="product.skuList"
        :felid="1"
        :need-edit-icon="false"
        @submit="handleEditStock"
        v-mc="{ bid: 'b_shangou_online_e_q6b5zwwy_mc', val: { spu_id: product.id } }"
      >
        <span slot="display" class="product-table-op-item">设置库存</span>
      </ProductSkuEdit>
    </span>
    <span :class="{ disabled: product.isStopSell }" class="product-table-op-item">
      <span v-if="product.sellStatus === PRODUCT_SELL_STATUS.OFF" @click="handleChangeStatus(PRODUCT_SELL_STATUS.ON)" v-mc="{ bid: 'b_yo8d391g', val: { type: 1 } }">上架</span>
      <span v-if="product.sellStatus === PRODUCT_SELL_STATUS.ON" @click="handleChangeStatus(PRODUCT_SELL_STATUS.OFF)" v-mc="{ bid: 'b_yo8d391g', val: { type: 0 } }">下架</span>
    </span>
    <ProductDelete v-mc="{ bid: 'b_ugst7wnh' }" @submit="handleDelete" :product="product">
      <span class="product-table-op-item" style="margin-right: 0">删除</span>
    </ProductDelete>
  </div>
</template>
<script>
  import {
    PRODUCT_SELL_STATUS
  } from '@/data/enums/product'
  import ProductSkuEdit from '@/views/merchant/components/product-sku-edit'
  import ProductDelete from '@/views/merchant/components/product-delete'
  // TODO 药品兼容 后期优化
  import { mapModule } from '@/module/module-manage/vue'
  import { BUSINESS_MEDICINE } from '@/module/moduleTypes'

  export default {
    name: 'product-table-operation',
    props: {
      product: {
        type: Object,
        default: () => ({})
      },
      disabled: Boolean,
      index: Number,
      createCallback: {
        type: Function,
        default: (success) => success
      }
    },
    computed: {
      ...mapModule({
        isMedicine: BUSINESS_MEDICINE
      }),
      PRODUCT_SELL_STATUS () {
        return PRODUCT_SELL_STATUS
      }
    },
    components: {
      ProductSkuEdit,
      ProductDelete
    },
    methods: {
      handleEdit () {
        // 延迟30ms 埋点上报
        setTimeout(() => {
          this.$router.push({ name: 'merchantEdit', query: { spuId: this.product.id } })
        }, 30)
      },
      async handleChangeStatus (status) {
        const str = status === PRODUCT_SELL_STATUS.ON ? '上架' : '下架'
        this.$Modal.open({
          width: 420,
          title: `${str}商品`,
          render: () => <div style="text-align: center">同时{str}所有已关联门店的该商品，是否确认{str}？</div>,
          closable: false,
          maskClosable: false,
          centerLayout: true,
          onOk: async () => {
            this.$emit('status', this.product, status, this.createCallback(() => {
              this.$Message.success(`${str}成功`)
            }, (err) => {
              this.$Message.error(err.message || `${str}失败`)
            }))
          }
        })
      },
      handleDelete ({ isMerchantDelete, isSelectAll, poiIdList }) {
        return new Promise((resolve, reject) => {
          this.$emit('delete', this.product, { isMerchantDelete, isSelectAll, poiIdList }, this.createCallback(resolve, reject))
        })
      },
      handleEditStock (product, skuList, { poiIdList, isSelectAll }) {
        return new Promise((resolve, reject) => {
          this.$emit('edit-stock', product, skuList, { poiIdList, isSelectAll }, this.createCallback(resolve, reject))
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
  &-item {
    text-decoration: underline;
    margin-right: 20px;
    cursor: pointer;
  }
  .disabled {
    cursor: not-allowed;
    color: @disabled-color;
  }
}
</style>
