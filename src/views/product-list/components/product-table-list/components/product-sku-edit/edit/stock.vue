<template>
  <Edit :border="false" :on-confirm="onConfirm" :value="value">
    <template v-slot:display="{ edit }">
      <template>
        <ProductStock :stock="value" />
        <Icon class="edit-icon" local="edit" @click="edit(true)" size="20" />
      </template>
    </template>
    <template v-slot:editing="{ change, value }">
      <InputNumber class="edit-input" size="small" :min="-1" :value="value" @on-change="change"/>
    </template>
  </Edit>
</template>
<script>
  import Edit from '@components/edit'
  import ProductStock from '@components/product-stock'

  export default {
    name: 'product-sku-edit-stock',
    props: {
      onConfirm: {
        type: Function,
        required: true
      },
      value: [String, Number]
    },
    components: {
      Edit,
      ProductStock
    }
  }
</script>
<style lang="less" scoped>
  .edit {
    &-icon {
      color: @link-color;
      &:hover {
        color: @link-hover-color;
      }
    }
    &-input {
      width: 120px;
    }
  }
</style>
