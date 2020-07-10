<template>
  <div class="product-package-list">
    <Alert v-if="editMode" type="warning">编辑模式下，组包商品不允许修改组合关系</Alert>
    <div class="product-package-list-operate-container" v-if="!editMode">
      <Button @click="selectProductModalVisible = true">添加商品</Button>
    </div>
    <Table border :columns="columns" :data="productList"/>
    <ProductSelectModal
      :max-count="maxCount"
      v-model="selectProductModalVisible"
      :selectedProductList="selectedProductList"
      :selectableTester="testSelectable"
      @on-ok="handleProductSelected"
      @on-cancel="selectProductModalVisible = false"
    />
  </div>
</template>

<script>
  import InputNumber from '@/components/input-number'
  import ProductSelectModal from '../../product-select-modal'
  import PictureViewBox from '@components/product-picture/picture-view-box'
  import unionBy from 'lodash/unionBy'
  import intersectionBy from 'lodash/intersectionBy'

  const isPrescription = product => product.isPrescription
  const isHealthcare = product => +product.category.idPath[0] === 200000927

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
      },
      editMode: {
        type: Boolean,
        default: () => false
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
            title: '图片',
            key: 'pictureList',
            align: 'center',
            minWidth: 90,
            render: (h, { row, index }) => {
              return (
                <PictureViewBox
                  style={{ width: '80px', height: '80px', display: 'inline-block' }}
                  src={(row.pictureList || [])[0]}
                  leftMarker={index === 0 ? '主' : ''}
                  rightMarker={isPrescription(row) ? '处方药' : ''}
                  bottomMarker={row.sellStatus === 1 ? '已下架' : '上架中'}
                />
              )
            }
          },
          {
            title: '商品名称',
            key: 'name',
            align: 'center',
            minWidth: 140
          },
          {
            title: '规格名称',
            key: 'spec',
            align: 'center',
            minWidth: 100
          },
          {
            title: 'SKU码/货号',
            key: 'upc',
            align: 'center',
            minWidth: 90,
            render (h, { row }) {
              return row.upc || '/'
            }
          },
          {
            title: '价格(元)',
            key: 'price',
            align: 'center',
            minWidth: 70
          },
          {
            title: '库存',
            key: 'stock',
            align: 'center',
            minWidth: 60,
            render: (h, { row }) => {
              return (
                <span>{row.stock === -1 ? '无限' : row.stock}</span>
              )
            }
          },
          {
            title: '折扣',
            key: 'discount',
            align: 'center',
            minWidth: 80,
            render: (h, { row, index }) => {
              return (
                <InputNumber
                  placeholder="请输入"
                  style={{ width: '70px' }}
                  max={10}
                  min={0.01}
                  step={0.1}
                  value={row.discount}
                  parser={v => `${Math.floor((Number(v) || 0.01) * 100) / 100}`}
                  vOn:input={(v) => this.handleProductListItemChanged(index, 'discount', Number(v) || 0)}
                >
                  <span slot="append">折</span>
                </InputNumber>
              )
            }
          },
          {
            title: '数量',
            key: 'count',
            align: 'center',
            minWidth: 70,
            render: (h, { row, index }) => {
              return (
                <InputNumber
                  placeholder="请输入"
                  style={{ width: '60px' }}
                  max={99}
                  min={1}
                  precision={0}
                  value={row.count}
                  parser={v => v || '1'}
                  vOn:input={(v) => this.handleProductListItemChanged(index, 'count', v)}
                />
              )
            }
          }
        ].concat(this.editMode ? [] : [{
          title: '操作',
          align: 'center',
          key: '',
          minWidth: 80,
          render: (h, { row, index }) => {
            if (this.editMode) {
              return null
            }
            return (
              <Button
                type="text"
                vOn:click={() => this.handleRemove(index)}
              >删除</Button>
            )
          }
        }])
      }
    },
    watch: {
      productList: {
        deep: true,
        handler (v) {
          this.$emit('input', v)
        }
      },
      value (v) {
        this.productList = [...v]
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
            discount: 10,
            sellStatus: product.sellStatus,
            category: product.category,
            pictureList: product.pictureList,
            isPrescription: isPrescription(product)
          }
        })
      },
      mergeSelectedProductToPackageProductList (items = []) {
        const newProductList = this.convertProductListToPackageProductList(items)
        return intersectionBy(unionBy(this.productList, newProductList, 'id'), newProductList, 'id')
      },
      handleRemove (idx) {
        const product = this.productList[idx]
        this.$Modal.confirm({
          title: '提示',
          content: `您确定要删除商品"${product.name}"的"${product.spec}"规格吗？`,
          onOk: () => {
            const [product] = this.productList.splice(idx, 1)
            const selectedIndex = this.selectedProductList.findIndex(selectedProduct => selectedProduct.skuList[0].id === product.id)
            if (selectedIndex >= 0) {
              this.selectedProductList.splice(selectedIndex, 1)
            }
          }
        })
      },
      handleProductListItemChanged (idx, propertyKey, propertyValue) {
        this.productList.splice(idx, 1, {
          ...this.productList[idx],
          [propertyKey]: propertyValue
        })
      },
      testSelectable (product, selectedProductList = [], allProductList = []) {
        const selectedProductListWithoutCurOptProduct = selectedProductList.filter(p => p.id !== product.id)
        if (isPrescription(product)) {
          if (selectedProductListWithoutCurOptProduct.some(isPrescription)) {
            throw Error('组包商品不允许同时选择两种处方药商品')
          }
          if (selectedProductListWithoutCurOptProduct.some(isHealthcare)) {
            throw Error('组包商品不允许同时选择处方药商品和营养保健商品')
          }
        }
        if (isHealthcare(product)) {
          if (selectedProductListWithoutCurOptProduct.some(isPrescription)) {
            throw Error('组包商品不允许同时选择营养保健商品和处方药商品')
          }
        }

        return true
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
  /deep/ .boo-alert {
    line-height: 1.4;
  }

  /deep/ .boo-table-cell {
    padding: 4px;
  }

  /deep/ .picture-box .tag {
    left: 0;
    padding: 0 3px;
    right: initial;
    background-color: #63D29D;
  }
}
</style>
