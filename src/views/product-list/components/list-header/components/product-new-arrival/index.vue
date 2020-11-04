<template>
  <div class="product-cube">
    <Alert type="warning" class="product-cube-alert">
      <CubeLogo />
      <span class="product-cube-title">{{ tips }}</span>
      <Tooltip transfer :value="visible" placement="right" content="点击这里，创建并售卖这些商品会带来更多收入哦～" max-width="230">
        <router-link class="product-cube-link" :to="{ name: 'newArrivalList', query: $route.query }">
          <span v-mc:productCube="{ bid: 'b_shangou_online_e_n2chi3yh_mc' }">马上去创建 ></span>
        </router-link>
      </Tooltip>
    </Alert>
  </div>
</template>
<script>
  import lx from '@/common/lx/lxReport'
  import storage, { KEYS } from '@/common/local-storage'
  import logo from '@/assets/cube-logo.png'
  import CubeLogo from '@/views/components/cube-logo/index'

  export default {
    name: 'product-new-arrival',
    components: { CubeLogo },
    props: {
      tips: String
    },
    computed: {
      imgSrc () {
        return logo
      }
    },
    data () {
      return {
        visible: false
      }
    },
    methods: {
      closeGuideTip () {
        this.visible = false
        storage[KEYS.PRODUCT_NEW_ARRIVAL_GUIDE] = true
      }
    },
    mounted () {
      if (!storage[KEYS.PRODUCT_NEW_ARRIVAL_GUIDE]) {
        // 引导文案
        this.visible = true
        setTimeout(this.closeGuideTip, 5000)
        window.addEventListener('click', this.closeGuideTip)
      }

      // TODO 埋点
      lx.mv({ bid: 'b_shangou_online_e_bvdvb4tt_mv' }, 'productCube')
    },
    beforeDestroy () {
      window.removeEventListener('click', this.closeGuideTip)
    }
  }
</script>
<style lang="less" scoped>
.product-cube {
  background: @component-bg url('~@/assets/cube-logo-mask.png') right no-repeat;
  background-size: contain;
  &-alert {
    margin-bottom: 0;
    padding: 6px 16px;
    border-radius: 0;
    /deep/ .boo-alert-message {
      display: flex;
      align-items: center;
    }
  }
  &-tag {
    background: #FFECCF;
    border: 1px solid #F89800;
    border-radius: 0 2.5px 0 2.5px;
    color: #F88100;
    padding: 2px 4px;
    line-height: 20px;
    margin-right: 8px;
    font-size: @font-size-small;
  }
  &-title {
    color: #333333;
    font-weight: 600;
    margin-right: 4px;
  }
  &-link {
    text-decoration: underline;
  }
  &-description {
    margin-top: 8px;
    color: #676A78;
  }
  &-horn-icon {
    color: #F89800;
    margin-right: 8px;
  }
}
</style>
