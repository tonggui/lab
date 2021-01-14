<template>
  <div><slot :columns="columns"></slot></div>
</template>
<script>
  import { SKU_EDIT_TYPE, PRODUCT_AUDIT_STATUS } from '@/data/enums/product'
  // import { PRODUCT_AUDIT_STATUS } from '@/data/enums/product'
  import ProductInfoImage from './product-info-image'
  // import ProductPrice from '@components/product-price'
  // import ProductSkuEdit from '@/views/merchant/components/product-sku-edit'
  import ProductSkuEdit, { FELID } from './product-sku-edit'
  import Operation from './product-table-operation'
  import withPromiseEmit from '@/hoc/withPromiseEmit'

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
                  {row.medicineTypeName !== '其他' && (<span class="otc-marker">{row.medicineTypeName}</span>)}
                </template>

                {/* <template slot="bottom-marker">
                  {
                    row.id ? (
                      <span class="recommend-product-info-bottom-marker">已存在</span>
                      ) : (
                      row.isDelete && (
                        <span class="recommend-product-info-bottom-marker delete">已删除</span>)
                      )
                   } : <span/>
                </template> */}
              </ProductInfoImage>
            )
          }
        }, {
          title: '商品名称/编码',
          maxWidth: 180,
          minWidth: 120,
          align: 'left',
          render: (h, { row, index }) => {
            return (<Tooltip content="Top Center text" placement="top" width="225" transfer={true} zIndex={9800}>
                      <p class="ellipsis">{row.name}</p>
                      <p>{row.sourceFoodCode}</p>
                      { row.isMedicare ? <p class="medicare-marker">医保商品</p> : null}
                      <div slot="content">
                          <p>{row.name}</p>
                          <p>{row.sourceFoodCode}</p>
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
                      <p class="ellipsis">{row.wmPoiName}</p>
                      <p>{row.wmPoiId}</p>
                      <div slot="content">
                          <p>{row.wmPoiName}</p>
                          <p>{row.wmPoiId}</p>
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
                // skuList={row.skuList}
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
            // const scopedSlots = {
            //   display: ({ skuList }) => <ProductPrice price={skuList.map(sku => sku.price.value)} />
            // }
            return (
              <ProductSkuEdit
                product={row}
                // skuList={row.skuList}
                felid={FELID.STOCK}
                onChange={this.handleChangeStock}
                // scopedSlots={scopedSlots}
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
      triggerEditSku (product, type, params, callback) {
        // console.log(callback)
        this.$emit('edit-sku', product, type, params, callback)
      },
      handleEditPrice (product, skuList, { poiIdList, isSelectAll }) {
        return this.triggerEditSku(product, skuList, SKU_EDIT_TYPE.PRICE, { poiIdList, isSelectAll })
      },
      handleEditStock (product, skuList, { poiIdList, isSelectAll }) {
        return this.triggerEditSku(product, skuList, SKU_EDIT_TYPE.STOCK, { poiIdList, isSelectAll })
      },
      // 点击价格√执行到这
      handleChangePrice (product, price, callback) {
        // console.log(product, sku, price, callback)
        this.triggerEditSku(product, 'price', { price }, callback)
      },
      handleChangeStock (product, stock, callback) {
        this.triggerEditSku(product, 'stock', { stock }, callback)
      },
      handleRefresh () {
        this.$emit('refresh')
      },
      handleChangeStatus (product, sellStatus, packageConfirmFlag, callback) {
        return new Promise((resolve, reject) => {
          this.$emit('edit-product', product, sellStatus, packageConfirmFlag, callback, this.createCallback(resolve, reject))
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
  /deep/ .ellipsis{
    width: 100%;
    display: -webkit-box;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
</style>
