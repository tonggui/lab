import Vue from 'vue'
import { get } from 'lodash'
import { forwardComponent } from '@/common/vnode'
import { needCorrectionAudit } from './utils'

export default ({ getNeedAudit }) => (Form) => Vue.extend({
  name: 'audit-product-edit-container',
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
    upcExisted () {
      return !!this.value.isSp && !!this.value.upcCode
    },
    /**
     * 普通逻辑
     */
    needNormalAudit () {
      if (!this.auditSwitch.poi || !this.auditSwitch.category) {
        return false
      }
      return this.isEditMode ? !this.auditSwitch.originalCategory : !this.upcExisted
    },
    /**
     * 纠错送审
     */
    needCorrectionAudit () {
      if (!this.isEditMode) {
        return false
      }
      if (!this.auditSwitch.poi || !this.auditSwitch.originalCategory) {
        return false
      }
      return needCorrectionAudit(this.value, this.originalProduct)
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
    this.form = this.$refs.form.for
    await this.getAuditSwitch(this.value.category.id, true)
  },
  methods: {
    handleCancel () {
      this.$emit('cancel')
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
    }
  },
  render (h) {
    return forwardComponent(this, Form, {
      props: {
        value: this.value,
        confirmText: this.auditBtnText,
        isEditMode: this.isEditMode
      },
      ref: 'form',
      on: {
        confirm: this.handleConfirm,
        cancel: this.handleCancel,
        input: (v) => { this.$emit('input', v) }
      }
    })
  }
})
