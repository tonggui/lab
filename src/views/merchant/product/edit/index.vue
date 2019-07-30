<template>
  <div>
    <Form
      :spu-id="spuId"
      :product="product"
      :preferences="preferences"
      :modules="modules"
      :on-confirm="handleConfirm"
      @cancel="handleCancel"
    />
    <SpChangeInfo
      v-if="changes && changes.length"
      :visible="spVisible"
      :product="product"
      :changes="changes"
      @on-confirm="acceptSpChangeInfo"
    />
    <PoiSelectDrawer
      :value="drawerVisible"
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
  import SpChangeInfo from '@/views/components/sp-change-info'

  import { PRODUCT_PACKINGBAG } from '@/common/cmm'

  import { fetchGetTagList } from '@/data/repos/merchantCategory'
  import {
    fetchGetProductDetail,
    fetchGetSpChangeInfo,
    fetchSaveOrUpdateProduct
  } from '@/data/repos/merchantProduct'
  import { trimSplit } from '@/common/utils'

  export default {
    name: 'MerchantProductEdit',
    components: {
      PoiSelectDrawer,
      SpChangeInfo,
      Form: withAsyncTask(fetchGetTagList, {
        loadingOptions: {
          props: {
            fix: true,
            size: 'large'
          }
        },
        key: 'tagList',
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
        spVisible: false,
        changes: []
      }
    },
    computed: {
      preferences () {
        return {
          maxTagCount: 5
        }
      },
      modules () {
        return {
          shortCut: true,
          sellTime: true,
          picContent: true,
          description: true,
          suggestNoUpc: false,
          packingbag: this[PRODUCT_PACKINGBAG]
        }
      }
    },
    methods: {
      async checkSpChangeInfo (spuId) {
        try {
          const changes = await fetchGetSpChangeInfo(spuId)
          if (changes && changes.length) {
            this.spVisible = true
            this.changes = changes
          }
        } catch (err) {
          console.error(err.message)
        }
      },
      acceptSpChangeInfo (replacePicture) {
        this.changes.forEach(c => {
          /* eslint-disable vue/script-indent */
          switch (c.field) {
            case 'name':
              this.product.name = c.newValue
              break
            case 'pic':
              if (replacePicture) {
                const pictureList = trimSplit(c.newValue)
                this.product.pictureList = pictureList
                this.product.poolImages = []
              }
              break
            case 'spec':
              if (this.product.skuList && this.product.skuList.length) {
                this.product.skuList[0].name = c.newValue
              }
              break
            case 'weight':
              if (this.product.skuList && this.product.skuList.length) {
                this.product.skuList[0].weight.value = c.newValue
                this.product.skuList[0].weight.unit = this.product.skuList[0].weight.unit || '克(g)'
              }
              break
          }
          /* eslint-enable */
        })
      },
      chooseSyncPois (product) {
        return new Promise((resolve, reject) => {
          this.drawerVisible = true
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
        if (!this.spuId) {
          try {
            const pois = await this.chooseSyncPois(product)
            product.poiIds = pois.map(poi => poi.id)
          } catch { return }
        }
        return fetchSaveOrUpdateProduct(product)
      },
      handleCancel () {
        window.history.go(-1)
      },
      handlePoiSelected (pois) {
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
        this.checkSpChangeInfo(spuId)
      }
    }
  }
</script>
