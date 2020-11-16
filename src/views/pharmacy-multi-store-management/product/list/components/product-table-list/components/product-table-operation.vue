<template>
  <div class="product-table-op" :class="{ disabled: disabled }">
    <span class="product-table-op-item" @click="handleEdit" v-mc="{bid: 'b_shangou_online_e_bml1rroi_mc'}">编辑</span>
    <span :class="{ disabled: product.isStopSell }" class="product-table-op-item">
      <span v-if="product.sellStatus === PRODUCT_SELL_STATUS.OFF" @click="handleChangeStatus(PRODUCT_SELL_STATUS.ON)" v-mc="{ bid: 'b_shangou_online_e_ko5l88qy_mc'}">上架</span>
      <span v-if="product.sellStatus === PRODUCT_SELL_STATUS.ON" @click="handleChangeStatus(PRODUCT_SELL_STATUS.OFF)" v-mc="{ bid: 'b_shangou_online_e_ko5l88qy_mc'}">下架</span>
    </span>
    <ProductDelete v-mc="{ bid: 'b_shangou_online_e_s3oavqv6_mc' }" @submit="handleDelete" :product="product">
      <span class="product-table-op-item" style="margin-right: 0">删除</span>
    </ProductDelete>
  </div>
</template>
<script>
  import {
    PRODUCT_SELL_STATUS,
    PRODUCT_TYPE
  } from '@/data/enums/product'
  import ProductDelete from './product-delete'
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
      // ProductSkuEdit,
      ProductDelete
    },
    methods: {
      handleEdit () {
        let { spuId, wmPoiId, combination } = this.product
        // 延迟30ms 埋点上报
        setTimeout(() => {
          if (combination === PRODUCT_TYPE.PACKAGE) {
            this.$router.push({ name: 'productPackageEdit', query: { spuId, wmPoiId } }, () => {}, () => {})
          } else {
            this.$router.push({ name: 'medicineEdit', query: { spuId, wmPoiId } }, () => {}, () => {})
          }
        }, 30)
      },
      async handleChangeStatus (status) {
        const str = status === PRODUCT_SELL_STATUS.ON ? '上架' : '下架'
        this.$Modal.open({
          width: 420,
          title: `${str}商品`,
          render: () => <div style="text-align: center">确认{str} {this.product.wmPoiName} "{this.product.name}"？</div>,
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
      handleDelete (product, packageConfirmFlag, callback) {
        // console.log(product, packageConfirmFlag, callback)
        this.$emit('delete', product, packageConfirmFlag, callback)
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
    // text-decoration: underline;
    margin-right: 20px;
    cursor: pointer;
  }
  .disabled {
    cursor: not-allowed;
    color: @disabled-color;
  }
  .delete-operation{
    color: @color-gray2;
  }
}
</style>
