<template>
  <Alert
    class="alert-tip"
    :banner="fixed"
    :type="type"
  >
    <div class="alert-tip-title">{{title}}</div>
    <div slot="desc" class="alert-tip-desc">
      <Icon v-if="!!icon" :type="icon" color="#F89800" /> {{desc}}
    </div>
  </Alert>
</template>
<script>
  export default {
    name: 'alert-tip',
    props: {
      title: {
        type: String,
        default: ''
      },
      desc: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        icon: 'volume-up',
        fixed: true,
        type: 'warning'
      }
    },
    components: {
    },
    methods: {
      getData () {
        // to-do
      }
    }
  }
</script>

<style lang="less" scoped>
.alert-tip {
  width: 100%;
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
