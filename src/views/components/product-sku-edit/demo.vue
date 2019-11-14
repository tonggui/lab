<template>
  <div>
    <ProductSkuEdit
      :product="product"
      :sku-list="skuList"
      :felid="2"
      @submit="handleSubmit"
      @done="handleRefresh"
    >
      <template v-slot:display="{ skuList }">
        <ProductStock :stock="123" />
      </template>
    </ProductSkuEdit>
  </div>
</template>
<script>
  import withPromiseEmit from '@/hoc/withPromiseEmit'
  import ProductSkuEdit from './product-sku-edit'
  import ProductStock from '@components/product-stock'

  export default {
    name: 'component-product-sku-edit-demo',
    data () {
      return {
        product: {
          title: 'test'
        },
        skuList: [{
          specName: '123',
          weight: {
            value: 200,
            unit: '克'
          },
          price: { value: 1 },
          stock: 12
        }, {
          specName: '234',
          weight: {
            value: 201,
            unit: '克'
          },
          price: { value: 2 },
          stock: 20
        }, {
          specName: '345',
          weight: {
            value: 202,
            unit: '克'
          },
          price: { value: 3 },
          stock: 30
        }]
      }
    },
    components: {
      ProductStock,
      ProductSkuEdit: withPromiseEmit(ProductSkuEdit)
    },
    methods: {
      async handleSubmit (skuList, sku, product) {
        await new Promise((resolve, reject) => {
          setTimeout(resolve, 2000)
        })
        console.log('handleChange', sku, skuList)
        this.skuList = skuList
      },
      handleRefresh () {
        console.log('handleRefresh')
      }
    }
  }
</script>
