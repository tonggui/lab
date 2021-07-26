<template>
  <!-- TODO: 新增minOrderCount起购数 和 是否为编辑库存 -->
  <EditInput
    :on-confirm="onConfirm"
    :value="value"
    :minOrderCount="minOrderCount"
    :disabled="isDisabled || !havePermission"
    :input-props="inputProps"
    sign="stock"
    ref="edit"
    editing-style="z-index: 10"
    v-on="$listeners"
  >
    <template v-slot:input-suffix="{ confirm }">
      <span class="edit-set-zero" @click="confirm(0)" v-mc="{ bid: 'b_shangou_online_e_u2zh84x4_mc' }">清零</span>
    </template>
    <template v-slot:display="{ edit }">
      <template>
        <div>
          <!-- TODO: 库存数，传入最小起购数 -->
          <ProductStock :stock="value" :minOrderCount="minOrderCount" :isSingleSku="isSingleSku" />
          <!-- TODO: 编辑库存ICON -->
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
        </div>
      </template>
    </template>
  </EditInput>
</template>
<script>
  import EditInput from '@components/edit-input/edit-input'
  import ProductStock from '@components/product-stock'
  import PermissionBtn from '@/views/components/permission-bth/index'
  import getPermissionMixin from '@/views/components/permission-bth/getPermissionMixin'
  import { PRODUCT_STATUS_MAIDIAN } from '@/data/enums/product'
  import lx from '@/common/lx/lxReport'
  // import { createNamespacedHelpers } from 'vuex'
  // const { mapState } = createNamespacedHelpers('productList/product')

  export default {
    name: 'product-sku-edit-stock',
    mixins: [getPermissionMixin('MODIFY_STOCK')],
    props: {
      onConfirm: {
        type: Function,
        required: true
      },
      value: [String, Number],
      minOrderCount: Number, // 起购数
      isSingleSku: Boolean, // 是否为单规格
      disabled: Boolean,
      disableTip: String,
      displayNone: Boolean,
      tabValue: [String, Number]
    },
    computed: {
      // ...mapState(['status']),
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
        if (this.isSingleSku) {
          // 单规格发送埋点，多规格已经在外部处理
          lx.mc({
            bid: 'b_shangou_online_e_a01gqbnj_mc',
            val: {
              tab_id: PRODUCT_STATUS_MAIDIAN[this.tabValue.toString()]
            }
          })
        }
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
