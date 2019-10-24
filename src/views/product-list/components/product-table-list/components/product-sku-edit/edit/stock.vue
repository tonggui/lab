<template>
  <EditInput
    :on-confirm="onConfirm"
    :value="value"
    :disabled="isDisabled"
    :input-props="inputProps"
    ref="edit"
  >
    <template v-slot:input-suffix="{ confirm }">
      <span class="edit-set-zero" @click="confirm(0)" v-mc="{ bid: 'b_shangou_online_e_u2zh84x4_mc' }">清零</span>
    </template>
    <template v-slot:display="{ edit }">
      <template>
        <ProductStock :stock="value" />
        <Icon :class="{ disabled: isDisabled }" class="edit-icon" local="edit" @click="!disabled && edit(true)" size="20" v-mc="{ bid: 'b_tikw7tcq' }" />
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
      value: [String, Number],
      disabled: Boolean
    },
    computed: {
      isDisabled () {
        return this.disabled || this.value === null || this.value === undefined
      },
      inputProps () {
        return {
          number: true
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
    &-icon,
    &-set-zero {
      color: @link-color;
      &:hover {
        color: @link-hover-color;
      }
      &.disabled {
        color: @disabled-color;
        cursor: not-allowed;
      }
    }
    &-set-zero {
      line-height: 32px;
    }
  }
</style>
