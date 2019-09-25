<template>
  <div>
    <Form
      :changes="changes"
      :spu-id="spuId"
      :product="product"
      :modules="modules"
      :submitting="submitting"
      @on-confirm="handleConfirm"
      @cancel="handleCancel"
    />
    <PoiSelectDrawer
      title="关联门店"
      :value="drawerVisible"
      :queryPoiList="fetchGetPoiList"
      @on-confirm="handlePoiSelected"
      @on-visible-change="handlePoiDrawerVisibleChange"
    />
  </div>
</template>

<script>
  import withModules from '@/mixins/withModules'
  import withAsyncTask from '@/hoc/withAsyncTask'
  import Form from '@/views/components/product-form/form'
  import PoiSelectDrawer from '@/views/components/poi-select/poi-select-drawer'

  import { PRODUCT_PACKINGBAG } from '@/common/cmm'
  import {
    fetchGetPoiList
  } from '@/data/repos/merchantPoi'

  import { fetchGetTagList } from '@/data/repos/merchantCategory'
  import {
    fetchGetCategoryAttrSwitch,
    fetchGetProductDetail,
    fetchGetSpChangeInfo,
    fetchSaveOrUpdateProduct
  } from '@/data/repos/merchantProduct'
  import lx from '@/common/lx/lxReport'

  const preAsyncTask = () => {
    return Promise.all([fetchGetCategoryAttrSwitch(), fetchGetTagList()])
  }

  const REL_TEXT = '关联门店'
  const NO_REL_TEXT = '暂不关联'

  export default {
    name: 'MerchantProductEdit',
    components: {
      PoiSelectDrawer,
      Form: withAsyncTask(preAsyncTask, {
        loadingOptions: {
          props: {
            fix: true,
            size: 'large'
          }
        },
        mapper: (keys, data) => {
          const [categoryAttrSwitch, tagList] = data
          return {
            categoryAttrSwitch, tagList
          }
        },
        initData: []
      })(Form)
    },
    mixins: [
      withModules({
        PRODUCT_PACKINGBAG
      })
    ],
    data () {
      return {
        drawerVisible: false,
        product: {},
        spuId: undefined,
        changes: [],
        submitting: false
      }
    },
    computed: {
      modules () {
        return {
          hasStock: !this.spuId,
          shortCut: true,
          sellTime: true,
          picContent: true,
          description: true,
          suggestNoUpc: false,
          packingbag: this[PRODUCT_PACKINGBAG],
          allowApply: false
        }
      }
    },
    methods: {
      fetchGetPoiList (params) {
        return fetchGetPoiList(params.name, params.pagination, params.city)
      },
      async checkSpChangeInfo (spuId) {
        try {
          const changes = await fetchGetSpChangeInfo(spuId)
          if (changes && changes.length) {
            this.changes = changes
          }
        } catch (err) {
          console.error(err.message)
        }
      },
      confirmEdit (product) {
        const poiIds = product.poiIds
        return new Promise((resolve, reject) => {
          if (!poiIds || poiIds.length === 0) {
            resolve()
          } else {
            this.$Modal.confirm({
              title: '提示',
              content: `此商品关联了${poiIds.length}个门店，修改后将同步给所有关联的门店，是否确认保存？`,
              okText: '确认',
              cancelText: '取消',
              onOk: () => resolve(),
              onCancel: () => reject(new Error('cancel'))
            })
          }
        })
      },
      confirmSyncPois () {
        return new Promise((resolve, reject) => {
          this.$Modal.confirm({
            title: '提示',
            content: '是否将此商品关联到下属门店',
            okText: REL_TEXT,
            cancelText: NO_REL_TEXT,
            transitionNames: [],
            onOk: () => resolve(true),
            onCancel: () => resolve(false)
          })
        })
      },
      chooseSyncPois (product) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            this.drawerVisible = true
          }, 300)
          this.poiSelectCallback = (err, pois) => {
            if (pois) {
              resolve(pois)
            } else {
              reject(err)
            }
          }
        })
      },
      async handleConfirm (product) {
        try {
          if (!this.spuId) { // 新建
            const result = await this.confirmSyncPois()
            lx.mc({ bid: 'b_shangou_online_e_3u7qc7ro_mc', val: { button_nm: result ? REL_TEXT : NO_REL_TEXT } })
            if (result) {
              const pois = await this.chooseSyncPois(product)
              product.poiIds = pois.map(poi => poi.id)
            }
          } else { // 编辑
            await this.confirmEdit(product)
          }
        } catch { return }
        try {
          this.submitting = true
          await fetchSaveOrUpdateProduct(product)
          // op_type 标品更新纠错处理，0表示没有弹窗
          lx.mc({ bid: 'b_a3y3v6ek', val: { op_type: 0, op_res: 1, fail_reason: '', spu_id: this.spuId || 0 } })
          window.history.go(-1) // 返回
        } catch (err) {
          lx.mc({ bid: 'b_a3y3v6ek', val: { op_type: 0, op_res: 0, fail_reason: err.message, spu_id: this.spuId || 0 } })
          this.handleConfirmError(err)
        }
        this.submitting = false
      },
      handleConfirmError (err) {
        const errorMessage = (err && err.message) || err || '保存失败'
        /* eslint-disable indent */
        switch (err.code) {
        case 1013:
          this.$Modal.error({
            icon: null,
            width: 520,
            title: '条码不合法，请核对是否存在以下几种情况',
            content: `
              <ul>
                <li>录入条码与包装上印制的条码不一致</li>
                <li>商品非正规厂商出产，或三无商品：无中文标明产品名称、生产厂厂名、厂址的国产或合资企业产品</li>
                <li>录入条码为店内编码，非通用条形码</li>
                <li>厂商未将条形码在中国物品编码中心（<a href="http://www.ancc.org.cn/" target="_blank">http://www.ancc.org.cn/</a>）备案</li>
                <li>录入条码不符合国际编码规则（国际编码规则：<a href="http://www.ancc.org.cn/Knowledge/BarcodeArticle.aspx?id=183" target="_blank">http://www.ancc.org.cn/Knowledge/BarcodeArticle.aspx?id=183</a>）
                </li>
              </ul>
            `
          })
          break
        default:
          if (this.onConfirmError) {
            this.onConfirmError(err)
          } else {
            this.$Message.error(errorMessage)
          }
          break
        }
        /* eslint-enable indent */
      },
      handleCancel () {
        window.history.go(-1)
      },
      handlePoiSelected (pois) {
        lx.mc({ bid: 'b_shangou_online_e_f4nwywyw_mc' })
        if (this.poiSelectCallback) {
          this.poiSelectCallback(null, pois)
        }
        this.poiSelectCallback = null
      },
      handlePoiDrawerVisibleChange (visible) {
        this.drawerVisible = visible
        if (!visible && this.poiSelectCallback) {
          this.poiSelectCallback()
          this.poiSelectCallback = null
        }
      }
    },
    async created () {
      const spuId = +(this.$route.query.spuId || 0)
      if (spuId) {
        this.spuId = spuId
        this.product = await fetchGetProductDetail(spuId)
      }
    }
  }
</script>
