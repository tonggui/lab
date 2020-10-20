<template>
  <div><slot :columns="columns"></slot></div>
</template>
<script>
  import { SKU_EDIT_TYPE, PRODUCT_AUDIT_STATUS } from '@/data/enums/product'
  // import { PRODUCT_AUDIT_STATUS } from '@/data/enums/product'
  import ProductInfoImage from '@/components/product-table-info/product-info-image'
  import ProductPrice from '@components/product-price'
  import Operation from './product-table-operation'
  import withPromiseEmit from '@/hoc/withPromiseEmit'
  import ProductSkuEdit, { FELID } from './product-sku-edit'

  const ProductOperation = withPromiseEmit(Operation)

  export default {
    name: 'merchant-product-table-columns',
    props: {
      createCallback: {
        type: Function,
        default: (success) => success
      }
    },
    computed: {
      columns () {
        return [{
          title: '商品图片',
          width: 84,
          align: 'left',
          render: (h, { row }) => {
            return (
              <ProductInfoImage
              slot="image"
              product={row}
              class="recommend-product-info-image"
              >
                <template slot="top-left-marker">
                  {row.isOTC && (<span class="otc-marker">OTC</span>)}
                  {row.isPrescription && (<span class="otc-marker">处方药</span>)}
                </template>
                <template slot="bottom-marker">
                  {
                    row.id ? (
                      <span class="recommend-product-info-bottom-marker">已存在</span>
                      ) : (
                      row.isDelete && (
                        <span class="recommend-product-info-bottom-marker delete">已删除</span>)
                      )
                   } : <span/>
                </template>
              </ProductInfoImage>
            )
          }
        }, {
          title: '商品名称/编码',
          maxWidth: 180,
          minWidth: 120,
          align: 'left',
          render: (h, { row, index }) => {
            console.log(row)
            return (<Tooltip content="Top Center text" placement="top" width="225" transfer={true} zIndex={9800}>
                      <span class="ellipsis">{row.name || row.sourceFoodCode}</span>
                      <div slot="content">
                          <p>{row.name}</p>
                          <p>{1 || row.sourceFoodCode}</p>
                      </div>
                    </Tooltip>)
          }
        }, {
          title: '门店名称/编码',
          maxWidth: 180,
          minWidth: 120,
          align: 'left',
          render: (h, { row, index }) => {
            return (<Tooltip content="Top Center text" placement="top" width="225" transfer={true} zIndex={1000}>
                      <span class="ellipsis">{row.wmPoiName || row.wmPoiId}</span>
                      <div slot="content">
                          <p>{row.name}</p>
                          <p>{1 || row.sourceFoodCode}</p>
                      </div>
                    </Tooltip>)
          }
        }, {
          title: '商家分类',
          maxWidth: 180,
          minWidth: 120,
          align: 'left',
          render: (h, { row, index }) => {
            return (<span>{row.tagName}</span>)
          }
        }, {
          title: '药品类型',
          maxWidth: 180,
          minWidth: 120,
          align: 'left',
          render: (h, { row, index }) => {
            return (<span>{row.medicineTypeName}</span>)
          }
        }, {
          title: '价格',
          maxWidth: 180,
          minWidth: 120,
          align: 'left',
          render: (h, { row }) => {
            return (
              <ProductSkuEdit
                felid={FELID.PRICE}
                skuList={row.skuList}
                product={row}
                onChange={this.handleChangePrice}
                vOn:done={this.handleRefresh}
              />
            )
          }
        }, {
          title: '库存',
          maxWidth: 180,
          minWidth: 120,
          align: 'left',
          render: (h, { row, index }) => {
            const scopedSlots = {
              display: ({ skuList }) => <ProductPrice price={skuList.map(sku => sku.price.value)} />
            }
            return (
              <ProductSkuEdit
                product={row}
                skuList={row.skuList}
                felid={SKU_EDIT_TYPE.PRICE}
                onSubmit={this.handleEditPrice}
                scopedSlots={scopedSlots}
                v-mc={{ bid: 'b_shangou_online_e_0aplspa7_mc', val: { spu_id: row.id } }}
              />
            )
          }
        }, {
          title: '操作',
          width: 240,
          align: 'left',
          render: (h, { row, index }) => {
            return <ProductOperation index={index} product={row} onStatus={this.handleChangeStatus} onDelete={this.handleDelete} vOn:edit-stock={this.handleEditStock} />
          }
        }]
      }
    },
    methods: {
      getProductAudit (product) {
        return [PRODUCT_AUDIT_STATUS.AUDIT_REJECTED, PRODUCT_AUDIT_STATUS.AUDITING].includes(product.auditStatus)
      },
      // triggerEditSku (product, skuList, type, params) {
      //   return new Promise((resolve, reject) => {
      //     this.$emit('edit-sku', product, skuList, type, params, this.createCallback(resolve, reject))
      //   })
      // },
      triggerEditSku (product, sku, params, callback) {
        this.$emit('edit-sku', product, sku, params, callback)
      },
      handleEditPrice (product, skuList, { poiIdList, isSelectAll }) {
        return this.triggerEditSku(product, skuList, SKU_EDIT_TYPE.PRICE, { poiIdList, isSelectAll })
      },
      handleEditStock (product, skuList, { poiIdList, isSelectAll }) {
        return this.triggerEditSku(product, skuList, SKU_EDIT_TYPE.STOCK, { poiIdList, isSelectAll })
      },
      handleChangePrice (product, sku, price, callback) {
        console.log(product, sku, price, callback)
        this.triggerEditSku(product, sku, { price: { ...sku.price, value: price } }, callback)
      },
      handleChangeStock (product, sku, stock, callback) {
        this.triggerEditSku(product, sku, { stock }, callback)
      },
      handleRefresh () {
        this.$emit('refresh')
      },
      handleChangeStatus (product, sellStatus) {
        return new Promise((resolve, reject) => {
          this.$emit('edit-product', product, { sellStatus }, this.createCallback(resolve, reject))
        })
      },
      handleDelete (product, { isMerchantDelete, isSelectAll, poiIdList }) {
        return new Promise((resolve, reject) => {
          this.$emit('delete', product, { isMerchantDelete, isSelectAll, poiIdList }, this.createCallback(resolve, reject))
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  /deep/ .ellipsis{
    width: 100%;
    display: -webkit-box;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
</style>
