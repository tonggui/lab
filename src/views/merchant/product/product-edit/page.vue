<template>
  <div class="combine-product-edit">
    <Alert v-if="showMissingInfoTip" class="sticky-alert" type="error" show-icon>必填信息缺失，商品无法上架售卖。请尽快补⻬所有必填信息(“*”标识项)</Alert>
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
  import { get, isFunction } from 'lodash'
  import { SKU_FIELD, SPU_FIELD } from '@/views/components/configurable-form/field'
  import lx from '@/common/lx/lxReport'
  import { PRODUCT_AUDIT_STATUS, PRODUCT_AUDIT_TYPE } from '@/data/enums/product'
  import { BUTTON_TEXTS } from '@/data/enums/common'
  import PoiSelect from '../../components/poi-select'
  import { diffKeyAttrs } from '@/common/product/audit'
  import TimeCounters, { FillTime, SearchTime } from '@/common/lx/lxReport/lxTime'
  import { getProductChangInfo } from '@/common/utils'
  // 仅用于埋点参数
  const BIDS = {
    'SUBMIT': 'b_shangou_online_e_3ebesqok_mc',
    'PUBLISH': 'b_cswqo6ez',
    'SAVE': 'b_cswqo6ez'
  }

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
      originalProductCategoryNeedAudit: Boolean,
      upcIsSp: Boolean,
      upcIsAuditPassProduct: Boolean,
      isAuditFreeProduct: Boolean
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
      auditBtnStatus () {
        if (this.productInfo.auditStatus === PRODUCT_AUDIT_STATUS.AUDITING) return 'REVOCATION'
        return this.needAudit ? 'SUBMIT' : !this.spuId ? 'PUBLISH' : 'SAVE'
      },
      showMissingInfoTip () {
        return get(this.productInfo, 'isMissingInfo', false)
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
        // 新建模式，标品库存在的非标品不走审核逻辑
        return this.categoryNeedAudit && !this.productInfo.spId
      },
      // 编辑场景下是否需要审核
      editNeedAudit () {
        if (this.originalProductCategoryNeedAudit) { // 编辑模式下•原始类目需审核，则命中纠错条件则需要审核
          return this.checkCateNeedAudit()
        } else if (!this.originalProductCategoryNeedAudit && this.categoryNeedAudit) { // 编辑模式下•原始类目无需审核，当前选中为制定类目，需要审核
          return true
        }
        return false
      },
      isCreateMode () {
        if (!this.spuId) return true
        if (get(this.product, 'isMissingInfo', false)) return true
        return false
      },
      // 商家是否需要提交审核
      realNeedAudit () {
        const supportAudit = this.supportAudit
        if (!supportAudit) return false
        // 门店未开启审核功能，则不启用审核状态
        if (!this.poiNeedAudit) return false

        if (this.isCreateMode) { // 新建逻辑判断
          return this.createNeedAudit
        } else { // 编辑逻辑判断
          return this.editNeedAudit
        }
      },
      // 商家是否需要提交审核
      needAudit () {
        if (this.isProductAuditFree) return false
        return this.realNeedAudit
      },
      // 是否为纠错审核
      isNeedCorrectionAudit () {
        if (this.isCreateMode) return false // 新建场景不可能是纠错
        if (!this.poiNeedAudit) return false // 门店审核状态

        return this.checkCateNeedAudit()
      },
      // 是否是免审
      isProductAuditFree () {
        if (!this.realNeedAudit) return false
        return (![PRODUCT_AUDIT_STATUS.AUDITING, PRODUCT_AUDIT_STATUS.START_SELL_AUDITING].includes(this.productInfo.auditStatus) && this.isAuditFreeProduct)
      },
      context () {
        return {
          field: {
            // 商家商品中心，固定不支持，写死
            [SPU_FIELD.PRODUCT_VIDEO]: {
              visible: false
            },
            [SPU_FIELD.UPC_IMAGE]: {
              visible: this.needAudit && !this.upcIsSp && !this.upcIsAuditPassProduct
            }
          },
          features: {
            needPicSync: !(this.productInfo.pictureContentList && this.productInfo.pictureContentList.length),
            navigation: true,
            spuId: this.spuId,
            // TODO 审核暂不支持，所以写死，融合的时候去掉
            allowAddSpec: true,
            supportLimitSaleMultiPoi: true,
            showCellularTopSale: false,
            disabledExistSkuColumnMap: {
              [SKU_FIELD.STOCK]: true,
              [SKU_FIELD.PRICE]: true
            },
            audit: {
              originalProduct: this.originalFormData,
              approveSnapshot: this.productInfo.approveSnapshot,
              needCorrectionAudit: this.isNeedCorrectionAudit && !this.isProductAuditFree,
              snapshot: this.productInfo.snapshot,
              productSource: this.productInfo.productSource
            },
            allowSuggestCategory: this.allowSuggestCategory // 根据审核变化
          }
        }
      }
    },
    methods: {
      checkCateNeedAudit () {
        // 初始状态的类目需要审核，才会出现纠错审核
        if (this.originalProductCategoryNeedAudit) {
          const oldData = this.originalFormData
          const newData = this.productInfo
          return diffKeyAttrs(oldData, newData)
        }
        return false
      },
      // 提交后弹窗
      popConfirmModal (response) {
        // 正常新建编辑场景下如果提交审核需要弹框
        if (this.needAudit) {
          lx.mv({
            bid: 'b_shangou_online_e_nwej6hux_mv',
            val: { spu_id: this.spuId || 0 }
          })
          /**
           * 审核类型
           * 1-先审后发；
           * 2-先发后审
           */
          const { auditType } = response || {}
          const tip = auditType === PRODUCT_AUDIT_TYPE.START_SELL ? [
            '商品上架后可正常售卖，同时平台会进行审核，信息不准确会导致审核驳回，驳回后商品不可上架售卖。'
          ] : [
            '此商品已送平台审核，审核中不可售卖。',
            '预计1-2工作日由平台审核通过后才可上架售卖。审核驳回的商品也不可售卖。',
            '您可以再【商品审核】中查看审核进度。'
          ]
          const $modal = this.$Modal.confirm({
            title: `商品${this.productInfo.id ? '修改' : '新建'}成功`,
            content: `<div>${tip.map(t => `<p>${t}</p>`).join('')}</div>`,
            centerLayout: true,
            iconType: null,
            scrollable: true,
            okText: '返回商品列表',
            cancelText: '查看商品审核',
            onOk: () => {
              if ($modal.destroy && isFunction($modal.destroy)) $modal.destroy()
              this.handleCancel() // 返回
            },
            onCancel: () => {
              lx.mc({
                bid: 'b_shangou_online_e_uxik0xal_mc',
                val: { spu_id: this.spuId || 0 }
              })
              if ($modal.destroy && isFunction($modal.destroy)) $modal.destroy()
              this.$router.replace({ name: 'merchantAuditList' })
            }
          })
        } else {
          this.$Message.success(`商品${this.productInfo.id ? '修改' : '新建'}成功`)
          this.handleCancel() // 返回
        }
      },
      handleCancel () {
        // 取消按钮埋点
        lx.mc({
          bid: 'b_gw4jtsa6',
          val: { spu_id: this.spuId || 0 }
        })
        this.$emit('on-cancel')
      },
      handleSubmitError (err) {
        if (err.code === 1013) {
          this.$Modal.error({
            icon: null,
            width: 520,
            title: '条码不合法，请核对是否存在以下几种情况',
            content: err.message
          })
        } else {
          const errorMessage = (err && err.message) || err || '保存失败'
          this.$Message.error(errorMessage)
        }
      },
      async handleConfirm (callback, context = {}) {
        // 保存按钮埋点
        lx.mc({
          bid: BIDS[this.auditBtnStatus],
          val: { spu_id: this.spuId || 0 }
        })

        const showLimitSale = get(this.$refs.form.formContext, `field.${SPU_FIELD.LIMIT_SALE}.visible`)
        const wholeContext = {
          ...context,
          isNeedCorrectionAudit: this.isNeedCorrectionAudit,
          needAudit: this.realNeedAudit,
          ...this.$refs.form.form.getPluginContext(),
          showLimitSale,
          isAuditFreeProduct: this.isProductAuditFree
        }
        // 先发后审 审核中编辑 saveType
        if (this.product.auditStatus === PRODUCT_AUDIT_STATUS.START_SELL_AUDITING) {
          wholeContext.saveType = 3
        }
        this.submit(callback, wholeContext)
      },
      submit (callback, context) {
        const cb = (response, err) => {
          response = response || {}
          if (err) {
            lx.mc({
              bid: 'b_a3y3v6ek',
              val: {
                op_type: 0,
                op_res: 0,
                fail_reason: err.message,
                spu_id: this.spuId || 0,
                st_spu_id: this.product.spId || 0,
                page_source: 12
              }
            })
            this.handleSubmitError(err)
          } else {
            FillTime.fillEndTime = +new Date()
            lx.mc({
              bid: 'b_a3y3v6ek',
              val: {
                op_type: 0,
                op_res: 1,
                fail_reason: '',
                spu_id: this.spuId || response.id || 0,
                st_spu_id: this.product.spId || 0,
                page_source: 12
              }
            })
            if (!this.spuId) {
              lx.mv({
                bid: 'b_shangou_online_e_aifq7sdx_mv',
                val: {
                  spu_id: this.spuId || response.id || 0,
                  st_spu_id: this.product.spId || 0,
                  source_id: 2,
                  viewtime: `${(SearchTime.getSearchTime() + FillTime.getFillTime() + TimeCounters.getTotal('poi')).toFixed(2)}, ${SearchTime.getSearchTime()}, ${(FillTime.getFillTime() + TimeCounters.getTotal('poi')).toFixed(2)}`,
                  list: TimeCounters.getResult(),
                  select_time: +new Date(response && response.serverTime ? response.serverTime : Date.now()).getTime(),
                  trace_id: response.traceId || ''
                }
              })
              lx.mv({
                bid: 'b_shangou_online_e_5f609qb1_mv',
                val: {
                  st_spu_id: this.product.spId || 0,
                  op_type: this.product.spId ? 1 : 0,
                  poi_num: this.poiIdList.length
                }
              })
            }
            this.popConfirmModal(response)
          }
          if (isFunction(callback)) callback()
        }
        if (this.auditBtnText === BUTTON_TEXTS.REVOCATION) {
          this.$emit('on-revocation', this.productInfo, callback)
        } else {
          this.$emit('on-submit', this.productInfo, context, cb)
        }
      },
      pageLeave () {
        if (!this.spuId) {
          lx.mc({
            cid: 'c_shangou_online_e_0jqze6bd',
            bid: 'b_shangou_online_e_7cxe0v96_mc',
            val: {
              list: getProductChangInfo(this.product),
              op_type: this.product.spId ? 1 : 0
            }
          })
        }
      }
    },
    mounted () {
      this.createTime = +new Date()
      FillTime.fillStartTime = +new Date()
      window.addEventListener('beforeunload', this.pageLeave)
    },
    beforeDestroy () {
      this.pageLeave()
    }
  }
</script>
