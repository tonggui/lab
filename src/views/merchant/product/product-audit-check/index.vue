<template>
  <div class="product-audit-check">
    <Loading v-if="loading" />
    <div v-else class="form-container with-task-list">
      <Alert v-if="warningTip" type="warning" show-icon>{{ warningTip }}</Alert>
      <AuditCheckForm
        navigation
        v-model="product"
        :originalProduct="originalProduct"
        ref="form"
        :disabled="auditing"
        :context="context"
        :auditStatus="auditStatus"
        isEditMode
        @confirm="handleConfirm"
        @cancel="handleCancel"
        @revocation="handleRevocation"
      />
    </div>
    <AuditProcessList
      ref="process"
      :auditTaskList="auditTaskList"
      :auditStatus="auditStatus"
    />
  </div>
</template>
<script>
  import { cloneDeep } from 'lodash'
  import { WARNING_TIP } from './constants'
  import AuditProcessList from '@/views/components/audit-process-list'
  import Form from './form'
  import { AuditTriggerMode, PRODUCT_AUDIT_STATUS } from '@/data/enums/product'
  import {
    fetchGetAuditProductDetail,
    fetchGetNeedAudit
  } from '@/data/repos/product'
  import {
    // fetchGetAuditProductDetail,
    fetchGetProductRevocation, // 商家商品中心撤回接口
    fetchSaveOrUpdateProduct // 商家商品中心保存或更新接口
    // fetchGetNeedAudit // 商家商品中心审核权限获取接口
  } from '@/data/repos/merchantProduct' // 审核详情接口
  import createAuditCheckForm from '@/views/components/configurable-form/audit/audit-check'
  import { SKU_FIELD } from '@/views/components/configurable-form/field'

  const AuditCheckForm = createAuditCheckForm({ getNeedAudit: fetchGetNeedAudit })(Form)

  export default {
    name: 'merchant-product-audit-check',
    data () {
      return {
        loading: false,
        auditTaskList: [],
        auditStatus: undefined,
        product: {},
        originalProduct: {},
        approveSnapshot: {}
      }
    },
    components: {
      AuditProcessList,
      AuditCheckForm
    },
    computed: {
      auditing () {
        return this.auditStatus === PRODUCT_AUDIT_STATUS.AUDITING
      },
      warningTip () {
        return WARNING_TIP[this.auditStatus] || ''
      },
      spuId () {
        return +(this.$route.query.spuId || 0)
      },
      context () {
        return {
          features: {
            supportLimitSaleMultiPoi: true,
            showCellularTopSale: false,
            disabledExistSkuColumnMap: {
              [SKU_FIELD.STOCK]: true,
              [SKU_FIELD.PRICE]: true
            },
            audit: {
              originalProduct: this.originalProduct,
              approveSnapshot: this.approveSnapshot
            }
          }
        }
      }
    },
    created () {
      this.getDetail()
    },
    methods: {
      computeAuditFieldTips (item) {
        // TODO
        if (['upcCode', 'category', 'name'].includes(item.key)) {
          return []
        }
        return []
      },
      async handleRevocation () {
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
        const revocation = async () => {
          await fetchGetProductRevocation(this.spuId)
          $modal.destroy()
          this.handleCancel()
        }
        const edit = () => {
          $modal.destroy()
          // TODO 地址
          this.$router.replace({ name: 'auditCheckEditTo', query: { ...this.$route.query, spuId: this.productInfo.id } })
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
              <Button onClick={revocation}>撤销</Button>
              <Button type="primary"onClick={edit}>修改商品</Button>
            </div>
          )
        })
      },
      handleCancel () {
        this.$router.back()
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
      async handleConfirm ({ needNormalAudit, needCorrectionAudit }, callback) {
        try {
          await fetchSaveOrUpdateProduct({
            needNormalAudit,
            needCorrectionAudit
          })
          this.handleCancel()
        } catch (err) {
          this.handleSubmitError(err)
        } finally {
          callback()
        }
      },
      async getDetail () {
        this.loading = true
        const {
          auditStatus,
          productSource,
          currentMis,
          processId,
          taskList,
          snapshot,
          approveSnapshot,
          ...product
        } = await fetchGetAuditProductDetail(this.spuId)
        this.product = product
        this.originalProduct = cloneDeep(product)
        this.auditStatus = auditStatus
        this.approveSnapshot = approveSnapshot
        this.auditTaskList = [...taskList, { nodeName: '商品审核完成' }]
        this.loading = false
      }
    }
  }
</script>
