<template>
  <EditInput
    :on-confirm="onConfirm"
    :value="value"
    :disabled="disabled"
    input-prefix="¥"
    :input-props="inputProps"
  >
    <template v-slot:display="{ edit }">
      <template>
        <ProductPrice :price="value" />
        <Icon :class="{ disabled }" class="edit-icon" local="edit" @click="!disabled && edit(true)" size="20" v-mc="{ bid: 'b_puojmmh2' }" />
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
      value: [Number, String]
    },
    computed: {
      disabled () {
        return this.value === null || this.value === undefined
      },
      inputProps () {
        return {
          number: true,
          style: 'width: 120px'
        }
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
