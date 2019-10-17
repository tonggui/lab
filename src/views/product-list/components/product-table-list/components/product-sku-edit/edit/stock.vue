<template>
  <EditInput
    :on-confirm="onConfirm"
    :value="value"
    :disabled="disabled"
    :input-props="inputProps"
  >
    <template v-slot:display="{ edit }">
      <template>
        <ProductStock :stock="value" />
        <Icon :class="{ disabled }" class="edit-icon" local="edit" @click="!disabled && edit(true)" size="20" />
      </template>
    </template>
  </EditInput>
</template>
<script>
  import EditInput from '@components/edit-input/edit-input'
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
    computed: {
      disabled () {
        return this.value === null || this.value === undefined
      },
      inputProps () {
        return {
          number: true,
          style: {
            width: '120px'
          }
        }
      }
    },
    components: {
      EditInput,
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
      &.disabled {
        color: @disabled-color;
        cursor: not-allowed;
      }
    }
  }
</style>
