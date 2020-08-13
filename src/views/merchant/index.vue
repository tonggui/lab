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
      <RouterView v-else />
    </template>
  </div>
</template>

<script>
  import { updateMerchantConfig, getMerchantConfig, ConfigKeys } from '@/common/merchant'
  import { fetchGetMerchantInfo } from '@/data/repos/merchantPoi'
  import ErrorPage from '@/views/error/error'

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
          updateMerchantConfig(ConfigKeys.MERCHANT_ID, this.merchantId)
          this.error = null
        } catch (e) {
          this.error = e
        } finally {
          this.loading = false
        }
      }
    },
    async mounted () {
      if (!this.isBusinessClient) {
        this.merchantId = this.$route.query.merchantId || getMerchantConfig(ConfigKeys.MERCHANT_ID)
        updateMerchantConfig(ConfigKeys.MERCHANT_ID, this.merchantId)
      } else {
        await this.loadMerchantInfo()
      }
    }
  }
</script>
