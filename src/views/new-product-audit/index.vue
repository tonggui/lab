<template>
  <div class="product-audit-check">
    <Loading v-if="loading" />
    <div v-else class="form-container" :class="{ 'with-task-list': showProcessList }">
      <Alert v-if="warningTip" type="warning" show-icon>{{ warningTip }}</Alert>
      <Form
        v-model="product"
        :disabled="auditing"
        @cancel="handleCancel"
        @confirm="handleConfirm"
      >
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
  import { PRODUCT_AUDIT_STATUS } from '@/data/enums/product'
  import { WARNING_TIP } from './constants'
  import AuditProcessList from './audit-process-list'
  import DefaultMixin from '../edit-page-common/defaultMixin'
  import CheckAuditMixin from './CheckAudit'
  import { BUTTON_TEXTS } from '@/data/enums/common'
  import { fetchGetAuditProductDetail, fetchRevocationSubmitEditProduct, fetchNormalSubmitEditProduct } from '@/data/repos/product'
  import Form from './form'

  export default {
    name: 'product-audit-check',
    mixins: [DefaultMixin, CheckAuditMixin],
    data () {
      return {
        productSource: undefined, // 纠错送审还是xxx
        snapshot: {}, // 快照
        approveSnapshot: {}, // xxx快照?
        product: {}, // 商品信息,
        loading: false
      }
    },
    computed: {
      warningTip () {
        return WARNING_TIP[this.product.auditStatus] || ''
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
          this.$refs['process'].showList(this.showAuditProcess, list)) ||
          false
        )
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
          // TODO
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
      handleConfirm () {
        if (this.auditBtnStatus === BUTTON_TEXTS.REVOCATION) {
          this.handleRevocation()
        } else {
          this.handleSubmit()
        }
      },
      handleCancel () {},
      async handleRevocation () {
        console.log('this.product', this.product)
        await fetchRevocationSubmitEditProduct(this.product)
      },
      async handleSubmit () {
        console.log('this.product', this.product)
        await fetchNormalSubmitEditProduct(this.product, {
          validType: this.validType, // TODO validType取值
          ignoreSuggestCategory: this.product.ignoreSuggestCategory, // TODO ignoreSuggestCategory取值
          suggestCategoryId: this.product.category.id, // TODO suggestCategoryId取值
          // editType,
          entranceType: this.$route.query.entranceType,
          dataSource: this.$route.query.dataSource,
          needAudit: this.needAudit,
          isNeedCorrectionAudit: this.isNeedCorrectionAudit
        })
      }
    },
    mounted () {
      if (this.spuId) {
        this.getAuditDetail()
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
  // .audit-process-container {
  //   flex: 1;
  //   margin: 0 0 66px 10px;
  //   background: #fff;
  //   .sticky {
  //     position: sticky;
  //     top: 0;
  //   }
  // }
}
</style>
