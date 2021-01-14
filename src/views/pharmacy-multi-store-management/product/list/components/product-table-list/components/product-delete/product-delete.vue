<template>
  <span @click="handleClick" class="delete-operation"><slot></slot></span>
</template>
<script>

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
    },
    created () {

    },
    beforeDestroy () {

    },
    methods: {
      handleClick () {
        this.$Modal.confirm({
          title: '删除商品',
          width: 494,
          centerLayout: true,
          render: () => {
            return (
              <div class="delete-content">
                <div>
                  确认删除“{ this.product.name }”？
                </div>
              </div>
            )
          },
          onOk: this.handleSubmit,
          okText: '确认'
        })
      },

      handleSubmit () {
        this.$emit('submit', this.product, false, this.package)
      },
      package (err) {
        this.$Modal.confirm({
          title: '删除商品',
          content: err.message,
          okText: '全部删除',
          onOk: () => this.$emit('submit', this.product, true)
        })
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
