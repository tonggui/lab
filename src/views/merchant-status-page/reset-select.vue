<template>
  <div class="reset-select-container">
    <h2 class="title">请选择商品库创建方式（2选1）</h2>
    <ul class="ways-select">
      <li :class="{ 'active': active === 1 }" @click="active = 1">
        <h3>从分店导入商品</h3>
        <p class="desc">适用于平台老连锁商户：旗下门店已有商品、门店正在营业</p>
        <p class="tip">建议：请从分店中选择商品作为总商品库，通过“批量关联”功能将总部商品与门店商品关联。后续商品管理更高效哦~</p>
      </li>
      <li :class="{ 'active': active === 2 }" @click="active = 2">
        <h3>自行新建总部商品</h3>
        <p class="desc">适用于新入驻美团平台的连锁商户，旗下门店还未创建商品</p>
        <p class="tip">建议：请先开通总部商品库，在总部商品库中创建商品后再给旗下门店建品。创建商品、后续管理两不误~</p>
      </li>
    </ul>
    <div class="footer">
      <Button @click="handleCancel">取消</Button>&nbsp;
      <Button type="primary" @click="handleConfirm">确定</Button>
    </div>
  </div>
</template>

<script>
  import { fetchGetResetMerchant } from '@/data/repos/merchantProduct'
  import jumpTo from '@components/link/jumpTo'
  export default {
    name: 'reset-select',
    data () {
      return {
        active: 1
      }
    },
    methods: {
      handleCancel () {
        this.$router.push({ name: 'merchantList' })
      },
      async handleConfirm () {
        if (this.active === 1) {
          jumpTo(`/reuse/sc/product/views/seller/center/productImport?reset=1`)
        } else {
          await fetchGetResetMerchant()
          this.$router.push({ name: 'merchantReset' })
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .reset-select-container {
    padding-top: 164px;
    text-align: center;
    .title {
      font-weight: 600;
      font-family: PingFangSC-Semibold;
      font-size: 24px;
      color: #000000;
      margin-bottom: 87px;
    }
    .ways-select {
      list-style: none;
      display: flex;
      justify-content: center;
      > li {
        width: 452px;
        height: 156px;
        padding: 20px 30px 30px;
        align-items: center;
        background: #FFFFFF;
        box-shadow: 0 6px 16px 0 rgba(0,0,0,0.08), 0 9px 28px 8px rgba(0,0,0,0.05);
        position: relative;
        cursor: pointer;
        > h3 {
          text-align: center;
        }
        .desc {
          margin: 10px 0;
          font-weight: 400;
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #222222;
          text-align: left;
        }
        .tip {
          font-weight: 400;
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #999999;
          text-align: left;
        }
        &.active {
          &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            display: block;
            width: 100%;
            height: 100%;
            border: 2px solid #FF6A00;
          }
        }
        margin-right: 40px;
      }
    }
    .footer {
      margin-top: 80px;
    }
  }
</style>
