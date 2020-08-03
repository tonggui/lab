import Vue from 'vue'
import { get } from 'lodash'
import { needCorrectionAudit } from './utils'
import { PRODUCT_AUDIT_STATUS } from '@/data/enums/product'
import { forwardComponent } from '@/common/vnode'

export default ({ getNeedAudit }) => (Form) => Vue.extend({
  name: 'audit-check-container',
  components: { Form },
  props: {
    value: {
      type: Object,
      required: true
    },
    originalProduct: {
      type: Object,
      required: true
    },
    auditStatus: Number,
    isEditMode: Boolean
  },
  data () {
    return {
      submitting: false,
      auditSwitch: {
        poi: false,
        category: false,
        originalCategory: false
      }
    }
  },
  computed: {
    auditBtnText () {
      if (this.needCorrectionAudit) {
        return '重新提交审核'
      }
      if (this.needNormalAudit) {
        return '提交审核'
      }
      return '保存'
    },
    /**
     * 普通逻辑
     */
    needNormalAudit () {
      if (!this.auditSwitch.poi) {
        return false
      }
      if (this.auditStatus === PRODUCT_AUDIT_STATUS.AUDIT_REVOCATION) {
        return true
      }
      if (this.auditStatus === PRODUCT_AUDIT_STATUS.AUDIT_REJECTED) {
        return !this.auditSwitch.category
      }
      return false
    },
    /**
     * 纠错送审
     */
    needCorrectionAudit () {
      if (!this.auditSwitch.poi) {
        return false
      }
      if (this.auditStatus === PRODUCT_AUDIT_STATUS.AUDIT_APPROVED) {
        return needCorrectionAudit(this.value, this.originalProduct)
      }
      return this.auditStatus === PRODUCT_AUDIT_STATUS.AUDIT_CORRECTION_REJECTED
    }
  },
  watch: {
    'value.category.id' (id) {
      if (!id) {
        this.auditSwitch.category = false
      } else {
        this.getAuditSwitch()
      }
    }
  },
  async mounted () {
    // TODO ref的传递
    this.form = this.$refs.form.form
    await this.getAuditSwitch(this.value.category.id, true)
  },
  methods: {
    handleCancel () {
      this.$emit('cancel')
    },
    handleRevocation () {
      this.$emit('revocation')
    },
    async handleConfirm () {
      this.submitting = true
      this.$emit('confirm', {
        needNormalAudit: this.needNormalAudit,
        needCorrectionAudit: this.needCorrectionAudit
      }, () => {
        this.submitting = false
      })
    },
    async getAuditSwitch (original = false) {
      const categoryId = get(this.value, 'category.id')
      const { poiNeedAudit, categoryNeedAudit } = getNeedAudit(categoryId)
      this.auditSwitch.poi = !!poiNeedAudit
      this.auditSwitch.category = !!categoryNeedAudit
      if (original) {
        this.auditSwitch.originalCategory = !!categoryNeedAudit
      }
    },
    renderFooter () {
      const footer = [
        <Button onClick={this.handleCancel}>取消</Button>
      ]
      if (this.auditing) {
        footer.push(<Button type="primary" onClick={this.handleRevocation}>撤销</Button>)
      } else {
        footer.push(<Button type="primary" onClick={this.handleConfirm}>{this.auditBtnText}</Button>)
      }
      return footer
    }
  },
  render (h) {
    const $footer = this.renderFooter(h)
    return forwardComponent(this, Form, {
      props: {
        value: this.value,
        isEditMode: this.isEditMode
      },
      ref: 'form',
      on: {
        input: (v) => { this.$emit('input', v) }
      }
    }, [h('template', { slot: 'footer' }, [$footer])])
  }
})
