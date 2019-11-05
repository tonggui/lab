<template>
  <Modal
    :title="title"
    :value="value"
    v-bind="$attrs"
    @on-cancel="handleCancel"
    @on-ok="handleOk"
  >
    <div class="product-info">
      <span class="picture"><img :src="picture" alt="商品" /></span>
      <span>{{ product.name }}</span>
    </div>
    <Table class="product-sku-table" :columns="columns" :data="selfSkuList" bordered />
    <slot></slot>
  </Modal>
</template>
<script>
  import defaultImage from '@/assets/icons/picture-broken.svg'
  import config from './config'

  export default {
    name: 'product-sku-edit-modal',
    props: {
      felid: Number,
      product: {
        type: Object,
        required: true
      },
      skuList: {
        type: Array,
        required: true
      },
      value: Boolean,
      edit: [Function, Object],
      showWeight: Boolean,
      editType: String
    },
    data () {
      return {
        selfSkuList: [ ...this.skuList ]
      }
    },
    watch: {
      skuList (skuList) {
        this.selfSkuList = [...this.skuList]
      }
    },
    computed: {
      picture () {
        return this.product.picture || defaultImage
      },
      info () {
        return config[this.felid]
      },
      title () {
        return this.info.title
      },
      headerTitle () {
        return this.info.headerTitle
      },
      columns () {
        const columns = [{
          title: '规格',
          key: 'specName',
          align: 'center',
          width: 180,
          render: (h, { row, index }) => {
            return <div class="specName">{ index === 0 && this.product.name }{ row.specName }</div>
          }
        }, {
          title: this.headerTitle,
          key: this.felid,
          align: 'center',
          minWidth: 180,
          render: (h, { row, index }) => {
            return h(this.edit, {
              props: {
                sku: row,
                value: this.info.getValue(row),
                onConfirm: (value) => this.handleConfirm(value, index),
                validator: this.info.validator
              },
              on: {
                change: (value) => this.handleChange(value, index)
              }
            })
          }
        }]
        if (this.showWeight) {
          columns.splice(1, 0, {
            title: '重量',
            key: 'weight',
            align: 'center',
            width: 120,
            render: (h, { row }) => {
              return <div>{ row.weight.value }{ row.weight.unit }</div>
            }
          })
        }
        return columns
      }
    },
    methods: {
      handleCancel () {
        this.$emit('on-cancel')
      },
      handleOk () {
        if (this.editType === 'inline') {
          this.handleInlineSubmit()
        }
        this.handleCancel()
      },
      handleConfirm (value, index) {
        const error = this.info.validator(value)
        if (error) {
          this.$Message.warning(error)
          return
        }
        const sku = this.selfSkuList[index]
        const params = this.info.onChange(value, sku)
        const list = [...this.selfSkuList]
        list.splice(index, 1, { ...sku, ...params })
        this.$emit('on-confirm', list, sku)
      },
      handleInlineSubmit () {
        let error
        this.selfSkuList.some(sku => {
          const value = this.info.getValue(sku)
          error = this.info.validator(value)
          return error
        })
        if (error) {
          this.$Message.warning(error)
          return
        }
        this.$emit('on-ok', this.selfSkuList)
      },
      handleChange (value, index) {
        const sku = this.selfSkuList[index]
        const params = this.info.onChange(value, sku)
        this.selfSkuList.splice(index, 1, { ...sku, ...params })
      }
    }
  }
</script>
<style scoped lang="less">
  @import '~@/styles/common.less';

  .product-info {
    display: flex;
    align-items: center;
    font-size: @font-size-base;
    color: @text-color;
    line-height: 22px;
    padding-right: 10px;
    margin-bottom: 20px;
    .picture {
      width: 48px;
      height: 36px;
      border: 1px solid @border-color-base;
      font-size: @font-size-small;
      margin-right: 26px;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .product-sku-table {
    /deep/ .boo-table {
      .boo-table-row {
        height: 80px;
        td {
          line-height: 40px;
          padding: 0;
        }
        .boo-table-cell {
          overflow: initial;
        }
      }
      .specName {
        .two-line-text-overflow()
      }
    }
  }
</style>
