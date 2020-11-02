<template>
  <span @click="handleClick" class="delete-operation"><slot></slot></span>
</template>
<script>
  import { fetchSubmitDeleteProduct } from '@/data/api/medicineMultiStore'
  import { Message } from '@roo-design/roo-vue'
  import { helper } from '../../../../store'
  const { mapState, mapActions } = helper('product')

  export default {
    name: 'multi-store-product-delete',
    props: {
      product: {
        type: Object,
        required: true
      },
      createCallback: {
        type: Function,
        default: success => success
      },
      withPoiSelect: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {

      }
    },
    computed: {
      ...mapState([
        'list'
      ])
    },
    created () {

    },
    beforeDestroy () {

    },
    methods: {
      ...mapActions([
        'pagePrev'
      ]),
      handleClick () {
        this.$Modal.open({
          title: '删除商品',
          width: 494,
          centerLayout: true,
          render: () => {
            return (
              <div class="delete-content">
                <div>
                  确认删除“{ this.product.name }”
                </div>
              </div>
            )
          },
          onOk: this.handleSubmit,
          okText: '确认'
        })
      },

      async handleSubmit () {
        // console.log(this.product)
        // try {
        const { wmPoiId, skuId } = this.product
        await fetchSubmitDeleteProduct({ wmPoiId, skuId }).then(() => {
          Message.success(`商品删除成功～`)
          if (this.list.length === 1) {
            this.pagePrev()
          }
        }).catch((err) => {
          if (err.message) {
            Message.error(err.message)
          }
        })
        // await new Promise((resolve, reject) => {
        //   this.$emit('submit', { wmPoiId, skuId }, this.createCallback(resolve, reject))
        // })
        //   this.$Message.success('商品删除成功～')
        // } catch (err) {
        //   this.$Message.warning(err.message || '商品删除失败！')
        //   throw err
        // }
      }
    }
  }
</script>
<style lang="less" scoped>
  .delete-operation {
    color: #F5222D;
  }
  .delete-content {
    .delete-range {
      margin-top: 20px;
      display: flex;
      align-items: center;
      .delete-range-label {
        margin-right: 20px;
      }
      /deep/ span.boo-radio + * {
        margin-left: 0;
        margin-right: 0;
      }
      /deep/ .boo-radio-wrapper:not(:last-child) {
        margin-right: 20px;
      }
    }
  }
</style>
