<template>
  <div>
    <Loading v-if="loading" />
    <template v-else>
      <ErrorPage
        v-if="errorMessage"
        title="出错啦"
        :description="errorMessage"
        :button-text="isBusinessClient ? '刷新一下' : ''"
        @refresh="loadMerchantInfo"
      />
      <gray-router-view v-else />
    </template>
  </div>
</template>

<script>
  import { updateMerchantConfig, getMerchantConfig, ConfigKeys } from '@/common/merchant'
  import { fetchGetMerchantInfo } from '@/data/repos/merchantPoi'
  import ErrorPage from '@/views/error/error'
  import moduleControl from '@/module'
  import { getPoiId } from '@/common/constants'

  export default {
    name: 'MerchantPageContainer',
    components: {
      ErrorPage
    },
    inject: ['appState'],
    data () {
      return {
        loading: true,
        error: null,
        merchantId: null
      }
    },
    computed: {
      isBusinessClient () {
        return this.appState.isBusinessClient
      },
      errorMessage () {
        if (this.isBusinessClient) {
          return this.error ? `加载失败，请重试` : ''
        } else {
          return this.merchantId ? '' : `缺少商家商品中心ID，请重新访问`
        }
      }
    },
    methods: {
      async loadMerchantInfo () {
        this.loading = true
        try {
          const merchantInfo = await fetchGetMerchantInfo()
          this.merchantId = merchantInfo.merchantId
          const routerTagId = merchantInfo.routerTagId
          updateMerchantConfig(ConfigKeys.MERCHANT_ID, this.merchantId)
          await this.syncMerchantParamsToRouter({
            merchantId: this.merchantId,
            routerTagId
          })
          this.error = null
        } catch (e) {
          this.error = e
        } finally {
          this.loading = false
        }
      },
      async syncMerchantParamsToRouter (params = {}) {
        const queryParams = Object.assign({}, this.$route.query)
        // 如果存在参数在URL中不存在，则需要同步过去
        if (Object.entries(params).filter(([key, value]) => {
          if (!queryParams[key] && value) {
            queryParams[key] = value
            return true
          }
        }).length) {
          await this.$router.replace({
            path: this.$route.path,
            query: queryParams
          }).catch(err => {
            // 莫名其妙，正常替换会抛出空异常
            if (err) throw err
          })
        }
      }
    },
    async created () {
      if (!getPoiId()) {
        if (!this.isBusinessClient) {
          this.merchantId = this.$route.query.merchantId || getMerchantConfig(ConfigKeys.MERCHANT_ID)
          updateMerchantConfig(ConfigKeys.MERCHANT_ID, this.merchantId)
          // 运营端如果缺少routerTagId，需要通过接口获取routerTagId
          if (this.merchantId && !this.$route.query.routerTagId) {
            await this.loadMerchantInfo()
          } else {
            await this.syncMerchantParamsToRouter({ merchantId: this.merchantId })
          }
          this.loading = false
        } else {
          // 商家端环境加载，必须先清空。（解决商家端切换账号引起的merchantId仍然是之前的缓存，后端按照缓存返回数据）
          updateMerchantConfig(ConfigKeys.MERCHANT_ID, '')
          await this.loadMerchantInfo()
        }
      } else {
        this.loading = false
      }
    },
    beforeRouteEnter (to, from, next) {
      if (!getPoiId()) {
        moduleControl.setContext({ merchant: true })
      }
      next()
    },
    beforeRouteLeave (to, from, next) {
      if (!getPoiId()) {
        moduleControl.setContext({ merchant: false })
      }
      next()
    }
  }
</script>
