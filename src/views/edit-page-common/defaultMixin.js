import {
  fetchGetNeedAudit,
  fetchNormalSubmitEditProduct, fetchRevocationSubmitEditProduct
} from '@/data/repos/product'
import { ATTR_TYPE } from '@/data/enums/category'
import { isEqual } from 'lodash'
import { splitCategoryAttrMap } from '@/views/components/product-form/data'
import { poiId } from '@/common/constants'
import lx from '@/common/lx/lxReport'

export default {
  data () {
    return {
      originalFormData: {},
      poiNeedAudit: false, // 门店开启审核状态
      supportAudit: true, // 是否支持审核状态
      categoryNeedAudit: false,
      originalProductCategoryNeedAudit: false,
      upcExisted: false,
      validType: null // TODO 提交接口需要?
    }
  },
  computed: {
  },
  watch: {
    'product.category' (category) {
      this.getGetNeedAudit()
    }
  },
  methods: {
    // 获取商家是否需要审核
    async getGetNeedAudit (changeOrigin = false) {
      const { category = { id: '' } } = this.product
      // 获取商品是否满足需要送审条件
      if (category && category.id) {
        const { poiNeedAudit, categoryNeedAudit } = await fetchGetNeedAudit(category.id)
        this.poiNeedAudit = poiNeedAudit
        this.categoryNeedAudit = categoryNeedAudit
        if (changeOrigin) this.originalProductCategoryNeedAudit = categoryNeedAudit
      }
    },
    // 是否需要审核判断之一
    checkCateNeedAudit () {
      // 初始状态的类目需要审核，才会出现纠错审核
      if (this.originalProductCategoryNeedAudit) {
        const newData = this.product
        const oldData = this.originalFormData
        if (newData.upcCode !== oldData.upcCode) return true
        if ((!newData.category && oldData.category) ||
          (newData.category && !oldData.category) ||
          (newData.category.id !== oldData.category.id)) return true
        let isSpecialAttrEqual = true

        const { normalAttributes = [], normalAttributesValueMap = {} } = this.getAttributes(newData)
        const { normalAttributesValueMap: oldNormalAttributesValueMap = {} } = this.getAttributes(oldData)
        // TODO normalAttributes获取?
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
    getAttributes (product) {
      const { categoryAttrList, categoryAttrValueMap } = product
      return splitCategoryAttrMap(categoryAttrList, categoryAttrValueMap)
    },
    async handleSubmitEditProduct () {
      console.log('123')
      const context = this.$refs.form.form.getPluginContext()
      const { ignoreId = null, suggest = { id: '' } } = context._SuggestCategory_ || {
        ignoreId: null,
        suggest: { id: '' }
      }
      return !!await fetchNormalSubmitEditProduct(this.product, {
        editType: this.mode,
        entranceType: this.$route.query.entranceType,
        dataSource: this.$route.query.dataSource,
        ignoreSuggestCategory: !!ignoreId,
        suggestCategoryId: suggest.id,
        validType: this.validType,
        needAudit: this.needAudit,
        isNeedCorrectionAudit: this.isNeedCorrectionAudit
      }, poiId)
    },
    async handleRevocation () {
      return !!await fetchRevocationSubmitEditProduct(this.product)
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
          title: `商品${this.product.id ? '修改' : '新建'}成功`,
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
    }
  }
}
