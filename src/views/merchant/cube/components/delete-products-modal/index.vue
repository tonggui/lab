<template>
  <Modal :value="value" :closable="true" @on-cancel="$emit('on-click-reselect')" :width="modalWidth" class="delete-products-modal-container">
    <slot name="header">
      <div slot="header" class="delete-products-modal-header">
        {{ isAllDeleted ? '选中商品被删除' : '部分选中商品被删除' }}
      </div>
    </slot>
    <slot name="content">
      <div class="delete-products-modal-content">
        {{ isAllDeleted ? '你选中的全部商品已被平台删除，请重新选择。' : '你选中的如下商品已被平台删除，请确认是否继续创建。' }}
        <ul v-if="!isAllDeleted" :class="{ 'single': dataSource.length === 1 }">
          <li v-for="item in dataSource" :key="item.__id__">
            <ProductInfo :product="item" />
          </li>
        </ul>
      </div>
    </slot>
    <div slot="footer" class="delete-products-modal-footer">
      <slot name="footer">
        <Button v-if="isAllDeleted" @click="$emit('on-click-reselect')" type="primary">我知道了</BUtton>
        <template v-else>
          <Button @click="$emit('on-click-reselect')">
            重新选择
          </Button>
          <Button type="primary" @click="$emit('on-click-create')">
            继续创建
          </Button>
        </template>
      </slot>
    </div>
  </Modal>
</template>

<script>
  import ProductInfo from '../../pages/list/components/product-info'
  export default {
    name: 'delete-products-modal',
    props: {
      value: {
        type: Boolean,
        default: false
      },
      dataSource: {
        type: Array,
        default: () => ([])
      },
      isAllDeleted: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
      }
    },
    computed: {
      modalWidth () {
        return this.dataSource.length === 1 ? 396 : this.isAllDeleted ? 348 : 760
      }
    },
    components: {
      ProductInfo
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
        max-height: 403px;
        margin-top: 16px;
        border: 1px solid #E9EAF2;
        border-radius: 2px;
        display: flex;
        flex-wrap: wrap;
        overflow: auto;
        > li {
          width: 50%;
          min-height: 111px;
          padding: 11px 16px 16px;
        }
        &.single {
          > li {
            width: 100%;
          }
        }
      }
    }
    &-footer {
      text-align: center;
    }
  }
}
</style>
