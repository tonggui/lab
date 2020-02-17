<template>
  <div class="product-table-info">
    <div class="product-table-info-img">
      <ProductInfoImage
        :disabled="disabled"
        :product="product"
        :editable="pictureEditable"
        :show-marker="showMarker"
        :marker-type="markerType"
        @change="handleChangePicture"
      />
    </div>
    <div class="product-table-info-desc">
      <EditInput :disabled="disabled" v-if="nameEditable" :value="product.name" :on-confirm="handleChangeName" display-max-width="100%">
        <Icon slot="icon" local="edit" size="20" class="edit-icon" :class="{ disabled }" color="#F89800" v-mc="{ bid: 'b_shangou_online_e_s40fd186_mc' }" />
      </EditInput>
      <div class="product-table-info-desc-name" v-else>
        <div class="content" :class="{ 'two-line': !hasDisplayInfo }">
          {{ product.name }}
        </div>
        <Tooltip v-if="lockedMap.name" transfer content="当前字段锁定，如需修改请联系业务经理" width="200">
          <Icon type="https" class="locked-icon" />
        </Tooltip>
      </div>
      <small v-if="product.displayInfo" class="product-table-info-desc-info">
        <template v-for="(info, i) in product.displayInfo">
          <span class="" :key="i">
            <template v-if="isArray(info)">
              <span v-for="(desc, index) in info" :key="index">{{ desc }}</span>
            </template>
            <template v-else>{{ info }}</template>
          </span>
        </template>
      </small>
      <div class="product-table-info-tip">
        <div v-if="product.stockoutAutoClearStock && showAutoClearStock" class="danger auto-clear-stock-info" :class="{ 'with-margin': !product.displayInfo }">
          门店/买家缺货取消订单后，会自动将商品库存清零 <a @click="handleCloseAutoClearStock">关闭设置</a>
        </div>
        <div v-else-if="product.errorTip" class="danger">{{ product.errorTip }}</div>
        <div class="disqualified" v-else-if="disqualifiedTip" @click="handleAddQualifed">
          {{ disqualifiedTip }}
          <Icon type="keyboard-arrow-right" size=18 style="margin-left: -6px" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { isArray } from 'lodash'
  import ProductInfoImage from './product-info-image'
  import EditInput from '@components/edit-input/edit-input'
  import { validate } from '@sgfe/product-validate'
  import { createCallback } from '@/common/vuex'
  import createAddQualificationModal from '@/components/qualification-modal'

  export default {
    name: 'product-table-info',
    props: {
      product: {
        type: Object,
        default: () => ({})
      },
      lockedMap: {
        type: Object,
        default: () => ({
          name: false,
          picture: false
        })
      },
      editableMap: {
        type: Object,
        default: () => ({
          name: false,
          picture: false
        })
      },
      createCallback: {
        type: Function,
        default: createCallback
      },
      showMarker: {
        type: Boolean,
        default: true
      },
      showAutoClearStock: Boolean,
      markerType: String,
      disabled: Boolean
    },
    components: {
      ProductInfoImage,
      EditInput
    },
    computed: {
      hasDisplayInfo () {
        return this.product.displayInfo
      },
      disqualifiedTip () {
        const { exist, tip } = this.product.qualification || {}
        return exist ? '' : tip
      },
      nameEditable () {
        return this.editableMap.name && !this.lockedMap.name
      },
      pictureEditable () {
        return this.editableMap.picture && !this.lockedMap.picture
      }
    },
    methods: {
      isArray () {
        return isArray
      },
      setCallback ({ success, error }, resolve) {
        return this.createCallback(() => {
          this.$Message.success(success)
          resolve && resolve()
        }, (err) => {
          this.$Message.error(err.message || error)
          resolve && resolve()
        })
      },
      handleChangePicture (pictureList) {
        if (!this.pictureEditable) {
          return
        }
        this.$emit('change-picture', this.product, pictureList, this.setCallback({
          success: '修改商品图片成功～',
          error: '修改商品图片失败！'
        }))
      },
      handleChangeName (name) {
        if (!this.nameEditable) {
          return
        }
        const res = validate('title', name)
        if (res.code > 0) {
          this.$Message.error('标题格式错误')
          return false
        }
        return new Promise((resolve) => {
          this.$emit('change-name', this.product, name, this.setCallback({
            success: '修改商品标题成功～',
            error: '修改商品标题失败！'
          }, resolve))
        })
      },
      handleAddQualifed () {
        createAddQualificationModal(this.product.qualification.message)
      },
      handleCloseAutoClearStock () {
        return new Promise((resolve) => {
          this.$emit('close-auto-clear-stock', this.product, !this.product.stockoutAutoClearStock, this.setCallback({
            success: '关闭缺货自动库存清零设置成功～',
            error: '关闭缺货自动库存清零设置失败！'
          }))
        })
      }
    }
  }
</script>
<style lang="less">
@import '~@/styles/common.less';

.product-table-info {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  &-img {
    flex-shrink: 0;
    margin-right: 10px;
  }
  &-desc {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 10px 0;
    max-width: calc(100% - 74px);
    &-info {
      margin-top: 10px;
      min-height: 12px;
    }
    &-name {
      display: flex;
      .content {
        display: inline-block;
        font-weight: normal;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
        &.two-line {
          .two-line-text-overflow
        }
        @media screen and (min-width: 1110px) {
          max-width: 250px;
        }
        @media screen and (min-width: 1180px) {
          max-width: 300px;
        }
        @media screen and (min-width: 1280px) {
          max-width: 350px;
        }
      }
      .locked-icon {
        color: @disabled-color;
        font-size: @font-size-base;
      }
    }
    small {
      font-size: @font-size-small;
      color: @text-helper-color;
    }
  }
}
.product-table-info-tip {
  font-size: 12px;
  .disqualified {
    .link
  }
  .auto-clear-stock-info {
    white-space: nowrap;
    &.with-margin {
      margin-top: 12px;
    }
  }
}
</style>
