<template>
  <EditInput
    :on-confirm="onConfirm"
    :value="value"
    :disabled="isDisabled"
    :input-props="inputProps"
    ref="edit"
    editing-style="z-index: 10"
    v-on="$listeners"
  >
    <template v-slot:input-suffix="{ confirm }">
      <span class="edit-set-zero" @click="confirm(0)">清零</span>
    </template>
    <template v-slot:display="{ edit }">
      <template>
        <ProductStock :stock="value" />
        <Icon :class="{ disabled: isDisabled, 'display-none': isDisplayNone }" class="edit-icon" local="edit" @click="() => handleClickEvent(edit)" size="20" />
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
      &.display-none{
        display: none;
      }
    }
    &-set-zero {
      line-height: 32px;
    }
  }
</style>
