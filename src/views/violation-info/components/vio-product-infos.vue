<template>
  <div class="vio-product-infos">
    <div class="infos-pic-box">
      <ListPictureDidsplay :src="pic" :size="48" />
    </div>
    <div class="infos-other">
      <div>{{ extraTextUp }}</div>
      <div>{{ extraTextDown }}</div>
    </div>
  </div>
</template>

<script>
  import ListPictureDidsplay from '@/components/list-picture-display'

  export default {
    name: 'vio-product-infos',
    components: {
      ListPictureDidsplay
    },
    props: {
      pic: {
        type: String
      },
      extraTextUp: {
        type: String
      },
      extraTextDown: {
        type: String
      }
    },
    data () {
      return {}
    },
    computed: {},
    watch: {},
    methods: {},
    created () {
    }
  }
</script>

<style lang='less' scoped>
  .vio-product-infos {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .infos-other {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: flex-start;
      padding-left: 20px;
    }
  }
</style>
