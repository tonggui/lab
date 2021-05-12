<template>
  <Layout>
    <ProductInfoImage
      slot="image"
      :disabled="disabled"
      :product="product"
      :editable="pictureEditable"
      :show-marker="showMarker"
      :marker-type="markerType"
      :need-permission="needPermission"
      @change="handleChangePicture"
    />
    <template slot="name">
      <EditInput v-if="nameEditable" :disabled="disabled || !havePermission" :value="product.name" :on-confirm="handleChangeName" display-max-width="100%">
        <PermissionBtn
          slot="icon"
          component="Icon"
          :need-permission="needPermission"
          :btn-type="btnType"
          local="edit"
          size="20"
          :class="{ 'edit-icon': true, disabled }"
          color="#F89800"
          v-mc="{ bid: 'b_shangou_online_e_s40fd186_mc' }"
        ></PermissionBtn>
      </EditInput>
      <div v-else class="product-table-info-name">
        <div class="content" :class="{ 'two-line': !hasDisplayInfo }" :title="product.name">
          <span v-if="isCorrect" class="correct-tips">【纠错】</span>
          {{ product.name }}
        </div>
        <Tooltip v-if="lockedMap.name" transfer content="当前字段锁定，如需修改请联系业务经理" width="200">
          <Icon type="https" class="locked-icon" />
        </Tooltip>
      </div>
    </template>
    <template slot="description">
      <slot name="description">
        <span v-if="product.isMedicare" class="medicare-marker">医保商品</span>
        <small v-if="product.displayInfo" class="product-table-info-desc">
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
          <div v-if="product.isMissingInfo" class="danger">补全必填信息后，可上架售卖</div>
          <div v-if="product.stockoutAutoClearStock && showAutoClearStock" class="danger auto-clear-stock-info" :class="{ 'with-margin': !product.displayInfo }">
            门店/买家缺货取消订单后，会自动将商品库存清0 <a @click="handleCloseAutoClearStock" v-mc="{ bid: 'b_shangou_online_e_i78lph2w_mc', val: { product_id: product.id } }">关闭设置</a>
          </div>
          <div v-else-if="product.errorTip" class="danger">{{ product.errorTip }}</div>
          <div class="disqualified" v-else-if="disqualifiedTip" @click="handleAddQualifed">
            {{ disqualifiedTip }}
            <Icon type="keyboard-arrow-right" size=18 style="margin-left: -6px" />
          </div>
          <div class="danger nowrap" v-if="showPlatformLimitSaleRule && platformLimitSaleRuleList.length">
            当前商品由平台统一限购，门店设置的限购暂不生效｜<a @click.prevent="checkRuleDetail">查看平台限购规则</a>
          </div>
        </div>
      </slot>
    </template>
  </Layout>
</template>
<script>
  import Layout from './layout'
  import { isArray } from 'lodash'
  import ProductInfoImage from './product-info-image'
  import EditInput from '@components/edit-input/edit-input'
  import { validate } from '@sgfe/product-validate'
  import { createCallback } from '@/common/vuex'
  import createAddQualificationModal from '@/components/qualification-modal'
  import getPermissionMixin from '@/views/components/permission-bth/getPermissionMixin'

  export default {
    name: 'product-table-info',
    mixins: [getPermissionMixin('EDIT')],
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
      showCorrectTags: {
        type: Boolean,
        default: false
      },
      showAutoClearStock: Boolean,
      showPlatformLimitSaleRule: Boolean,
      markerType: String,
      disabled: Boolean,
      needPermission: Boolean
    },
    components: {
      Layout,
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
      platformLimitSaleRuleList () {
        return this.product.platformLimitSaleRuleList
      },
      nameEditable () {
        return this.editableMap.name && !this.lockedMap.name
      },
      pictureEditable () {
        return this.editableMap.picture && !this.lockedMap.picture
      },
      isCorrect () {
        return this.showCorrectTags && this.product.recoverySymbol === 1
      }
    },
    methods: {
      isArray () {
        return isArray
      },
      getRuleDisplay (rule) {
        const { type, name, frequency, count, startTime, endTime, multiPoi } = rule
        const str = `${name}: 每个买家，` + (type === 1 ? `每${frequency}天可购买${count}份商品；${startTime}至${endTime}` : `在${startTime}至${endTime}内，仅可购买${count}份商品`)
        return str + (multiPoi ? '，不允许跨店重复购买' : '')
      },
      checkRuleDetail () {
        const inst = this.$Modal.open({
          title: '平台限购规则',
          content: this.platformLimitSaleRuleList.map(rule => `<div style="line-height:1.2;margin: 5px 0">${this.getRuleDisplay(rule)}</div>`).join(''),
          width: '800px',
          renderFooter: () => (
            <Button type="primary" onClick={() => inst.destroy()}>关闭</Button>
          ),
          closable: true
        })
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
            success: '关闭缺货自动库存清0设置成功～',
            error: '关闭缺货自动库存清0设置失败！'
          }))
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  @import '~@/styles/common.less';
  @import "~@/styles/medicine-components/medicare.less";

  .product-table-info {
    &-desc {
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
        .correct-tips {
          color: @error-color;
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
  }

  .medicare-marker {
    .medicare-marker();
    display: inline;
    width: 62px;
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
  .nowrap {
    white-space: nowrap;
  }
</style>
