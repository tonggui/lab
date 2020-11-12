<template>
  <Modal
    :width="600"
    :value="value"
    :loading="loading"
    :title="title"
    @on-cancel="handleCancel"
    @on-ok="triggerSubmit"
    @on-visible-change="changeVisible"
  >
    <template v-if="isColumn">
      <div class="product-info">
        <span class="picture"><img :src="picture" alt="商品" /></span>
        <div>
          <p class="title">{{ name }}</p>
          <p class="desc">{{`共选中${count}家门店`}}</p>
        </div>
      </div>
      <Table class="product-sku-table" :columns="columns" :data="skuList" bordered />
    </template>
    <template v-else>
      <div>
        {{`共选中${count}个门店商品${name}`}}
      </div>
    </template>
  </Modal>
</template>
<script>
  import defaultImage from '@/assets/icons/picture-broken.svg'
  import ModifyModal from './components/modifyModal.vue'
  import config from './config'

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
      isColumn: {
        type: Boolean,
        default: true
      },
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
        inputValue: ''
      }
    },
    computed: {
      title () {
        // if (this.isColumn) {
        return config[this.op.type].title
        // }
        // return ''
      },
      // inputValue () {
      //   if (this.product.length && this.product.length > 0) {
      //     return this.product[0].price
      //   } else {
      //     return ''
      //   }
      // },
      skuList () {
        if (this.product.length && this.product.length > 0) {
          const { spec, weight, weightUnit } = this.product[0]
          return [{ spec, weight, weightUnit }]
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
            return <div>{ `${row.weight}${row.weightUnit}` }</div>
          }
        }, {
          title: this.op.type ? config[this.op.type].headerTitle : '',
          key: this.op.key,
          align: 'left',
          width: 260,
          render: (h, { row }) => {
            return <div class="modify-unit">
                      {/* {this.value ? (<ModifyModal value={this.inputValue} type={this.op.type} onChange={this.onChange}/>) : null} */}
                      {this.value ? (<ModifyModal type={this.op.type} on-change={this.onChange}/>) : null}
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
        if (this.isColumn) {
          const { inputValue, op: { type } } = this
          const message = config[type].validator(inputValue)
          if (message) {
            this.$Message.error(message)
            return false
          }
          // 确认改价请求
          this.$emit('submit', parseFloat(this.inputValue))
        } else {
          this.$emit('submit')
        }

        // if (this.isColumn) {
        //   this.$refs.form.submit()
        // } else {
        //   this.$emit('submit', this.config.value)
        // }
      },
      onChange (value) {
        this.inputValue = value
      },
      changeVisible () {
        this.inputValue = ''
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
