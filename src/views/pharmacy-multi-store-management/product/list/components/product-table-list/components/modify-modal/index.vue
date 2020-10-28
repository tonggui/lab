<template>
  <Modal
    :width="600"
    :value="value"
    :loading="loading"
    :title="op.title"
    @on-cancel="handleCancel"
    @on-ok="triggerSubmit"
  >
    <template>
      <div class="product-info">
        <span class="picture"><img :src="picture" alt="商品" /></span>
        <div>
          <p class="title">{{ name }}</p>
          <p class="desc">{{`共选中${count}家门店`}}</p>
        </div>
      </div>
      <Table class="product-sku-table" :columns="columns" :data="skuList" bordered />
    </template>
  </Modal>
</template>
<script>
  import defaultImage from '@/assets/icons/picture-broken.svg'
  import ModifyModal from './components/modifyModal.vue'

  export default {
    name: 'product-list-batch-modal',
    props: {
      value: {
        type: Boolean,
        default: false
      }, // ture:显示,false:不显示
      loading: {
        type: Boolean,
        default: false
      },
      product: {
        type: Array,
        default: () => []
      },
      op: {
        type: Object,
        default: () => {}
      },
      // count: Number
      // type: {
      //   type: Number,
      //   validator (value) {
      //     return Object.values(PRODUCT_BATCH_OP).includes(value)
      //   }
      // },
      count: {
        type: Number,
        default: 0
      }
      // tagList: {
      //   type: Array,
      //   default: () => []
      // }
    },
    components: {
      // ProductPrice
    },
    data () {
      return {
        // error: ''
        // skuList: [],
      }
    },
    computed: {
      inputValue () {
        if (this.product.length && this.product.length > 0) {
          return this.product[0].price
        } else {
          return ''
        }
      },
      skuList () {
        if (this.product.length && this.product.length > 0) {
          return this.product[0].wmProductSkus
        } else {
          return []
        }
      },
      picture () {
        if (this.product.length && this.product.length > 0) {
          return this.product[0].picture
        } else {
          return defaultImage
        }
      },
      name () {
        if (this.product.length && this.product.length > 0) {
          return this.product[0].name
        } else {
          return '-'
        }
      },
      columns () {
        return [{
          title: '规格',
          key: 'spec',
          align: 'left',
          render: (h, { row, index }) => {
            return <div>{ row.spec }</div>
          }
        }, {
          title: '重量',
          key: 'weight',
          align: 'left',
          render: (h, { row, index }) => {
            return <div>{ row.weight }</div>
          }
        }, {
          title: this.op.columnTitle,
          key: this.op.key,
          align: 'left',
          width: 260,
          render: (h, { row }) => {
            return <div class="modify-unit">
                      {this.value ? (<ModifyModal value={this.inputValue} type={this.op.type} onChange={this.onChange}/>) : null}
                    </div>
          }
        }]
      }
    },
    methods: {
      handleCancel () {
        this.$emit('cancel')
      },
      // handleHidden () {
      //   this.error = ''
      // },
      triggerSubmit () {
        // if (this.isForm) {
        //   this.$refs.form.submit()
        // } else {
        //   this.$emit('submit', this.config.value)
        // }
      },
      onChange (value) {
        console.log(value)
        // this.inputValue = value
      }
      // handleSubmit (error, value) {
      //   if (error) {
      //     this.error = error
      //     this.$Message.error(error)
      //     return
      //   }
      //   this.$emit('submit', value)
      // }
    },
    mounted () {
    }
  }
</script>
<style scoped lang="less">
  @import '~@/styles/common.less';
  .one-line-text-overflow () {
    white-space: normal;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    /*! autoprefixer: ignore next */
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }

  .product-info {
    display: flex;
    align-items: center;
    font-size: @font-size-base;
    color: @text-color;
    line-height: 22px;
    padding-right: 10px;
    margin-bottom: 20px;
    .picture {
      display: flex;
      align-items: center;
      flex-shrink: 0;
      width: 48px;
      height: 48px;
      border: 1px solid @border-color-base;
      font-size: 14px;
      margin-right: 10px;
      img {
        max-width: 100%;
        max-height: 100%;
      }
    }
    .title {
      .one-line-text-overflow()
    }
    .desc{
      color: @color-gray2;
    }
  }
  .product-sku-table {
    /deep/ .boo-table {
      .boo-table-row {
        td {
          line-height: 1.5;
          padding: 0;
        }
        .boo-input-with-prefix{
          padding-left: 18px;
        }
        .boo-input-prefix{
          display: flex;
          justify-content: center;
          align-items: center;
          width: 18px;
        }
        .boo-table-cell {
          overflow: initial;
          max-height: 70px;
          min-height: 60px;
          padding-top: 13px;
          padding-bottom: 13px;
          display: inline-flex;
          align-items: center;
          .modify-unit{
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            width: 60px;
            height: 36px;
            overflow: hidden;
            background: #FFFFFF;
            // border: 1px solid #E9EAF2;
            border-radius: 2px;
          }
        }
      }
      .specName {
        .two-line-text-overflow()
      }
    }
  }
</style>
