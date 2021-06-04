<template>
  <Alert
    class="alert-tip"
    :banner="fixed"
    :type="type"
  >
    <div class="alert-tip-title">{{title}}</div>
    <div slot="desc" class="alert-tip-desc">
      <Icon color="#F89800"><Nofity /></Icon> {{desc}}
    </div>
  </Alert>
</template>
<script>
  import Nofity from '@/assets/icons/notify.svg'
  export default {
    name: 'alert-tip',
    props: {
      title: {
        type: String,
        default: '店内暂无商品'
      },
      desc: {
        type: String,
        default: ''
      }
    },
    components: {
      Nofity
    },
    data () {
      return {
        icon: 'volume-up',
        fixed: true,
        type: 'warning'
      }
    }
  }
</script>

<style lang="less" scoped>
.alert-tip {
  width: 100%;
  background: rgba(255,211,86,0.10);
  border: 1px solid #FFE190;
  &-title {
    font-family: PingFangSC-Medium;
    font-size: 16px;
    color: #36394D;
    letter-spacing: 0;
    line-height: 16px;
  }
  &-desc {
    font-size: 14px;
    margin-top: 12px;
    color: #676A78;
    letter-spacing: 0;
    line-height: 14px;
  }
}
</style>
