<template>
  <div class="table-operation">
    <span class="table-operation-item" @click="handleEdit">编辑</span>
    <span class="table-operation-item" style="margin-left: 8px; color: #F5222D;" @click="handleDelete">删除配置</span>
  </div>
</template>
<script>
  export default {
    name: 'table-operation',
    inject: ['editMedicineSettings'],
    props: {
      data: {
        type: Object,
        default: () => {}
      },
      disabled: Boolean,
      index: Number,
      createCallback: {
        type: Function,
        default: (success) => success
      }
    },
    methods: {
      handleEdit () {
        const params = {
          id: this.data.id,
          cityId: this.data.cityId,
          purchaseType: this.data.purchaseType,
          matchingRules: this.data.matchingRules,
          productInfo: this.data.productInfo
        }
        this.editMedicineSettings(params)
      },
      handleDelete () {
        this.$Modal.open({
          width: 420,
          title: `删除配置`,
          render: () => (
            <div style="text-align: center">
              确认清除该品牌在该城市下的所有商品配置？
            </div>
          ),
          closable: false,
          maskClosable: false,
          centerLayout: true,
          onOk: () => this.$emit('delete', this.data)
        })
      }
    }
  }
</script>
<style lang="less" scoped>
.table-operation {
  display: inline-block;
  text-align: right;
  &,.active {
    color: @link-color;
    font-size: @font-size-base;
  }
  &-item {
    margin-right: 8px;
    cursor: pointer;
  }
  .disabled {
    cursor: not-allowed;
    color: @disabled-color;
  }
}
</style>
