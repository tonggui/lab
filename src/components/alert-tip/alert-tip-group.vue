<template>
  <div class="container" v-if="!!showTip">
    <transition name="fade" mode="out-in">
      <AlertTip class="tip" v-bind="showTip" :key="showTip.id" @close="handleClose">
        <slot>{{ showTip.content }}</slot>
      </AlertTip>
    </transition>
  </div>
</template>
<script>
  import AlertTip from './alert-tip'

  export default {
    name: 'alert-tip-group',
    props: {
      tipList: {
        type: Array,
        required: true
      }
    },
    data: function () {
      return {
        closeId: []
      }
    },
    computed: {
      showTip () {
        return this.tipList.filter(tip => !!tip).find(tip => !this.closeId.includes(tip.id))
      }
    },
    methods: {
      handleClose () {
        const id = this.showTip.id
        this.closeId.push(id)
      }
    },
    components: {
      AlertTip
    }
  }
</script>
<style lang="less" scoped>
  .container {
    position: relative;
    height: 40px;
  }
  // .tip {
  //   position: absolute;
  //   width: 100%;
  // }
</style>
