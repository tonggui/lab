/** 正常编辑模式 **/

import { EDIT_TYPE } from '@/data/enums/common'
import { PRODUCT_AUDIT_STATUS } from '@/data/enums/product'
import lx from '@/common/lx/lxReport'

const NormalMixin = {
  computed: {
    mode () {
      return EDIT_TYPE.NORMAL
    },
    auditBtnText () {
      if (this.productInfo.auditStatus === PRODUCT_AUDIT_STATUS.AUDITING) return 'REVOCATION'
      return this.needAudit ? 'SUBMIT' : !this.spuId ? 'PUBLISH' : 'SAVE'
    },
    // 是否展示告警提示
    showWarningTip () {
      return false
    },
    // 是否为运营审核
    isManager () {
      return false
    },
    showShortCut () {
      // 审核场景下如果没有upcCode，需要隐藏快捷入口
      return this.shortCut
    },
    showUpcImage () {
      return false
    },
    showAuditProcess () {
      return false
    },
    // 非普通编辑模式，不获取字段更新的逻辑
    needCheckSpChangeInfo () {
      return true
    },
    needConfirmModal () {
      return true
    },
    allowSuggestCategory () {
      return ![
        PRODUCT_AUDIT_STATUS.AUDIT_APPROVED,
        PRODUCT_AUDIT_STATUS.AUDIT_CORRECTION_REJECTED
      ].includes(this.productInfo.auditStatus)
    },
    // 新建场景下是否需要审核
    createNeedAudit () {
      // 新建模式，只判断UPC不存在且选中为指定类目
      return this.formContext.categoryNeedAudit && !this.formContext.upcExisted
    },
    // 编辑场景下是否需要审核
    editNeedAudit () {
      if (this.originalProductCategoryNeedAudit) { // 编辑模式下•原始类目需审核，则命中纠错条件则需要审核
        return this.isNeedCorrectionAudit
      } else if (!this.originalProductCategoryNeedAudit && this.formContext.categoryNeedAudit) { // 编辑模式下•原始类目无需审核，当前选中为制定类目，需要审核
        return true
      }
      return false
    },
    // 商家是否需要提交审核
    needAudit () {
      const supportAudit = this.formContext.modules.supportAudit
      if (!supportAudit) return false
      // 门店未开启审核功能，则不启用审核状态
      if (!this.formContext.poiNeedAudit) return false

      if (!this.spuId) {
        return this.createNeedAudit
      } else {
        return this.editNeedAudit
      }
    },
    // 是否为纠错审核
    isNeedCorrectionAudit () {
      console.log('check')
      if (!this.spuId) return false // 新建场景不可能是纠错
      if (!this.formContext.poiNeedAudit) return false // 门店审核状态

      return this.checkCateNeedAudit()
    },
    // 表单是否需要验证
    isNeedFormValidate () {
      const auditStatus = this.productInfo.auditStatus
      // 兜底，防止审核中的商品在列表页出现
      return auditStatus !== PRODUCT_AUDIT_STATUS.AUDITING
    }
  },
  methods: {
    async handleConfirm () {
      const id = this.productInfo.id || 0
      // 点击重新提交审核/重新提交审核
      lx.mc({
        bid: 'b_shangou_online_e_3ebesqok_mc',
        val: { spu_id: id }
      })
      await this.checkSuggestCategory()
      await this.handleSubmit()
    }
  }
}

export default NormalMixin
