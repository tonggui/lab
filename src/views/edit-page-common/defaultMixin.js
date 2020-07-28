import {
  fetchGetNeedAudit,
  fetchNormalSubmitEditProduct
} from '@/data/repos/product'
// import { ATTR_TYPE } from '@/data/enums/category'
import { cloneDeep } from 'lodash'
import { splitCategoryAttrMap } from '@/views/components/product-form/data'
import { fetchGetCategoryAttrList } from '@/data/repos/category'
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
      this.getCategoryAttrList(category.id)
      this.getGetNeedAudit()
    }
  },
  methods: {
    // 获取商家是否需要审核
    async getGetNeedAudit () {
      // 获取商品是否满足需要送审条件
      if (this.product.category && this.product.category.id) {
        const { poiNeedAudit, categoryNeedAudit } = await fetchGetNeedAudit(this.product.category.id)
        this.poiNeedAudit = poiNeedAudit
        this.categoryNeedAudit = categoryNeedAudit
        this.originalProductCategoryNeedAudit = categoryNeedAudit
      }
    },
    // 是否需要审核判断之一
    checkCateNeedAudit () {
      // 初始状态的类目需要审核，才会出现纠错审核
      if (this.originalProductCategoryNeedAudit) {
        const newData = this.product
        const oldData = this.originalFormData
        if (newData.upcCode !== oldData.upcCode) return true
        if ((!newData.category && oldData.category) || (newData.category && !oldData.category) || (newData.category.id !== oldData.category.id)) return true
        let isSpecialAttrEqual = true
        // TODO normalAttributes获取?
        // for (let i = 0; i < this.formContext.normalAttributes.length; i++) {
        //   const attr = this.formContext.normalAttributes[i]
        //   if (attr.attrType === ATTR_TYPE.SPECIAL) {
        //     if (!isEqual(newData.normalAttributesValueMap[attr.id], oldData.normalAttributesValueMap[attr.id])) {
        //       isSpecialAttrEqual = false
        //       break
        //     }
        //   }
        // }
        return !isSpecialAttrEqual
      }
      return false
    },
    getAttributes (product) {
      const { categoryAttrList, categoryAttrValueMap } = product
      return splitCategoryAttrMap(categoryAttrList, categoryAttrValueMap)
    },
    setProductAttributes () {
      const {
        // normalAttributes,
        normalAttributesValueMap,
        // sellAttributes,
        sellAttributesValueMap
      } = this.getAttributes(this.product)
      this.product = {
        ...this.product,
        normalAttributesValueMap,
        sellAttributesValueMap
      }
      this.originalFormData = cloneDeep(this.product) // 对之前数据进行拷贝
    },
    async getCategoryAttrList (categoryId = this.product.category.id) {
      // TODO 旧属性获取？
      const oldSellAttributes = 1
      const { normalAttributesValueMap: oldNormalAttributesValueMap, sellAttributesValueMap: oldSellAttributesValueMap } = this.product
      const attrs = await fetchGetCategoryAttrList(categoryId) || {}
      const {
        // normalAttributes,
        normalAttributesValueMap,
        sellAttributes,
        sellAttributesValueMap
      } = this.getAttributes({
        categoryAttrList: attrs,
        categoryAttrValueMap: { ...oldNormalAttributesValueMap, ...oldSellAttributesValueMap }
      })
      const product = {
        ...this.product,
        normalAttributesValueMap,
        sellAttributesValueMap
      }
      if (sellAttributes.length > 0 || oldSellAttributes.length > 0) {
        product.skuList = []
      }
      this.productInfo = product
    },
    async handleSubmitEditProduct () {
      // TODO submitting?
      // this.submitting = true
      // TODO 如何取得validType, ignoreSuggestCategory, suggestCategoryId
      // const { validType, ignoreSuggestCategory, suggestCategoryId } = this.formContext
      await fetchNormalSubmitEditProduct(this.productInfo, {
        editType: this.mode,
        entranceType: this.$route.query.entranceType,
        dataSource: this.$route.query.dataSource,
        ignoreSuggestCategory: 1,
        suggestCategoryId: 2,
        validType: 3,
        needAudit: this.needAudit,
        isNeedCorrectionAudit: this.isNeedCorrectionAudit
      }, poiId)
      // TODO submitting?
      // this.submitting = false
    },
    // TODO 提交后弹窗？
    popConfirmModal () {
      // 正常新建编辑场景下如果提交审核需要弹框
      if (this.needAudit && this.needConfirmModal) {
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
