<template>
  <EditInput
    :on-confirm="onConfirm"
    :value="value"
    :disabled="isDisabled"
    input-prefix="¥"
    :input-props="inputProps"
    editing-style="z-index: 10"
  >
    <template v-slot:display="{ edit }">
      <template>
        <ProductPrice :price="value" />
        <Icon :class="{ disabled: isDisabled }" class="edit-icon" local="edit" @click="!disabled && edit(true)" size="20" v-mc="{ bid: 'b_puojmmh2' }" />
      </template>
    </template>
  </EditInput>
</template>
<script>
  import EditInput from '@components/edit-input/edit-input'
  import ProductPrice from '@components/product-price'

  export default {
    name: 'product-sku-edit-price',
    props: {
      onConfirm: {
        type: Function,
        required: true
      },
      value: [Number, String],
      disabled: Boolean
    },
    computed: {
      isDisabled () {
        return this.disabled || this.value === null || this.value === undefined
      },
      inputProps () {
        return { number: true }
      }
    },
    components: {
      EditInput,
      ProductPrice
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
