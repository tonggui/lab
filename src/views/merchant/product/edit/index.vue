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
  import { Spin } from '@sfe/bootes'
  import withAsyncTask from '@/hoc/withAsyncTask'
  import Form from '@/views/components/product-form/form'
  import PoiSelectDrawer from '@/views/components/poi-select/poi-select-drawer'
  import SpChangeInfo from '@/views/components/sp-change-info'

  import { fetchGetTagList } from '@/data/repos/category'
  import {
    fetchGetProductDetail,
    fetchGetSpChangeInfo,
    fetchSaveOrUpdateProduct
  } from '@/data/repos/merchantProduct'

  export default {
    name: 'MerchantProductEdit',
    components: {
      PoiSelectDrawer,
      SpChangeInfo,
      Form: withAsyncTask(fetchGetTagList, {
        Loading: Spin,
        key: 'tagList',
        initData: []
      })(Form)
    },
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
          suggestNoUpc: false
        }
      }
    },
    methods: {
      async checkSpChangeInfo (spuId) {
        const changes = await fetchGetSpChangeInfo(spuId)
        if (changes && changes.length) {
          this.spVisible = true
          this.changes = changes
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
                const pictureList = (c.newValue || '').split(',')
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
        try {
          if (!this.spuId) {
            try {
              const pois = await this.chooseSyncPois(product)
              console.log(pois)
            } catch { return }
          }
          await fetchSaveOrUpdateProduct(product)
        } catch (e) {
          this.$Message.error(e.message)
        }
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
        this.checkSpChangeInfo(spuId)
        this.product = await fetchGetProductDetail(spuId)
      }
    }
  }
</script>
