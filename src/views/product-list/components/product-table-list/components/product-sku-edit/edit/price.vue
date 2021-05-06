<template>
  <EditInput
    :on-confirm="onConfirm"
    :value="value"
    :disabled="isDisabled || havePermission"
    input-prefix="¥"
    :input-props="inputProps"
    editing-style="z-index: 10"
  >
    <template v-slot:display="{ edit }">
      <template>
        <ProductPrice :price="value" />
        <PermissionBtn
          component="Icon"
          need-permission
          :btn-type="btnType"
          :class="{ disabled: isDisabled }"
          class="edit-icon"
          local="edit"
          @click="() => handleClickEvent(edit)"
          size="20"
          v-mc="{ bid: 'b_puojmmh2' }"
        />
      </template>
    </template>
  </EditInput>
</template>
<script>
  import EditInput from '@components/edit-input/edit-input'
  import ProductPrice from '@components/product-price'
  import getPermissionMixin from '@/views/components/permission-bth/getPermissionMixin'
  import PermissionBtn from '@/views/components/permission-bth/index'

  export default {
    name: 'product-sku-edit-price',
    mixins: [getPermissionMixin('MODIFY_PRICE')],
    props: {
      onConfirm: {
        type: Function,
        required: true
      },
      value: [Number, String],
      disabled: Boolean,
      disableTip: String
    },
    computed: {
      isDisabled () {
        return this.disabled || this.value === null || this.value === undefined
      },
      inputProps () {
        return { number: true }
      }
    },
    methods: {
      handleClickEvent (setEditState) {
        if (!this.isDisabled) {
          setEditState && setEditState(true)
        } else if (this.disableTip) {
          this.$Modal.info({
            content: this.disableTip
          })
        }
      }
    },
    components: {
      PermissionBtn,
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
