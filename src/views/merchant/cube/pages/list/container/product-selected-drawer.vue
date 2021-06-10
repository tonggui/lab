<template>
  <Drawer
    :width="631"
    :value="value"
    :mask-closable="false"
    closable
    @on-close="handleClose"
    class="product-selected-drawer-container"
  >
    <h2>已选商品({{ total }})</h2>
    <Icon type="closed" slot="close" color="#666" />
    <ul class="classify-table-list" v-if="value && showDataSourceList.length">
      <template v-for="item in showDataSourceList">
        <li
          v-if="item[1].productList.length"
          is="SelectedClassifyProductList"
          :key="item[0]"
          :title="item[1].name"
          :children="item[1].productList"
          @on-unselect="handleItemUnselect"
        />
      </template>
    </ul>
    <div v-else class="load-fail">
      加载失败，请点击<a href="#">重试</a>
    </div>
    <div slot="footer" class="classify-table-list-footer">
      <a class="empty-selected" @click.prevent="handleEmptySelected"
      >清空已选</a
      >
      <Button type="primary" @click="handleCreate">确定创建</Button>
    </div>
  </Drawer>
</template>

<script>
  import SelectedClassifyProductList from '../components/selected-classify-product-list'
  import { helper } from '../../../store'
  import { covertObjectToSequenceArr } from '../../../utils'
  const { mapActions, mapState } = helper()

  export default {
    name: 'product-selected-drawer',
    props: {
      total: Number,
      value: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      ...mapState({
        dataSourceList: 'classifySelectedProducts'
      }),
      showDataSourceList () {
        return covertObjectToSequenceArr(this.dataSourceList)
      }
    },
    components: {
      SelectedClassifyProductList
    },
    methods: {
      ...mapActions(['deSelectProduct', 'clearSelected']),
      handleClose () {
        this.$emit('on-drawer-close')
      },
      handleItemUnselect (title, item) {
        this.deSelectProduct([item])
      },
      handleEmptySelected () {
        this.$Modal.open({
          closable: true,
          centerLayout: true,
          maskClosable: false,
          width: 377,
          okText: '确定',
          renderHeader: () => {
            return (
              <div class="selected-drawer-async-confirm-header">
                确定清空已选商品
              </div>
            )
          },
          render: h => {
            return (
              <div class="selected-drawer-async-confirm-content">
                清空后，需要重新选择，确定清空当前所有已选商品？
              </div>
            )
          },
          onOk: () => {
            this.clearSelected()
            this.handleClose()
          }
        })
      },
      handleCreate () {
        this.$emit('on-click-create')
      }
    }
  }
</script>

<style lang="less" scoped>
.product-selected-drawer-container {
  overflow: hidden;
  /deep/ .drawer-content.with-footer {
    padding-bottom: 58px;
  }
  .classify-table-list {
    list-style: none;
    margin-top: 20px;
    border-top: 1px solid #e9eaf2;
    height: calc(100% - 49px);
    overflow: auto;
  }
  .load-fail {
    display: flex;
    height: calc(100% - 49px);
    align-items: center;
    justify-content: center;
  }
  /deep/ .drawer-footer {
    justify-content: center;
  }
  .classify-table-list-footer {
    .empty-selected {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #676a78;
      line-height: 14px;
      text-decoration: underline;
      margin-right: 16px;
      &:hover {
        cursor: pointer;
      }
    }
  }
}
.selected-drawer-async-confirm {
  &-header {
    text-align: center;
    font-family: PingFangSC-Medium;
    font-size: 20px;
    color: #36394d;
    text-align: center;
    line-height: 20px;
    border-bottom: 1px solid #e8e8e8;
    padding-bottom: 18px;
  }
  &-content {
    font-size: 14px;
    color: #36394d;
    line-height: 22px;
  }
}
</style>
