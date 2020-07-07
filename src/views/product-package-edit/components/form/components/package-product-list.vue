<template>
  <div class="product-package-list">
    <div class="product-package-list-operate-container">
      <Button @click="selectProductModalVisible = true">添加商品</Button>
    </div>
    <Table border :columns="columns" :data="productList" />
    <ProductSelectModal
      :max-count="maxCount"
      v-model="selectProductModalVisible"
      @on-ok="handleProductSelected"
      @on-cancel="selectProductModalVisible = false"
    />
  </div>
</template>

<script>
  import Input from '@/components/input/ValidateInput'
  import InputNumber from '@/components/input-number'
  import ProductSelectModal from '../../product-select-modal'
  import unionBy from 'lodash/unionBy'

  export default {
    name: 'PackageProductList',
    components: {
      ProductSelectModal
    },
    props: {
      value: {
        type: Array,
        default: () => []
      },
      maxCount: {
        type: Number,
        default: () => 6
      }
    },
    data () {
      return {
        selectProductModalVisible: false,
        selectedProductList: [],
        productList: [...this.value]
      }
    },
    computed: {
      columns () {
        return [
          {
            title: '商品名称',
            key: 'name',
            align: 'center'
          },
          {
            title: '规格名称',
            key: 'spec',
            align: 'center'
          },
          {
            title: 'SKU码/货号',
            key: 'upc',
            align: 'center'
          },
          {
            title: '价格',
            key: 'price',
            align: 'center'
          },
          {
            title: '库存',
            key: 'stock',
            align: 'center'
          },
          {
            title: '折扣',
            key: 'discount',
            align: 'center',
            width: 160,
            render (h, { row }) {
              const validator = v => v >= 0 && v <= 100
              return (
                <Input
                  placeholder="请输入"
                  combine
                  validate={validator}
                  validateType="positive_float_2"
                  vModel={row.discount}
                >
                  <span slot="append">%</span>
                </Input>
              )
            }
          },
          {
            title: '数量',
            key: 'count',
            align: 'center',
            render (h, { row }) {
              return (
                <InputNumber
                  placeholder="请输入"
                  max={99}
                  min={1}
                  vModel={row.count}
                />
              )
            }
          },
          {
            title: '操作',
            align: 'center',
            key: '',
            render: (h, { row, index }) => {
              return (
                <Button
                  type="text"
                  vOn:click={() => this.handleRemove(index)}
                >删除</Button>
              )
            }
          }
        ]
      }
    },
    watch: {
      productList: {
        deep: true,
        handler (v) {
          this.$emit('input', v)
        }
      }
    },
    methods: {
      handleProductSelected (items) {
        this.selectProductModalVisible = false
        this.selectedProductList = [...items]
        this.productList.splice(0, this.productList.length, ...this.mergeSelectedProductToPackageProductList(items))
      },
      convertProductListToPackageProductList (productList = []) {
        return productList.map(product => {
          const sku = product.skuList[0]
          return {
            id: sku.id,
            spuId: product.id,
            name: product.name,
            spec: sku.specName,
            upc: sku.upcCode,
            stock: sku.stock,
            price: sku.price.value,
            count: 1,
            discount: 100
          }
        })
      },
      mergeSelectedProductToPackageProductList (items = []) {
        const newProductList = this.convertProductListToPackageProductList(items)
        return unionBy(this.productList, newProductList, 'id')
      },
      handleRemove (idx) {
        this.productList.splice(idx, 1)
      }
    }
  }
</script>

<style scoped lang="less">
.product-package-list {
  .product-package-list-operate-container {
    margin-bottom: 15px;
  }
  /deep/ .boo-input-wrapper {
    width: 100%;
  }
}
</style>
