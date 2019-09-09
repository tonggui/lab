<template>
  <Edit :border="false" :on-confirm="onConfirm" :value="value">
    <template v-slot:display="{ edit }">
      <template>
        <UnitNumber unit="¥" :number="value" />
        <Icon class="edit-icon" local="edit" @click="edit(true)" size="20" />
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

  export default {
    name: 'product-sku-edit-price',
    props: {
      onConfirm: {
        type: Function,
        required: true
      },
      value: [Number, String]
    },
    components: {
      Edit,
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
    }
    &-input {
      width: 120px;
    }
  }
</style>
