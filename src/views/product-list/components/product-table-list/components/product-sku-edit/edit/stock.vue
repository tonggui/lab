<template>
  <EditInput
    :on-confirm="onConfirm"
    :value="value"
    :disabled="isDisabled || !havePermission"
    :input-props="inputProps"
    ref="edit"
    editing-style="z-index: 10"
    v-on="$listeners"
  >
    <template v-slot:input-suffix="{ confirm }">
      <span class="edit-set-zero" @click="confirm(0)" v-mc="{ bid: 'b_shangou_online_e_u2zh84x4_mc' }">清零</span>
    </template>
    <template v-slot:display="{ edit }">
      <template>
        <ProductStock :stock="value" />
        <PermissionBtn
          component="Icon"
          need-permission
          :btn-type="btnType"
          :class="{ disabled: isDisabled,'display-none': isDisplayNone}"
          class="edit-icon"
          local="edit"
          @click="() => handleClickEvent(edit)"
          size="20"
          v-mc="{ bid: 'b_tikw7tcq' }"
        />
      </template>
    </template>
  </EditInput>
</template>
<script>
  import EditInput from '@components/edit-input/edit-input'
  import ProductStock from '@components/product-stock'
  import PermissionBtn from '@/views/components/permission-bth/index'
  import getPermissionMixin from '@/views/components/permission-bth/getPermissionMixin'

  export default {
    name: 'product-sku-edit-stock',
    mixins: [getPermissionMixin('MODIFY_STOCK')],
    props: {
      onConfirm: {
        type: Function,
        required: true
      },
      value: [String, Number],
      disabled: Boolean,
      disableTip: String,
      displayNone: Boolean
    },
    computed: {
      isDisabled () {
        return this.disabled || this.value === null || this.value === undefined
      },
      isDisplayNone () {
        return this.displayNone
      },
      inputProps () {
        return {
          number: true
        }
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
