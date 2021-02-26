<template>
  <Modal
    class-name="product-promotion-modal"
    :value="showModal"
    width="580"
    :mask-closable="false"
    @on-visible-change="handleVisibleChange"
  >
    <h2 class="title">品牌推广活动上线，默认开启“商品推广”助您单量红火～</h2>
    <p class="desc">开启后，美团合作的品牌商（包括伊利等）会定期为旗下品牌商品提供折扣、商品券等补贴。商家无需额外付费，即可获得更多订单！关闭后将无法享受补贴</p>
    <p class="tip">注：部分推广商品将加上“广告”标识，且排序会通过智能算法前置，其余商品排序不变。</p>
    <div class="content">
      <div class="left">
        <h3>在“商品配置管理”开启“商品推广”功能</h3>
        <div class="demo">
          <div class="demo-header">
            <sapn class="title">商品推广</sapn>
            <span class="switch" />
          </div>
          <div class="demo-content">
            平台现有合作品牌:伊利等
          </div>
        </div>
      </div>
      <div class="middle">
        <span class="arrow" />
      </div>
      <div class="right">
        <h3>品牌商品定期享受补贴、排序前置</h3>
        <img src="http://p0.meituan.net/scarlett/06f51efaa08cec2e744d1b9bd1c6aa2742459.png" />
      </div>
    </div>
    <Button type="primary" slot="footer" @click="$emit('on-ok')">我知道了</Button>
  </Modal>
</template>

<script>
  import storage, { KEYS } from '@/common/local-storage'
  export default {
    name: 'product-promotion-modal',
    props: {
      value: Boolean
    },
    computed: {
      showModal () {
        return !storage[KEYS.PRODUCT_SETTING_PROMOTION] && this.value
      }
    },
    methods: {
      handleVisibleChange (val) {
        if (!val) {
          storage[KEYS.PRODUCT_SETTING_PROMOTION] = true
        }
      }
    }
  }
</script>

<style lang="less">
  .product-promotion-modal {
    font-family: MicrosoftYaHei;
    color: #222222;
    h2.title {
      font-weight: 700;
      font-size: 16px;
    }
    .desc {
      font-size: 14px;
      margin: 20px 0 10px;
    }
    .tip {
      font-size: 12px;
      color: #999999;
      margin-bottom: 30px;
    }
    .content {
      display: flex;
      justify-content: space-between;
      .left, .right {
        width: 250px;
        flex: 1;
        text-align: center;
      }
      .left {
        .demo {
          background: #FFFFFF;
          box-shadow: 0 2px 20px 0 rgba(0,0,0,0.10);
          border-radius: 5px;
          padding: 12px;
          &-header {
            font-family: MicrosoftYaHei;
            color: #222222;
            font-size: 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 11px;
            .switch {
              width: 32.5px;
              height: 18.5px;
              line-height: 18.5px;
              background: #F8B500;
              border-radius: 18.5px;
              border: 1px solid #F8B500;
              display: inline-block;
              position: relative;
              &::after {
                content: '';
                display: inline-block;
                position: absolute;
                width: 17px;
                height: 17px;
                right: 0;
                top: 0;
                background: #fff;
                border-radius: 15.5px;
                border: 1px solid rgba(230,233,243,0.50);
              }
            }
          }
          &-content {
            background: #F5F6FA;
            border-radius: 2px;
            line-height: 34px;
            font-family: MicrosoftYaHei;
            font-size: 12px;
            padding-left: 10px;
            text-align: left;
            color: #222222;
            height: 34px;
          }
        }
      }
      .middle {
        width: 40px;
        padding-top: 70px;
        padding-left: 7px;
        .arrow {
          width: 24px;
          height: 1px;
          display: block;
          background: linear-gradient(to right, #fff, #222);
          position: relative;
          &::after {
            content: '';
            display: inline-block;
            position: absolute;
            width: 10px;
            height: 8px;
            background: linear-gradient(155deg, transparent 63%, #fff 63%),
            linear-gradient(25deg, transparent 63%, #fff 63%),
            linear-gradient(to right, #7f7c7c, #000);
            right: 0;
            top: -4px;
            transform: translateY(0.5px);
          }
        }
      }
      .right {
        img {
          background: #F5F6FA;
          width: 100%;
          height: 338px;
        }
      }
      h3 {
        font-size: 12px;
        font-weight: normal;
        margin-bottom: 11px;
      }
    }
  }
</style>
