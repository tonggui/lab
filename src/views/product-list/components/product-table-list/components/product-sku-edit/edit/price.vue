<template>
  <Edit :border="false" :on-confirm="onConfirm" :value="value" :disabled="disabled">
    <template v-slot:display="{ edit }">
      <template>
        <ProductPrice :price="value" />
        <Icon :class="{ disabled }" class="edit-icon" local="edit" @click="!disabled && edit(true)" size="20" />
      </template>
    </template>
    <template v-slot:editing="{ change, value }">
      <UnitNumber unit="¥">
        <InputNumber size="small" class="edit-input" :value="value" @on-change="change" />
      </UnitNumber>
    </template>
  </Edit>
</template>
<script>
  import Edit from '@components/edit'
  import UnitNumber from '@components/unit-number'
  import ProductPrice from '@components/product-price'

  export default {
    name: 'product-sku-edit-price',
    props: {
      onConfirm: {
        type: Function,
        required: true
      },
      value: [Number, String]
    },
    computed: {
      disabled () {
        return this.value === null || this.value === undefined
      }
    },
    components: {
      Edit,
      ProductPrice,
      UnitNumber
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
      &.disabled {
        color: @disabled-color;
        cursor: not-allowed;
      }
    }
    &-input {
      width: 120px;
    }
  }
</style>
