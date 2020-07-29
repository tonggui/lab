<template>
  <div class="product-audit-check">
    <Loading v-if="loading" />
    <div v-else class="form-container" :class="{ 'with-task-list': showProcessList }">
      <Alert v-if="warningTip" type="warning" show-icon>{{ warningTip }}</Alert>
      <Form
        v-model="product"
        :disabled="auditing"
        :context="context"
        @cancel="handleCancel"
        @confirm="handleConfirm"
      >
        <template slot="footer">
          <Button>取消</Button>
          <Button type="primary" @click="handleConfirm">{{ auditBtnText }}</Button>
          <!-- <Button v-if="auditing" type="primary">撤销</Button>
          <Button v-else-if="needAudit" type="primary">{{ auditBtnText }}</Button>
          <Button v-else type="primary">保存</Button> -->
        </template>
      </Form>
    </div>
    <AuditProcessList
      ref="process"
      :product="product"
      :show="showProcessList"
    />
  </div>
</template>
<script>
  import { AuditTriggerMode, PRODUCT_AUDIT_STATUS } from '@/data/enums/product'
  import { WARNING_TIP } from './constants'
  import AuditProcessList from './audit-process-list'
  import DefaultMixin from '../edit-page-common/defaultMixin'
  import { BUTTON_TEXTS, EDIT_TYPE } from '@/data/enums/common'
  import { fetchGetAuditProductDetail } from '@/data/repos/product'
  import Form from './form'
  import lx from '@/common/lx/lxReport'
  import errorHandler from '@/views/edit-page-common/error'
  import { cloneDeep } from 'lodash'
  import { categoryTemplateMix } from '@/views/category-template'
  import { SPU_FELID } from '@/views/components/configurable-form/felid'

  export default {
    name: 'product-audit-check',
    mixins: [categoryTemplateMix, DefaultMixin],
    data () {
      return {
        productSource: undefined, // 纠错送审还是xxx
        snapshot: {}, // 快照
        approveSnapshot: {}, // xxx快照?
        product: {}, // 商品信息,
        loading: false
      }
    },
    inject: ['appState'],
    computed: {
      mode () {
        return EDIT_TYPE.CHECK_AUDIT
      },
      auditBtnStatus () {
        if (this.product.auditStatus === PRODUCT_AUDIT_STATUS.AUDITING) {
          return 'REVOCATION'
        }
        return this.needAudit ? 'RESUBMIT' : 'SAVE'
      },
      auditBtnText () {
        return BUTTON_TEXTS[this.auditBtnStatus]
      },
      warningTip () {
        return WARNING_TIP[this.product.auditStatus] || ''
      },
      // TODO? showShortCut
      showShortCut () {
        const { id, upcCode } = this.product
        // 审核场景下如果没有upcCode，需要隐藏快捷入口
        return !!(id && upcCode)
      },
      // TODO 允许类目推荐
      allowSuggestCategory () {
        return ![
          PRODUCT_AUDIT_STATUS.AUDIT_APPROVED,
          PRODUCT_AUDIT_STATUS.AUDIT_REJECTED,
          PRODUCT_AUDIT_STATUS.AUDIT_CORRECTION_REJECTED
        ].includes(this.product.auditStatus)
      },
      // TODO showUpcImage?
      showUpcImage () {
        return true
      },
      context () {
        // TODO 需要设置?
        return {
          felid: {
            [SPU_FELID.TAG_LIST]: {
              // TODO taglist设置?
              required: !this.usedBusinessTemplate
            }
          },
          features: {
            allowCategorySuggest: this.allowSuggestCategory // 根据审核变化
          }
        }
      },
      spuId () {
        return this.$route.query.spuId
      },
      auditing () {
        return this.auditStatus === PRODUCT_AUDIT_STATUS.AUDITING
      },
      // 是否展示审核步骤
      showProcessList () {
        const list = this.product.taskList
        return (
          (this.$refs['process'] &&
          this.$refs['process'].showList &&
          this.$refs['process'].showList(true, list)) ||
          false
        )
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
      needAudit () {
        const supportAudit = this.supportAudit
        if (!supportAudit) return false
        // 门店未开启审核功能，则不启用审核状态
        if (!this.poiNeedAudit) return false

        const auditStatus = this.product.auditStatus
        // 审核详情查看页面，均需要走审核逻辑（除非是审核中，走撤销逻辑）
        if (auditStatus !== PRODUCT_AUDIT_STATUS.AUDIT_APPROVED) {
          // 审核驳回状态下，如果UPC不存在且选中类目为需审核类目，需要审核，其他为可保存
          if (auditStatus === PRODUCT_AUDIT_STATUS.AUDIT_REJECTED) {
            return this.categoryNeedAudit
          }
          // 审核撤销状态下，必须送审
          if (auditStatus === PRODUCT_AUDIT_STATUS.AUDIT_REVOCATION) {
            return true
          }
          return this.isNeedCorrectionAudit
        }

        return this.editNeedAudit
      },
      isNeedCorrectionAudit () {
        if (!this.poiNeedAudit) return false // 门店审核状态
        const auditStatus = this.product.auditStatus

        // 审核详情页面，审核通过走编辑场景的逻辑
        if (auditStatus !== PRODUCT_AUDIT_STATUS.AUDIT_APPROVED) {
          // 审核驳回，只允许重新提审，且提审后一直都是审核纠错状态
          if (auditStatus === PRODUCT_AUDIT_STATUS.AUDIT_CORRECTION_REJECTED) {
            return true
          }
          return false
        }
        return this.checkCateNeedAudit()
      },
      // TODO 表单是否需要校验
      isNeedFormValidate () {
        const auditStatus = this.product.auditStatus
        // 审核撤销场景，不需要表单校验
        return auditStatus !== PRODUCT_AUDIT_STATUS.AUDITING
      }
    },
    components: {
      AuditProcessList,
      Form
    },
    methods: {
      async getAuditDetail () {
        this.loading = true
        try {
          const { productSource, currentMis, processId, snapshot, approveSnapshot, ...product
          } = await fetchGetAuditProductDetail(this.spuId)
          this.product = product
          this.originalFormData = cloneDeep(this.product) // TODO 对之前数据进行拷贝
          // TODO 这几个需要?
          this.productSource = productSource
          this.snapshot = snapshot
          this.approveSnapshot = approveSnapshot
        } catch (err) {
          console.error(err)
          this.$Message.error(err.message)
        } finally {
          this.loading = false
        }
      },
      createModal (resolve, reject) {
        let tip = '注：选择"撤销"后，新建的商品会被删除，在售商品可重新提审'
        switch (this.product.triggerMode) {
        case AuditTriggerMode.CREATE:
          tip = '注：该商品是新建商品，若选择"撤销"会删除商品'
          break
        case AuditTriggerMode.MODIFY:
          tip = '撤销后可重新提交审核'
          break
        default: break
        }
        const $modal = this.$Modal.open({
          title: '撤销商品审核',
          content: `撤销【${this.product.name}】的信息审核。<br><br>${tip}`,
          centerLayout: true,
          iconType: '',
          width: 412,
          closable: true,
          renderFooter: () => (
              <div>
              <Button onClick={async () => {
            try {
              resolve(true)
              $modal.destroy()
            } catch (err) {
              this.$Message.error(err.message)
              throw err
            }
          }}>撤销</Button>
          <Button type="primary"onClick={() => {
            $modal.destroy()
            // TODO 页面跳转地址
            this.$router.replace({ name: 'productInfoAuditCheck', query: { ...this.$route.query, spuId: this.product.id, modify: '1' } })
          }}>修改商品</Button>
          </div>
        )
        })
      },
      async requestUserConfirm () {
        const id = this.product.id || 0
        if (['RESUBMIT', 'SUBMIT'].includes(this.auditBtnStatus)) {
          // 点击重新提交审核/重新提交审核
          lx.mc({
            bid: 'b_shangou_online_e_3ebesqok_mc',
            val: { spu_id: id }
          })
        }
        if (this.product.auditStatus === PRODUCT_AUDIT_STATUS.AUDITING) {
          // 撤销审核的点击
          lx.mc({
            bid: 'b_shangou_online_e_2410gzln_mc',
            val: { spu_id: id }
          })
          // TODO
          return new Promise((resolve, reject) => {
            this.createModal(resolve, reject)
          })
        }
        return true
      },
      async handleConfirm (callback, context) {
        if (context.validType) this.validType = context.validType
        try {
          if (this.auditBtnText === BUTTON_TEXTS.REVOCATION) {
            if (await this.requestUserConfirm()) {
              this.handleRevocation()
            }
          } else {
            if (!await this.$refs['form'].validate()) {
              this.handleSubmit()
            }
          }
          this.handleCancel() // 返回
        } catch (err) {
          // 错误处理
          errorHandler(err)({
            isBusinessClient: this.isBusinessClient,
            confirm: this.handleConfirm
          })
        } finally {
          callback()
        }
      },
      handleCancel () {
        this.$tryToNext()
      }
    },
    mounted () {
      try {
        if (this.spuId) {
          this.getAuditDetail()
          this.getGetNeedAudit(true)
        }
      } catch (err) {
        console.error(err)
        this.$Message.error(err.message)
      } finally {
        this.loading = false
      }
    }
  }
</script>
<style lang="less" scoped>
.product-audit-check {
  display: flex;
  width: 100%;
  .form-container {
    width: 100%;
    &.with-task-list {
      width: 75%;
    }
  }
}
</style>
