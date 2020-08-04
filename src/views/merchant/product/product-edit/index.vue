<template>
  <div class="combine-product-edit">
    <PoiSelect v-model="poiIdList" />
    <AuditForm
      v-model="product"
      navigation
      ref="form"
      :auditStatus="auditStatus"
      :context="context"
      :is-edit-mode="isEditMode"
      @cancel="handleCancel"
      @confirm="handleConfirm"
    />
  </div>
</template>
<script>
  import Form from './form'
  import PoiSelect from '../../components/poi-select'
  import {
    fetchGetProductDetail, // 商家商品中心获取详情接口
    fetchSaveOrUpdateProduct, // 商家商品中心保存或更新接口
    fetchGetNeedAudit // 商家商品中心审核权限获取接口
  } from '@/data/repos/merchantProduct'
  import createAuditForm from '@/views/components/configurable-form/audit/product-edit'
  import { SKU_FIELD, SPU_FIELD } from '@/views/components/configurable-form/field'
  import { PRODUCT_AUDIT_STATUS } from '@/data/enums/product'
  import Layout from '@/views/components/configurable-form/audit/audit-reject-tip-layout'

  const AuditForm = createAuditForm({ getNeedAudit: fetchGetNeedAudit })(Form)

  export default {
    name: 'merchant-product-edit',
    components: { AuditForm, PoiSelect },
    data () {
      return {
        loading: false,
        product: {},
        auditStatus: undefined,
        poiIdList: []
      }
    },
    computed: {
      context () {
        const allowCategorySuggest = ![
          PRODUCT_AUDIT_STATUS.AUDIT_APPROVED,
          PRODUCT_AUDIT_STATUS.AUDIT_CORRECTION_REJECTED
        ].includes(this.auditStatus)
        return {
          field: {
            [SPU_FIELD.UPC_CODE]: {
              layout: Layout
            }
          },
          features: {
            allowCategorySuggest,
            supportLimitSaleMultiPoi: true,
            showCellularTopSale: false,
            disabledExistSkuColumnMap: {
              [SKU_FIELD.STOCK]: true,
              [SKU_FIELD.PRICE]: true
            }
          }
        }
      },
      spuId () {
        return +(this.$route.query.spuId || 0)
      },
      isEditMode () {
        return this.spuId > 0
      }
    },
    created () {
      if (this.spuId) {
        this.getProduct()
      }
    },
    methods: {
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
      handleSubmitSuccess () {
        if (!this.needNormalAudit && !this.needCorrectionAudit) {
          this.handleCancel()
        }
        this.$Modal.confirm({
          title: `商品${this.isEditMode ? '修改' : '新建'}成功`,
          content: '<div><p>商品审核通过后才可正常售卖，预计1-2个工作日完成审核，请耐心等待。</p><p>您可以在【商品审核】中查看审核进度。</p></div>',
          centerLayout: true,
          iconType: null,
          okText: '返回商品列表',
          cancelText: '查看商品审核',
          onOk: this.handleCancel,
          onCancel: () => {
            this.$router.replace({ path: '/merchant/audit/list' })
          }
        })
      },
      async handleConfirm ({ needNormalAudit, needCorrectionAudit }, callback) {
        try {
          const context = this.$refs.form.form.getPluginContext()
          const { ignoreId = null, suggest = { id: '' } } = context._SuggestCategory_ || {
            ignoreId: null,
            suggest: { id: '' }
          }
          await fetchSaveOrUpdateProduct(this.product, {
            ignoreSuggestCategory: !!ignoreId,
            suggestCategoryId: suggest.id,
            needNormalAudit,
            needCorrectionAudit
          })
          this.handleSubmitSuccess()
        } catch (err) {
          this.handleSubmitError(err)
        } finally {
          callback()
        }
      },
      handleCancel () {
        this.$router.back()
      },
      async getProduct () {
        this.loading = true
        const { auditStatus, poiIds, ...product } = await fetchGetProductDetail(this.spuId)
        this.poiIdList = poiIds
        this.product = product
        this.auditStatus = auditStatus
        this.loading = false
      }
    }
  }
</script>
