<template>
  <div><slot :columns="columns"></slot></div>
</template>
<script>
  import { SKU_EDIT_TYPE } from '@/data/enums/product'
  import ProductInfo from '@components/product-table-info'
  import ProductPrice from '@components/product-price'
  import AssociatedPoi from '@/views/merchant/components/associated-poi-cell'
  import ProductSkuEdit from '@/views/merchant/components/product-sku-edit'
  import Operation from './product-table-operation'
  import Tooltip from '@components/tooltip'
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
          title: '商品信息',
          minWidth: 200,
          align: 'left',
          render: (h, { row }) => {
            return <ProductInfo product={row} showMarker={row.isMerchantDelete || row.isMissingInfo} />
          }
        }, {
          title: '价格',
          maxWidth: 180,
          minWidth: 120,
          align: 'right',
          renderHeader: (h, { column }) => {
            return (
              <span style="margin-right: 20px">
                { column.title }
              </span>
            )
          },
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
          title: '关联门店数',
          width: 150,
          align: 'center',
          renderHeader: (h, { column }) => {
            return (
              <Tooltip
                disabled={true} // 优化 - 取消此提示
                type="guide"
                content="有此商品的分店数量，点击数字可查看门店详情"
                placement="top"
                transfer
                width={200}
                keyName="TABLE_HEADER_REL_POI_TIP"
              >
                { column.title }
              </Tooltip>
            )
          },
          render: (h, { row }) => {
            return (
              <div class="associatedPoi">
                <AssociatedPoi
                  id={row.id}
                  vMc={{ bid: 'b_shangou_online_e_t4mnknun_mc' }}
                >
                  {row.poiCount}
                </AssociatedPoi>
              </div>
            )
          }
        }, {
          title: '操作',
          width: 240,
          align: 'right',
          render: (h, { row, index }) => {
            return <ProductOperation index={index} product={row} onStatus={this.handleChangeStatus} onDelete={this.handleDelete} vOn:edit-stock={this.handleEditStock} />
          },
          renderHeader: (h, { column }) => {
            return <div style={{ marginRight: '98px' }}>{ column.title }</div>
          }
        }]
      }
    },
    methods: {
      triggerEditSku (product, skuList, type, params) {
        return new Promise((resolve, reject) => {
          this.$emit('edit-sku', product, skuList, type, params, this.createCallback(resolve, reject))
        })
      },
      handleEditPrice (product, skuList, { poiIdList, isSelectAll }) {
        return this.triggerEditSku(product, skuList, SKU_EDIT_TYPE.PRICE, { poiIdList, isSelectAll })
      },
      handleEditStock (product, skuList, { poiIdList, isSelectAll }) {
        return this.triggerEditSku(product, skuList, SKU_EDIT_TYPE.STOCK, { poiIdList, isSelectAll })
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
