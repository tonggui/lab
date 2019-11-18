<template>
  <div><slot :columns="columns"></slot></div>
</template>
<script>
  import { fetchSubmitModProductSkuPrice } from '@/data/repos/merchantProduct'
  import ProductInfo from '@components/product-table-info'
  import ProductPrice from '@components/product-price'
  import AssociatedPoi from '@/views/merchant/components/associated-poi-cell'
  import ProductSkuEdit from '@/views/merchant/components/product-sku-edit'
  import ProductOperation from '@/views/merchant/components/product-table-operation'
  import Tooltip from '@components/tooltip'

  export default {
    name: 'merchant-product-table-columns',
    computed: {
      columns () {
        return [{
          title: '商品信息',
          minWidth: 200,
          align: 'left',
          render: (h, { row }) => {
            return <ProductInfo product={row} showMarker={row.isMerchantDelete} />
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
                felid={2}
                onSubmit={(data) => this.handleEditPrice(row, index, data)}
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
              <AssociatedPoi
                id={row.id}
                vMc={{ bid: 'b_shangou_online_e_t4mnknun_mc' }}
              >
                {row.poiCount}
              </AssociatedPoi>
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
      handleChangeStatus (status, product, index) {
        this.$emit('edit', product, { sellStatus: status }, index)
      },
      handleDelete (...rest) {
        this.$emit('delete', ...rest)
      },
      handleEditStock (product, skuList, index) {
        this.$emit('edit-sku', product, skuList, index)
      },
      async handleEditPrice (product, index, { skuList, poiIdList, isSelectAll }) {
        await fetchSubmitModProductSkuPrice(product, skuList, poiIdList, isSelectAll)
        this.$emit('edit-sku', product, skuList, index)
      }
    }
  }
</script>
