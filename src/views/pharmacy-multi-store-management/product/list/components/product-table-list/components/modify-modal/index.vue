<template>
  <Modal
    :width="600"
    :value="value"
    :title="title"
    :loading="loading"
    @on-cancel="handleCancel"
    @on-ok="triggerSubmit"
  >
    <template>
      <div class="product-info">
        <span class="picture"><img :src="picture" alt="商品" /></span>
        <div>
          <p class="title">{{ name }}</p>
          <p class="desc">{{`共选中${5}家门店`}}</p>
        </div>
      </div>
      <Table class="product-sku-table" :columns="columns" :data="skuList" bordered />
    </template>
  </Modal>
</template>
<script>
  import defaultImage from '@/assets/icons/picture-broken.svg'
  export default {
    name: 'product-list-batch-modal',
    props: {
      value: Boolean,
      title: String,
      loading: Boolean,
      product: Array
      // type: {
      //   type: Number,
      //   validator (value) {
      //     return Object.values(PRODUCT_BATCH_OP).includes(value)
      //   }
      // },
      // count: {
      //   type: Number,
      //   default: 0
      // },
      // tagList: {
      //   type: Array,
      //   default: () => []
      // }
    },
    data () {
      return {
        // error: ''
        skuList: []
      }
    },
    computed: {
      picture () {
        if (this.product.length > 0) {
          return this.product[0].picture
        } else {
          return defaultImage
        }
      },
      name () {
        if (this.product.length > 0) {
          return this.product[0].name
        } else {
          return '-'
        }
      },
      columns () {
        return [{
          title: '规格',
          // key: 'specName',
          align: 'left',
          render: (h, { row, index }) => {
            return <div>{ index === 0 && this.product.name }{ row.specName }</div>
          }
        }, {
          title: '重量',
          // key: 'specName',
          align: 'left',
          render: (h, { row, index }) => {
            return <div>{ index === 0 && this.product.name }{ row.specName }</div>
          }
        }, {
          title: this.title,
          key: 1,
          align: 'left',
          width: 260,
          render: (h, { row }) => {
            const onChange = (value, callback) => this.onChange(row, value, callback)
            return this.info.editRender(h, { sku: row, onChange })
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
        .boo-table-cell {
          overflow: initial;
          max-height: 70px;
          min-height: 60px;
          padding-top: 13px;
          padding-bottom: 13px;
          display: inline-flex;
          align-items: center;
        }
      }
      .specName {
        .two-line-text-overflow()
      }
    }
  }
</style>
