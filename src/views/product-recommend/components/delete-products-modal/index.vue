<template>
  <Modal :value="value" :closable="true" class="delete-products-modal-container">
    <div slot="header" class="delete-products-modal-header">
      部分选择商品被删除
    </div>
    <div class="delete-products-modal-content">
      抱歉！所选商品中有1件商品已被平台删除，请重新选择。
      <ul class="">
        <li>1</li>
        <li>2</li>
        <li>3</li>
        <li>4</li>
      </ul>
    </div>
    <div slot="footer" class="delete-products-modal-footer">
      <Button>
        重新选择
      </Button>
      <Button type="primary">
        继续创建其他
      </Button>
    </div>
  </Modal>
</template>

<script>
  export default {
    name: 'delete-products-modal',
    props: {
      value: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
      }
    }
  }
</script>

<style lang="less" scoped>
.delete-products-modal-container {
  text-align: center;
  .delete-products-modal {
    &-header {
      font-family: PingFangSC-Medium;
      font-size: 20px;
      color: #36394D;
      text-align: center;
      line-height: 20px;
      border-bottom: 1px solid #E8E8E8;
      padding-bottom: 21px;
    }
    &-content {
      text-align: left;
      > ul {
        list-style: none;
        margin-top: 16px;
        border: 1px solid #E9EAF2;
        border-radius: 2px;
        display: flex;
        flex-wrap: wrap;
        > li {
          width: 50%;
          padding: 11px 16px 16px;
        }
      }
    }
    &-footer {
      text-align: center;
    }
  }
}
</style>
