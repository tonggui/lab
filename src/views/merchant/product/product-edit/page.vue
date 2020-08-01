<template>
  <div class="combine-product-edit">
    <PoiSelect v-model="poiIdList" />
    <Form
      v-model="productInfo"
      navigation
      ref="form"
      :confirmText="auditBtnText"
      :context="context"
      :is-edit-mode="isEditMode"
      @cancel="handleCancel"
      @confirm="handleConfirm"
    />
  </div>
</template>
<script>
  import Form from './form'
  import { ATTR_TYPE } from '@/data/enums/category'
  import { isEqual } from 'lodash'
  import { SKU_FIELD, SPU_FIELD } from '@/views/components/configurable-form/field'
  import lx from '@/common/lx/lxReport'
  import { PRODUCT_AUDIT_STATUS } from '@/data/enums/product'
  import { BUTTON_TEXTS, EDIT_TYPE } from '@/data/enums/common'
  import { poiId } from '@/common/constants'
  import { getAttributes } from '../../edit-page-common/common'
  import PoiSelect from './poi-select'

  export default {
    name: 'combine-product-edit',
    props: {
      product: Object,
      spuId: Number,
      isEditMode: Boolean,
      originalFormData: Object,
      poiNeedAudit: Boolean, // 门店开启审核状态
      supportAudit: Boolean, // 是否支持审核状态
      categoryNeedAudit: Boolean,
      originalProductCategoryNeedAudit: Boolean
    },
    data () {
      return {
        drawerVisible: false,
        poiIds: []
      }
    },
    components: { Form, PoiSelect },
    computed: {
      productInfo: {
        get () {
          return this.product
        },
        set (product) {
          this.$emit('change', product)
        }
      },
      poiIdList: {
        get () {
          return this.product.poiIds || []
        },
        set (poiIdList) {
          this.$emit('change', { ...this.product, poiIds: poiIdList })
        }
      },
      mode () {
        return EDIT_TYPE.NORMAL
      },
      auditBtnStatus () {
        if (this.productInfo.auditStatus === PRODUCT_AUDIT_STATUS.AUDITING) return 'REVOCATION'
        return this.needAudit ? 'SUBMIT' : !this.spuId ? 'PUBLISH' : 'SAVE'
      },
      auditBtnText () {
        return BUTTON_TEXTS[this.auditBtnStatus]
      },
      // 是否类目推荐
      allowSuggestCategory () {
        return ![
          PRODUCT_AUDIT_STATUS.AUDIT_APPROVED,
          PRODUCT_AUDIT_STATUS.AUDIT_CORRECTION_REJECTED
        ].includes(this.productInfo.auditStatus)
      },
      // 新建场景下是否需要审核
      createNeedAudit () {
        // 新建模式，只判断UPC不存在且选中为指定类目
        return this.categoryNeedAudit && !this.productInfo.upcCode
      },
      // 编辑场景下是否需要审核
      editNeedAudit () {
        if (this.originalProductCategoryNeedAudit) { // 编辑模式下•原始类目需审核，则命中纠错条件则需要审核
          return this.isNeedCorrectionAudit
        } else if (!this.originalProductCategoryNeedAudit && this.categoryNeedAudit) { // 编辑模式下•原始类目无需审核，当前选中为制定类目，需要审核
          return true
        }
        return false
      },
      // 商家是否需要提交审核
      needAudit () {
        const supportAudit = this.supportAudit
        if (!supportAudit) return false
        // 门店未开启审核功能，则不启用审核状态
        if (!this.poiNeedAudit) return false

        if (!this.spuId) {
          return this.createNeedAudit
        } else {
          return this.editNeedAudit
        }
      },
      // 是否为纠错审核
      isNeedCorrectionAudit () {
        if (!this.spuId) return false // 新建场景不可能是纠错
        if (!this.poiNeedAudit) return false // 门店审核状态

        return this.checkCateNeedAudit()
      },
      context () {
        return {
          field: {
            supportLimitSaleMultiPoi: true,
            showCellularTopSale: false,
            disabledExistSkuColumnMap: {
              [SKU_FIELD.STOCK]: true,
              [SKU_FIELD.PRICE]: true
            },
            [SPU_FIELD.UPC_IMAGE]: this.needAudit
          },
          features: {
            allowCategorySuggest: this.allowSuggestCategory // 根据审核变化
          }
        }
      }
    },
    methods: {
      checkCateNeedAudit () {
        // 初始状态的类目需要审核，才会出现纠错审核
        if (this.originalProductCategoryNeedAudit) {
          const newData = this.productInfo
          const oldData = this.originalFormData
          if (newData.upcCode !== oldData.upcCode) return true
          if ((!newData.category && oldData.category) ||
            (newData.category && !oldData.category) ||
            (newData.category.id !== oldData.category.id)) return true
          let isSpecialAttrEqual = true

          const { normalAttributes = [], normalAttributesValueMap = {} } = getAttributes(
            newData)
          const { normalAttributesValueMap: oldNormalAttributesValueMap = {} } = getAttributes(
            oldData)
          for (let i = 0; i < normalAttributes.length; i++) {
            const attr = normalAttributes[i]
            if (attr.attrType === ATTR_TYPE.SPECIAL) {
              if (!isEqual(normalAttributesValueMap[attr.id], oldNormalAttributesValueMap[attr.id])) {
                isSpecialAttrEqual = false
                break
              }
            }
          }
          return !isSpecialAttrEqual
        }
        return false
      },
      // 提交后弹窗
      popConfirmModal () {
        // 正常新建编辑场景下如果提交审核需要弹框
        if (this.needAudit) {
          lx.mv({
            bid: 'b_shangou_online_e_nwej6hux_mv',
            val: { spu_id: this.spuId || 0 }
          })
          this.$Modal.confirm({
            title: `商品${this.productInfo.id ? '修改' : '新建'}成功`,
            content: '<div><p>商品审核通过后才可正常售卖，预计1-2个工作日完成审核，请耐心等待。</p><p>您可以在【商品审核】中查看审核进度。</p></div>',
            centerLayout: true,
            iconType: null,
            okText: '返回商品列表',
            cancelText: '查看商品审核',
            onOk: () => {
              this.handleCancel() // 返回
            },
            onCancel: () => {
              lx.mc({
                bid: 'b_shangou_online_e_uxik0xal_mc',
                val: { spu_id: this.spuId || 0 }
              })
              this.$router.replace({ name: 'productAuditList', query: { wmPoiId: poiId } })
            }
          })
        } else {
          this.handleCancel() // 返回
        }
      },
      handleCancel () {
        this.$emit('on-cancel')
      },
      async handleConfirm (callback, context = {}) {
        const wholeContext = {
          ...context,
          ...this.$refs.form.form.getPluginContext()
        }
        await this.submit(callback, wholeContext)
      },
      async submit (callback, context) {
        const cb = (err) => {
          if (err) {
            lx.mc({ bid: 'b_a3y3v6ek', val: { op_type: 0, op_res: 0, fail_reason: err.message, spu_id: this.spuId || 0 } })
            this.handleSubmitError(err)
          } else {
            lx.mc({ bid: 'b_a3y3v6ek', val: { op_type: 0, op_res: 1, fail_reason: '', spu_id: this.spuId || 0 } })
            this.popConfirmModal()
          }
          callback()
        }
        if (this.auditBtnText === BUTTON_TEXTS.REVOCATION) {
          this.$emit('on-revocation', this.productInfo, cb)
        } else {
          this.$emit('on-submit', this.productInfo, context, cb)
        }
      }
    }
  }
</script>
