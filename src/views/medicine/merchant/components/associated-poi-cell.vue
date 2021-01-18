<template>
  <a @click="handleJump">
    <slot></slot>
  </a>
</template>
<script>
  export default {
    name: 'associated-poi-cell',
    props: {
      id: Number
    },
    methods: {
      handleJump () {
        // 延迟30ms 埋点上报
        setTimeout(() => {
          this.$router.push({ name: 'medicineMerchantRelPoi', query: { spuId: this.id } })
        }, 30)
      }
    }
  }
</script>
