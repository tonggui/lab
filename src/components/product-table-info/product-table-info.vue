<template>
  <div class="product-table-info">
    <div class="product-table-info-img">
      <ProductInfoImage :disabled="disabled" :product="product" :editable="pictureEditable" @change="handleChangePicture" />
    </div>
    <div class="product-table-info-desc">
      <div class="product-table-info-desc-name" :class="{ 'two-line': !hasDisplayInfo }">
        <EditInput :disabled="disabled" v-if="nameEditable" :value="product.name" :on-confirm="handleChangeName">
          <Icon slot="icon" local="edit" size="20" class="edit-icon" :class="{ disabled }" color="#F89800" v-mc="{ bid: 'b_shangou_online_e_s40fd186_mc' }" />
        </EditInput>
        <template v-else>{{ product.name }}</template>
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
        <div v-if="product.errorTip" class="danger">{{ product.errorTip }}</div>
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
      pictureEditable: Boolean,
      nameEditable: Boolean,
      createCallback: {
        type: Function,
        default: createCallback
      },
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
        createAddQualificationModal(this.disqualifiedTip)
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
    }
    &-name {
      width: 100%;
      font-weight: normal;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
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
}
</style>
